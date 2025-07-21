import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react' // o cualquier otro icono
import { useModulesContext } from '../context/modules-context'

export function ModulesPrimaryButtons() {
  const { setOpen } = useModulesContext()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Agregar Módulo</span> <PlusIcon size={18} />
      </Button>
    </div>
  )
}
