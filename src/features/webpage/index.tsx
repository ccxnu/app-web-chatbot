import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/context/auth-context'
import { Zap, BookOpen, BarChart3, MessageSquare, Github, ExternalLink, GraduationCap, Mail } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Rendimiento Instantáneo con RAG',
    description: 'Respuestas ultra-rápidas, precisas y relevantes, fundamentadas en tus documentos institucionales. El adiós a las respuestas genéricas.',
  },
  {
    icon: BookOpen,
    title: 'Base de Conocimiento Centralizada',
    description: 'Sube y gestiona la documentación de la institución. Nuestro sistema aprende y se actualiza de forma autónoma. (API /documents)',
  },
  {
    icon: BarChart3,
    title: 'Analíticas de Uso y Calidad',
    description: 'Obtén datos reales sobre las consultas más frecuentes y la calidad de las respuestas para una mejora continua del servicio. (API /chunk-statistics)',
  },
  {
    icon: MessageSquare,
    title: 'Soporte 24/7 y Multicanal',
    description: 'Disponibilidad constante para el estudiante, con integración nativa para automatización de canales como WhatsApp. (API /admin/whatsapp)',
  },
]

// --- 2. Componente de Cabecera (Header/Navbar) ---
function AppHeader({ isAuthenticated }: { isAuthenticated: boolean }) {
    return (
        <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
            <div className='container mx-auto flex h-16 items-center justify-between px-4'>
                {/* Logo o Título Principal */}
                <Link to='/' className='flex items-center space-x-2 font-bold text-xl tracking-tight'>
                    <GraduationCap className='w-6 h-6 text-primary' />
                    <span>Chatbot Istitucional</span>
                </Link>

                {/* Enlaces de Navegación */}
                <nav className='hidden md:flex items-center space-x-6 text-sm font-medium'>
                    <a href='#caracteristicas' className='hover:text-primary transition-colors'>Características</a>
                    {/* ENLACE DE TECNOLOGÍA (RAG) ELIMINADO */}
                    <a href='https://tecnologicosudamericano.edu.ec/' target='_blank' rel='noopener noreferrer' className='hover:text-primary transition-colors flex items-center'>
                        ISTS Oficial
                        <ExternalLink className='w-3 h-3 ml-1' />
                    </a>
                    <a href='https://evas.soydelsuda.com/' target='_blank' rel='noopener noreferrer' className='hover:text-primary transition-colors flex items-center'>
                        EVAS
                        <ExternalLink className='w-3 h-3 ml-1' />
                    </a>
                </nav>

                {/* Botón de Acción (CTA) + Icono de GitHub */}
                <div className='flex items-center space-x-3'>
                    {/* ICONO DE GITHUB AÑADIDO A LA CABECERA */}
                    <a
                        href='https://github.com/ccxnu'
                        target='_blank'
                        rel='noopener noreferrer'
                        aria-label='Ver el perfil de GitHub'
                        className='p-2 rounded-full text-gray-700 hover:text-primary transition-colors'
                    >
                        <Github className='w-6 h-6' />
                    </a>

                    {isAuthenticated ? (
                        // ÚNICO BOTÓN AL PANEL DE CONTROL
                        <Button asChild size='sm'>
                            <Link to='/panel-de-control'>Panel</Link>
                        </Button>
                    ) : (
                        <Button asChild size='sm'>
                            <Link to='/iniciar-sesion'>Acceder</Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    )
}

// --- 3. Componente Principal de la Landing Page ---
export default function LandingPage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className='flex min-h-screen flex-col items-center bg-background'>

      {/* Header/Navbar */}
      <AppHeader isAuthenticated={isAuthenticated} />

      <section className='flex w-full flex-col items-center justify-center py-24 md:py-32 bg-gradient-to-b from-background to-muted/50 min-h-[70vh]'>
        <div className='container mx-auto px-4 text-center'>
          <div className='mx-auto max-w-4xl'>
            <p className='text-sm font-semibold uppercase text-primary mb-4 tracking-widest'>
                IA Conversacional y RAG para Educación
            </p>

            <h1 className='mb-6 text-6xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600'>
              Automatiza tu Atención Estudiantil
            </h1>

            <p className='text-muted-foreground mb-12 text-xl sm:text-2xl max-w-3xl mx-auto'>
              Un asistente virtual basado en <strong>RAG</strong> y <strong>LLM</strong> que utiliza tu documentación oficial para ofrecer respuestas verificables, mejorando la eficiencia y la calidad en tu institución.
            </p>
          </div>
        </div>
      </section>

      <Separator className='w-full' />

      <section id='caracteristicas' className='w-full py-20 bg-white dark:bg-gray-900'>
        <div className='container mx-auto px-4'>
            <h2 className='text-4xl font-bold text-center mb-4'>Potencia la Calidad de tu Servicio</h2>
            <p className='text-xl text-center text-muted-foreground mb-12 max-w-3xl mx-auto'>
                Diseñado específicamente para la documentación educativa. Cada característica está orientada a la eficiencia y la verificación.
            </p>

            <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
                {features.map((feature) => (
                    <Card key={feature.title} className='h-full shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-primary/60'>
                        <CardHeader>
                            <feature.icon className='w-8 h-8 text-primary mb-3' />
                            <CardTitle className='text-xl'>{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>{feature.description}</CardDescription>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </section>

      <section className='w-full py-20 bg-primary/90 text-white'>
        <div className='container mx-auto px-4 text-center'>
          <div className='mx-auto max-w-3xl'>
            <h2 className='text-4xl font-bold mb-4'>Maximiza la Eficiencia Ahora</h2>
            <p className='text-xl mb-8 opacity-90'>
                Únete al Instituto Superior Tecnológico Sudamericano en la transformación de la atención estudiantil.
            </p>

		<div className='flex flex-col justify-center gap-4 sm:flex-row'>
              {/* Lógica: Botón de ACCEDER si NO está autenticado */}
              {!isAuthenticated && (
                <>
                  {/* ENLACE MAILTO ADICIONAL */}
                  <Button asChild variant='ghost' size='lg' className='border border-white/50 text-white hover:bg-white/10'>
                    <a
                      href='mailto:tecnico@ists.edu.ec?subject=Solicitud%20de%20Información%20Chatbot%20ISTS'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <Mail className='w-5 h-5 mr-2' />
                      Solicitar más Información
                    </a>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className='w-full py-4 bg-muted text-muted-foreground text-center border-t border-border'>
        <div className='container mx-auto'>
            <p className='text-sm'>COPYRIGHT &copy; {new Date().getFullYear()} ISTS. RESERVADOS TODOS LOS DERECHOS.</p>
        </div>
      </footer>

    </div>
  )
}
