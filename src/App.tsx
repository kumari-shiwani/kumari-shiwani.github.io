import { useState } from 'react'
import VideoBackground from './components/VideoBackground'
import Hero from './components/Hero'
import BrandMarquee from './components/BrandMarquee'
import AboutSection from './components/AboutSection'
import ProcessSection from './components/ProcessSection'
import SelectedWorkSection from './components/SelectedWorkSection'
import CapabilitiesSection from './components/CapabilitiesSection'
import ExperienceSection from './components/ExperienceSection'
import ContactSection from './components/ContactSection'
import Lightbox from './components/Lightbox'
import { galleryCount } from './lib/data'

export default function App() {
  const [openPage, setOpenPage] = useState<number | null>(null)

  return (
    <div id="home">
      <VideoBackground />
      <div className="relative z-0">
        <Hero />
        <BrandMarquee />
        <AboutSection />
        <ProcessSection />
        <SelectedWorkSection onOpen={setOpenPage} />
        <CapabilitiesSection />
        <ExperienceSection />
        <ContactSection />
      </div>
      <Lightbox
        page={openPage}
        onClose={() => setOpenPage(null)}
        onNavigate={(page) => setOpenPage(((page - 1) % galleryCount) + 1)}
      />
    </div>
  )
}
