import { useState } from 'react'
import Hero from './components/Hero'
import AboutSection from './components/AboutSection'
import FeaturedBoardSection from './components/FeaturedBoardSection'
import PhilosophySection from './components/PhilosophySection'
import ServicesSection from './components/ServicesSection'
import ExperienceSection from './components/ExperienceSection'
import GallerySection from './components/GallerySection'
import ContactSection from './components/ContactSection'
import Lightbox from './components/Lightbox'
import { galleryCount } from './lib/data'

export default function App() {
  const [openPage, setOpenPage] = useState<number | null>(null)

  return (
    <div id="home" className="bg-black">
      <Hero />
      <AboutSection />
      <FeaturedBoardSection onOpen={setOpenPage} />
      <PhilosophySection />
      <ServicesSection />
      <ExperienceSection />
      <GallerySection onOpen={setOpenPage} />
      <ContactSection />
      <Lightbox
        page={openPage}
        onClose={() => setOpenPage(null)}
        onNavigate={(page) => setOpenPage(((page - 1) % galleryCount) + 1)}
      />
    </div>
  )
}
