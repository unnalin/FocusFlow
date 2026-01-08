class AudioManager {
  private audioContext: AudioContext | null = null
  private sounds: Map<string, AudioBuffer> = new Map()
  private breakBgmList: string[] = []
  private currentBgmSource: AudioBufferSourceNode | null = null
  private currentBgmGain: GainNode | null = null
  private bgmInitialVolume: number = 0.3
  private fadeOutStarted: boolean = false

  async init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }

  async preload(name: string, url: string) {
    await this.init()

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`)
    }
    const arrayBuffer = await response.arrayBuffer()
    const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer)
    this.sounds.set(name, audioBuffer)
  }

  // Load all BGM files from the break-bgm directory
  async loadBreakBgm() {
    await this.init()

    // Try to load BGM files numbered 1-20 (you can add more if needed)
    const bgmPromises = []
    for (let i = 1; i <= 20; i++) {
      const name = `break-bgm-${i}`
      const url = `/sounds/break-bgm/break-bgm-${i}.mp3`

      bgmPromises.push(
        this.preload(name, url)
          .then(() => {
            this.breakBgmList.push(name)
          })
          .catch(() => {
            // Silently ignore if file doesn't exist
          })
      )
    }

    await Promise.all(bgmPromises)
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

    // If sound not loaded, generate it (fallback for notification sounds)
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

  // Start playing break BGM (looping, random selection)
  playBreakBgm(volume: number = 0.3) {
    // Stop any currently playing BGM
    this.stopBreakBgm()

    if (this.breakBgmList.length === 0) {
      console.info('No break BGM tracks loaded')
      return
    }

    if (!this.audioContext) {
      this.init()
    }

    // Select a random BGM track
    const randomIndex = Math.floor(Math.random() * this.breakBgmList.length)
    const bgmName = this.breakBgmList[randomIndex]
    const buffer = this.sounds.get(bgmName)

    if (!buffer || !this.audioContext) {
      console.warn(`BGM not available: ${bgmName}`)
      return
    }

    // Create audio source and gain node
    const source = this.audioContext.createBufferSource()
    const gainNode = this.audioContext.createGain()

    source.buffer = buffer
    source.loop = true // Loop the BGM
    gainNode.gain.value = volume

    source.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    // Store references so we can stop it later
    this.currentBgmSource = source
    this.currentBgmGain = gainNode
    this.bgmInitialVolume = volume
    this.fadeOutStarted = false

    source.start(0)
  }

  // Update BGM volume based on remaining time (for auto fade-out)
  updateBgmWithTimeLeft(timeLeftMs: number) {
    if (!this.currentBgmGain || !this.audioContext) {
      return
    }

    if (this.fadeOutStarted) {
      return
    }

    const fadeOutDuration = 5000 // 5 seconds fade out

    // Start fading out when less than 5 seconds remain
    if (timeLeftMs <= fadeOutDuration) {
      this.fadeOutStarted = true
      const currentTime = this.audioContext.currentTime
      const fadeDuration = timeLeftMs / 1000 // Convert to seconds

      // Smooth fade out from current volume to 0
      this.currentBgmGain.gain.setValueAtTime(this.bgmInitialVolume, currentTime)
      this.currentBgmGain.gain.linearRampToValueAtTime(0, currentTime + fadeDuration)
    }
  }

  // Stop playing break BGM with fade out
  stopBreakBgm(fadeOutDuration: number = 1.0) {
    if (!this.currentBgmSource || !this.currentBgmGain || !this.audioContext) {
      return
    }

    const gainNode = this.currentBgmGain
    const source = this.currentBgmSource
    const currentTime = this.audioContext.currentTime

    // Only fade out if not already fading
    if (!this.fadeOutStarted) {
      gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime)
      gainNode.gain.linearRampToValueAtTime(0, currentTime + fadeOutDuration)
    }

    // Stop after fade out
    setTimeout(() => {
      try {
        source.stop()
      } catch (error) {
        // Already stopped, ignore
      }
    }, fadeOutDuration * 1000)

    // Clear references
    this.currentBgmSource = null
    this.currentBgmGain = null
    this.fadeOutStarted = false
  }

  // Check if BGM is currently playing
  isPlayingBgm(): boolean {
    return this.currentBgmSource !== null
  }
}

export const audioManager = new AudioManager()

// Preload sounds (notification sounds + break BGM)
export const preloadAudioFiles = async () => {
  try {
    // Preload notification sounds
    await audioManager.preload('focus-complete', '/sounds/focus-complete.mp3').catch(() => {
      // Using generated sound for focus-complete
    })
    await audioManager.preload('break-complete', '/sounds/break-complete.mp3').catch(() => {
      // Using generated sound for break-complete
    })

    // Load all break BGM tracks
    await audioManager.loadBreakBgm()
  } catch (error) {
    // Using generated sounds for notifications
  }
}
