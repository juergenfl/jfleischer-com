import Header from '../components/Header'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import NeuralCore from '../three/NeuralCore'

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      {/* The scene lives behind the whole page so it can morph as you scroll */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <NeuralCore />
      </div>

      <div className="relative z-10 flex min-h-full flex-col">
        <Header />
        <main id="main">
          <Hero />
          {/*
            Nothing to read down here — the screen belongs to the scene. The
            height is what gives the scroll something to travel through, so the
            blob has room to collapse into the connected cloud and stay there.
          */}
          <section id="scene" aria-hidden="true" className="min-h-dvh" />
        </main>
        <Footer />
      </div>
    </div>
  )
}
