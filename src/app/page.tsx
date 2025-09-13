import { Navigation } from '@/components/navigation'
import { Hero } from '@/components/hero'
import { Programs } from '@/components/programs'
import { Testimonials } from '@/components/testimonials'
import { Statistics } from '@/components/statistics'
import { FAQ } from '@/components/faq'
import { Gallery } from '@/components/gallery'
import { News } from '@/components/news'
import { ContactForm } from '@/components/contact-form'
import { Footer } from '@/components/footer'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <section id="home">
        <Hero />
      </section>
      <Programs />
      <Testimonials />
      <Statistics />
      <FAQ />
      <Gallery />
      <News />
      <ContactForm />
      <Footer />
    </main>
  )
}