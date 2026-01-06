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

  play(name: string, volume: number = 0.5) {
    const buffer = this.sounds.get(name)
    if (!buffer || !this.audioContext) {
      console.warn(`Sound not loaded: ${name}`)
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

// Preload sounds
export const preloadAudioFiles = async () => {
  try {
    await audioManager.preload('focus-complete', '/audio/focus-complete.mp3')
    await audioManager.preload('break-complete', '/audio/break-complete.mp3')
  } catch (error) {
    console.error('Failed to preload audio files', error)
  }
}
