"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronRight, ChevronLeft, Sparkles, BookOpen } from "lucide-react"

// ─── Tutorial steps ────────────────────────────────────────────────────────────
// Each step targets a DOM element via a data-tutorial attribute.
// dialogPosition controls where the dialog box opens relative to the element.
// ──────────────────────────────────────────────────────────────────────────────

interface TutorialStep {
  /** CSS selector for the highlighted element */
  target: string
  title: string
  description: string
  dialogPosition?: "top" | "bottom" | "left" | "right" | "center"
  /** Icon emoji shown in the header */
  icon?: string
}

const STEPS: TutorialStep[] = [
  {
    target: "[data-tutorial='welcome']",
    title: "¡Bienvenido a QuestMind!",
    description:
      "Esta es tu pantalla principal. Desde aquí controlas toda tu aventura de aprendizaje. Vamos a mostrarte cada sección en menos de 2 minutos.",
    dialogPosition: "bottom",
    icon: "🎮",
  },
  {
    target: "[data-tutorial='xp-bar']",
    title: "Tu Barra de Experiencia",
    description:
      "Cada respuesta correcta te da puntos de XP. Cuando llenes la barra completamente, subirás de nivel y ganarás recompensas especiales.",
    dialogPosition: "bottom",
    icon: "⚡",
  },
  {
    target: "[data-tutorial='stats']",
    title: "Tus Estadísticas",
    description:
      "Aquí ves tu nivel actual, partidas jugadas, aciertos totales y precisión general. Intenta mejorar cada número con cada sesión.",
    dialogPosition: "bottom",
    icon: "📊",
  },
  {
    target: "[data-tutorial='streak']",
    title: "Racha Diaria",
    description:
      "Estudia al menos una vez al día para mantener tu racha activa. Las rachas largas demuestran consistencia. ¡No la rompas!",
    dialogPosition: "bottom",
    icon: "🔥",
  },
  {
    target: "[data-tutorial='new-game']",
    title: "Crear Nueva Partida",
    description:
      "Sube un PDF con tus apuntes y la IA generará preguntas automáticamente. Elige la dificultad (Fácil, Normal, Difícil) y empieza a ganar XP.",
    dialogPosition: "top",
    icon: "🎯",
  },
  {
    target: "[data-tutorial='subjects-sidebar']",
    title: "Módulos de Estudio",
    description:
      "Aquí encontrarás materias y módulos organizados. Completa secciones, supera diagnósticos y avanza por el contenido estructurado.",
    dialogPosition: "left",
    icon: "📚",
  },
  {
    target: "[data-tutorial='nav-inventory']",
    title: "Tu Inventario",
    description:
      "Los ítems que ganes se guardan aquí: vidas extra, pistas, saltar pregunta y doble XP. Úsalos estratégicamente durante las partidas.",
    dialogPosition: "bottom",
    icon: "🎒",
  },
  {
    target: "[data-tutorial='nav-records']",
    title: "Records y Leaderboard",
    description:
      "¿Quién tiene más XP? ¿Quién juega más? Compara tu desempeño con el de otros jugadores y escala el ranking global.",
    dialogPosition: "bottom",
    icon: "🏆",
  },
  {
    target: "[data-tutorial='nav-profile']",
    title: "Tu Perfil",
    description:
      "Revisa tu historial completo, estadísticas avanzadas y personaliza tu nombre de aventurero. ¡Tu leyenda queda registrada aquí!",
    dialogPosition: "bottom",
    icon: "👤",
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface ElementRect {
  top: number
  left: number
  width: number
  height: number
}

const SPOTLIGHT_PAD = 10
const DIALOG_W = 330
const DIALOG_H_APPROX = 270

function getViewport() {
  return {
    vw: window.innerWidth,
    vh: window.innerHeight,
  }
}

// ─── Main component ───────────────────────────────────────────────────────────

export interface TutorialOverlayProps {
  /** Show the tutorial (derived from profile state) */
  show: boolean
  /** Used for the API call – the user's UUID */
  userId: string
}

export function TutorialOverlay({ show, userId }: TutorialOverlayProps) {
  const [mounted, setMounted] = useState(false)
  const [active, setActive] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [rect, setRect] = useState<ElementRect | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const scrollingRef = useRef(false)

  // Mount guard (for portals)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Activate after a short delay so the page has rendered
  useEffect(() => {
    if (!show || !mounted) return
    const t = setTimeout(() => setActive(true), 700)
    return () => clearTimeout(t)
  }, [show, mounted])

  // Measure the target element (viewport-relative)
  const measure = useCallback((index: number) => {
    const step = STEPS[index]
    if (!step) return
    const el = document.querySelector(step.target)
    if (!el) {
      setRect(null)
      return
    }
    const r = el.getBoundingClientRect()
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height })
  }, [])

  // Scroll target into view, then measure
  const focusStep = useCallback(
    (index: number) => {
      const step = STEPS[index]
      if (!step) return
      const el = document.querySelector(step.target)
      if (!el) {
        measure(index)
        return
      }
      scrollingRef.current = true
      el.scrollIntoView({ behavior: "smooth", block: "center" })
      setTimeout(() => {
        measure(index)
        scrollingRef.current = false
      }, 500)
    },
    [measure]
  )

  // Focus current step whenever it changes
  useEffect(() => {
    if (!active) return
    focusStep(stepIndex)
  }, [active, stepIndex, focusStep])

  // Re-measure on resize
  useEffect(() => {
    if (!active) return
    const onResize = () => {
      if (!scrollingRef.current) measure(stepIndex)
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [active, stepIndex, measure])

  // ─── Persist state via API ────────────────────────────────────────────────
  const persistTutorial = useCallback(
    async (action: "complete" | "skip") => {
      try {
        await fetch("/api/tutorial", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        })
      } catch {
        // non-blocking
      }
    },
    []
  )

  // ─── Navigation handlers ──────────────────────────────────────────────────
  const handleNext = useCallback(async () => {
    if (isTransitioning) return
    if (stepIndex < STEPS.length - 1) {
      setIsTransitioning(true)
      setTimeout(() => {
        setStepIndex((s) => s + 1)
        setIsTransitioning(false)
      }, 150)
    } else {
      setActive(false)
      await persistTutorial("complete")
    }
  }, [isTransitioning, stepIndex, persistTutorial])

  const handleBack = useCallback(() => {
    if (isTransitioning || stepIndex === 0) return
    setIsTransitioning(true)
    setTimeout(() => {
      setStepIndex((s) => s - 1)
      setIsTransitioning(false)
    }, 150)
  }, [isTransitioning, stepIndex])

  const handleSkip = useCallback(async () => {
    setActive(false)
    await persistTutorial("skip")
  }, [persistTutorial])

  // ─── Dialog position (fixed) ──────────────────────────────────────────────
  const getDialogStyle = useCallback((): React.CSSProperties => {
    const { vw, vh } = getViewport()

    if (!rect) {
      return {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        width: Math.min(DIALOG_W, vw - 32),
      }
    }

    const pos = STEPS[stepIndex]?.dialogPosition ?? "bottom"
    const dw = Math.min(DIALOG_W, vw - 32)
    let top: number
    let left: number

    const sp = SPOTLIGHT_PAD

    switch (pos) {
      case "top":
        top = rect.top - DIALOG_H_APPROX - sp - 8
        left = rect.left + rect.width / 2 - dw / 2
        break
      case "left":
        top = rect.top + rect.height / 2 - DIALOG_H_APPROX / 2
        left = rect.left - dw - sp - 8
        // fallback to right if no space
        if (left < 12) left = rect.left + rect.width + sp + 8
        break
      case "right":
        top = rect.top + rect.height / 2 - DIALOG_H_APPROX / 2
        left = rect.left + rect.width + sp + 8
        break
      case "center":
        top = vh / 2 - DIALOG_H_APPROX / 2
        left = vw / 2 - dw / 2
        break
      default: // bottom
        top = rect.top + rect.height + sp + 8
        left = rect.left + rect.width / 2 - dw / 2
    }

    // Clamp to viewport
    left = Math.max(12, Math.min(left, vw - dw - 12))
    top = Math.max(12, Math.min(top, vh - DIALOG_H_APPROX - 12))

    return { position: "fixed", top, left, width: dw }
  }, [rect, stepIndex])

  // ─── Render ───────────────────────────────────────────────────────────────
  if (!mounted || !show) return null

  const currentStep = STEPS[stepIndex]
  const t = rect?.top ?? 0
  const l = rect?.left ?? 0
  const w = rect?.width ?? 0
  const h = rect?.height ?? 0
  const sp = SPOTLIGHT_PAD

  const panelStyle = (
    style: React.CSSProperties
  ): React.CSSProperties => ({
    position: "fixed",
    background: "rgba(5,5,15,0.80)",
    backdropFilter: "blur(1px)",
    ...style,
  })

  const progressPct = ((stepIndex + 1) / STEPS.length) * 100

  return createPortal(
    <AnimatePresence>
      {active && (
        <>
          {/* ── Dark overlay: 4 panels around the spotlight ── */}
          <motion.div
            key="tutorial-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            aria-hidden="true"
          >
            {rect ? (
              <>
                {/* Top */}
                <div
                  style={panelStyle({
                    top: 0,
                    left: 0,
                    right: 0,
                    height: Math.max(0, t - sp),
                    zIndex: 9980,
                  })}
                />
                {/* Bottom */}
                <div
                  style={panelStyle({
                    top: t + h + sp,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 9980,
                  })}
                />
                {/* Left */}
                <div
                  style={panelStyle({
                    top: t - sp,
                    left: 0,
                    width: Math.max(0, l - sp),
                    height: h + sp * 2,
                    zIndex: 9980,
                  })}
                />
                {/* Right */}
                <div
                  style={panelStyle({
                    top: t - sp,
                    left: l + w + sp,
                    right: 0,
                    height: h + sp * 2,
                    zIndex: 9980,
                  })}
                />
              </>
            ) : (
              <div style={{ ...panelStyle({ inset: 0 }), zIndex: 9980 }} />
            )}
          </motion.div>

          {/* ── Interaction blocker (prevents clicking behind overlay) ── */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9981,
              cursor: "default",
            }}
            onClick={(e) => e.stopPropagation()}
          />

          {/* ── Spotlight highlight ring ── */}
          {rect && (
            <motion.div
              key={`ring-${stepIndex}`}
              aria-hidden="true"
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              style={{
                position: "fixed",
                top: t - sp,
                left: l - sp,
                width: w + sp * 2,
                height: h + sp * 2,
                borderRadius: 14,
                border: "2px solid oklch(0.72 0.20 145)",
                boxShadow: [
                  "0 0 0 3px oklch(0.72 0.20 145 / 0.20)",
                  "0 0 28px 4px oklch(0.72 0.20 145 / 0.30)",
                ].join(", "),
                pointerEvents: "none",
                zIndex: 9982,
              }}
            />
          )}

          {/* ── Dialog card ── */}
          <motion.div
            key={`dialog-${stepIndex}`}
            role="dialog"
            aria-modal="true"
            aria-label={`Tutorial paso ${stepIndex + 1} de ${STEPS.length}`}
            style={{ ...getDialogStyle(), zIndex: 9983 }}
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="overflow-hidden rounded-2xl shadow-2xl"
          >
            {/* Accent top bar */}
            <div
              style={{
                height: 3,
                background:
                  "linear-gradient(90deg, oklch(0.72 0.20 145 / 0.5), oklch(0.72 0.20 145), oklch(0.72 0.20 145 / 0.5))",
              }}
            />

            <div
              style={{
                background: "oklch(0.17 0.02 280)",
                border: "1px solid oklch(0.28 0.03 280)",
                borderTop: "none",
                borderRadius: "0 0 16px 16px",
                padding: "18px 20px 20px",
              }}
            >
              {/* Header row */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xl leading-none"
                    aria-hidden="true"
                  >
                    {currentStep.icon}
                  </span>
                  <h3
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "oklch(0.93 0.01 90)",
                      lineHeight: 1.3,
                    }}
                  >
                    {currentStep.title}
                  </h3>
                </div>
                <button
                  onClick={handleSkip}
                  aria-label="Cerrar tutorial"
                  style={{
                    flexShrink: 0,
                    marginTop: -2,
                    padding: "4px",
                    borderRadius: 6,
                    color: "oklch(0.65 0.02 280)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    transition: "color 0.15s, background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.color =
                      "oklch(0.93 0.01 90)"
                    ;(
                      e.currentTarget as HTMLButtonElement
                    ).style.background = "oklch(0.25 0.03 280)"
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.color =
                      "oklch(0.65 0.02 280)"
                    ;(
                      e.currentTarget as HTMLButtonElement
                    ).style.background = "transparent"
                  }}
                >
                  <X style={{ width: 14, height: 14 }} />
                </button>
              </div>

              {/* Description */}
              <p
                style={{
                  fontSize: 12.5,
                  color: "oklch(0.65 0.02 280)",
                  lineHeight: 1.6,
                  marginBottom: 16,
                }}
              >
                {currentStep.description}
              </p>

              {/* Progress bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 99,
                    background: "oklch(0.25 0.03 280)",
                    overflow: "hidden",
                  }}
                >
                  <motion.div
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    style={{
                      height: "100%",
                      background:
                        "linear-gradient(90deg, oklch(0.60 0.20 145), oklch(0.78 0.20 145))",
                      borderRadius: 99,
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 10,
                    fontFamily: "monospace",
                    color: "oklch(0.65 0.02 280)",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {stepIndex + 1} / {STEPS.length}
                </span>
              </div>

              {/* Dot indicators */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  marginBottom: 18,
                }}
              >
                {STEPS.map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      width: i === stepIndex ? 16 : 5,
                      backgroundColor:
                        i === stepIndex
                          ? "oklch(0.72 0.20 145)"
                          : i < stepIndex
                          ? "oklch(0.72 0.20 145 / 0.35)"
                          : "oklch(0.22 0.02 280)",
                    }}
                    transition={{ duration: 0.22 }}
                    style={{ height: 5, borderRadius: 99 }}
                  />
                ))}
              </div>

              {/* Action row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                {/* Skip text button */}
                <button
                  onClick={handleSkip}
                  style={{
                    fontSize: 11,
                    color: "oklch(0.55 0.02 280)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px 2px",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.color =
                      "oklch(0.75 0.01 90)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.color =
                      "oklch(0.55 0.02 280)")
                  }
                >
                  Saltar tutorial
                </button>

                {/* Prev / Next buttons */}
                <div style={{ display: "flex", gap: 6 }}>
                  {stepIndex > 0 && (
                    <motion.button
                      onClick={handleBack}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "6px 12px",
                        borderRadius: 8,
                        fontSize: 11,
                        fontWeight: 600,
                        background: "oklch(0.25 0.03 280)",
                        color: "oklch(0.90 0.01 90)",
                        border: "1px solid oklch(0.30 0.03 280)",
                        cursor: "pointer",
                      }}
                    >
                      <ChevronLeft style={{ width: 12, height: 12 }} />
                      Atrás
                    </motion.button>
                  )}

                  <motion.button
                    onClick={handleNext}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "6px 14px",
                      borderRadius: 8,
                      fontSize: 11,
                      fontWeight: 700,
                      background: "oklch(0.72 0.20 145)",
                      color: "oklch(0.13 0.02 280)",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {stepIndex === STEPS.length - 1 ? (
                      <>
                        <Sparkles style={{ width: 12, height: 12 }} />
                        ¡Empezar!
                      </>
                    ) : (
                      <>
                        Siguiente
                        <ChevronRight style={{ width: 12, height: 12 }} />
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── "QuestMind Tour" floating label ── */}
          <motion.div
            key="tour-label"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            style={{
              position: "fixed",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9984,
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: 99,
              background: "oklch(0.17 0.02 280)",
              border: "1px solid oklch(0.30 0.03 280)",
              fontSize: 11,
              color: "oklch(0.65 0.02 280)",
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            <BookOpen style={{ width: 12, height: 12 }} />
            Tour de QuestMind
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}