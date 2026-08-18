import { useState, useRef, useCallback, useEffect } from 'react'
import {
  CheckCircle,
  AlertTriangle,
  Activity,
  XCircle,
  ShieldCheck,
  MapPin,
  Tag,
  Hash,
  Building,
  GripVertical,
  TrendingUp,
  Eye,
  Zap,
  Upload,
  Loader2,
  Sparkles,
  ImageIcon,
} from 'lucide-react'

const API_URL = 'http://localhost:5000/api/resolution/verify'

const BEFORE_IMG =
  'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=1200&h=800&fit=crop&q=80'
const AFTER_IMG =
  'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=1200&h=800&fit=crop&q=80'

/* ═══════════════════════════════════════════════════════════════
   Before / After Comparison Slider
   ═══════════════════════════════════════════════════════════════ */
function ComparisonSlider({ beforeSrc, afterSrc }) {
  const [pos, setPos] = useState(50)
  const containerRef = useRef(null)
  const dragging = useRef(false)

  const update = useCallback((clientX) => {
    if (!containerRef.current) return
    const { left, width } = containerRef.current.getBoundingClientRect()
    setPos(Math.max(4, Math.min(96, ((clientX - left) / width) * 100)))
  }, [])

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return
      update(e.clientX)
    }
    const onUp = () => {
      dragging.current = false
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [update])

  const onPointerDown = (e) => {
    e.preventDefault()
    dragging.current = true
    update(e.clientX)
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none cursor-col-resize overflow-hidden touch-none"
      onPointerDown={onPointerDown}
    >
      {/* After image — base layer */}
      <img
        src={afterSrc}
        alt="After — repaired road"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* Before image — clipped overlay */}
      <img
        src={beforeSrc}
        alt="Before — damaged road"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        draggable={false}
      />

      {/* Corner labels */}
      <span className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 bg-zinc-950/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ring-1 ring-white/10 pointer-events-none">
        <XCircle className="w-3 h-3 text-red-400" />
        Before
      </span>
      <span className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 bg-zinc-950/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ring-1 ring-white/10 pointer-events-none">
        <CheckCircle className="w-3 h-3 text-emerald-400" />
        After
      </span>

      {/* Slider line */}
      <div
        className="absolute top-0 bottom-0 z-20 w-[2px] bg-white/90 pointer-events-none"
        style={{
          left: `${pos}%`,
          transform: 'translateX(-50%)',
          boxShadow: '0 0 12px rgba(255,255,255,0.35)',
        }}
      >
        {/* Drag handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-2xl flex items-center justify-center ring-1 ring-white/40 pointer-events-none">
          <GripVertical className="w-4 h-4 text-zinc-500" />
        </div>
      </div>

      {/* Bottom hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-1 bg-zinc-950/50 backdrop-blur-md text-zinc-300 text-[10px] font-medium px-3 py-1.5 rounded-full ring-1 ring-white/5 pointer-events-none">
        ← Drag to compare →
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   Circular Progress Ring
   ═══════════════════════════════════════════════════════════════ */
function CircularProgress({ value, size = 80 }) {
  const radius = 15.9155
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
        {/* Track */}
        <circle
          cx="18"
          cy="18"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-zinc-800"
        />
        {/* Progress */}
        <circle
          cx="18"
          cy="18"
          r={radius}
          fill="none"
          stroke="url(#ring-grad)"
          strokeWidth="2.5"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="drop-shadow-[0_0_6px_rgba(52,211,153,0.5)]"
        />
        <defs>
          <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#2dd4bf" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-white tabular-nums tracking-tight">
          {value}%
        </span>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   File Upload Button
   ═══════════════════════════════════════════════════════════════ */
function FileUploadButton({ label, file, onFileChange, id }) {
  const inputRef = useRef(null)

  return (
    <div className="flex-1 min-w-0">
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFileChange(e.target.files?.[0] || null)}
      />
      <button
        onClick={() => inputRef.current?.click()}
        className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border text-sm font-medium transition-all duration-150 cursor-pointer ${
          file
            ? 'border-emerald-500/25 bg-emerald-500/[0.06] text-emerald-300'
            : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
        }`}
      >
        {file ? (
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        ) : (
          <ImageIcon className="w-4 h-4 flex-shrink-0" />
        )}
        <span className="truncate">
          {file ? file.name : label}
        </span>
      </button>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   Main Dashboard
   ═══════════════════════════════════════════════════════════════ */
function App() {
  const [confirmed, setConfirmed] = useState(false)
  const [reported, setReported] = useState(false)

  // File upload state
  const [beforeImageFile, setBeforeImageFile] = useState(null)
  const [afterImageFile, setAfterImageFile] = useState(null)

  // AI verification state
  const [isVerifying, setIsVerifying] = useState(false)
  const [aiResult, setAiResult] = useState(null)
  const [aiError, setAiError] = useState(null)

  // Preview URLs for uploaded images
  const beforePreview = beforeImageFile
    ? URL.createObjectURL(beforeImageFile)
    : BEFORE_IMG
  const afterPreview = afterImageFile
    ? URL.createObjectURL(afterImageFile)
    : AFTER_IMG

  // Cleanup object URLs on unmount or file change
  useEffect(() => {
    return () => {
      if (beforeImageFile) URL.revokeObjectURL(beforePreview)
    }
  }, [beforeImageFile])

  useEffect(() => {
    return () => {
      if (afterImageFile) URL.revokeObjectURL(afterPreview)
    }
  }, [afterImageFile])

  /* ── AI Verification ── */
  const handleVerifyResolution = async () => {
    if (!beforeImageFile || !afterImageFile) return

    setIsVerifying(true)
    setAiResult(null)
    setAiError(null)

    try {
      const formData = new FormData()
      formData.append('beforeImage', beforeImageFile)
      formData.append('afterImage', afterImageFile)

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setAiResult(data.data)
      } else {
        throw new Error(data.error || 'Verification failed')
      }
    } catch (error) {
      console.error('[handleVerifyResolution]', error)
      setAiError(error.message)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleConfirm = () => {
    setConfirmed(true)
    setReported(false)
  }
  const handleReport = () => {
    setReported(true)
    setConfirmed(false)
  }

  const metadata = [
    { icon: Hash, label: 'Complaint ID', value: 'CE-1042' },
    { icon: Tag, label: 'Category', value: 'Pothole' },
    { icon: MapPin, label: 'Location', value: 'MG Road, Sadar' },
    { icon: Building, label: 'Ward', value: 'Sadar — Zone 3' },
  ]

  // Derive display values from AI result (with fallback defaults)
  const improvementValue = aiResult ? aiResult.improvement : 92
  const resolvedStatus = aiResult ? aiResult.resolved : true
  const confidenceValue = aiResult
    ? aiResult.confidence >= 0.8
      ? 'High'
      : aiResult.confidence >= 0.5
        ? 'Medium'
        : 'Low'
    : '—'
  const reasonText = aiResult ? aiResult.reason : null

  const bothFilesSelected = beforeImageFile && afterImageFile

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] rounded-full bg-emerald-500/[0.03] blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[15%] w-[500px] h-[500px] rounded-full bg-indigo-500/[0.025] blur-[100px]" />
      </div>

      {/* ── Top Bar ── */}
      <header className="relative z-10 border-b border-white/[0.06] bg-zinc-950/80 backdrop-blur-xl flex-shrink-0">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Eye className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-white">
              CivicEye
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold tracking-widest uppercase">
            <Activity className="w-3 h-3" />
            <span className="hidden sm:inline">Verification</span> Active
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="relative z-10 flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 lg:py-6 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 flex-1 min-h-0">
          {/* ────────────────────────────────────────────────
              LEFT COLUMN — Visual Evidence
              ──────────────────────────────────────────────── */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-3 min-h-0">
            {/* Section label */}
            <div className="flex items-center justify-between flex-shrink-0">
              <h2 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">
                Visual Evidence
              </h2>
              <span className="text-[10px] text-zinc-600 font-medium tracking-wide">
                Interactive Comparison
              </span>
            </div>

            {/* Slider card */}
            <div className="rounded-xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl shadow-2xl shadow-black/30 overflow-hidden flex-1 min-h-[320px] lg:min-h-0">
              <ComparisonSlider beforeSrc={beforePreview} afterSrc={afterPreview} />
            </div>

            {/* ── Image Upload Controls ── */}
            <div className="rounded-xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl p-4 flex-shrink-0">
              <div className="flex items-center gap-2 mb-3">
                <Upload className="w-3.5 h-3.5 text-zinc-500" />
                <h3 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">
                  Upload Images for AI Analysis
                </h3>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <FileUploadButton
                  id="before-upload"
                  label="Select Before Image"
                  file={beforeImageFile}
                  onFileChange={setBeforeImageFile}
                />
                <FileUploadButton
                  id="after-upload"
                  label="Select After Image"
                  file={afterImageFile}
                  onFileChange={setAfterImageFile}
                />
              </div>
              {/* Verify Button */}
              <button
                onClick={handleVerifyResolution}
                disabled={!bothFilesSelected || isVerifying}
                className={`mt-3 w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  !bothFilesSelected
                    ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                    : isVerifying
                      ? 'bg-violet-500/20 text-violet-300 cursor-wait'
                      : 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg shadow-violet-500/20 hover:brightness-110 active:scale-[0.98]'
                }`}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying with AI…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Verify with Gemini AI
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ────────────────────────────────────────────────
              RIGHT COLUMN — AI Intelligence & Actions
              ──────────────────────────────────────────────── */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4 min-h-0">
            {/* ─ Complaint Metadata Card ─ */}
            <div className="rounded-xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl p-5 space-y-4 flex-shrink-0">
              <h3 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">
                Complaint Details
              </h3>
              <div className="space-y-3">
                {metadata.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800/80 flex items-center justify-center ring-1 ring-white/[0.06] flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-zinc-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider leading-none mb-0.5">
                        {label}
                      </p>
                      <p className="text-[13px] text-zinc-200 font-medium truncate">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ─ Bento Grid — AI Cards (dynamic) ─ */}
            <div className="grid grid-cols-2 gap-3 flex-shrink-0">
              {/* Card 1: Visual Improvement */}
              <div className="rounded-xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl p-4 flex flex-col items-center justify-center text-center gap-2.5">
                <CircularProgress value={improvementValue} size={68} />
                <div>
                  <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider leading-none">
                    Visual
                  </p>
                  <p className="text-xs text-zinc-300 font-semibold mt-0.5">
                    Improvement
                  </p>
                </div>
              </div>

              {/* Card 2: AI Status (dynamic resolved) */}
              <div
                className={`rounded-xl border backdrop-blur-xl p-4 flex flex-col items-center justify-center text-center gap-2.5 relative overflow-hidden ${
                  resolvedStatus
                    ? 'border-emerald-500/15 bg-emerald-500/[0.04]'
                    : 'border-red-500/15 bg-red-500/[0.04]'
                }`}
              >
                {/* Background glow */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br to-transparent pointer-events-none ${
                    resolvedStatus
                      ? 'from-emerald-500/[0.06]'
                      : 'from-red-500/[0.06]'
                  }`}
                />
                <div className="relative">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center ring-1 ${
                      resolvedStatus
                        ? 'bg-emerald-500/10 ring-emerald-500/20'
                        : 'bg-red-500/10 ring-red-500/20'
                    }`}
                  >
                    {resolvedStatus ? (
                      <ShieldCheck className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-400" />
                    )}
                  </div>
                  <div
                    className={`absolute inset-0 rounded-full blur-xl progress-glow ${
                      resolvedStatus ? 'bg-emerald-400/15' : 'bg-red-400/15'
                    }`}
                  />
                </div>
                <div className="relative">
                  <p
                    className={`text-[10px] font-semibold uppercase tracking-wider leading-none ${
                      resolvedStatus ? 'text-emerald-500/80' : 'text-red-500/80'
                    }`}
                  >
                    AI Status
                  </p>
                  <p
                    className={`text-xs font-bold mt-0.5 ${
                      resolvedStatus ? 'text-emerald-300' : 'text-red-300'
                    }`}
                  >
                    {resolvedStatus ? '✓ Likely Resolved' : '✗ Not Resolved'}
                  </p>
                </div>
              </div>

              {/* Card 3: Confidence (dynamic) */}
              <div className="rounded-xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl p-4 flex flex-col items-center justify-center text-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center ring-1 ring-violet-500/15">
                  <TrendingUp className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider leading-none">
                    Confidence
                  </p>
                  <p className="text-sm text-white font-bold mt-0.5">{confidenceValue}</p>
                </div>
              </div>

              {/* Card 4: Analysis Time */}
              <div className="rounded-xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl p-4 flex flex-col items-center justify-center text-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center ring-1 ring-amber-500/15">
                  <Zap className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider leading-none">
                    Analysis
                  </p>
                  <p className="text-sm text-white font-bold mt-0.5">
                    {aiResult ? 'Done' : '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* ─ Status Banner (dynamic) ─ */}
            {aiResult ? (
              <div
                className={`rounded-xl border backdrop-blur-xl p-4 flex items-start gap-3 flex-shrink-0 ${
                  resolvedStatus
                    ? 'border-emerald-500/15 bg-emerald-500/[0.04]'
                    : 'border-red-500/15 bg-red-500/[0.04]'
                }`}
              >
                {resolvedStatus ? (
                  <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p
                    className={`text-sm font-semibold tracking-tight ${
                      resolvedStatus ? 'text-emerald-300' : 'text-red-300'
                    }`}
                  >
                    {resolvedStatus
                      ? '✓ Issue appears resolved'
                      : '✗ Issue does not appear resolved'}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1 font-medium leading-relaxed">
                    {reasonText}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-xl p-4 flex items-start gap-3 flex-shrink-0">
                <Sparkles className="w-5 h-5 text-zinc-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-zinc-400 tracking-tight">
                    Awaiting AI analysis
                  </p>
                  <p className="text-xs text-zinc-600 mt-0.5 font-medium">
                    Upload images and verify to see results
                  </p>
                </div>
              </div>
            )}

            {/* ─ AI Error Banner ─ */}
            {aiError && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4 flex items-center gap-3 animate-fade-in-up flex-shrink-0">
                <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-300 font-medium">{aiError}</p>
              </div>
            )}

            {/* ─ Feedback Banners ─ */}
            {confirmed && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4 flex items-center gap-3 animate-fade-in-up flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <p className="text-sm text-emerald-300 font-medium">
                  Resolution confirmed. Thank you!
                </p>
              </div>
            )}
            {reported && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-4 flex items-center gap-3 animate-fade-in-up flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <p className="text-sm text-amber-300 font-medium">
                  Report submitted. We&apos;ll re-examine.
                </p>
              </div>
            )}

            {/* ─ Action Buttons ─ */}
            <div className="flex flex-col gap-2.5 mt-auto pt-1 flex-shrink-0">
              <button
                onClick={handleConfirm}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white text-zinc-950 font-semibold text-sm shadow-lg shadow-white/[0.07] hover:bg-zinc-100 active:scale-[0.98] transition-all duration-150 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                Confirm Resolution
              </button>
              <button
                onClick={handleReport}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-transparent border border-zinc-800 text-zinc-400 font-medium text-sm hover:border-red-500/30 hover:text-red-400 hover:bg-red-500/[0.04] active:scale-[0.98] transition-all duration-150 cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4" />
                Report Still Unresolved
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
