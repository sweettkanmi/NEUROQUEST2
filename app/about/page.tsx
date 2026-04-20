import Link from "next/link"
import Image from "next/image"

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border/50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden">
            <Image
              src="https://i.ibb.co/3mHxWbym/Chat-GPT-Image-20-abr-2026-16-31-42.png"
              alt="NeuroQuest Logo"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-bold text-lg text-foreground">NeuroQuest</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/about"
            className="text-sm text-primary font-medium"
          >
            About Us
          </Link>
          <Link
            href="/auth/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Iniciar Sesion
          </Link>
          <Link
            href="/auth/sign-up"
            className="text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            Registrarse
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex-1 rpg-grid-bg">
        <div className="max-w-4xl mx-auto px-6 py-12">

          {/* University Header Section */}
          <section className="text-center mb-16">
            <div className="flex flex-col items-center gap-6">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden bg-card p-4 border border-border/50">
                <Image
                  src="https://www.unicatolica.edu.co/files/logo-unicatolica-vertical.png"
                  alt="Logo UNICATOLICA"
                  width={160}
                  height={160}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  UNICATOLICA
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground mb-6">
                  LUMEN GENTIUM
                </p>
              </div>
            </div>

            {/* University Description */}
            <div className="max-w-3xl mx-auto mt-8 text-left">
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base mb-4">
                Lumen Gentium – UNICATOLICA es una institucion educativa comprometida con la formacion integral de sus estudiantes, promoviendo el desarrollo academico, humano y etico dentro de un entorno basado en valores. Como parte de Fundacion Universitaria Catolica Lumen Gentium, se enfoca en brindar educacion accesible y de calidad, preparando a sus estudiantes para enfrentar los retos del mundo profesional y tecnologico actual.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base mb-4">
                La institucion impulsa el aprendizaje a traves de metodologias que combinan teoria y practica, fomentando el pensamiento critico, la creatividad y la innovacion. Ademas, promueve una formacion orientada a la responsabilidad social, buscando que sus estudiantes no solo desarrollen habilidades tecnicas, sino tambien una vision consciente de su impacto en la sociedad.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                En este entorno, los estudiantes encuentran un espacio para crecer, explorar sus capacidades y construir proyectos con proposito, apoyados por una comunidad academica que valora el esfuerzo, la disciplina y la evolucion constante.
              </p>
            </div>
          </section>

          {/* Responsables Section */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              Responsables
            </h2>

            {/* Team Member Card */}
            <div className="bg-card border border-border/50 rounded-xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar Placeholder */}
                <div className="flex-shrink-0 mx-auto md:mx-0">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                    <span className="text-4xl md:text-5xl font-bold text-primary">S</span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-foreground mb-1">
                    Stevan Ortiz
                  </h3>
                  <p className="text-primary font-medium mb-4">
                    Project Manager/Main Developer
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                    de 19 años, es estudiante de Desarrollo de Software en la Institución Educativa Lumen Gentium – UNICATÓLICA. Inició su camino en la programación desde los 14 años, explorando el desarrollo frontend como un interés temprano que, tras un corto periodo, se mantuvo a nivel básico y autodidacta, marcando sus primeros pasos en el mundo tecnológico.
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base mt-4">
                    Actualmente trabaja de manera independiente liderando su propio estudio, WARE, donde ofrece servicios de desarrollo bajo demanda orientados a pequeños desarrolladores y creadores. Dentro de este estudio, se desempeña como Modelador 3D, Environment Artist y Competitive Layout Designer, enfocándose en la construcción de experiencias visuales y entornos digitales.
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base mt-4">
                    La idea de esta aplicación nace desde una experiencia personal. Diagnosticado desde la infancia con TDAH (Trastorno por Déficit de Atención e Hiperactividad), Stevan ha vivido de primera mano los desafíos que enfrentan las personas neurodivergentes dentro del sistema educativo actual, donde aún existen importantes brechas de inclusión.
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base mt-4">
                    A partir de esta realidad, decidió crear esta aplicación como una herramienta tanto para su propio crecimiento como para apoyar a quienes atraviesan dificultades similares, buscando facilitar el enfoque, la constancia y el cumplimiento de metas educativas.
                  </p>
                </div>
              </div>
            </div>

            {/* Team Member Card - Juan Sebastián Molina */}
            <div className="bg-card border border-border/50 rounded-xl p-6 md:p-8 mt-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar Placeholder */}
                <div className="flex-shrink-0 mx-auto md:mx-0">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                    <span className="text-4xl md:text-5xl font-bold text-primary">J</span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-foreground mb-1">
                    Juan Sebastian Molina
                  </h3>
                  <p className="text-primary font-medium mb-4">
                    Desarrollador
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                    Juan Sebastian Molina es estudiante de Tecnologia en Desarrollo de Software en la Fundacion Universitaria Lumen Gentium, en Cali. Se caracteriza por su interes en afrontar desafios que le permitan fortalecer sus habilidades y adquirir nuevos conocimientos en el area tecnologica.
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base mt-4">
                    A lo largo de su formacion, ha desarrollado diversos prototipos funcionales de paginas web, incluyendo tanto recreaciones de plataformas existentes como disenos propios, lo que evidencia su capacidad para aplicar conceptos teoricos en soluciones practicas.
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base mt-4">
                    Se destaca por su habilidad para el trabajo en equipo y su disposicion para seguir lineamientos de manera efectiva, contribuyendo al cumplimiento de objetivos en entornos colaborativos. Asimismo, muestra afinidad por proyectos dinamicos que impliquen aprendizaje continuo y adaptacion a nuevos retos dentro del desarrollo de software.
                  </p>
                </div>
              </div>
            </div>

            {/* Team Member Card - Johan Balcázar */}
            <div className="bg-card border border-border/50 rounded-xl p-6 md:p-8 mt-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar Placeholder */}
                <div className="flex-shrink-0 mx-auto md:mx-0">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                    <span className="text-4xl md:text-5xl font-bold text-primary">J</span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-foreground mb-1">
                    Johan Balcazar
                  </h3>
                  <p className="text-primary font-medium mb-4">
                    Desarrollador
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                    Johan Balcazar es estudiante de tecnologia en desarrollo de software, en la institucion educativa Lumen Gentium - UNICATOLICA. Inicio su camino en la programacion desde los 17 anos, le interesan los diferentes lenguajes de programacion e incrementar su aprendizaje en nuevos proyectos de esa area.
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base mt-4">
                    No ha participado en muchos trabajos o proyectos relacionados sobre la programacion de varios sitios web o semejantes pero le llaman la atencion y en los pocos que ha participado, aprende algo nuevo, con buena habilidad para analizar.
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base mt-4">
                    En este nuevo proyecto que es de la universidad en el que esta con sus companeros de equipo para desarrollar una aplicacion para personas con TDAH (trastorno por deficit de atencion e hiperactividad), es bastante interesante y cada vez que avanzan, aprende mas sobre el tema.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border/50 text-center">
        <p className="text-sm text-muted-foreground">
          NeuroQuest - Aprende jugando. Hecho para estudiantes con TDAH.
        </p>
      </footer>
    </main>
  )
}
