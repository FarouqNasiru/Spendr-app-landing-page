import { useState, useEffect, useRef } from 'react'
import logoImg from './assets/spendr/logo.webp'
import phoneDashLight from './assets/spendr/phone-dashboard-light.webp'
import phoneDashDark from './assets/spendr/phone-dashboard-dark.webp'
import phoneTxLight from './assets/spendr/phone-transactions-light.webp'
import phoneTxDark from './assets/spendr/phone-transactions-dark.webp'

// 3D Slanted Mockup assets for Opal-style showcase section
import phoneAddLight from './assets/spendr/phone-add-light.webp'
import phoneAddDark from './assets/spendr/phone-add-dark.webp'
import phoneSettingsLight from './assets/spendr/phone-settings-light.webp'
import phoneSettingsDark from './assets/spendr/phone-settings-dark.webp'
import phoneSlantTxLight from './assets/spendr/phone-slant-tx-light.webp'
import phoneSlantTxDark from './assets/spendr/phone-slant-tx-dark.webp'

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Preload alternate-theme & key mockups in browser cache for instant rendering
  useEffect(() => {
    const imagesToPreload = [
      phoneDashLight,
      phoneDashDark,
      phoneTxLight,
      phoneTxDark,
      phoneAddLight,
      phoneAddDark,
      phoneSlantTxLight,
      phoneSlantTxDark
    ]
    imagesToPreload.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [])

  // Scroll zoom animation state for the feature grid
  const featureSectionRef = useRef(null)
  const [zoomScale, setZoomScale] = useState(0.88)
  const [zoomOpacity, setZoomOpacity] = useState(0.8)

  // Animation progress for smaller card metrics
  const [hasAnimated, setHasAnimated] = useState(false)
  const [animProgress, setAnimProgress] = useState(0) // 0 to 1

  // Staggered slide-in visibility states for the 3 showcase blocks and CTA section
  const block1Ref = useRef(null)
  const block2Ref = useRef(null)
  const block3Ref = useRef(null)
  const ctaSectionRef = useRef(null)
  const [block1InView, setBlock1InView] = useState(false)
  const [block2InView, setBlock2InView] = useState(false)
  const [block3InView, setBlock3InView] = useState(false)
  const [ctaInView, setCtaInView] = useState(false)

  // Keep html class in sync with dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  // Scroll handler for zoom-in animation as the header is scrolled past
  // and trigger for interactive counters
  useEffect(() => {
    let animationFrameId
    const handleScroll = () => {
      if (!featureSectionRef.current) return
      const rect = featureSectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Zoom scaling calculation
      const startTrigger = windowHeight * 0.95
      const endTrigger = windowHeight * 0.35

      if (rect.top >= startTrigger) {
        setZoomScale(0.88)
        setZoomOpacity(0.8)
      } else if (rect.top <= endTrigger) {
        setZoomScale(1.0)
        setZoomOpacity(1.0)
      } else {
        const progress = (startTrigger - rect.top) / (startTrigger - endTrigger)
        const currentScale = 0.88 + progress * (1.0 - 0.88)
        const currentOpacity = 0.8 + progress * (1.0 - 0.8)
        setZoomScale(Math.min(1.0, Math.max(0.88, currentScale)))
        setZoomOpacity(Math.min(1.0, Math.max(0.8, currentOpacity)))
      }

      // Check if section scrolled into view to trigger counting animations
      if (!hasAnimated && rect.top <= windowHeight * 0.75) {
        setHasAnimated(true)
        const startTime = performance.now()
        const duration = 1600

        const animateCounters = (now) => {
          const elapsed = now - startTime
          const rawProgress = Math.min(1, elapsed / duration)
          const eased = 1 - Math.pow(1 - rawProgress, 3)
          setAnimProgress(eased)

          if (rawProgress < 1) {
            animationFrameId = requestAnimationFrame(animateCounters)
          }
        }
        animationFrameId = requestAnimationFrame(animateCounters)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [hasAnimated])

  // IntersectionObserver for staggered slide-in of text then image in Showcase Blocks & CTA
  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === block1Ref.current) setBlock1InView(true)
          if (entry.target === block2Ref.current) setBlock2InView(true)
          if (entry.target === block3Ref.current) setBlock3InView(true)
          if (entry.target === ctaSectionRef.current) setCtaInView(true)
        }
      })
    }, observerOptions)

    if (block1Ref.current) observer.observe(block1Ref.current)
    if (block2Ref.current) observer.observe(block2Ref.current)
    if (block3Ref.current) observer.observe(block3Ref.current)
    if (ctaSectionRef.current) observer.observe(ctaSectionRef.current)

    return () => observer.disconnect()
  }, [])

  const toggleTheme = () => setIsDarkMode((prev) => !prev)

  // Current phone images based on active theme
  const currentDashImg = isDarkMode ? phoneDashDark : phoneDashLight
  const currentTxImg = isDarkMode ? phoneTxDark : phoneTxLight

  // Opal-style Showcase 3D Slanted Phone Images
  const currentAddImg = isDarkMode ? phoneAddDark : phoneAddLight
  const currentSlantTxImg = isDarkMode ? phoneSlantTxDark : phoneSlantTxLight
  const currentSettingsImg = isDarkMode ? phoneSettingsDark : phoneSettingsLight

  // Animated values for smaller cards
  const totalEntries = Math.floor(animProgress * 223)
  const growthPercent = (animProgress * 18.4).toFixed(1)
  const gaugeFill = Math.floor(animProgress * 85)

  // Store download coming soon modal & APK email state
  const [storeModal, setStoreModal] = useState({ open: false, store: '' })
  const [emailValue, setEmailValue] = useState('')
  const [apkSubmitted, setApkSubmitted] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [inputHighlighted, setInputHighlighted] = useState(false)
  const emailInputRef = useRef(null)

  const handleProceedToApk = () => {
    // Dismiss the modal first if open
    setStoreModal({ open: false, store: '' })

    setTimeout(() => {
      const section = document.getElementById('apk-download')
      const input = emailInputRef.current
      if (!section) return

      const isTouch = typeof window !== 'undefined' && (
        'ontouchstart' in window ||
        (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
        window.innerWidth < 768
      )

      // Calculate exact scroll target with header offset (navbar is 80px high)
      const rect = section.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const headerOffset = window.innerWidth < 768 ? 84 : 96
      const targetY = Math.max(0, rect.top + scrollTop - headerOffset)

      window.scrollTo({
        top: targetY,
        behavior: 'smooth'
      })

      // Trigger vibrant highlight pulse on the email input
      setInputHighlighted(true)
      setTimeout(() => {
        setInputHighlighted(false)
      }, 2500)

      // On non-touch desktop browsers, focus the input field with preventScroll: true once smooth scroll finishes.
      // On mobile/touch devices, we deliberately do NOT auto-focus to prevent virtual keyboard pop-up,
      // which shrinks the viewport and violently overrides smooth scroll coordinates past the input field.
      if (!isTouch && input) {
        setTimeout(() => {
          input.focus({ preventScroll: true })
        }, 700)
      }
    }, 60)
  }

  useEffect(() => {
    const handleScrollBackTop = () => {
      setShowBackToTop(window.scrollY > 350)
    }
    window.addEventListener('scroll', handleScrollBackTop, { passive: true })
    return () => window.removeEventListener('scroll', handleScrollBackTop)
  }, [])

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${
      isDarkMode ? 'dark bg-[#070F18] text-white' : 'bg-[#F4F7EB] text-[#0D1B2A]'
    }`}>
      
      {/* ──────────────── Top Navigation ──────────────── */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${
        isDarkMode ? 'bg-[#070F18]/90 border-[#1E2D3D]/50' : 'bg-[#F4F7EB]/90 border-[#E2EBD5]'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & App Brand */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="relative w-11 h-11 rounded-2xl bg-[#E2F163] flex items-center justify-center p-2 shadow-sm transition-transform group-hover:scale-105">
                <img
                  src={logoImg}
                  alt="Spendr Logo"
                  className="w-full h-full object-contain filter drop-shadow-sm"
                />
              </div>
              <div className="flex flex-col">
                <span className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#0D1B2A]'}`}>
                  spendr
                </span>
                <span className={`text-[10px] tracking-widest font-medium uppercase -mt-1 ${
                  isDarkMode ? 'text-[#E2F163]' : 'text-[#61741F]'
                }`}>
                  personal finance
                </span>
              </div>
            </a>
          </div>

          {/* Right Action: Circular Theme Toggle & "Try it out" Button */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Circular Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle Dark Mode"
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer ${
                isDarkMode
                  ? 'bg-[#1E2D3D] border-[#1E2D3D] text-[#E2F163] hover:bg-[#253649] hover:scale-105'
                  : 'bg-[#EDF2E4] border-[#EDF2E4] text-[#0D1B2A] hover:bg-[#E2ECD5] hover:scale-105'
              }`}
            >
              {isDarkMode ? (
                <svg className="w-5 h-5 text-[#E2F163]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-[#0D1B2A]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* "Try it out" Primary Action Button */}
            <a
              href="#apk-download"
              onClick={(e) => {
                e.preventDefault()
                handleProceedToApk()
              }}
              className="px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold text-[#0D1B2A] bg-[#E2F163] hover:bg-[#d8e855] shadow-md shadow-[#E2F163]/25 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              Try it out
            </a>
          </div>
        </div>
      </header>

      {/* ──────────────── Hero Showcase Section ──────────────── */}
      <section className="relative overflow-hidden pt-8 sm:pt-12 lg:pt-14 pb-12 lg:pb-16">
        
        {/* Ambient Brand Glow */}
        <div className={`pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] rounded-full filter blur-3xl opacity-50 -z-10 transition-colors duration-500 ${
          isDarkMode ? 'bg-gradient-to-b from-[#E2F163]/10 via-[#1E2D3D]/40 to-transparent' : 'bg-gradient-to-b from-[#E2F163]/30 via-[#EDF2E4]/60 to-transparent'
        }`} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            
            {/* Left Content Column - Moved up to be fully visible without scrolling */}
            <div className="lg:col-span-5 flex flex-col items-center text-center z-10 transform lg:-translate-y-8">
              
              {/* Floating App Icon Badge (Matching Menu Bar Light Mode: Lime Green Background) */}
              <div className="mb-4 relative group">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#E2F163] p-3 shadow-xl shadow-[#E2F163]/25 flex items-center justify-center transform transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1">
                  <img
                    src={logoImg}
                    alt="Spendr App Icon"
                    className="w-full h-full object-contain filter drop-shadow-sm"
                  />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-[#E2F163]/30 filter blur-xl -z-10" />
              </div>

              {/* Main Headline */}
              <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-medium sm:font-semibold tracking-tight leading-[1.12] mb-4 ${
                isDarkMode ? 'text-white' : 'text-[#0D1B2A]'
              }`}>
                Smart Personal<br />
                <span className="text-[#738c00] dark:text-[#E2F163] transition-colors duration-300">
                  Finance Tracker
                </span>
              </h1>

              {/* Subtitle / Paragraph */}
              <p className={`text-sm sm:text-base leading-relaxed max-w-md mb-5 font-light ${
                isDarkMode ? 'text-slate-300' : 'text-[#0D1B2A]/75'
              }`}>
                Get our award-winning app to track your expenses, manage income, automatically extract bank statements with AI, and go premium with Paystack payments.
              </p>

              {/* App Store & Google Play Badges */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {/* Apple App Store */}
                <button
                  type="button"
                  onClick={() => setStoreModal({ open: true, store: 'Apple App Store' })}
                  className="group flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-xl bg-black text-white hover:bg-neutral-900 border border-neutral-800 shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer text-left"
                >
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.42c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.07 1.71-.93 2.73 1.01.08 2.01-.5 2.63-1.23z" />
                  </svg>
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] uppercase tracking-wider text-neutral-300 font-medium leading-none">
                      Download on the
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-white leading-tight mt-0.5">
                      App Store
                    </span>
                  </div>
                </button>

                {/* Google Play */}
                <button
                  type="button"
                  onClick={() => setStoreModal({ open: true, store: 'Google Play Store' })}
                  className="group flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-xl bg-black text-white hover:bg-neutral-900 border border-neutral-800 shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer text-left"
                >
                  <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M3.6 1.8L13.7 12 3.6 22.2c-.4-.4-.6-1-.6-1.7V3.5c0-.7.2-1.3.6-1.7z" />
                    <path fill="#34A853" d="M17.1 8.6L13.7 12l3.4 3.4 3.9-2.2c1.1-.6 1.1-1.7 0-2.4l-3.9-2.2z" />
                    <path fill="#EA4335" d="M3.6 1.8l10.1 10.2 3.4-3.4L6.3.7C5.3.1 4.3.4 3.6 1.8z" />
                    <path fill="#FBBC04" d="M17.1 15.4L13.7 12 3.6 22.2c.7 1.4 1.7 1.7 2.7 1.1l10.8-7.9z" />
                  </svg>
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] uppercase tracking-wider text-neutral-300 font-medium leading-none">
                      GET IT ON
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-white leading-tight mt-0.5">
                      Google Play
                    </span>
                  </div>
                </button>
              </div>

              {/* Supported Tech Pills */}
              <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-normal">
                <span className={`px-2.5 py-1 rounded-md ${
                  isDarkMode ? 'bg-[#1E2D3D] text-slate-300' : 'bg-[#EDF2E4] text-[#0D1B2A]'
                }`}>
                  Flutter Powered
                </span>
                <span className={`px-2.5 py-1 rounded-md ${
                  isDarkMode ? 'bg-[#1E2D3D] text-slate-300' : 'bg-[#EDF2E4] text-[#0D1B2A]'
                }`}>
                  Paystack Secured
                </span>
                <span className={`px-2.5 py-1 rounded-md ${
                  isDarkMode ? 'bg-[#1E2D3D] text-slate-300' : 'bg-[#EDF2E4] text-[#0D1B2A]'
                }`}>
                  Firebase Cloud Sync
                </span>
              </div>
            </div>

            {/* Right Phone Mockups Column (Both Same Size, Right Higher) */}
            <div className="lg:col-span-7 relative flex items-center justify-center lg:justify-end pt-12 lg:pt-0">
              
              {/* Backlight Glow Behind Phones */}
              <div className={`absolute w-[440px] sm:w-[560px] h-[440px] sm:h-[560px] rounded-full filter blur-3xl opacity-50 pointer-events-none transition-colors duration-500 ${
                isDarkMode ? 'bg-[#E2F163]/15' : 'bg-[#E2F163]/30'
              }`} />

              <div className="relative flex items-center justify-center max-w-full">
                
                {/* Phone 1 (Left / Front): Dashboard Mockup (High Fetch Priority for Instant LCP) */}
                <div className="relative z-10 w-[235px] sm:w-[275px] md:w-[300px] transition-all duration-300 transform -mr-11 sm:-mr-15 lg:-mr-18 hover:scale-[1.02]">
                  <img
                    key={`dash-${isDarkMode}`}
                    src={currentDashImg}
                    alt="Spendr Dashboard App Mockup"
                    fetchPriority="high"
                    decoding="async"
                    className="w-full h-auto object-contain filter drop-shadow-[0_25px_35px_rgba(13,27,42,0.22)] dark:drop-shadow-[0_25px_45px_rgba(0,0,0,0.55)] transition-opacity duration-300"
                  />
                </div>

                {/* Phone 2 (Right / Back): Transactions Mockup (POSITIONED HIGHER) */}
                <div className="relative z-20 w-[235px] sm:w-[275px] md:w-[300px] transition-all duration-300 transform -translate-y-7 sm:-translate-y-11 lg:-translate-y-13 hover:scale-[1.02]">
                  <img
                    key={`tx-${isDarkMode}`}
                    src={currentTxImg}
                    alt="Spendr Transactions App Mockup"
                    fetchPriority="high"
                    decoding="async"
                    className="w-full h-auto object-contain filter drop-shadow-[0_30px_40px_rgba(13,27,42,0.25)] dark:drop-shadow-[0_30px_50px_rgba(0,0,0,0.6)] transition-opacity duration-300"
                  />
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ──────────────── 2x2 Feature Showcase Section ──────────────── */}
      <section
        id="features"
        ref={featureSectionRef}
        className={`py-16 sm:py-24 relative overflow-hidden transition-colors duration-300 ${
          isDarkMode ? 'bg-[#070F18]' : 'bg-[#F4F7EB]'
        }`}
      >
        <div className="max-w-[1250px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header text at top-left matching attached reference */}
          <div className="text-left mb-10 sm:mb-14 max-w-2xl">
            <h2 className="text-3xl sm:text-5xl font-medium sm:font-semibold tracking-tight leading-[1.15]">
              <span className={isDarkMode ? 'text-white' : 'text-[#0D1B2A]'}>
                Everything you need
              </span>
              <br />
              <span className={isDarkMode ? 'text-[#E2F163]' : 'text-[#738c00]'}>
                at your fingertips
              </span>
            </h2>
            <p className={`mt-3 text-base sm:text-lg font-light ${
              isDarkMode ? 'text-slate-400' : 'text-[#0D1B2A]/70'
            }`}>
              Stay informed, stay empowered, stay on top of your finances.
            </p>
          </div>

          {/* 
            Zoom Container:
            Scales smoothly into full view as the header section is scrolled past
          */}
          <div
            style={{
              transform: `scale(${zoomScale})`,
              opacity: zoomOpacity,
              transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.18s ease-out',
              transformOrigin: 'center top'
            }}
            className="w-full"
          >
            {/* Asymmetrical Bento Grid: Direct on Page Background with Individual Glows */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
              
              {/* ──── Card 1: Row 1 Left (5 cols out of 12) ──── */}
              <div className="lg:col-span-5 relative min-h-[430px] sm:min-h-[470px] rounded-[44px] overflow-hidden p-6 sm:p-7 flex flex-col justify-end shadow-[0_22px_55px_rgba(0,0,0,0.45),0_12px_32px_rgba(226,241,99,0.12)] bg-[#0D1B2A]">
                {/* Individual Card Ambient Glow Behind & Below */}
                <div className="absolute -inset-2 rounded-[52px] bg-gradient-to-b from-[#E2F163]/18 via-[#E2F163]/10 to-[#E2F163]/5 blur-2xl opacity-70 pointer-events-none -z-10" />

                <img
                  src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=70&fm=webp"
                  alt="Know Exactly Where Every Penny Goes"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.78] pointer-events-none"
                />
                {/* Soft, Reduced Black Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/85 via-[#0D1B2A]/35 to-black/5 pointer-events-none" />

                <div className="relative z-10">
                  <h3 className="text-3xl sm:text-4xl lg:text-[40px] font-medium sm:font-semibold text-white tracking-tight leading-[1.15] mb-2.5 px-4 sm:px-6">
                    Know Exactly What You Spend
                  </h3>
                  <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed font-light pl-4 sm:pl-6 pr-0 max-w-lg">
                    Real-time expense tracking with interactive charts and automated category breakdown. No guessing balances, hidden fees, or mysterious deductions.
                  </p>
                </div>
              </div>

              {/* ──── Card 2: Row 1 Right (7 cols out of 12) ──── */}
              <div className="lg:col-span-7 relative min-h-[430px] sm:min-h-[470px] rounded-[44px] overflow-hidden p-6 sm:p-7 flex flex-col justify-between shadow-[0_22px_55px_rgba(0,0,0,0.45),0_12px_32px_rgba(226,241,99,0.12)] bg-[#0D1B2A]">
                {/* Individual Card Ambient Glow Behind & Below */}
                <div className="absolute -inset-2 rounded-[52px] bg-gradient-to-b from-[#E2F163]/18 via-[#E2F163]/10 to-[#E2F163]/5 blur-2xl opacity-70 pointer-events-none -z-10" />

                <img
                  src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=70&fm=webp"
                  alt="AI Statement Upload"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.78] pointer-events-none"
                />
                {/* Soft, Reduced Black Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/85 via-[#0D1B2A]/35 to-black/5 pointer-events-none" />

                {/* Compact Animated Mini Card 2 (Subtle Border, No Yellow/Green Outline) */}
                <div className="relative z-10 self-start w-full max-w-[240px] sm:max-w-[270px]">
                  <div className="animate-float-delayed backdrop-blur-md bg-[#0D1B2A]/85 border border-white/10 rounded-2xl p-3 sm:p-3.5 shadow-2xl transition-all duration-300">
                    <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                      <span className="font-semibold text-white flex items-center gap-1.5 text-[11px] truncate">
                        <span>📄</span> Jan_Statement.pdf
                      </span>
                      <span className="text-[9px] uppercase font-black text-[#0D1B2A] bg-[#E2F163] px-2 py-0.5 rounded-full shrink-0">
                        AI Extracted
                      </span>
                    </div>

                    {/* Animated Scanning Bar */}
                    <div className="w-full h-1.5 rounded-full bg-[#1E2D3D] overflow-hidden mb-2.5 relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E2F163] to-transparent w-full h-full animate-scan-laser" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#1E2D3D]/80 border border-white/5 text-[11px]">
                        <span className="text-slate-300 font-medium">💼 Salary Deposit</span>
                        <span className="text-[#E2F163] font-bold">+£10,000.00</span>
                      </div>
                      <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#1E2D3D]/80 border border-white/5 text-[11px]">
                        <span className="text-slate-300 font-medium">🛒 Shopping & Outlay</span>
                        <span className="text-slate-200 font-bold">-£33,160.00</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 pt-6">
                  <h3 className="text-3xl sm:text-4xl lg:text-[40px] font-medium sm:font-semibold text-white tracking-tight leading-[1.15] mb-2.5 px-4 sm:px-6">
                    Automated Statement Upload
                  </h3>
                  <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed font-light pl-4 sm:pl-6 pr-0 max-w-lg">
                    Upload bank statements in PDF or image format. Spendr&apos;s AI extracts transactions, dates, amounts, and classifications with zero manual data entry.
                  </p>
                </div>
              </div>

              {/* ──── Card 3: Row 2 Left (7 cols out of 12) ──── */}
              <div className="lg:col-span-7 relative min-h-[430px] sm:min-h-[470px] rounded-[44px] overflow-hidden p-6 sm:p-7 flex flex-col justify-between shadow-[0_22px_55px_rgba(0,0,0,0.45),0_12px_32px_rgba(226,241,99,0.12)] bg-[#0D1B2A]">
                {/* Individual Card Ambient Glow Behind & Below */}
                <div className="absolute -inset-2 rounded-[52px] bg-gradient-to-b from-[#E2F163]/18 via-[#E2F163]/10 to-[#E2F163]/5 blur-2xl opacity-70 pointer-events-none -z-10" />

                <img
                  src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=70&fm=webp"
                  alt="Multi-Currency & Custom Categories"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.78] pointer-events-none"
                />
                {/* Soft, Reduced Black Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/85 via-[#0D1B2A]/35 to-black/5 pointer-events-none" />

                {/* Compact Animated Mini Card 3 (Subtle Border, No Yellow/Green Outline) */}
                <div className="relative z-10 self-start w-full max-w-[240px] sm:max-w-[270px]">
                  <div className="animate-float-slow backdrop-blur-md bg-[#0D1B2A]/85 border border-white/10 rounded-2xl p-3 sm:p-3.5 shadow-2xl transition-all duration-300">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      <span className="flex items-center gap-1.5 text-white">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E2F163] animate-ping" />
                        Multi-Currency
                      </span>
                      <span className="text-[#E2F163] font-semibold">4 Currencies</span>
                    </div>

                    <div className="flex items-center justify-between gap-1 mb-2">
                      {['GBP', 'USD', 'EUR', 'NGN'].map((curr, idx) => (
                        <span
                          key={curr}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            idx === 0
                              ? 'bg-[#E2F163] text-[#0D1B2A] shadow-sm'
                              : 'bg-[#1E2D3D] text-slate-300 border border-white/5'
                          }`}
                        >
                          {curr}
                        </span>
                      ))}
                    </div>

                    <div className="p-2 rounded-xl bg-[#1E2D3D]/90 border border-white/5 flex items-center justify-between mb-2">
                      <span className="text-[11px] text-slate-300 font-medium">Active Balance:</span>
                      <span className="text-sm font-black text-[#E2F163]">
                        £823,457.93
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
                      <span className="px-2 py-0.5 rounded-md bg-[#1E2D3D]">✈️ Travel</span>
                      <span className="px-2 py-0.5 rounded-md bg-[#1E2D3D]">🍔 Dining</span>
                      <span className="px-2 py-0.5 rounded-md bg-[#1E2D3D]">🏷️ Custom</span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 pt-6">
                  <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-medium sm:font-semibold text-white tracking-tight leading-[1.15] mb-2.5 px-4 sm:px-6">
                    Any Currency, Custom Categories
                  </h3>
                  <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed font-light pl-4 sm:pl-6 pr-0 max-w-lg">
                    Build your own category tags with custom icons, log transfers across checking and savings, and switch effortlessly between USD, EUR, GBP, and NGN.
                  </p>
                </div>
              </div>

              {/* ──── Card 4: Row 2 Right (5 cols out of 12) ──── */}
              <div className="lg:col-span-5 relative min-h-[430px] sm:min-h-[470px] rounded-[44px] overflow-hidden p-6 sm:p-7 flex flex-col justify-between shadow-[0_22px_55px_rgba(0,0,0,0.45),0_12px_32px_rgba(226,241,99,0.12)] bg-[#0D1B2A]">
                {/* Individual Card Ambient Glow Behind & Below */}
                <div className="absolute -inset-2 rounded-[52px] bg-gradient-to-b from-[#E2F163]/18 via-[#E2F163]/10 to-[#E2F163]/5 blur-2xl opacity-70 pointer-events-none -z-10" />

                <img
                  src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=70&fm=webp"
                  alt="Track Your Savings Progress"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.78] pointer-events-none"
                />
                {/* Soft, Reduced Black Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/85 via-[#0D1B2A]/35 to-black/5 pointer-events-none" />

                {/* Compact Animated Mini Card 4 (Subtle Border, No Yellow/Green Outline) */}
                <div className="relative z-10 self-start w-full max-w-[240px] sm:max-w-[270px]">
                  <div className="animate-float-delayed backdrop-blur-md bg-[#0D1B2A]/85 border border-white/10 rounded-2xl p-3 sm:p-3.5 shadow-2xl transition-all duration-300">
                    <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 mb-1">
                      <span className="text-white">Savings Target</span>
                      <span className="text-[#E2F163] font-black bg-[#E2F163]/15 px-1.5 py-0.5 rounded-full animate-pulse">
                        +{growthPercent}%
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-2xl font-black text-white">
                        {totalEntries}
                      </span>
                      <span className="text-[11px] font-medium text-slate-300">
                        Transactions Tracked
                      </span>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-[#1E2D3D] overflow-hidden mb-1.5">
                      <div
                        style={{ width: `${gaugeFill}%` }}
                        className="h-full bg-gradient-to-r from-amber-400 via-[#E2F163] to-emerald-400 transition-all duration-300"
                      />
                    </div>

                    <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold">
                      <span>Month Progress</span>
                      <span className="text-[#E2F163]">{gaugeFill}% Achieved</span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 pt-6">
                  <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-medium sm:font-semibold text-white tracking-tight leading-[1.15] mb-2.5 px-4 sm:px-6">
                    Track Your Growth & Net Worth
                  </h3>
                  <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed font-light pl-4 sm:pl-6 pr-0 max-w-lg">
                    Watch your savings grow month over month with visual charts, goal targets, and scheduled reminders for continuous financial momentum.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ──────────────── NEW SECTION: Opal-Inspired 3-Screen Staggered Slide-In Showcase ──────────────── */}
      <section id="showcase" className={`py-20 sm:py-28 relative overflow-hidden transition-colors duration-300 ${
        isDarkMode ? 'bg-[#070F18]' : 'bg-[#F4F7EB]'
      }`}>
        
        {/* Soft, gentle ambient glows (subtle, not too strong) */}
        <div className="pointer-events-none absolute top-1/4 -left-32 w-[380px] h-[380px] rounded-full bg-[#E2F163]/5 filter blur-[100px] -z-10" />
        <div className="pointer-events-none absolute bottom-1/4 -right-32 w-[380px] h-[380px] rounded-full bg-[#E2F163]/5 filter blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-20">
          
          {/* ──── Block 1: Text Left (Slides In 1st), Phone Right (Slides In 2nd) ──── */}
          <div ref={block1Ref} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content (Text slides into place 1st) */}
            <div className={`lg:col-span-6 flex flex-col items-start text-left z-10 transition-all duration-700 ease-out ${
              block1InView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}>
              
              {/* Opal-style Pill Tag */}
              <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 border ${
                isDarkMode
                  ? 'bg-[#1E2D3D]/80 border-[#E2F163]/30 text-[#E2F163]'
                  : 'bg-[#EDF2E4] border-[#0D1B2A]/15 text-[#0D1B2A]'
              }`}>
                <span>Instant Entry ®</span>
              </div>

              {/* Bold Title */}
              <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] mb-6 ${
                isDarkMode ? 'text-white' : 'text-[#0D1B2A]'
              }`}>
                Log every penny<br />
                in one tap
              </h2>

              {/* Description Copy */}
              <p className={`text-base sm:text-lg leading-relaxed max-w-xl ${
                isDarkMode ? 'text-slate-300' : 'text-[#0D1B2A]/80'
              }`}>
                Spendr eliminates tedious financial paperwork. Switch seamlessly between Income and Expense, enter custom amounts, and assign category folders in seconds.
              </p>

            </div>

            {/* Right Phone Mockup (Image slides into place 2nd, staggered delay) */}
            <div className={`lg:col-span-6 relative flex items-center justify-center lg:justify-end transition-all duration-700 delay-300 ease-out ${
              block1InView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'
            }`}>
              
              {/* Soft, gentle backlight (not strong) */}
              <div className="absolute w-[320px] sm:w-[420px] h-[320px] sm:h-[420px] rounded-full filter blur-3xl opacity-20 pointer-events-none bg-[#E2F163]/10" />

              <div className="relative group w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[500px]">
                {/* 
                  Bottom Half Fade Mask (Half of the image faded into background):
                  Starts fading at 35%, completely melts by 78%
                */}
                <div className="relative overflow-hidden [mask-image:linear-gradient(to_bottom,black_30%,rgba(0,0,0,0.6)_48%,transparent_78%)] [-webkit-mask-image:linear-gradient(to_bottom,black_30%,rgba(0,0,0,0.6)_48%,transparent_78%)]">
                  <img
                    key={`add-${isDarkMode}`}
                    src={currentAddImg}
                    alt="Spendr Add Transaction Screen"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto object-contain filter drop-shadow-[0_20px_35px_rgba(13,27,42,0.25)] dark:drop-shadow-[0_25px_45px_rgba(0,0,0,0.7)] transform transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  {/* Subtle bottom half gradient overlay */}
                  <div className={`absolute inset-x-0 bottom-0 h-1/2 pointer-events-none ${
                    isDarkMode ? 'bg-gradient-to-t from-[#070F18] via-[#070F18]/85 to-transparent' : 'bg-gradient-to-t from-[#F4F7EB] via-[#F4F7EB]/85 to-transparent'
                  }`} />
                </div>
              </div>

            </div>

          </div>

          {/* ──── Block 2: Text Left (Slides In 1st on Right), Image Left (Slides In 2nd beside it) ──── */}
          <div ref={block2Ref} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Phone Mockup (Transactions Image on Left, Slides In 2nd with delay-300) */}
            <div className={`lg:col-span-6 order-2 lg:order-1 relative flex items-center justify-center lg:justify-start transition-all duration-700 delay-300 ease-out ${
              block2InView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'
            }`}>
              
              {/* Soft, gentle backlight */}
              <div className="absolute w-[320px] sm:w-[420px] h-[320px] sm:h-[420px] rounded-full filter blur-3xl opacity-20 pointer-events-none bg-[#E2F163]/10" />

              <div className="relative group w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[500px]">
                {/* Bottom Half Fade Mask */}
                <div className="relative overflow-hidden [mask-image:linear-gradient(to_bottom,black_30%,rgba(0,0,0,0.6)_48%,transparent_78%)] [-webkit-mask-image:linear-gradient(to_bottom,black_30%,rgba(0,0,0,0.6)_48%,transparent_78%)]">
                  <img
                    key={`tx-${isDarkMode}`}
                    src={currentSlantTxImg}
                    alt="Spendr Transactions Activity Screen"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto object-contain filter drop-shadow-[0_20px_35px_rgba(13,27,42,0.25)] dark:drop-shadow-[0_25px_45px_rgba(0,0,0,0.7)] transform transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  {/* Subtle bottom half gradient overlay */}
                  <div className={`absolute inset-x-0 bottom-0 h-1/2 pointer-events-none ${
                    isDarkMode ? 'bg-gradient-to-t from-[#070F18] via-[#070F18]/85 to-transparent' : 'bg-gradient-to-t from-[#F4F7EB] via-[#F4F7EB]/85 to-transparent'
                  }`} />
                </div>
              </div>

            </div>

            {/* Right Content (Text slides into place 1st) */}
            <div className={`lg:col-span-6 order-1 lg:order-2 flex flex-col items-start text-left z-10 transition-all duration-700 ease-out ${
              block2InView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}>
              
              {/* Opal-style Pill Tag */}
              <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 border ${
                isDarkMode
                  ? 'bg-[#1E2D3D]/80 border-[#E2F163]/30 text-[#E2F163]'
                  : 'bg-[#EDF2E4] border-[#0D1B2A]/15 text-[#0D1B2A]'
              }`}>
                <span>Activity Stream ®</span>
              </div>

              {/* Bold Title */}
              <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] mb-6 ${
                isDarkMode ? 'text-white' : 'text-[#0D1B2A]'
              }`}>
                Your cashflow in<br />
                one live feed
              </h2>

              {/* Description Copy */}
              <p className={`text-base sm:text-lg leading-relaxed max-w-xl ${
                isDarkMode ? 'text-slate-300' : 'text-[#0D1B2A]/80'
              }`}>
                Review every salary deposit, travel expense, and inter-bank transfer in a unified stream. Clear running balances and categorized entries keep your finances transparent.
              </p>

            </div>

          </div>

          {/* ──── Block 3: Text Left (Slides In 1st), Phone Right (Slides In 2nd) ──── */}
          <div ref={block3Ref} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content (Text slides into place 1st) */}
            <div className={`lg:col-span-6 flex flex-col items-start text-left z-10 transition-all duration-700 ease-out ${
              block3InView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}>
              
              {/* Opal-style Pill Tag */}
              <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 border ${
                isDarkMode
                  ? 'bg-[#1E2D3D]/80 border-[#E2F163]/30 text-[#E2F163]'
                  : 'bg-[#EDF2E4] border-[#0D1B2A]/15 text-[#0D1B2A]'
              }`}>
                <span>Focus Rules & Security ®</span>
              </div>

              {/* Bold Title */}
              <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] mb-6 ${
                isDarkMode ? 'text-white' : 'text-[#0D1B2A]'
              }`}>
                Set your rules &<br />
                secure your vault
              </h2>

              {/* Description Copy */}
              <p className={`text-base sm:text-lg leading-relaxed max-w-xl ${
                isDarkMode ? 'text-slate-300' : 'text-[#0D1B2A]/80'
              }`}>
                Take control of your day and privacy. Lock the app with biometric Face ID and Touch ID, schedule customized daily reminders, and switch between world currencies anytime.
              </p>

            </div>

            {/* Right Phone Mockup (Image slides into place 2nd, staggered delay) */}
            <div className={`lg:col-span-6 relative flex items-center justify-center lg:justify-end transition-all duration-700 delay-300 ease-out ${
              block3InView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'
            }`}>
              
              {/* Soft, gentle backlight */}
              <div className="absolute w-[320px] sm:w-[420px] h-[320px] sm:h-[420px] rounded-full filter blur-3xl opacity-20 pointer-events-none bg-[#E2F163]/10" />

              <div className="relative group w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[500px]">
                {/* Bottom Half Fade Mask */}
                <div className="relative overflow-hidden [mask-image:linear-gradient(to_bottom,black_30%,rgba(0,0,0,0.6)_48%,transparent_78%)] [-webkit-mask-image:linear-gradient(to_bottom,black_30%,rgba(0,0,0,0.6)_48%,transparent_78%)]">
                  <img
                    key={`settings-${isDarkMode}`}
                    src={currentSettingsImg}
                    alt="Spendr Settings & Security Screen"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto object-contain filter drop-shadow-[0_20px_35px_rgba(13,27,42,0.25)] dark:drop-shadow-[0_25px_45px_rgba(0,0,0,0.7)] transform transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  {/* Subtle bottom half gradient overlay */}
                  <div className={`absolute inset-x-0 bottom-0 h-1/2 pointer-events-none ${
                    isDarkMode ? 'bg-gradient-to-t from-[#070F18] via-[#070F18]/85 to-transparent' : 'bg-gradient-to-t from-[#F4F7EB] via-[#F4F7EB]/85 to-transparent'
                  }`} />
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ──────────────── Pre-qualification & Financial Future CTA Section ──────────────── */}
      <section
        ref={ctaSectionRef}
        className={`py-12 sm:py-20 relative overflow-hidden transition-colors duration-300 ${
          isDarkMode ? 'bg-[#070F18]' : 'bg-[#F4F7EB]'
        }`}
      >
        {/* Creative Ambient Underglow that blooms on scroll */}
        <div className={`pointer-events-none absolute inset-x-1/4 top-1/2 -translate-y-1/2 h-[360px] rounded-full bg-[#E2F163]/12 filter blur-[95px] transition-all duration-1000 -z-10 ${
          ctaInView ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`} />

        <div className="max-w-[1250px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Enclosed Card with smooth scale-in & reveal on scroll */}
          <div className={`rounded-[36px] sm:rounded-[44px] overflow-hidden border transition-all duration-1000 ease-out ${
            ctaInView
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-12 scale-[0.96]'
          } ${
            isDarkMode
              ? 'bg-[#0D1B2A] border-white/10 shadow-[0_22px_55px_rgba(0,0,0,0.45),0_12px_32px_rgba(226,241,99,0.08)]'
              : 'bg-white border-[#0D1B2A]/10 shadow-[0_20px_50px_rgba(0,0,0,0.06)]'
          }`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px] lg:min-h-[580px] items-stretch">
              
              {/* Left Column: Full-bleed Lifestyle Image with Animated Spendr Card Overlay */}
              <div className="lg:col-span-6 relative min-h-[340px] lg:min-h-full overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=900&q=70&fm=webp"
                  alt="Managing financial future with Spendr"
                  loading="lazy"
                  decoding="async"
                  className={`absolute inset-0 w-full h-full object-cover object-center transform transition-transform duration-1000 ease-out ${
                    ctaInView ? 'scale-100 group-hover:scale-105' : 'scale-110'
                  }`}
                />
                {/* Soft overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

                {/* Floating Mini Spendr Debit Card Accent - Slides up, rotates into place, and shimmers */}
                <div className={`absolute bottom-6 left-6 sm:bottom-8 sm:left-8 z-10 transition-all duration-1000 delay-300 ease-out ${
                  ctaInView
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-14 scale-90'
                }`}>
                  <div className="animate-float-slow">
                    <div className="relative overflow-hidden w-48 sm:w-56 h-28 sm:h-32 rounded-2xl bg-gradient-to-br from-[#0D1B2A] to-[#1E2D3D] p-3.5 sm:p-4 shadow-2xl border border-white/20 flex flex-col justify-between text-white backdrop-blur-md transform -rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300 group/card">
                      
                      {/* Sweeping Metallic Light Shimmer Reflection */}
                      <div
                        className={`absolute -inset-full w-[250%] h-[250%] bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-25 pointer-events-none transition-transform duration-1000 delay-700 ${
                          ctaInView ? 'translate-x-[150%]' : '-translate-x-[150%]'
                        }`}
                      />

                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-md bg-[#E2F163] p-1 flex items-center justify-center">
                            <img src={logoImg} alt="Spendr" className="w-full h-full object-contain" />
                          </div>
                          <span className="text-xs font-black tracking-wider text-white">spendr</span>
                        </div>
                        {/* Chip / Contactless icon */}
                        <div className="flex -space-x-1.5 opacity-90">
                          <div className="w-3.5 h-3.5 rounded-full bg-red-500/90" />
                          <div className="w-3.5 h-3.5 rounded-full bg-amber-400/90" />
                        </div>
                      </div>

                      <div className="flex items-end justify-between relative z-10">
                        <div>
                          <div className="text-[9px] text-slate-400 font-mono tracking-widest">•••• 8824</div>
                          <div className="text-[10px] font-bold text-slate-200 uppercase tracking-wider mt-0.5">Farouq N.</div>
                        </div>
                        <div className="text-[10px] font-mono text-[#E2F163] font-extrabold">09/29</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: CTA Content with Staggered Entrance on Scroll */}
              <div className={`lg:col-span-6 flex flex-col justify-center items-start p-8 sm:p-12 lg:p-16 z-10 ${
                isDarkMode ? 'bg-[#0D1B2A]' : 'bg-white'
              }`}>
                
                {/* Brand Aligned Pill Tag */}
                <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 border transition-all duration-700 delay-150 ease-out ${
                  ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
                } ${
                  isDarkMode
                    ? 'bg-[#1E2D3D]/80 border-[#E2F163]/30 text-[#E2F163]'
                    : 'bg-[#EDF2E4] border-[#0D1B2A]/15 text-[#0D1B2A]'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E2F163] animate-pulse" />
                  <span>Smart Financial Growth ®</span>
                </div>

                {/* Headline matching app typography & Josefin Sans font */}
                <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-medium sm:font-semibold tracking-tight leading-[1.12] mb-5 transition-all duration-700 delay-300 ease-out ${
                  ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                } ${
                  isDarkMode ? 'text-white' : 'text-[#0D1B2A]'
                }`}>
                  Take control of your<br />
                  <span className="text-[#738c00] dark:text-[#E2F163] transition-colors duration-300">
                    financial future
                  </span>
                </h2>

                {/* Description Copy */}
                <p className={`text-sm sm:text-base leading-relaxed max-w-md mb-7 font-light transition-all duration-700 delay-450 ease-out ${
                  ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                } ${
                  isDarkMode ? 'text-slate-300' : 'text-[#0D1B2A]/75'
                }`}>
                  Join thousands of mindful spenders taking control of their money. Track every expense, automate bank statements with AI, and grow your savings effortlessly.
                </p>

                {/* Brand Action CTA Button */}
                <div className={`transition-all duration-700 delay-600 ease-out ${
                  ctaInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
                }`}>
                  <a
                    href="#apk-download"
                    onClick={(e) => {
                      e.preventDefault()
                      handleProceedToApk()
                    }}
                    className="inline-flex items-center gap-2 px-7 sm:px-8 py-3 sm:py-3.5 rounded-full text-sm sm:text-base font-bold text-[#0D1B2A] bg-[#E2F163] hover:bg-[#d8e855] shadow-md shadow-[#E2F163]/25 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer group/btn"
                  >
                    <span>Start Tracking Free</span>
                    <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>

                {/* Trust Subtext Aligned with Spendr App */}
                <div className={`flex items-center gap-2 mt-6 text-xs sm:text-sm font-light text-[#0D1B2A]/60 dark:text-slate-400 transition-all duration-700 delay-700 ease-out ${
                  ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                }`}>
                  <svg className="w-4 h-4 text-[#738c00] dark:text-[#E2F163] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Free to use · No credit card required · 100% private</span>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── Creative Fintech Footer ──────────────── */}
      <footer className={`relative overflow-hidden border-t pt-20 pb-12 transition-colors duration-300 ${
        isDarkMode ? 'border-[#1E2D3D] bg-[#070F18] text-slate-300' : 'border-[#EDF2E4] bg-[#F4F7EB] text-[#0D1B2A]'
      }`}>
        
        {/* Soft Ambient Glows in Footer Background */}
        <div className="pointer-events-none absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#E2F163]/5 filter blur-[120px] -z-10" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-[#E2F163]/5 filter blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Newsletter / Direct APK Download Pre-Footer Banner */}
          <div
            id="apk-download"
            className={`scroll-mt-24 sm:scroll-mt-28 p-8 sm:p-12 rounded-3xl border mb-20 transition-all duration-300 ${
              isDarkMode
                ? 'bg-[#0D1B2A] border-[#E2F163]/25 shadow-[0_0_50px_rgba(226,241,99,0.05)]'
                : 'bg-white border-[#EDF2E4] shadow-sm'
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 bg-[#E2F163] text-[#0D1B2A]">
                  <span>Direct APK Download</span>
                </div>
                <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 ${
                  isDarkMode ? 'text-white' : 'text-[#0D1B2A]'
                }`}>
                  Get the Spendr APK sent to your inbox
                </h3>
                <p className={`text-sm sm:text-base ${isDarkMode ? 'text-slate-400' : 'text-[#0D1B2A]/70'}`}>
                  While we finalize Apple App Store & Google Play review, enter your email below to receive the direct Android APK download link immediately.
                </p>
              </div>

              <div className="lg:col-span-5">
                {apkSubmitted ? (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <div className="flex items-center gap-2 font-bold text-sm mb-1 text-emerald-300">
                      <span>✓</span> Download Link Sent!
                    </div>
                    <p className="text-xs leading-relaxed text-slate-300">
                      We&apos;ve sent the Spendr APK link to <strong className="text-white">{emailValue}</strong>. Check your inbox to install!
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setApkSubmitted(false)
                        setEmailValue('')
                      }}
                      className="mt-3 text-xs underline text-[#E2F163] hover:opacity-80 cursor-pointer"
                    >
                      Send to a different email
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      if (emailValue.trim()) {
                        setApkSubmitted(true)
                      }
                    }}
                    className="flex flex-col sm:flex-row gap-2.5"
                  >
                    <input
                      ref={emailInputRef}
                      type="email"
                      required
                      value={emailValue}
                      onChange={(e) => setEmailValue(e.target.value)}
                      placeholder="Enter your email address"
                      className={`flex-1 px-4 py-3 rounded-full text-sm font-medium border outline-none transition-all duration-300 ${
                        inputHighlighted
                          ? 'ring-4 ring-[#E2F163] shadow-lg shadow-[#E2F163]/40 border-[#E2F163] scale-[1.01]'
                          : ''
                      } ${
                        isDarkMode
                          ? 'bg-[#1E2D3D] border-[#1E2D3D] text-white placeholder-slate-400 focus:border-[#E2F163]'
                          : 'bg-[#F9FBF2] border-[#EDF2E4] text-[#0D1B2A] placeholder-slate-400 focus:border-[#0D1B2A]'
                      }`}
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-full text-sm font-bold bg-[#E2F163] text-[#0D1B2A] hover:bg-[#d8e855] transition-all shadow-md shadow-[#E2F163]/20 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer hover:scale-105 active:scale-95"
                    >
                      <span>Send Link</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </form>
                )}
                <div className="flex items-center gap-4 mt-3 text-[11px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <span className="text-[#65A30D] dark:text-[#E2F163]">✓</span> Instant download
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-[#65A30D] dark:text-[#E2F163]">✓</span> Free forever
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-[#65A30D] dark:text-[#E2F163]">✓</span> 100% secure APK
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Footer Navigation Columns */}
          <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12 pb-16">
            
            {/* Column 1: Brand & Identity (4 Cols) */}
            <div className="col-span-2 md:col-span-4 flex flex-col items-start">
              <a href="#" className="flex items-center gap-2.5 group mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#E2F163] flex items-center justify-center p-2 shadow-sm transition-transform group-hover:scale-105">
                  <img src={logoImg} alt="Spendr Logo" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-[#0D1B2A]'}`}>
                    spendr
                  </span>
                  <span className={`text-[10px] tracking-widest font-semibold uppercase -mt-1 ${
                    isDarkMode ? 'text-[#E2F163]' : 'text-[#61741F]'
                  }`}>
                    personal finance
                  </span>
                </div>
              </a>

              <p className={`text-sm leading-relaxed mb-6 max-w-sm ${isDarkMode ? 'text-slate-400' : 'text-[#0D1B2A]/70'}`}>
                A smart personal finance tracker built with Flutter. Track daily spending, extract bank statements with AI, and grow your net worth with bank-level privacy.
              </p>
            </div>

            {/* Column 2: Product (2 Cols) */}
            <div className="col-span-1 md:col-span-2">
              <h4 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-[#E2F163]' : 'text-[#0D1B2A]'}`}>
                Product
              </h4>
              <ul className="space-y-2.5 text-sm font-medium">
                <li><a href="#features" className="hover:underline">Visual Dashboard</a></li>
                <li><a href="#showcase" className="hover:underline">AI Statement OCR</a></li>
                <li><a href="#features" className="hover:underline">Custom Categories</a></li>
                <li><a href="#showcase" className="hover:underline">Instant Logging</a></li>
                <li><a href="#currencies" className="hover:underline">Multi-Currency</a></li>
                <li><a href="#prequalify" className="hover:underline">Paystack Premium</a></li>
              </ul>
            </div>

            {/* Column 3: Security & Privacy (3 Cols) */}
            <div className="col-span-1 md:col-span-3">
              <h4 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-[#E2F163]' : 'text-[#0D1B2A]'}`}>
                Security & Cloud
              </h4>
              <ul className="space-y-2.5 text-sm font-medium">
                <li><a href="#showcase" className="hover:underline">Face ID / Touch ID</a></li>
                <li><a href="#security" className="hover:underline">256-Bit TLS Encryption</a></li>
                <li><a href="#features" className="hover:underline">Firebase Firestore Sync</a></li>
                <li><a href="#privacy" className="hover:underline">Local-First Storage</a></li>
                <li><a href="#privacy" className="hover:underline">Privacy Policy</a></li>
                <li><a href="#terms" className="hover:underline">Terms of Service</a></li>
              </ul>
            </div>

            {/* Column 4: Supported Currencies & App (3 Cols) */}
            <div className="col-span-2 md:col-span-3">
              <h4 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-[#E2F163]' : 'text-[#0D1B2A]'}`}>
                Supported Currencies
              </h4>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {[
                  { code: 'GBP', sym: '£', label: 'British Pound' },
                  { code: 'USD', sym: '$', label: 'US Dollar' },
                  { code: 'EUR', sym: '€', label: 'Euro' },
                  { code: 'NGN', sym: '₦', label: 'Nigerian Naira' }
                ].map((c) => (
                  <div
                    key={c.code}
                    className={`p-2 rounded-xl text-left border ${
                      isDarkMode ? 'bg-[#1E2D3D]/50 border-white/5' : 'bg-white border-[#EDF2E4]'
                    }`}
                  >
                    <div className="text-[11px] font-bold text-[#E2F163] dark:text-[#E2F163]">{c.code} ({c.sym})</div>
                    <div className="text-[10px] text-slate-400 truncate">{c.label}</div>
                  </div>
                ))}
              </div>

              {/* Built with Flutter badge */}
              <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs font-semibold ${
                isDarkMode ? 'bg-[#1E2D3D]/40 border-white/5' : 'bg-white border-[#EDF2E4]'
              }`}>
                <span>Flutter • Dart</span>
                <span className="text-[#65A30D] dark:text-[#E2F163]">Paystack Ready</span>
              </div>
            </div>

          </div>

          {/* Legal Disclaimers & Compliance */}
          <div className={`pt-8 pb-12 border-t text-xs leading-relaxed ${
            isDarkMode ? 'border-white/10 text-slate-500' : 'border-[#0D1B2A]/10 text-slate-500'
          }`}>
            <p className="mb-2">
              Spendr Technologies Inc. is a financial management software tool, not a registered banking institution or credit card issuer. Accounts, payments, and banking transfers are processed through licensed third-party partners.
            </p>
            <p>
              Apple and the Apple Logo are trademarks of Apple Inc., registered in the U.S. and other countries. Google Play and the Google Play logo are trademarks of Google LLC.
            </p>
          </div>

          {/* Bottom Bar: Copyright & Navigation */}
          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium">
            <div>
              © 2026 Spendr Technologies Inc. All rights reserved.
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-500">
              <a href="#features" className="hover:underline">Features</a>
              <a href="#showcase" className="hover:underline">Security</a>
              <a
                href="#apk-download"
                onClick={(e) => {
                  e.preventDefault()
                  handleProceedToApk()
                }}
                className="hover:underline cursor-pointer"
              >
                Direct Download
              </a>
            </div>
          </div>

          {/* Giant Artistic Background Watermark: full-width on mobile */}
          <div className="w-full overflow-hidden flex justify-center pointer-events-none select-none -mb-8 sm:-mb-12 mt-6">
            <span className={`text-[23.5vw] sm:text-[19vw] md:text-[18vw] lg:text-[17vw] font-black tracking-tighter leading-none transition-colors duration-300 text-center w-full block ${
              isDarkMode ? 'text-white/[0.03]' : 'text-[#0D1B2A]/[0.04]'
            }`}>
              SPENDR
            </span>
          </div>

        </div>
      </footer>

      {/* ──────────────── Floating Action Button: Circular Back to Top ──────────────── */}
      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer border ${
            isDarkMode
              ? 'bg-[#E2F163] text-[#0D1B2A] border-[#E2F163] shadow-[#E2F163]/30'
              : 'bg-[#0D1B2A] text-[#E2F163] border-[#0D1B2A] shadow-slate-900/30'
          }`}
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}

      {/* ──────────────── Coming Soon Store Modal ──────────────── */}
      {storeModal.open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setStoreModal({ open: false, store: '' })}
        >
          <div
            className={`relative w-full max-w-md rounded-3xl p-6 sm:p-8 border shadow-2xl transition-all transform scale-100 ${
              isDarkMode
                ? 'bg-[#0D1B2A] border-white/10 text-white shadow-black/80'
                : 'bg-white border-[#0D1B2A]/10 text-[#0D1B2A] shadow-2xl'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setStoreModal({ open: false, store: '' })}
              aria-label="Close modal"
              className={`absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                isDarkMode
                  ? 'bg-[#1E2D3D] text-slate-300 hover:text-white'
                  : 'bg-[#EDF2E4] text-[#0D1B2A] hover:bg-[#dfe8d4]'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Icon / Badge */}
            <div className="w-12 h-12 rounded-2xl bg-[#E2F163] p-2.5 flex items-center justify-center mb-5 shadow-lg shadow-[#E2F163]/25">
              <img src={logoImg} alt="Spendr" className="w-full h-full object-contain" />
            </div>

            {/* Modal Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-2.5 bg-[#E2F163]/15 text-[#738c00] dark:text-[#E2F163] border border-[#E2F163]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E2F163] animate-ping" />
              <span>Coming Soon</span>
            </div>

            <h3 className={`text-xl sm:text-2xl font-bold tracking-tight mb-2.5 leading-snug ${
              isDarkMode ? 'text-white' : 'text-[#0D1B2A]'
            }`}>
              Coming to {storeModal.store} soon!
            </h3>

            <p className={`text-sm leading-relaxed mb-6 font-light ${
              isDarkMode ? 'text-slate-300' : 'text-[#0D1B2A]/75'
            }`}>
              We are currently in the final stages of store approvals. In the meantime, you can get early access right now — enter your email to receive the direct download link for the Android APK!
            </p>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleProceedToApk}
                className="flex-1 px-5 py-3 rounded-full text-sm font-bold bg-[#E2F163] text-[#0D1B2A] hover:bg-[#d8e855] transition-all shadow-md shadow-[#E2F163]/25 hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Get APK Download Link</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => setStoreModal({ open: false, store: '' })}
                className={`px-4 py-3 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                  isDarkMode
                    ? 'bg-[#1E2D3D] text-slate-300 hover:text-white'
                    : 'bg-[#EDF2E4] text-[#0D1B2A] hover:bg-[#dfe8d4]'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
