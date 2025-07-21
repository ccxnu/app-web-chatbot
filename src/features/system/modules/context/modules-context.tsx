import React, { useState } from 'react';
import useDialogState from '@/hooks/use-dialog-state'
import type { ModuleModel } from '../data/schema';

type ModulesDialogType = 'add' | 'edit' | 'delete';

interface ModulesContextType {
  open: ModulesDialogType | null;
  setOpen: (str: ModulesDialogType | null) => void;
  currentRow: ModuleModel | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<ModuleModel | null>>;
}

const ModulesContext = React.createContext<ModulesContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export default function ModulesProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<ModulesDialogType>(null);
  const [currentRow, setCurrentRow] = useState<ModuleModel | null>(null);

  return (
    <ModulesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ModulesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useModulesContext = () => {
  const modulesContext = React.useContext(ModulesContext);
  if (!modulesContext) {
    throw new Error('useModulesContext has to be used within <ModulesProvider>');
  }
  return modulesContext;
};
