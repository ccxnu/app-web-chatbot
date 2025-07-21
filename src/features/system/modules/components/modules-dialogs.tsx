import { useModulesContext } from '../context/modules-context'
import { ModuleActionDialog } from './modules-action-dialog'
import { ModuleDeleteDialog } from './modules-delete-dialog'

export function ModulesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useModulesContext()
  return (
    <>
      <ModuleActionDialog
        key="module-add"
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />
      {currentRow && (
        <>
          <ModuleActionDialog
            key={`module-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => setCurrentRow(null), 500)
            }}
            currentRow={currentRow}
          />
          <ModuleDeleteDialog
            key={`module-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => setCurrentRow(null), 500)
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
