import { Toaster as Sonner, type ToasterProps } from 'sonner'
import { useTheme } from '@/context/theme-context'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group [&_div[data-content]]:w-full'
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--success-bg': 'hsl(var(--popover))',
          '--success-text': 'hsl(var(--popover-foreground))',
          '--success-border': 'hsl(var(--border))',
          '--error-bg': 'hsl(var(--popover))',
          '--error-text': 'hsl(var(--popover-foreground))',
          '--error-border': 'hsl(var(--border))',
          '--warning-bg': 'hsl(var(--popover))',
          '--warning-text': 'hsl(var(--popover-foreground))',
          '--warning-border': 'hsl(var(--border))',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          success: '[&_[data-icon]]:text-green-500',
          error: '[&_[data-icon]]:text-yellow-500',
          info: '[&_[data-icon]]:text-blue-500',
          warning: '[&_[data-icon]]:text-yellow-500',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
