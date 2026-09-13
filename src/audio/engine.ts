import type { SoundscapeId } from '../data/types'

type Cleanup = () => void
type Ctx = AudioContext

const rand = (min: number, max: number) => min + Math.random() * (max - min)
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]

// ---- Noise buffer generation -------------------------------------------------

const bufferCache = new Map<string, AudioBuffer>()

function whiteNoiseBuffer(ctx: Ctx, seconds = 3) {
  const key = `white-${seconds}`
  const cached = bufferCache.get(key)
  if (cached) return cached
  const size = Math.floor(ctx.sampleRate * seconds)
  const buffer = ctx.createBuffer(1, size, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1
  bufferCache.set(key, buffer)
  return buffer
}

function pinkNoiseBuffer(ctx: Ctx, seconds = 3) {
  const key = `pink-${seconds}`
  const cached = bufferCache.get(key)
  if (cached) return cached
  const size = Math.floor(ctx.sampleRate * seconds)
  const buffer = ctx.createBuffer(1, size, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
  for (let i = 0; i < size; i++) {
    const white = Math.random() * 2 - 1
    b0 = 0.99886 * b0 + white * 0.0555179
    b1 = 0.99332 * b1 + white * 0.0750759
    b2 = 0.969 * b2 + white * 0.153852
    b3 = 0.8665 * b3 + white * 0.3104856
    b4 = 0.55 * b4 + white * 0.5329522
    b5 = -0.7616 * b5 - white * 0.016898
    const out = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362
    b6 = white * 0.115926
    data[i] = out * 0.11
  }
  bufferCache.set(key, buffer)
  return buffer
}

function brownNoiseBuffer(ctx: Ctx, seconds = 3) {
  const key = `brown-${seconds}`
  const cached = bufferCache.get(key)
  if (cached) return cached
  const size = Math.floor(ctx.sampleRate * seconds)
  const buffer = ctx.createBuffer(1, size, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  let last = 0
  for (let i = 0; i < size; i++) {
    const white = Math.random() * 2 - 1
    last = (last + 0.02 * white) / 1.02
    data[i] = last * 3.5
  }
  bufferCache.set(key, buffer)
  return buffer
}

function noiseSource(ctx: Ctx, kind: 'white' | 'pink' | 'brown') {
  const buffer =
    kind === 'white' ? whiteNoiseBuffer(ctx) : kind === 'pink' ? pinkNoiseBuffer(ctx) : brownNoiseBuffer(ctx)
  const src = ctx.createBufferSource()
  src.buffer = buffer
  src.loop = true
  return src
}

// ---- Small building blocks ----------------------------------------------------

/** A noise bed filtered + optionally slowly modulated in cutoff to feel alive. */
function noiseBed(
  ctx: Ctx,
  out: AudioNode,
  opts: {
    kind: 'white' | 'pink' | 'brown'
    filterType: BiquadFilterType
    freq: number
    q?: number
    gain: number
    lfoRate?: number
    lfoDepth?: number
  },
): Cleanup {
  const src = noiseSource(ctx, opts.kind)
  const filter = ctx.createBiquadFilter()
  filter.type = opts.filterType
  filter.frequency.value = opts.freq
  filter.Q.value = opts.q ?? 0.7
  const gain = ctx.createGain()
  gain.gain.value = opts.gain

  src.connect(filter)
  filter.connect(gain)
  gain.connect(out)
  src.start()

  let lfo: OscillatorNode | null = null
  let lfoGain: GainNode | null = null
  if (opts.lfoRate) {
    lfo = ctx.createOscillator()
    lfo.frequency.value = opts.lfoRate
    lfoGain = ctx.createGain()
    lfoGain.gain.value = opts.lfoDepth ?? opts.freq * 0.4
    lfo.connect(lfoGain)
    lfoGain.connect(filter.frequency)
    lfo.start()
  }

  return () => {
    try {
      src.stop()
      lfo?.stop()
    } catch {
      /* already stopped */
    }
    src.disconnect()
    filter.disconnect()
    gain.disconnect()
    lfo?.disconnect()
    lfoGain?.disconnect()
  }
}

/** A slow evolving pad made of a few detuned oscillators through a lowpass filter. */
function pad(
  ctx: Ctx,
  out: AudioNode,
  opts: { freqs: number[]; type?: OscillatorType; cutoff?: number; gain: number },
): Cleanup {
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = opts.cutoff ?? 1200
  const master = ctx.createGain()
  master.gain.value = 0
  filter.connect(master)
  master.connect(out)
  master.gain.linearRampToValueAtTime(opts.gain, ctx.currentTime + 3)

  const oscs = opts.freqs.map((f) => {
    const o = ctx.createOscillator()
    o.type = opts.type ?? 'sine'
    o.frequency.value = f
    const g = ctx.createGain()
    g.gain.value = 1 / opts.freqs.length
    o.connect(g)
    g.connect(filter)
    o.start()
    return o
  })

  return () => {
    oscs.forEach((o) => {
      try {
        o.stop()
      } catch {
        /* noop */
      }
      o.disconnect()
    })
    filter.disconnect()
    master.disconnect()
  }
}

/** Schedules a repeating short "pluck" style tone at randomized intervals. */
function pluckScheduler(
  ctx: Ctx,
  out: AudioNode,
  opts: {
    notes: number[]
    minInterval: number
    maxInterval: number
    type?: OscillatorType
    decay?: number
    gain: number
  },
): Cleanup {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let stopped = false

  const strike = () => {
    if (stopped) return
    const now = ctx.currentTime
    const freq = pick(opts.notes)
    const osc = ctx.createOscillator()
    osc.type = opts.type ?? 'sine'
    osc.frequency.value = freq
    const g = ctx.createGain()
    g.gain.setValueAtTime(0, now)
    g.gain.linearRampToValueAtTime(opts.gain, now + 0.03)
    g.gain.exponentialRampToValueAtTime(0.0001, now + (opts.decay ?? 2.5))
    osc.connect(g)
    g.connect(out)
    osc.start(now)
    osc.stop(now + (opts.decay ?? 2.5) + 0.1)
    osc.onended = () => {
      osc.disconnect()
      g.disconnect()
    }
    timeoutId = setTimeout(strike, rand(opts.minInterval, opts.maxInterval))
  }

  timeoutId = setTimeout(strike, rand(opts.minInterval, opts.maxInterval))

  return () => {
    stopped = true
    if (timeoutId) clearTimeout(timeoutId)
  }
}

/** Schedules short filtered noise bursts — crackles, pops, distant thunder, train clacks. */
function noiseBurstScheduler(
  ctx: Ctx,
  out: AudioNode,
  opts: {
    kind: 'white' | 'pink' | 'brown'
    minInterval: number
    maxInterval: number
    duration: number
    freq: number
    filterType?: BiquadFilterType
    gain: number
  },
): Cleanup {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let stopped = false

  const burst = () => {
    if (stopped) return
    const now = ctx.currentTime
    const src = noiseSource(ctx, opts.kind)
    const filter = ctx.createBiquadFilter()
    filter.type = opts.filterType ?? 'lowpass'
    filter.frequency.value = opts.freq
    const g = ctx.createGain()
    g.gain.setValueAtTime(0, now)
    g.gain.linearRampToValueAtTime(opts.gain, now + opts.duration * 0.2)
    g.gain.exponentialRampToValueAtTime(0.0001, now + opts.duration)
    src.connect(filter)
    filter.connect(g)
    g.connect(out)
    src.start(now)
    src.stop(now + opts.duration + 0.05)
    src.onended = () => {
      src.disconnect()
      filter.disconnect()
      g.disconnect()
    }
    timeoutId = setTimeout(burst, rand(opts.minInterval, opts.maxInterval))
  }

  timeoutId = setTimeout(burst, rand(opts.minInterval, opts.maxInterval))

  return () => {
    stopped = true
    if (timeoutId) clearTimeout(timeoutId)
  }
}

/** Two detuned oscillators panned hard left/right — a binaural beat. */
function binaural(ctx: Ctx, out: AudioNode, baseFreq: number, beatFreq: number, gain: number): Cleanup {
  const left = ctx.createOscillator()
  const right = ctx.createOscillator()
  left.type = 'sine'
  right.type = 'sine'
  left.frequency.value = baseFreq
  right.frequency.value = baseFreq + beatFreq
  const panL = ctx.createStereoPanner()
  const panR = ctx.createStereoPanner()
  panL.pan.value = -1
  panR.pan.value = 1
  const g = ctx.createGain()
  g.gain.value = 0
  g.gain.linearRampToValueAtTime(gain, ctx.currentTime + 2)
  left.connect(panL)
  right.connect(panR)
  panL.connect(g)
  panR.connect(g)
  g.connect(out)
  left.start()
  right.start()
  return () => {
    try {
      left.stop()
      right.stop()
    } catch {
      /* noop */
    }
    ;[left, right, panL, panR, g].forEach((n) => n.disconnect())
  }
}

// ---- Per-soundscape composition -----------------------------------------------

const PENTATONIC = [261.6, 293.7, 349.2, 392.0, 440.0, 523.3, 587.3, 659.3]
const LOW_PAD_CHORD = [98, 123.5, 147, 196]
const BOWL_HARMONICS = [136.1, 272.2, 408.3]

function build(id: SoundscapeId, ctx: Ctx, out: AudioNode): Cleanup {
  switch (id) {
    case 'silence':
      return () => {}

    case 'whitenoise':
      return noiseBed(ctx, out, { kind: 'white', filterType: 'lowpass', freq: 8000, gain: 0.18 })

    case 'pinknoise':
      return noiseBed(ctx, out, { kind: 'pink', filterType: 'lowpass', freq: 6000, gain: 0.5 })

    case 'brownnoise':
      return noiseBed(ctx, out, { kind: 'brown', filterType: 'lowpass', freq: 500, gain: 0.55 })

    case 'rain': {
      const cleanups = [
        noiseBed(ctx, out, {
          kind: 'white',
          filterType: 'bandpass',
          freq: 3200,
          q: 0.6,
          gain: 0.35,
          lfoRate: 0.08,
          lfoDepth: 800,
        }),
        noiseBed(ctx, out, { kind: 'brown', filterType: 'lowpass', freq: 300, gain: 0.15 }),
      ]
      return () => cleanups.forEach((c) => c())
    }

    case 'ocean':
      return noiseBed(ctx, out, {
        kind: 'brown',
        filterType: 'lowpass',
        freq: 500,
        gain: 0.5,
        lfoRate: 0.09,
        lfoDepth: 400,
      })

    case 'river':
      return noiseBed(ctx, out, {
        kind: 'white',
        filterType: 'bandpass',
        freq: 1800,
        q: 0.9,
        gain: 0.3,
        lfoRate: 0.6,
        lfoDepth: 500,
      })

    case 'wind':
      return noiseBed(ctx, out, {
        kind: 'white',
        filterType: 'bandpass',
        freq: 700,
        q: 0.5,
        gain: 0.32,
        lfoRate: 0.05,
        lfoDepth: 500,
      })

    case 'forest': {
      const cleanups = [
        noiseBed(ctx, out, { kind: 'white', filterType: 'bandpass', freq: 1000, q: 0.4, gain: 0.12, lfoRate: 0.06, lfoDepth: 300 }),
        pluckScheduler(ctx, out, {
          notes: [1800, 2200, 2600, 3100],
          minInterval: 2500,
          maxInterval: 7000,
          type: 'sine',
          decay: 0.25,
          gain: 0.06,
        }),
      ]
      return () => cleanups.forEach((c) => c())
    }

    case 'crickets': {
      const cleanups = [
        noiseBed(ctx, out, { kind: 'pink', filterType: 'lowpass', freq: 400, gain: 0.1 }),
        pluckScheduler(ctx, out, {
          notes: [4200, 4400],
          minInterval: 150,
          maxInterval: 400,
          type: 'square',
          decay: 0.08,
          gain: 0.025,
        }),
      ]
      return () => cleanups.forEach((c) => c())
    }

    case 'fire': {
      const cleanups = [
        noiseBed(ctx, out, { kind: 'brown', filterType: 'bandpass', freq: 250, q: 0.6, gain: 0.28 }),
        noiseBurstScheduler(ctx, out, {
          kind: 'white',
          minInterval: 250,
          maxInterval: 1200,
          duration: 0.12,
          freq: 3000,
          filterType: 'highpass',
          gain: 0.15,
        }),
      ]
      return () => cleanups.forEach((c) => c())
    }

    case 'thunder': {
      const cleanups = [
        noiseBed(ctx, out, { kind: 'white', filterType: 'bandpass', freq: 3000, q: 0.6, gain: 0.25, lfoRate: 0.1, lfoDepth: 700 }),
        noiseBurstScheduler(ctx, out, {
          kind: 'brown',
          minInterval: 12000,
          maxInterval: 28000,
          duration: 3.5,
          freq: 90,
          filterType: 'lowpass',
          gain: 0.6,
        }),
      ]
      return () => cleanups.forEach((c) => c())
    }

    case 'train': {
      const cleanups = [
        noiseBed(ctx, out, { kind: 'brown', filterType: 'lowpass', freq: 220, gain: 0.3 }),
        noiseBurstScheduler(ctx, out, {
          kind: 'white',
          minInterval: 480,
          maxInterval: 520,
          duration: 0.1,
          freq: 1200,
          filterType: 'lowpass',
          gain: 0.2,
        }),
      ]
      return () => cleanups.forEach((c) => c())
    }

    case 'cafe': {
      const cleanups = [
        noiseBed(ctx, out, { kind: 'pink', filterType: 'bandpass', freq: 900, q: 0.4, gain: 0.22 }),
        noiseBurstScheduler(ctx, out, {
          kind: 'white',
          minInterval: 3000,
          maxInterval: 9000,
          duration: 0.15,
          freq: 2500,
          filterType: 'bandpass',
          gain: 0.08,
        }),
      ]
      return () => cleanups.forEach((c) => c())
    }

    case 'space':
      return pad(ctx, out, { freqs: [55, 82.5, 110], type: 'sine', cutoff: 400, gain: 0.3 })

    case 'chimes': {
      const cleanups = [
        pad(ctx, out, { freqs: [220], type: 'sine', cutoff: 800, gain: 0.05 }),
        pluckScheduler(ctx, out, {
          notes: PENTATONIC,
          minInterval: 2000,
          maxInterval: 5500,
          type: 'sine',
          decay: 3,
          gain: 0.12,
        }),
      ]
      return () => cleanups.forEach((c) => c())
    }

    case 'morning': {
      const cleanups = [
        pad(ctx, out, { freqs: [261.6, 329.6, 392], type: 'triangle', cutoff: 1500, gain: 0.14 }),
        pluckScheduler(ctx, out, {
          notes: PENTATONIC.slice(3),
          minInterval: 3000,
          maxInterval: 6500,
          type: 'triangle',
          decay: 1.8,
          gain: 0.09,
        }),
      ]
      return () => cleanups.forEach((c) => c())
    }

    case 'bowl':
      return pluckScheduler(ctx, out, {
        notes: BOWL_HARMONICS,
        minInterval: 9000,
        maxInterval: 18000,
        type: 'sine',
        decay: 10,
        gain: 0.22,
      })

    case 'piano':
      return pluckScheduler(ctx, out, {
        notes: PENTATONIC,
        minInterval: 1800,
        maxInterval: 4200,
        type: 'triangle',
        decay: 2.2,
        gain: 0.13,
      })

    case 'strings':
      return pad(ctx, out, { freqs: LOW_PAD_CHORD, type: 'sawtooth', cutoff: 900, gain: 0.16 })

    case 'lofi': {
      const cleanups = [
        pad(ctx, out, { freqs: [130.8, 164.8, 196], type: 'triangle', cutoff: 1100, gain: 0.16 }),
        noiseBed(ctx, out, { kind: 'pink', filterType: 'highpass', freq: 6000, gain: 0.03 }),
      ]
      return () => cleanups.forEach((c) => c())
    }

    case 'binaural-alpha':
      return binaural(ctx, out, 200, 10, 0.18)

    case 'binaural-theta':
      return binaural(ctx, out, 180, 6, 0.18)

    case 'binaural-delta':
      return binaural(ctx, out, 150, 3, 0.18)

    default:
      return () => {}
  }
}

// ---- Public engine --------------------------------------------------------

class AmbientAudioEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private stopCurrent: Cleanup | null = null
  private targetVolume = 0.6

  private ensure() {
    if (!this.ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new Ctor()
      this.master = this.ctx.createGain()
      this.master.gain.value = 0
      this.master.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume()
    return { ctx: this.ctx, master: this.master! }
  }

  play(id: SoundscapeId, volume = this.targetVolume) {
    const { ctx, master } = this.ensure()
    this.targetVolume = volume
    this.stopCurrent?.()
    this.stopCurrent = null

    const now = ctx.currentTime
    master.gain.cancelScheduledValues(now)
    master.gain.setValueAtTime(master.gain.value, now)
    master.gain.linearRampToValueAtTime(volume, now + 1.0)

    this.stopCurrent = build(id, ctx, master)
  }

  setVolume(v: number) {
    this.targetVolume = v
    if (!this.ctx || !this.master) return
    this.master.gain.setTargetAtTime(v, this.ctx.currentTime, 0.08)
  }

  stop() {
    if (this.ctx && this.master) {
      const now = this.ctx.currentTime
      this.master.gain.cancelScheduledValues(now)
      this.master.gain.setValueAtTime(this.master.gain.value, now)
      this.master.gain.linearRampToValueAtTime(0, now + 0.6)
    }
    const prev = this.stopCurrent
    this.stopCurrent = null
    if (prev) setTimeout(prev, 650)
  }
}

export const audioEngine = new AmbientAudioEngine()
