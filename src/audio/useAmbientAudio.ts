import { useEffect, useRef, useState } from 'react'
import { audioEngine } from './engine'
import type { SoundscapeId } from '../data/types'

/** Drives the ambient Web Audio engine in sync with play/pause state and a chosen soundscape. */
export function useAmbientAudio(soundscape: SoundscapeId, isPlaying: boolean, volume: number) {
  const [ready, setReady] = useState(false)
  const lastSoundscape = useRef<SoundscapeId | null>(null)

  useEffect(() => {
    if (isPlaying) {
      audioEngine.play(soundscape, volume)
      lastSoundscape.current = soundscape
      setReady(true)
    } else {
      audioEngine.stop()
    }
    return () => {
      audioEngine.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soundscape, isPlaying])

  useEffect(() => {
    audioEngine.setVolume(volume)
  }, [volume])

  return { ready }
}
