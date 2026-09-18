import { useCallback, useEffect, useRef, useState } from 'react'

export function useStepPlayer<T>(steps: T[], defaultDelay = 300) {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    setStep(0)
    setPlaying(false)
  }, [steps])

  const stepForward = useCallback(() => {
    setStep((s) => Math.min(s + 1, Math.max(0, steps.length - 1)))
  }, [steps.length])

  const stepBack = useCallback(() => {
    setStep((s) => Math.max(0, s - 1))
  }, [])

  const jumpStart = useCallback(() => setStep(0), [])
  const jumpEnd = useCallback(
    () => setStep(Math.max(0, steps.length - 1)),
    [steps.length],
  )

  useEffect(() => {
    if (!playing) {
      if (timerRef.current) window.clearTimeout(timerRef.current)
      return
    }
    if (step >= steps.length - 1) {
      setPlaying(false)
      return
    }
    timerRef.current = window.setTimeout(() => {
      setStep((s) => s + 1)
    }, defaultDelay * speed)
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [playing, step, steps.length, speed, defaultDelay])

  return {
    step,
    playing,
    speed,
    setSpeed,
    togglePlay: () => setPlaying((p) => !p),
    stepForward,
    stepBack,
    jumpStart,
    jumpEnd,
    current: steps[step],
    total: steps.length,
  }
}
