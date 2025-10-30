import { Button } from '@/components/ui/button'

export default function MaintenanceError() {
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>503</h1>
        <span className='font-medium'>¡El sitio está en mantenimiento!</span>
        <p className='text-muted-foreground text-center'>
          El sitio no está disponible en este momento. <br />
          Volveremos pronto.
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline'>Saber más</Button>
        </div>
      </div>
    </div>
  )
}
