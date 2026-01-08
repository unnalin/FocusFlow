class AudioManager {
  private audioContext: AudioContext | null = null
  private sounds: Map<string, AudioBuffer> = new Map()

  async init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }

  async preload(name: string, url: string) {
    await this.init()

    try {
      const response = await fetch(url)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer)
      this.sounds.set(name, audioBuffer)
    } catch (error) {
      console.error(`Failed to load sound: ${name}`, error)
    }
  }

  // Generate a gentle completion sound using Web Audio API
  private createGentleSound(duration: number = 0.5, frequency: number = 523.25): AudioBuffer {
    if (!this.audioContext) {
      throw new Error('AudioContext not initialized')
    }

    const sampleRate = this.audioContext.sampleRate
    const numSamples = duration * sampleRate
    const buffer = this.audioContext.createBuffer(1, numSamples, sampleRate)
    const channelData = buffer.getChannelData(0)

    // Create a gentle bell-like sound with fade in/out
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate
      const fadeIn = Math.min(1, t * 10) // Fast fade in
      const fadeOut = Math.max(0, 1 - (t / duration)) // Gradual fade out
      const envelope = fadeIn * fadeOut

      // Combination of fundamental and harmonic for a pleasant sound
      const fundamental = Math.sin(2 * Math.PI * frequency * t)
      const harmonic = 0.3 * Math.sin(2 * Math.PI * frequency * 2 * t)

      channelData[i] = (fundamental + harmonic) * envelope * 0.3
    }

    return buffer
  }

  play(name: string, volume: number = 0.5) {
    if (!this.audioContext) {
      this.init()
    }

    let buffer = this.sounds.get(name)

    // If sound not loaded, generate it
    if (!buffer && this.audioContext) {
      if (name === 'focus-complete') {
        buffer = this.createGentleSound(0.8, 523.25) // C5 - higher, more celebratory
      } else if (name === 'break-complete') {
        buffer = this.createGentleSound(0.6, 392.00) // G4 - lower, more relaxing
      }

      if (buffer) {
        this.sounds.set(name, buffer)
      }
    }

    if (!buffer || !this.audioContext) {
      console.warn(`Sound not available: ${name}`)
      return
    }

    const source = this.audioContext.createBufferSource()
    const gainNode = this.audioContext.createGain()

    source.buffer = buffer
    gainNode.gain.value = volume

    source.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    source.start(0)
  }
}

export const audioManager = new AudioManager()

// Preload sounds (will fall back to generated sounds if files not found)
export const preloadAudioFiles = async () => {
  try {
    // Try to preload audio files, but don't fail if they don't exist
    await audioManager.preload('focus-complete', '/audio/focus-complete.mp3').catch(() => {
      console.info('Using generated sound for focus-complete')
    })
    await audioManager.preload('break-complete', '/audio/break-complete.mp3').catch(() => {
      console.info('Using generated sound for break-complete')
    })
  } catch (error) {
    console.info('Using generated sounds for notifications')
  }
}
