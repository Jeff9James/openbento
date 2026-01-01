/**
 * Generate React hooks for the exported App.tsx
 */

export const generateTiltHook = (): string => `
// Tilt effect hook
const useTiltEffect = (isEnabled = true) => {
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({})
  const elementRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEnabled || !elementRef.current) return
    const rect = elementRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -10
    const rotateY = ((x - centerX) / centerX) * 10
    const glareX = (x / rect.width) * 100
    const glareY = (y / rect.height) * 100
    const shadowX = rotateY * 1.5
    const shadowY = rotateX * -1.5
    setTiltStyle({
      transform: \`perspective(800px) rotateX(\${rotateX}deg) rotateY(\${rotateY}deg) scale3d(1.02, 1.02, 1.02)\`,
      boxShadow: \`\${shadowX}px \${shadowY}px 25px rgba(0,0,0,0.15), 0 8px 30px rgba(0,0,0,0.1)\`,
      transition: 'transform 0.1s ease-out, box-shadow 0.1s ease-out',
      '--glare-x': \`\${glareX}%\`,
      '--glare-y': \`\${glareY}%\`,
    } as React.CSSProperties)
  }, [isEnabled])

  const handleMouseLeave = useCallback(() => {
    if (!isEnabled) return
    setTiltStyle({
      transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.5s ease-out, box-shadow 0.5s ease-out',
    })
  }, [isEnabled])

  return { elementRef, tiltStyle, handleMouseMove, handleMouseLeave }
}
`;

export const generateAnalyticsHook = (siteId: string): string => `
// Analytics hook
const useAnalytics = () => {
  const sessionStart = useRef(Date.now())
  const maxScroll = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0
      maxScroll.current = Math.max(maxScroll.current, scrollPercent)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const config = profile.analytics
    if (!config?.enabled || !config?.supabaseUrl || !config?.anonKey) return

    const getVisitorId = () => {
      let id = localStorage.getItem('_ob_vid')
      if (!id) {
        id = 'v_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
        localStorage.setItem('_ob_vid', id)
      }
      return id
    }

    const track = async (eventType: string, extra = {}) => {
      const utm = new URLSearchParams(window.location.search)
      const payload = {
        site_id: '${siteId}',
        event_type: eventType,
        visitor_id: getVisitorId(),
        session_id: sessionStart.current.toString(36),
        page_url: window.location.href,
        referrer: document.referrer || null,
        utm_source: utm.get('utm_source'),
        utm_medium: utm.get('utm_medium'),
        utm_campaign: utm.get('utm_campaign'),
        utm_term: utm.get('utm_term'),
        utm_content: utm.get('utm_content'),
        user_agent: navigator.userAgent,
        language: navigator.language,
        screen_w: window.screen?.width,
        screen_h: window.screen?.height,
        viewport_w: window.innerWidth,
        viewport_h: window.innerHeight,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        ...extra,
      }
      const endpoint = config.supabaseUrl.replace(/\\/+$/, '') + '/rest/v1/openbento_analytics_events'
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': config.anonKey!, 'Authorization': 'Bearer ' + config.anonKey, 'Prefer': 'return=minimal' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {})
    }

    track('page_view')

    const trackEnd = () => {
      const duration = Math.round((Date.now() - sessionStart.current) / 1000)
      track('session_end', { duration_seconds: duration, scroll_depth: maxScroll.current, engaged: duration > 10 && maxScroll.current > 25 })
    }
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') trackEnd() })
    window.addEventListener('pagehide', trackEnd)
  }, [])
}
`;
