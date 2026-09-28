import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

const variantClass: Record<ButtonVariant, string> = {
  primary: 'primary-button',
  secondary: 'secondary-button',
  danger: 'danger-button',
  ghost: 'text-button',
}

function Button({ variant = 'primary', className = '', ...rest }: ButtonProps) {
  return (
    <button
      className={`${variantClass[variant]} ${className}`.trim()}
      {...rest}
    />
  )
}

export default Button
