'use client'

import { useState } from 'react'
import { IconAlertTriangle } from '@tabler/icons-react'
import { showSubmittedData } from '@/utils/show-submitted-data'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import type { ModuleModel } from '../data/schema'
import { useDeleteModule } from '../queries'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: ModuleModel
}

export function ModuleDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const [value, setValue] = useState('');
  const deleteMutation = useDeleteModule();

  const handleDelete = () => {
    if (value.trim() !== currentRow.name) return;
    // Llama la API
    deleteMutation.mutate({ id: currentRow.id });
    onOpenChange(false);
    showSubmittedData(currentRow, 'El siguiente modulo será eliminado')
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.name}
      title={
        <span className='text-destructive'>
          <IconAlertTriangle
            className='stroke-destructive mr-1 inline-block'
            size={18}
          />{' '}
          Delete Module
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete{' '}
            <span className='font-bold'>{currentRow.name}</span>?
            <br />
            This action will permanently remove the module and cannot be undone.
          </p>

          <Label className='my-2'>
            Module name:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Enter module name to confirm deletion.'
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation cannot be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Delete'
      destructive
    />
  )
}
