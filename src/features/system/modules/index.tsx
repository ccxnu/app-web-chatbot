import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/modules-columns'
import { ModulesTable } from './components/modules-table'
import { ModulesDialogs } from './components/modules-dialogs'
import { ModulesPrimaryButtons } from './components/modules-primary-buttons'
import ModulesProvider from './context/modules-context'
import { useModules } from './queries'

export default function Modules() {
  // Usa React Query
  // const { data = [], isLoading } = useModules()

  return (
    <ModulesProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Módulos</h2>
            <p className='text-muted-foreground'>
              Administra los módulos del sistema.
            </p>
          </div>
          <ModulesPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <ModulesTable data={[]} columns={columns} loading={true} />
        </div>
      </Main>

      <ModulesDialogs />
    </ModulesProvider>
  )
}
