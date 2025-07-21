'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { showSubmittedData } from '@/utils/show-submitted-data'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { ModuleModel } from '../data/schema'
import { useAddModule, useUpdateModule } from '../queries'

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
  active: z.boolean(),
});

type ModuleForm = z.input<typeof formSchema>;

interface Props {
  currentRow?: ModuleModel;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ModuleActionDialog({ currentRow, open, onOpenChange }: Props) {
  const isEdit = !!currentRow;
  const addMutation = useAddModule();
  const updateMutation = useUpdateModule();

  const form = useForm<ModuleForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          name: currentRow?.name ?? "",
          description: currentRow?.description ?? "",
          active: currentRow?.active ?? true,
        }
      : {
          name: " ",
          description: " ",
          active: true,
      }
  });

  const onSubmit = (values: ModuleForm) => {
    if (isEdit) {
      updateMutation.mutate({ ...currentRow, ...values });
    } else {
      addMutation.mutate(values);
    }
    form.reset();
    showSubmittedData(values)
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>{isEdit ? 'Edit Module' : 'Add New Module'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the module here.' : 'Create a new module here.'} Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className='-mr-4 h-[18rem] w-full overflow-y-auto py-1 pr-4'>
          <Form {...form}>
            <form
              id='module-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Example: USERS'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Example: User management module'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Si quieres permitir cambiar el estado activo desde aquí: */}
              {/*
              <FormField
                control={form.control}
                name='active'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Active</FormLabel>
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              */}
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='module-form'>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
