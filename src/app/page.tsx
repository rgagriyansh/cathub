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
              Free to Use - No Credit Card Required
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
              The all-in-one platform for MBA aspirants. Build your profile, generate SOPs, 
              create professional CVs, and share your journey - all powered by AI.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/register"
                className="group flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full text-base font-medium hover:bg-black/80 transition-all hover:gap-4"
              >
                Get Started Free
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link 
                href="#features"
                className="flex items-center gap-2 px-8 py-4 rounded-full text-base font-medium border border-[var(--border)] hover:border-black transition-colors"
              >
                Explore Features
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
            <span className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider">Features</span>
            <h2 className="font-[family-name:var(--font-syne)] text-4xl md:text-5xl font-bold mt-4 tracking-tight">
              Everything You Need to Succeed
            </h2>
            <p className="text-[var(--muted)] text-lg mt-4 max-w-2xl mx-auto">
              From building your profile to generating application materials - we've got you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 - Profile Builder */}
            <div className="group p-8 rounded-3xl border border-[var(--border)] hover:border-black transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                <span className="text-2xl">👤</span>
              </div>
              <h3 className="font-[family-name:var(--font-syne)] text-xl font-semibold mb-3">Profile Builder</h3>
              <p className="text-[var(--muted)] leading-relaxed text-sm">
                Create a comprehensive profile with your academics, work experience, achievements, and career goals.
              </p>
            </div>

            {/* Feature 2 - MBA Writer */}
            <div className="group p-8 rounded-3xl border-2 border-black transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative">
              <div className="absolute -top-3 right-6 bg-black text-white text-xs font-medium px-3 py-1 rounded-full">
                Popular
              </div>
              <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                <span className="text-2xl">✍️</span>
              </div>
              <h3 className="font-[family-name:var(--font-syne)] text-xl font-semibold mb-3">MBA Writer</h3>
              <p className="text-[var(--muted)] leading-relaxed text-sm">
                AI-powered SOP and essay generator tailored to your profile and target B-schools.
              </p>
            </div>

            {/* Feature 3 - CV Creator */}
            <div className="group p-8 rounded-3xl border border-[var(--border)] hover:border-black transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                <span className="text-2xl">📄</span>
              </div>
              <h3 className="font-[family-name:var(--font-syne)] text-xl font-semibold mb-3">CV Creator</h3>
              <p className="text-[var(--muted)] leading-relaxed text-sm">
                Generate professional, ATS-friendly CVs from your profile data in seconds.
              </p>
            </div>

            {/* Feature 4 - Reddit Card */}
            <div className="group p-8 rounded-3xl border border-[var(--border)] hover:border-black transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                <span className="text-2xl">🎴</span>
              </div>
              <h3 className="font-[family-name:var(--font-syne)] text-xl font-semibold mb-3">Reddit Card</h3>
              <p className="text-[var(--muted)] leading-relaxed text-sm">
                Create beautiful shareable profile cards for Reddit, social media, and networking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider">How It Works</span>
            <h2 className="font-[family-name:var(--font-syne)] text-4xl md:text-5xl font-bold mt-4 tracking-tight">
              Three Simple Steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-[var(--border)]" />
            
            {/* Step 1 */}
            <div className="text-center relative">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold relative z-10">
                1
              </div>
              <h3 className="font-[family-name:var(--font-syne)] text-xl font-semibold mb-3">Build Your Profile</h3>
              <p className="text-[var(--muted)] leading-relaxed">
                Enter your academic background, work experience, achievements, and career aspirations.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center relative">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold relative z-10">
                2
              </div>
              <h3 className="font-[family-name:var(--font-syne)] text-xl font-semibold mb-3">Generate Content</h3>
              <p className="text-[var(--muted)] leading-relaxed">
                Use our AI tools to create personalized SOPs, essays, and professional CVs instantly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center relative">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold relative z-10">
                3
              </div>
              <h3 className="font-[family-name:var(--font-syne)] text-xl font-semibold mb-3">Apply & Succeed</h3>
              <p className="text-[var(--muted)] leading-relaxed">
                Download your materials, refine as needed, and submit confident applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Tools Section */}
      <section id="tools" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider">Our Tools</span>
            <h2 className="font-[family-name:var(--font-syne)] text-4xl md:text-5xl font-bold mt-4 tracking-tight">
              Powerful Tools for Every Step
            </h2>
          </div>

          {/* Tool 1 - MBA Writer */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <div>
              <div className="inline-flex items-center gap-2 bg-black text-white text-xs font-medium px-3 py-1 rounded-full mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                Available Now
              </div>
              <h3 className="font-[family-name:var(--font-syne)] text-3xl font-bold mb-4">MBA Writer</h3>
              <p className="text-[var(--muted)] leading-relaxed mb-6">
                Our flagship AI-powered writing tool generates compelling SOPs and essays tailored specifically 
                to your profile and target schools. No more staring at blank pages.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Personalized to your unique background</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Supports all major B-school formats</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Edit and refine with AI assistance</span>
                </li>
              </ul>
              <Link 
                href="/register"
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-black/80 transition-colors"
              >
                Start Writing
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="bg-[#fafafa] rounded-3xl p-8 border border-[var(--border)]">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--border)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                    <span className="text-lg">✍️</span>
                  </div>
                  <div>
                    <div className="font-medium">SOP for IIM Ahmedabad</div>
                    <div className="text-xs text-[var(--muted)]">Generated just now</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-[#f5f5f5] rounded-full w-full" />
                  <div className="h-3 bg-[#f5f5f5] rounded-full w-11/12" />
                  <div className="h-3 bg-[#f5f5f5] rounded-full w-10/12" />
                  <div className="h-3 bg-[#f5f5f5] rounded-full w-full" />
                  <div className="h-3 bg-[#f5f5f5] rounded-full w-9/12" />
                </div>
              </div>
            </div>
          </div>

          {/* Tool 2 - CV Creator */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <div className="order-2 md:order-1 bg-[#fafafa] rounded-3xl p-8 border border-[var(--border)]">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--border)]">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-[family-name:var(--font-syne)] font-bold text-lg">John Doe</div>
                  <div className="text-xs text-[var(--muted)]">PDF Ready</div>
                </div>
                <div className="text-xs text-[var(--muted)] mb-4">Software Engineer | 4 Years Experience</div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-medium mb-1">Experience</div>
                    <div className="h-2 bg-[#f5f5f5] rounded-full w-full" />
                    <div className="h-2 bg-[#f5f5f5] rounded-full w-10/12 mt-1" />
                  </div>
                  <div>
                    <div className="text-xs font-medium mb-1">Education</div>
                    <div className="h-2 bg-[#f5f5f5] rounded-full w-9/12" />
                  </div>
                  <div>
                    <div className="text-xs font-medium mb-1">Skills</div>
                    <div className="flex gap-1">
                      <div className="h-4 bg-[#f5f5f5] rounded w-12" />
                      <div className="h-4 bg-[#f5f5f5] rounded w-16" />
                      <div className="h-4 bg-[#f5f5f5] rounded w-10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 bg-black text-white text-xs font-medium px-3 py-1 rounded-full mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                Available Now
              </div>
              <h3 className="font-[family-name:var(--font-syne)] text-3xl font-bold mb-4">CV Creator</h3>
              <p className="text-[var(--muted)] leading-relaxed mb-6">
                Transform your profile into a professional, ATS-friendly CV instantly. 
                Perfect for MBA applications and job hunting.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Professional templates</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>One-click PDF download</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Auto-populated from your profile</span>
                </li>
              </ul>
              <Link 
                href="/register"
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-black/80 transition-colors"
              >
                Create Your CV
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Tool 3 - Reddit Card */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-black text-white text-xs font-medium px-3 py-1 rounded-full mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                Available Now
              </div>
              <h3 className="font-[family-name:var(--font-syne)] text-3xl font-bold mb-4">Reddit Card</h3>
              <p className="text-[var(--muted)] leading-relaxed mb-6">
                Share your MBA profile beautifully on Reddit, LinkedIn, and other platforms. 
                Perfect for networking and getting advice from the community.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Multiple beautiful themes</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Privacy controls - mask your name</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Download as image or share link</span>
                </li>
              </ul>
              <Link 
                href="/register"
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-black/80 transition-colors"
              >
                Create Your Card
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="bg-[#fafafa] rounded-3xl p-8 border border-[var(--border)]">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-[family-name:var(--font-syne)] font-bold">Joh*** D**</div>
                  <div className="text-xs bg-white/20 px-2 py-1 rounded">CAT 2024</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-white/60 text-xs">Percentile</div>
                    <div className="font-semibold">99.2</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs">Work Ex</div>
                    <div className="font-semibold">48 months</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs">Category</div>
                    <div className="font-semibold">General</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs">Background</div>
                    <div className="font-semibold">Engineer</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-24 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider">Coming Soon</span>
            <h2 className="font-[family-name:var(--font-syne)] text-3xl md:text-4xl font-bold mt-4 tracking-tight">
              More Features on the Way
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Interview Prep */}
            <div className="bg-white p-8 rounded-2xl border border-[var(--border)] opacity-75">
              <div className="w-12 h-12 bg-[#f5f5f5] rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-[family-name:var(--font-syne)] text-lg font-semibold mb-2">Interview Prep</h3>
              <p className="text-[var(--muted)] text-sm">
                AI-powered mock interviews with real-time feedback to ace your B-school interviews.
              </p>
            </div>

            {/* Essay Review */}
            <div className="bg-white p-8 rounded-2xl border border-[var(--border)] opacity-75">
              <div className="w-12 h-12 bg-[#f5f5f5] rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="font-[family-name:var(--font-syne)] text-lg font-semibold mb-2">Essay Review</h3>
              <p className="text-[var(--muted)] text-sm">
                Get detailed AI feedback on your existing essays and suggestions for improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-[family-name:var(--font-syne)] text-4xl md:text-5xl font-bold mb-2">100%</div>
              <div className="text-[var(--muted)]">Free to Use</div>
            </div>
            <div>
              <div className="font-[family-name:var(--font-syne)] text-4xl md:text-5xl font-bold mb-2">4+</div>
              <div className="text-[var(--muted)]">Powerful Tools</div>
            </div>
            <div>
              <div className="font-[family-name:var(--font-syne)] text-4xl md:text-5xl font-bold mb-2">AI</div>
              <div className="text-[var(--muted)]">Powered</div>
            </div>
            <div>
              <div className="font-[family-name:var(--font-syne)] text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <div className="text-[var(--muted)]">Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-[family-name:var(--font-syne)] text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Ready to Start Your
            <br />MBA Journey?
          </h2>
          <p className="text-white/60 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
            Join thousands of MBA aspirants using CatHub to build their profiles, 
            craft compelling applications, and get into their dream schools.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full text-base font-medium hover:bg-white/90 transition-colors"
            >
              Get Started Free
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link 
              href="/login"
              className="inline-flex items-center gap-2 text-white/80 px-8 py-4 rounded-full text-base font-medium hover:text-white transition-colors"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
