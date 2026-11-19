// Netlify Serverless Function: send-apk.js
// Handles production-secure email validation and automated APK link delivery via Resend API.

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

export default async (req) => {
  // CORS & Preflight headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed. Use POST.' }),
      { status: 405, headers }
    )
  }

  try {
    let body = {}
    try {
      body = await req.json()
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON request body.' }),
        { status: 400, headers }
      )
    }

    const { email, honeypot } = body

    // 1. Honeypot Bot Trap: If a spam bot filled the hidden input, pretend success and discard
    if (honeypot && String(honeypot).trim().length > 0) {
      console.warn('Bot trap triggered. Honeypot field was filled.')
      return new Response(
        JSON.stringify({ success: true, message: 'Link dispatched.' }),
        { status: 200, headers }
      )
    }

    // 2. Strict Input Sanitization & CRLF Injection Prevention
    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Email address is required.' }),
        { status: 400, headers }
      )
    }

    const cleanEmail = email.trim().replace(/[\r\n]/g, '').toLowerCase()

    if (cleanEmail.length > 254 || !EMAIL_REGEX.test(cleanEmail)) {
      return new Response(
        JSON.stringify({ error: 'Please enter a valid email address.' }),
        { status: 400, headers }
      )
    }

    // 3. Resolve APK Download URL
    // If APK_DOWNLOAD_URL is set in Netlify Env Vars, use it; otherwise compute from current host
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'spendr.app'
    const protocol = req.headers.get('x-forwarded-proto') || 'https'
    const defaultApkUrl = `${protocol}://${host}/downloads/spendr.apk`
    const apkUrl = process.env.APK_DOWNLOAD_URL || defaultApkUrl

    // 4. Verify Resend API Key is configured
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.warn('RESEND_API_KEY environment variable is not configured on Netlify.')
      // In development / pre-setup mode, return friendly notice
      return new Response(
        JSON.stringify({
          success: true,
          notice: 'DEMO_MODE: Set RESEND_API_KEY in your Netlify dashboard to send live emails.',
          downloadUrl: apkUrl,
        }),
        { status: 200, headers }
      )
    }

    // 5. Construct Branded HTML Email
    const fromAddress = process.env.EMAIL_FROM || 'Spendr App <onboarding@resend.dev>'
    const emailSubject = 'Your Spendr Android APK Download Link 🚀'
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Spendr APK Download</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #070F18; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #FFFFFF;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #070F18; padding: 40px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" style="max-width: 540px; background-color: #0D1B2A; border-radius: 24px; border: 1px solid rgba(226, 241, 99, 0.2); padding: 36px 32px; text-align: left;">
                
                <!-- Logo & Brand Header -->
                <tr>
                  <td>
                    <div style="display: inline-block; padding: 6px 14px; border-radius: 9999px; background-color: #E2F163; color: #0D1B2A; font-size: 12px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 20px;">
                      SPENDR · EARLY ACCESS
                    </div>
                    <h1 style="margin: 0 0 12px 0; font-size: 26px; font-weight: 800; color: #FFFFFF; line-height: 1.25;">
                      Your direct Android APK is ready
                    </h1>
                    <p style="margin: 0 0 28px 0; font-size: 15px; color: #94A3B8; line-height: 1.6;">
                      Thank you for testing Spendr! While we finalize our Google Play Store and Apple App Store listings, you can install and use the full app right now using the direct link below.
                    </p>
                  </td>
                </tr>

                <!-- CTA Download Button -->
                <tr>
                  <td align="center" style="padding: 10px 0 28px 0;">
                    <a href="${apkUrl}" style="display: inline-block; background-color: #E2F163; color: #0D1B2A; font-size: 15px; font-weight: 800; text-decoration: none; padding: 14px 32px; border-radius: 9999px; box-shadow: 0 4px 14px rgba(226, 241, 99, 0.35);">
                      Download Spendr APK
                    </a>
                  </td>
                </tr>

                <!-- Direct Link Fallback -->
                <tr>
                  <td style="border-top: 1px solid #1E2D3D; padding-top: 20px;">
                    <p style="margin: 0 0 6px 0; font-size: 12px; color: #64748B;">
                      Or copy and paste this direct link into your mobile browser:
                    </p>
                    <p style="margin: 0 0 20px 0; font-size: 12px; color: #E2F163; word-break: break-all;">
                      <a href="${apkUrl}" style="color: #E2F163; text-decoration: underline;">${apkUrl}</a>
                    </p>
                  </td>
                </tr>

                <!-- Installation Instructions Card -->
                <tr>
                  <td style="background-color: #070F18; border-radius: 14px; padding: 16px 20px; border: 1px solid rgba(255, 255, 255, 0.06);">
                    <div style="font-size: 13px; font-weight: 700; color: #FFFFFF; margin-bottom: 8px;">
                      💡 Quick Android Install Steps:
                    </div>
                    <ol style="margin: 0; padding-left: 20px; font-size: 12px; color: #94A3B8; line-height: 1.6;">
                      <li>Tap the button above on your Android phone to download.</li>
                      <li>Open your <strong>Downloads</strong> or tap the downloaded notification.</li>
                      <li>If prompted, allow <em>"Install unknown apps"</em> for your browser.</li>
                      <li>Tap <strong>Install</strong> and start tracking your expenses!</li>
                    </ol>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding-top: 28px; text-align: center;">
                    <p style="margin: 0; font-size: 11px; color: #64748B;">
                      © 2026 Spendr Technologies Inc. · All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `

    // 6. Send via Resend REST API (Native fetch, zero dependencies)
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [cleanEmail],
        subject: emailSubject,
        html: emailHtml,
      }),
    })

    const resendData = await resendResponse.json()

    if (!resendResponse.ok) {
      console.error('Resend API error:', resendData)
      return new Response(
        JSON.stringify({
          error: resendData.message || 'Email delivery failed. Please check your address.',
        }),
        { status: resendResponse.status, headers }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        id: resendData.id,
        message: 'APK download link sent successfully!',
      }),
      { status: 200, headers }
    )
  } catch (err) {
    console.error('Unhandled send-apk error:', err)
    return new Response(
      JSON.stringify({ error: 'Server error occurred. Please try again later.' }),
      { status: 500, headers }
    )
  }
}

