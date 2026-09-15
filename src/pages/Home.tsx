import Header from '../components/Header'
import Hero from '../components/Hero'
import Directory from '../components/Directory'
import Manifest from '../components/Manifest'
import LabNotes from '../components/LabNotes'
import Contact from '../components/Contact'
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
          <Directory />
          <Manifest />
          <LabNotes />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  )
}
