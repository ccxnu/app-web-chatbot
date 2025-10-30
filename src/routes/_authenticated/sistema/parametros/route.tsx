import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addParameter,
  getAllParameters,
  updateParameter,
  deleteParameter,
  reloadParameterCache,
  parametersKeys
} from '@/api/services/system/parameters.api'
import type { Parameter, AddParameterParams, UpdateParameterParams } from '@/api/frontend-types/parameter.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { PlusIcon, Pencil1Icon, TrashIcon, ReloadIcon, MagnifyingGlassIcon, Cross2Icon } from '@radix-ui/react-icons'

type KeyValuePair = {
  key: string;
  value: string;
  isOriginal?: boolean // true = fila original (clave bloqueada), false/undefined = nueva fila (clave editable)
}

export const Route = createFileRoute('/_authenticated/sistema/parametros')({
  component: RouteComponent,
})

type StatusFilter = "all" | "active" | "inactive";

function RouteComponent() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [nameFilter, setNameFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedParameter, setSelectedParameter] = useState<Parameter | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
  })
  const [keyValuePairs, setKeyValuePairs] = useState<KeyValuePair[]>([
    { key: '', value: '', isOriginal: false }
  ])

  // Fetch all parameters
  const { data: parameters, isLoading, error } = useQuery({
    queryKey: parametersKeys.all,
    queryFn: async () => {
      const response = await getAllParameters({})
      return response as Parameter[]
    },
  })

  // Add parameter mutation
  const addMutation = useMutation({
    mutationFn: (data: AddParameterParams) => addParameter(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: parametersKeys.all })
      toast.success('Parameter added successfully')
      setIsAddDialogOpen(false)
      resetForm()
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add parameter')
    },
  })

  // Update parameter mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateParameterParams) => updateParameter(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: parametersKeys.all })
      toast.success('Parameter updated successfully')
      setIsEditDialogOpen(false)
      resetForm()
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update parameter')
    },
  })

  // Delete parameter mutation
  const deleteMutation = useMutation({
    mutationFn: (code: string) => deleteParameter({ code }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: parametersKeys.all })
      toast.success('Parameter deleted successfully')
      setIsDeleteDialogOpen(false)
      setSelectedParameter(null)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete parameter')
    },
  })

  // Reload cache mutation
  const reloadCacheMutation = useMutation({
    mutationFn: () => reloadParameterCache({}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: parametersKeys.all })
      toast.success('Cache reloaded successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reload cache')
    },
  })

  // Convertir de JSON a key-value pairs
  const jsonToKeyValuePairs = (data: any): KeyValuePair[] => {
    if (typeof data === 'string') {
      return [{ key: 'value', value: data, isOriginal: true }]
    }
    if (typeof data === 'object' && data !== null) {
      return Object.entries(data).map(([key, value]) => ({
        key,
        value: typeof value === 'string' ? value : JSON.stringify(value),
        isOriginal: true // Marcar como fila original
      }))
    }
    return [{ key: '', value: '', isOriginal: false }]
  }

  // Convertir de key-value pairs a JSON
  const keyValuePairsToJson = (pairs: KeyValuePair[]): any => {
    // Filtrar pares vacíos
    const validPairs = pairs.filter(p => p.key.trim() !== '')

    if (validPairs.length === 0) {
      return {}
    }

    // Si solo hay un par con key "value", retornar el valor directamente
    if (validPairs.length === 1 && validPairs[0].key === 'value') {
      return validPairs[0].value
    }

    // Crear objeto desde los pares
    const result: any = {}
    validPairs.forEach(pair => {
      // Intentar parsear el valor como JSON si es posible
      try {
        result[pair.key] = JSON.parse(pair.value)
      } catch {
        result[pair.key] = pair.value
      }
    })
    return result
  }

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
    })
    setKeyValuePairs([{ key: '', value: '', isOriginal: false }])
    setSelectedParameter(null)
  }

  const handleAdd = () => {
    setIsAddDialogOpen(true)
    resetForm()
  }

  const handleEdit = (parameter: Parameter) => {
    setSelectedParameter(parameter)
    setFormData({
      name: parameter.name,
      code: parameter.code,
      description: parameter.description || '',
    })
    setKeyValuePairs(jsonToKeyValuePairs(parameter.data))
    setIsEditDialogOpen(true)
  }

  const handleDelete = (parameter: Parameter) => {
    setSelectedParameter(parameter)
    setIsDeleteDialogOpen(true)
  }

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault()

    const parsedData = keyValuePairsToJson(keyValuePairs)

    addMutation.mutate({
      name: formData.name,
      code: formData.code,
      data: parsedData,
      description: formData.description || undefined,
    })
  }

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault()

    const parsedData = keyValuePairsToJson(keyValuePairs)

    updateMutation.mutate({
      code: formData.code,
      name: formData.name,
      data: parsedData,
      description: formData.description || undefined,
    })
  }

  // Funciones para manejar key-value pairs
  const addKeyValuePair = () => {
    setKeyValuePairs([...keyValuePairs, { key: '', value: '', isOriginal: false }])
  }

  const removeKeyValuePair = (index: number) => {
    setKeyValuePairs(keyValuePairs.filter((_, i) => i !== index))
  }

  const updateKeyValuePair = (index: number, field: 'key' | 'value', value: string) => {
    const newPairs = [...keyValuePairs]
    newPairs[index][field] = value
    setKeyValuePairs(newPairs)
  }

  const handleConfirmDelete = () => {
    if (selectedParameter) {
      deleteMutation.mutate(selectedParameter.code)
    }
  }

  // Obtener nombres únicos de parámetros
  const uniqueNames = useMemo(() => {
    if (!parameters) return [];
    const names = Array.from(new Set(parameters.map(p => p.name)));
    return names.sort();
  }, [parameters]);

  // Contar parámetros por estado
  const statusCounts = useMemo(() => {
    if (!parameters) return { all: 0, active: 0, inactive: 0 };

    return {
      all: parameters.length,
      active: parameters.filter(p => p.active).length,
      inactive: parameters.filter(p => !p.active).length,
    };
  }, [parameters]);

  // Filtrar parámetros por estado, nombre y búsqueda
  const filteredParameters = useMemo(() => {
    let filtered = parameters || [];

    // Filtrar por estado (active/inactive)
    if (statusFilter === "active") {
      filtered = filtered.filter(p => p.active);
    } else if (statusFilter === "inactive") {
      filtered = filtered.filter(p => !p.active);
    }

    // Filtrar por nombre seleccionado
    if (nameFilter !== "all") {
      filtered = filtered.filter(p => p.name === nameFilter);
    }

    // Filtrar por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(
        (param) =>
          param.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          param.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          param.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [parameters, statusFilter, nameFilter, searchQuery])

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Parámetros</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona los parámetros de configuración del sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => reloadCacheMutation.mutate()}
            disabled={reloadCacheMutation.isPending}
          >
            <ReloadIcon className={reloadCacheMutation.isPending ? 'animate-spin' : ''} />
            Recargar Caché
          </Button>
          <Button onClick={handleAdd}>
            <PlusIcon />
            Agregar Parámetro
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar parámetros..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Dropdown para filtrar por nombre/grupo */}
        <div className="w-64">
          <Select value={nameFilter} onValueChange={setNameFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Grupo o Nombre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los grupos</SelectItem>
              {uniqueNames.map(name => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filtros por estado con Tabs */}
      <div className="w-full overflow-x-auto overflow-y-hidden pb-2">
        <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
          <TabsList className="inline-flex w-auto min-w-min">
            <TabsTrigger value="all">
              Todos ({statusCounts.all})
            </TabsTrigger>
            <TabsTrigger value="active">
              Activos ({statusCounts.active})
            </TabsTrigger>
            <TabsTrigger value="inactive">
              Inactivos ({statusCounts.inactive})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Cargando parámetros...</div>
      ) : error ? (
        <div className="text-center py-8 text-destructive">
          Error al cargar parámetros: {error.message}
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Vista Previa</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParameters?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No se encontraron parámetros
                  </TableCell>
                </TableRow>
              ) : (
                filteredParameters?.map((parameter) => (
                  <TableRow key={parameter.id}>
                    <TableCell className="font-medium">{parameter.name}</TableCell>
                    <TableCell>
                      <code className="bg-muted px-2 py-1 rounded text-xs">
                        {parameter.code}
                      </code>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {parameter.description || '-'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      <code className="bg-muted px-2 py-1 rounded text-xs">
                        {typeof parameter.data === 'string'
                          ? parameter.data
                          : JSON.stringify(parameter.data).slice(0, 50)}
                      </code>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          parameter.active
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {parameter.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(parameter)}
                        >
                          <Pencil1Icon />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(parameter)}
                        >
                          <TrashIcon className="text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Parameter Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Parámetro</DialogTitle>
            <DialogDescription>
              Crea un nuevo parámetro de configuración del sistema
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitAdd} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add-name">Nombre *</Label>
              <Input
                id="add-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ingresa el nombre del parámetro"
                minLength={3}
                maxLength={100}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-code">Código *</Label>
              <Input
                id="add-code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Ingresa un código único"
                minLength={2}
                maxLength={100}
                required
              />
            </div>

            {/* Tabla Key-Value */}
            <div className="space-y-2">
              <Label>Datos del Parámetro *</Label>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="grid grid-cols-12 gap-2 font-semibold text-sm text-muted-foreground">
                      <div className="col-span-5">Clave</div>
                      <div className="col-span-6">Valor</div>
                      <div className="col-span-1"></div>
                    </div>
                    {keyValuePairs.map((pair, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-center">
                        <Input
                          className="col-span-5"
                          placeholder="clave"
                          value={pair.key}
                          onChange={(e) => updateKeyValuePair(index, 'key', e.target.value)}
                          required
                        />
                        <Input
                          className="col-span-6"
                          placeholder="valor"
                          value={pair.value}
                          onChange={(e) => updateKeyValuePair(index, 'value', e.target.value)}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="col-span-1"
                          onClick={() => removeKeyValuePair(index)}
                          disabled={keyValuePairs.length === 1}
                        >
                          <Cross2Icon />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addKeyValuePair}
                      className="w-full"
                    >
                      <PlusIcon className="mr-2" />
                      Agregar Fila
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-description">Descripción</Label>
              <Textarea
                id="add-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ingresa una descripción (opcional)"
                maxLength={500}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={addMutation.isPending}>
                {addMutation.isPending ? 'Agregando...' : 'Agregar Parámetro'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Parameter Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Parámetro</DialogTitle>
            <DialogDescription>
              Actualiza la configuración del parámetro
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nombre (Grupo)</Label>
              <Input
                id="edit-name"
                value={formData.name}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">El nombre/grupo no se puede cambiar</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-code">Código</Label>
              <Input
                id="edit-code"
                value={formData.code}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">El código no se puede cambiar</p>
            </div>

            {/* Tabla Key-Value con claves bloqueadas para originales */}
            <div className="space-y-2">
              <Label>Datos del Parámetro *</Label>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="grid grid-cols-12 gap-2 font-semibold text-sm text-muted-foreground">
                      <div className="col-span-5">Clave</div>
                      <div className="col-span-6">Valor</div>
                      <div className="col-span-1"></div>
                    </div>
                    {keyValuePairs.map((pair, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-center">
                        <Input
                          className={`col-span-5 ${pair.isOriginal ? 'bg-muted' : ''}`}
                          placeholder="clave"
                          value={pair.key}
                          onChange={(e) => updateKeyValuePair(index, 'key', e.target.value)}
                          disabled={pair.isOriginal}
                          required
                        />
                        <Input
                          className="col-span-6"
                          placeholder="valor"
                          value={pair.value}
                          onChange={(e) => updateKeyValuePair(index, 'value', e.target.value)}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="col-span-1"
                          onClick={() => removeKeyValuePair(index)}
                          disabled={keyValuePairs.length === 1}
                        >
                          <Cross2Icon />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addKeyValuePair}
                      className="w-full"
                    >
                      <PlusIcon className="mr-2" />
                      Agregar Fila
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <p className="text-xs text-muted-foreground">
                Las claves existentes están bloqueadas. Las nuevas filas permiten editar ambas columnas.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Descripción</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ingresa una descripción (opcional)"
                maxLength={500}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Actualizando...' : 'Actualizar Parámetro'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Parámetro</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este parámetro? Esto lo marcará como inactivo.
            </DialogDescription>
          </DialogHeader>
          {selectedParameter && (
            <div className="space-y-2 py-4">
              <div>
                <span className="font-medium">Nombre:</span> {selectedParameter.name}
              </div>
              <div>
                <span className="font-medium">Código:</span>{' '}
                <code className="bg-muted px-2 py-1 rounded text-xs">
                  {selectedParameter.code}
                </code>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar Parámetro'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
