import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-pattern noise-bg">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-black/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-black/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
          <div className="text-center stagger-children">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-black text-white text-xs font-medium px-4 py-2 rounded-full mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              MBA Writer Now Live
            </div>

            {/* Main Heading */}
            <h1 className="font-[family-name:var(--font-syne)] text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[1.1]">
              Your MBA Journey
              <br />
              <span className="relative">
                Starts Here
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 10C50 4 150 2 298 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-[var(--muted)] max-w-2xl mx-auto mb-12 leading-relaxed">
              AI-powered tools to craft compelling SOPs, ace interviews, and navigate 
              your path to top MBA programs. All in one place.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/register"
                className="group flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full text-base font-medium hover:bg-black/80 transition-all hover:gap-4"
              >
                Start Writing Free
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link 
                href="#features"
                className="flex items-center gap-2 px-8 py-4 rounded-full text-base font-medium border border-[var(--border)] hover:border-black transition-colors"
              >
                See How It Works
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 flex flex-col items-center gap-4">
              <p className="text-sm text-[var(--muted)]">Trusted by students applying to</p>
              <div className="flex items-center gap-8 opacity-60">
                <span className="font-[family-name:var(--font-syne)] font-bold text-lg">IIM</span>
                <span className="font-[family-name:var(--font-syne)] font-bold text-lg">ISB</span>
                <span className="font-[family-name:var(--font-syne)] font-bold text-lg">XLRI</span>
                <span className="font-[family-name:var(--font-syne)] font-bold text-lg">MDI</span>
                <span className="font-[family-name:var(--font-syne)] font-bold text-lg">FMS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider">Why CatHub</span>
            <h2 className="font-[family-name:var(--font-syne)] text-4xl md:text-5xl font-bold mt-4 tracking-tight">
              Everything You Need
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-3xl border border-[var(--border)] hover:border-black transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-syne)] text-xl font-semibold mb-3">AI-Powered Writing</h3>
              <p className="text-[var(--muted)] leading-relaxed">
                Generate compelling SOPs and essays tailored to your profile and target schools. No more writer's block.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-3xl border border-[var(--border)] hover:border-black transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-syne)] text-xl font-semibold mb-3">Smart Suggestions</h3>
              <p className="text-[var(--muted)] leading-relaxed">
                Get intelligent recommendations based on successful applications to your dream schools.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-3xl border border-[var(--border)] hover:border-black transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-syne)] text-xl font-semibold mb-3">Lightning Fast</h3>
              <p className="text-[var(--muted)] leading-relaxed">
                Generate your first draft in seconds. Iterate and refine until it's perfect.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-32 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider">Our Tools</span>
            <h2 className="font-[family-name:var(--font-syne)] text-4xl md:text-5xl font-bold mt-4 tracking-tight">
              Built for Success
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* MBA Writer - Active */}
            <div className="relative group bg-white p-10 rounded-3xl border-2 border-black overflow-hidden">
              <div className="absolute top-6 right-6 bg-black text-white text-xs font-medium px-3 py-1 rounded-full">
                Available Now
              </div>
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-8">
                <span className="text-3xl">✍️</span>
              </div>
              <h3 className="font-[family-name:var(--font-syne)] text-2xl font-bold mb-4">MBA Writer</h3>
              <p className="text-[var(--muted)] leading-relaxed mb-8">
                Craft compelling SOPs, personal essays, and application responses. Our AI understands what top MBA programs look for.
              </p>
              <Link 
                href="/register"
                className="inline-flex items-center gap-2 text-base font-medium group-hover:gap-4 transition-all"
              >
                Try Now
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Interview Prep - Coming Soon */}
            <div className="relative group bg-white p-10 rounded-3xl border border-[var(--border)] overflow-hidden opacity-75">
              <div className="absolute top-6 right-6 bg-[var(--border)] text-[var(--muted)] text-xs font-medium px-3 py-1 rounded-full">
                Coming Soon
              </div>
              <div className="w-16 h-16 bg-[#f5f5f5] rounded-2xl flex items-center justify-center mb-8">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="font-[family-name:var(--font-syne)] text-2xl font-bold mb-4">Interview Prep</h3>
              <p className="text-[var(--muted)] leading-relaxed mb-8">
                Practice with AI-powered mock interviews. Get real-time feedback and improve your responses for top B-schools.
              </p>
              <span className="inline-flex items-center gap-2 text-base font-medium text-[var(--muted)]">
                Join Waitlist
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full grid-pattern" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)' }} />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-[family-name:var(--font-syne)] text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Ready to Ace Your
            <br />MBA Application?
          </h2>
          <p className="text-white/60 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
            Join thousands of students who've used CatHub to get into their dream schools.
          </p>
          <Link 
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full text-base font-medium hover:bg-white/90 transition-colors"
          >
            Get Started Free
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
