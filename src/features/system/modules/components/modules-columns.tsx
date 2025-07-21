import type { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/long-text'
import type { ModuleModel } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions' // Si tienes acciones (editar/eliminar)

export const columns: ColumnDef<ModuleModel>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: cn(
        'sticky md:table-cell left-0 z-10 rounded-tl',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
      ),
    },
  },
  // ID
  {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='ID' />
      ),
      cell: ({ row }) => <div className='text-xs'>{row.getValue('id')}</div>,
      meta: { className: 'w-14' },
      enableSorting: true,
      enableHiding: false,
  },
  // Nombre del módulo
  {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Nombre' />
      ),
      cell: ({ row }) => (
        <LongText className='max-w-32'>{row.getValue('name')}</LongText>
      ),
      meta: { className: 'min-w-[120px]' },
      enableHiding: false,
  },
  // Descripción
  {
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Descripción' />
      ),
      cell: ({ row }) => (
        <LongText className='max-w-lg'>{row.getValue('description')}</LongText>
      ),
      meta: { className: 'min-w-[220px]' },
      enableHiding: false,
  },
  // Estado activo/inactivo
    {
        accessorKey: 'active',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Estado" />
        ),
        cell: ({ row }) => (
          <span className={row.getValue('active') ? "text-green-700" : "text-red-700"}>
            {row.getValue('active') ? 'Activo' : 'Inactivo'}
          </span>
        ),
        filterFn: (row, id, value) => {
          return value.includes(String(row.getValue(id)));
        },
        enableSorting: false,
        enableHiding: false,
    },
      // Acciones (editar, eliminar, etc.)
    {
        id: 'actions',
        cell: DataTableRowActions, // Personaliza tu propio componente o pon un placeholder
        enableSorting: false,
        enableHiding: false,
        meta: { className: 'w-14' },
    },
]
