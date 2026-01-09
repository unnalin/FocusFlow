import { useEffect, useRef } from 'react'
import { useUIStore } from '@/store/uiStore'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  depth: number // 0-1, 0 is far, 1 is near
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const { theme, colorScheme } = useUIStore()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize particles with depth layers
    const particleCount = 60
    particlesRef.current = Array.from({ length: particleCount }, () => {
      const depth = Math.random() // 0 (far) to 1 (near)

      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        // Speed based on depth: far particles move slower
        vx: (Math.random() - 0.5) * (0.2 + depth * 0.4),
        vy: (Math.random() - 0.5) * (0.2 + depth * 0.4),
        // Size based on depth: far particles are smaller
        radius: 0.5 + depth * 2.5,
        // Opacity based on depth: far particles are more transparent
        opacity: 0.2 + depth * 0.4,
        depth,
      }
    })

    // Get particle color based on theme and color scheme
    const getParticleColor = () => {
      if (colorScheme === 'forest') {
        // Green particles
        return theme === 'dark'
          ? 'rgba(74, 222, 128, ' // green-400
          : 'rgba(34, 197, 94, '   // green-500
      } else {
        // Blue particles (default)
        return theme === 'dark'
          ? 'rgba(56, 189, 248, ' // sky-400
          : 'rgba(14, 165, 233, ' // sky-500
      }
    }

    // Animation loop
    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const particleColor = getParticleColor()

      // Sort particles by depth (far to near) for proper layering
      const sortedParticles = [...particlesRef.current].sort((a, b) => a.depth - b.depth)

      sortedParticles.forEach((particle) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particleColor + particle.opacity + ')'
        ctx.fill()

        // Add subtle glow for near particles
        if (particle.depth > 0.7) {
          ctx.shadowBlur = 4
          ctx.shadowColor = particleColor + (particle.opacity * 0.5) + ')'
        } else {
          ctx.shadowBlur = 0
        }
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [theme, colorScheme])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  )
}
