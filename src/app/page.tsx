import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'
import AnimatedCounter from '@/components/AnimatedCounter'

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-pattern noise-bg">
        {/* Animated blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-black/5 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-black/5 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-black/3 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }} />
        
        {/* Floating decorative elements */}
        <div className="absolute top-32 right-20 w-20 h-20 border border-black/10 rounded-2xl animate-float-slow hidden lg:block" />
        <div className="absolute bottom-40 left-20 w-16 h-16 bg-black/5 rounded-full animate-float-delayed hidden lg:block" />
        <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-black rounded-lg animate-bounce-subtle hidden lg:block" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
          <div className="text-center stagger-children">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-black text-white text-xs font-medium px-4 py-2 rounded-full mb-8 animate-glow">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Free to Use - No Credit Card Required
            </div>

            {/* Main Heading */}
            <h1 className="font-[family-name:var(--font-syne)] text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[1.1]">
              <span className="text-gradient">Your MBA Journey</span>
              <br />
              <span className="relative inline-block">
                Starts Here
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path 
                    d="M2 10C50 4 150 2 298 8" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                    className="animate-[draw_1s_ease-out_0.5s_forwards]"
                    style={{ strokeDasharray: 300, strokeDashoffset: 300 }}
                  />
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
                className="magnetic-btn group flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full text-base font-medium hover:bg-black/80 transition-all hover:gap-4 hover:shadow-2xl ripple"
              >
                Get Started Free
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link 
                href="#features"
                className="magnetic-btn flex items-center gap-2 px-8 py-4 rounded-full text-base font-medium border border-[var(--border)] hover:border-black hover:shadow-lg transition-all"
              >
                Explore Features
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 flex flex-col items-center gap-4">
              <p className="text-sm text-[var(--muted)]">Trusted by students applying to</p>
              <div className="flex items-center gap-8">
                {['IIM', 'ISB', 'XLRI', 'MDI', 'FMS'].map((school, i) => (
                  <span 
                    key={school}
                    className="font-[family-name:var(--font-syne)] font-bold text-lg opacity-60 hover:opacity-100 transition-opacity cursor-default"
                    style={{ animationDelay: `${0.8 + i * 0.1}s` }}
                  >
                    {school}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-[var(--muted)] rounded-full flex justify-center p-2">
            <div className="w-1 h-2 bg-[var(--muted)] rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-20">
              <span className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider">Features</span>
              <h2 className="font-[family-name:var(--font-syne)] text-4xl md:text-5xl font-bold mt-4 tracking-tight">
                Everything You Need to Succeed
              </h2>
              <p className="text-[var(--muted)] text-lg mt-4 max-w-2xl mx-auto">
                From building your profile to generating application materials - we've got you covered.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 - Profile Builder */}
            <ScrollReveal delay={100}>
              <div className="group p-8 rounded-3xl border border-[var(--border)] hover:border-black transition-all duration-500 hover:-translate-y-2 hover:shadow-xl card-glow h-full">
                <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                  <span className="text-2xl">👤</span>
                </div>
                <h3 className="font-[family-name:var(--font-syne)] text-xl font-semibold mb-3 group-hover:text-black/80 transition-colors">Profile Builder</h3>
                <p className="text-[var(--muted)] leading-relaxed text-sm">
                  Create a comprehensive profile with your academics, work experience, achievements, and career goals.
                </p>
              </div>
            </ScrollReveal>

            {/* Feature 2 - MBA Writer */}
            <ScrollReveal delay={200}>
              <div className="group p-8 rounded-3xl border-2 border-black transition-all duration-500 hover:-translate-y-2 hover:shadow-xl relative overflow-hidden h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -top-3 right-6 bg-black text-white text-xs font-medium px-3 py-1 rounded-full animate-bounce-subtle">
                  Popular
                </div>
                <div className="relative">
                  <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                    <span className="text-2xl">✍️</span>
                  </div>
                  <h3 className="font-[family-name:var(--font-syne)] text-xl font-semibold mb-3">MBA Writer</h3>
                  <p className="text-[var(--muted)] leading-relaxed text-sm">
                    AI-powered SOP and essay generator tailored to your profile and target B-schools.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Feature 3 - CV Creator */}
            <ScrollReveal delay={300}>
              <div className="group p-8 rounded-3xl border border-[var(--border)] hover:border-black transition-all duration-500 hover:-translate-y-2 hover:shadow-xl card-glow h-full">
                <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                  <span className="text-2xl">📄</span>
                </div>
                <h3 className="font-[family-name:var(--font-syne)] text-xl font-semibold mb-3">CV Creator</h3>
                <p className="text-[var(--muted)] leading-relaxed text-sm">
                  Generate professional, ATS-friendly CVs from your profile data in seconds.
                </p>
              </div>
            </ScrollReveal>

            {/* Feature 4 - Reddit Card */}
            <ScrollReveal delay={400}>
              <div className="group p-8 rounded-3xl border border-[var(--border)] hover:border-black transition-all duration-500 hover:-translate-y-2 hover:shadow-xl card-glow h-full">
                <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                  <span className="text-2xl">🎴</span>
                </div>
                <h3 className="font-[family-name:var(--font-syne)] text-xl font-semibold mb-3">Reddit Card</h3>
                <p className="text-[var(--muted)] leading-relaxed text-sm">
                  Create beautiful shareable profile cards for Reddit, social media, and networking.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 bg-[#fafafa] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-black/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <ScrollReveal>
            <div className="text-center mb-20">
              <span className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider">How It Works</span>
              <h2 className="font-[family-name:var(--font-syne)] text-4xl md:text-5xl font-bold mt-4 tracking-tight">
                Three Simple Steps
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line with animation */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-black/20 to-transparent" />
            
            {/* Step 1 */}
            <ScrollReveal delay={100} direction="scale">
              <div className="text-center relative group">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold relative z-10 group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-xl">
                  <span className="group-hover:animate-bounce-subtle">1</span>
                </div>
                <h3 className="font-[family-name:var(--font-syne)] text-xl font-semibold mb-3">Build Your Profile</h3>
                <p className="text-[var(--muted)] leading-relaxed">
                  Enter your academic background, work experience, achievements, and career aspirations.
                </p>
              </div>
            </ScrollReveal>

            {/* Step 2 */}
            <ScrollReveal delay={200} direction="scale">
              <div className="text-center relative group">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold relative z-10 group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-xl">
                  <span className="group-hover:animate-bounce-subtle">2</span>
                </div>
                <h3 className="font-[family-name:var(--font-syne)] text-xl font-semibold mb-3">Generate Content</h3>
                <p className="text-[var(--muted)] leading-relaxed">
                  Use our AI tools to create personalized SOPs, essays, and professional CVs instantly.
                </p>
              </div>
            </ScrollReveal>

            {/* Step 3 */}
            <ScrollReveal delay={300} direction="scale">
              <div className="text-center relative group">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold relative z-10 group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-xl">
                  <span className="group-hover:animate-bounce-subtle">3</span>
                </div>
                <h3 className="font-[family-name:var(--font-syne)] text-xl font-semibold mb-3">Apply & Succeed</h3>
                <p className="text-[var(--muted)] leading-relaxed">
                  Download your materials, refine as needed, and submit confident applications.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Detailed Tools Section */}
      <section id="tools" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-20">
              <span className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider">Our Tools</span>
              <h2 className="font-[family-name:var(--font-syne)] text-4xl md:text-5xl font-bold mt-4 tracking-tight">
                Powerful Tools for Every Step
              </h2>
            </div>
          </ScrollReveal>

          {/* Tool 1 - MBA Writer */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <ScrollReveal direction="left">
              <div>
                <div className="inline-flex items-center gap-2 bg-black text-white text-xs font-medium px-3 py-1 rounded-full mb-6">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Available Now
                </div>
                <h3 className="font-[family-name:var(--font-syne)] text-3xl font-bold mb-4">MBA Writer</h3>
                <p className="text-[var(--muted)] leading-relaxed mb-6">
                  Our flagship AI-powered writing tool generates compelling SOPs and essays tailored specifically 
                  to your profile and target schools. No more staring at blank pages.
                </p>
                <ul className="space-y-3 mb-8">
                  {['Personalized to your unique background', 'Supports all major B-school formats', 'Edit and refine with AI assistance'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 group">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  href="/register"
                  className="magnetic-btn inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-black/80 hover:gap-4 transition-all hover:shadow-lg"
                >
                  Start Writing
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="bg-[#fafafa] rounded-3xl p-8 border border-[var(--border)] hover:shadow-xl transition-shadow">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--border)] hover:border-black/20 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center animate-bounce-subtle">
                      <span className="text-lg">✍️</span>
                    </div>
                    <div>
                      <div className="font-medium">SOP for IIM Ahmedabad</div>
                      <div className="text-xs text-[var(--muted)]">Generated just now</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-[#f5f5f5] rounded-full w-full animate-pulse" />
                    <div className="h-3 bg-[#f5f5f5] rounded-full w-11/12 animate-pulse" style={{ animationDelay: '0.1s' }} />
                    <div className="h-3 bg-[#f5f5f5] rounded-full w-10/12 animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="h-3 bg-[#f5f5f5] rounded-full w-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                    <div className="h-3 bg-[#f5f5f5] rounded-full w-9/12 animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Tool 2 - CV Creator */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <ScrollReveal direction="left" className="order-2 md:order-1">
              <div className="bg-[#fafafa] rounded-3xl p-8 border border-[var(--border)] hover:shadow-xl transition-shadow">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--border)] hover:border-black/20 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-[family-name:var(--font-syne)] font-bold text-lg">John Doe</div>
                    <div className="text-xs text-[var(--muted)] bg-green-100 text-green-700 px-2 py-1 rounded">PDF Ready</div>
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
                      <div className="flex gap-1 flex-wrap">
                        <div className="h-5 bg-black/10 rounded px-2 text-xs flex items-center">React</div>
                        <div className="h-5 bg-black/10 rounded px-2 text-xs flex items-center">Node.js</div>
                        <div className="h-5 bg-black/10 rounded px-2 text-xs flex items-center">Python</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" className="order-1 md:order-2">
              <div>
                <div className="inline-flex items-center gap-2 bg-black text-white text-xs font-medium px-3 py-1 rounded-full mb-6">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Available Now
                </div>
                <h3 className="font-[family-name:var(--font-syne)] text-3xl font-bold mb-4">CV Creator</h3>
                <p className="text-[var(--muted)] leading-relaxed mb-6">
                  Transform your profile into a professional, ATS-friendly CV instantly. 
                  Perfect for MBA applications and job hunting.
                </p>
                <ul className="space-y-3 mb-8">
                  {['Professional templates', 'One-click PDF download', 'Auto-populated from your profile'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 group">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  href="/register"
                  className="magnetic-btn inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-black/80 hover:gap-4 transition-all hover:shadow-lg"
                >
                  Create Your CV
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* Tool 3 - Reddit Card */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <div>
                <div className="inline-flex items-center gap-2 bg-black text-white text-xs font-medium px-3 py-1 rounded-full mb-6">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Available Now
                </div>
                <h3 className="font-[family-name:var(--font-syne)] text-3xl font-bold mb-4">Reddit Card</h3>
                <p className="text-[var(--muted)] leading-relaxed mb-6">
                  Share your MBA profile beautifully on Reddit, LinkedIn, and other platforms. 
                  Perfect for networking and getting advice from the community.
                </p>
                <ul className="space-y-3 mb-8">
                  {['Multiple beautiful themes', 'Privacy controls - mask your name', 'Download as image or share link'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 group">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  href="/register"
                  className="magnetic-btn inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-black/80 hover:gap-4 transition-all hover:shadow-lg"
                >
                  Create Your Card
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="bg-[#fafafa] rounded-3xl p-8 border border-[var(--border)] hover:shadow-xl transition-shadow">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white transform hover:scale-[1.02] transition-transform">
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-[family-name:var(--font-syne)] font-bold">Joh*** D**</div>
                    <div className="text-xs bg-white/20 px-2 py-1 rounded animate-pulse">CAT 2024</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="hover:bg-white/10 rounded-lg p-2 transition-colors">
                      <div className="text-white/60 text-xs">Percentile</div>
                      <div className="font-semibold">99.2</div>
                    </div>
                    <div className="hover:bg-white/10 rounded-lg p-2 transition-colors">
                      <div className="text-white/60 text-xs">Work Ex</div>
                      <div className="font-semibold">48 months</div>
                    </div>
                    <div className="hover:bg-white/10 rounded-lg p-2 transition-colors">
                      <div className="text-white/60 text-xs">Category</div>
                      <div className="font-semibold">General</div>
                    </div>
                    <div className="hover:bg-white/10 rounded-lg p-2 transition-colors">
                      <div className="text-white/60 text-xs">Background</div>
                      <div className="font-semibold">Engineer</div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-24 bg-[#fafafa] relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-black/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider">Coming Soon</span>
              <h2 className="font-[family-name:var(--font-syne)] text-3xl md:text-4xl font-bold mt-4 tracking-tight">
                More Features on the Way
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <ScrollReveal delay={100}>
              <div className="bg-white p-8 rounded-2xl border border-[var(--border)] opacity-75 hover:opacity-100 transition-opacity group">
                <div className="w-12 h-12 bg-[#f5f5f5] rounded-xl flex items-center justify-center mb-4 group-hover:animate-bounce-subtle">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-[family-name:var(--font-syne)] text-lg font-semibold mb-2">Interview Prep</h3>
                <p className="text-[var(--muted)] text-sm">
                  AI-powered mock interviews with real-time feedback to ace your B-school interviews.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="bg-white p-8 rounded-2xl border border-[var(--border)] opacity-75 hover:opacity-100 transition-opacity group">
                <div className="w-12 h-12 bg-[#f5f5f5] rounded-xl flex items-center justify-center mb-4 group-hover:animate-bounce-subtle">
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="font-[family-name:var(--font-syne)] text-lg font-semibold mb-2">Essay Review</h3>
                <p className="text-[var(--muted)] text-sm">
                  Get detailed AI feedback on your existing essays and suggestions for improvement.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white border-y border-[var(--border)] relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-50" />
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <ScrollReveal delay={0} direction="scale">
              <div className="group">
                <div className="font-[family-name:var(--font-syne)] text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">
                  <AnimatedCounter value="100%" />
                </div>
                <div className="text-[var(--muted)]">Free to Use</div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100} direction="scale">
              <div className="group">
                <div className="font-[family-name:var(--font-syne)] text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">
                  <AnimatedCounter value="4+" />
                </div>
                <div className="text-[var(--muted)]">Powerful Tools</div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200} direction="scale">
              <div className="group">
                <div className="font-[family-name:var(--font-syne)] text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform text-gradient">
                  AI
                </div>
                <div className="text-[var(--muted)]">Powered</div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={300} direction="scale">
              <div className="group">
                <div className="font-[family-name:var(--font-syne)] text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">
                  <AnimatedCounter value="24/7" />
                </div>
                <div className="text-[var(--muted)]">Available</div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        </div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }} />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <ScrollReveal>
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
                className="magnetic-btn inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full text-base font-medium hover:bg-white/90 hover:scale-105 transition-all hover:shadow-2xl"
              >
                Get Started Free
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link 
                href="/login"
                className="inline-flex items-center gap-2 text-white/80 px-8 py-4 rounded-full text-base font-medium hover:text-white transition-colors underline-animate"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </main>
  )
}
