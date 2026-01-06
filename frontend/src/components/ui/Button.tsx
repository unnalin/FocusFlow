import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) => {
  const baseClasses = 'rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

  const variantStyles = {
    primary: {
      style: {
        backgroundColor: 'rgb(var(--color-accent-600))',
      },
      hoverClass: 'hover:brightness-90',
      textClass: 'text-white',
    },
    secondary: {
      style: {},
      hoverClass: 'hover:bg-neutral-300 dark:hover:bg-neutral-600',
      textClass: 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50',
    },
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg',
  }

  const variantStyle = variantStyles[variant]

  return (
    <button
      className={`${baseClasses} ${variantStyle.textClass} ${variantStyle.hoverClass} ${sizeClasses[size]} ${className}`}
      style={variantStyle.style}
      {...props}
    >
      {children}
    </button>
  )
}
