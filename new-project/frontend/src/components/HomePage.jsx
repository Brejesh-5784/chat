import { BookOpen, Github, ArrowRight } from 'lucide-react'

export default function HomePage({ onGetStarted, onNavigateToDocs }) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0033] via-[#1a0052] to-[#2d1b69]">
        {/* Geometric Shapes */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-3xl transform rotate-45 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl transform -rotate-12 blur-2xl"></div>
        
        {/* Floating Triangles */}
        <div className="absolute top-32 left-1/4 w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[70px] border-b-pink-500/30 animate-float"></div>
        <div className="absolute bottom-1/4 right-1/3 w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[50px] border-b-cyan-500/30 animate-float-delayed"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navigation */}
        <nav className="px-8 py-6 flex items-center justify-between">
          <div className="text-white font-bold text-xl">
            ChartAI
          </div>
          <div className="flex gap-8 text-white/80 text-sm">
            <button onClick={onNavigateToDocs} className="hover:text-white transition-colors">Documentation</button>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          </div>
          <button 
            onClick={onGetStarted}
            className="px-6 py-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-full text-sm font-medium hover:shadow-lg hover:shadow-orange-500/50 transition-all"
          >
            Get Started
          </button>
        </nav>

        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Transform Ideas<br/>
                Into Action with<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  AI Planning
                </span>
              </h1>
              
              <p className="text-white/70 text-lg leading-relaxed max-w-lg">
                Chat with AI to instantly generate comprehensive project timelines
                and Gantt charts. Simply describe your project, and watch as our
                intelligent system creates a detailed roadmap with tasks, dependencies,
                and team assignments.
              </p>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={onGetStarted}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-full font-medium hover:shadow-lg hover:shadow-orange-500/50 transition-all transform hover:scale-105"
                >
                  Start Planning
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={onNavigateToDocs}
                  className="px-8 py-3 border border-white/30 text-white rounded-full font-medium hover:bg-white/10 transition-all"
                >
                  View Docs
                </button>
              </div>
            </div>

            {/* Right Content - Gantt Chart Visualization */}
            <div className="relative">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                {/* Glowing effect behind */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 via-purple-500/30 to-pink-500/30 rounded-full blur-3xl"></div>
                
                {/* Gantt Chart representation */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="w-64 h-64 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 space-y-3">
                    {/* Simulated Gantt bars */}
                    <div className="space-y-2">
                      <div className="h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full w-3/4"></div>
                      <div className="h-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full w-full"></div>
                      <div className="h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full w-2/3"></div>
                      <div className="h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full w-5/6"></div>
                      <div className="h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full w-1/2"></div>
                    </div>
                    
                  </div>
                </div>

                {/* Floating geometric shapes */}
                <div className="absolute top-10 right-10 w-16 h-16 bg-gradient-to-br from-pink-500/40 to-purple-500/40 rounded-lg transform rotate-45 animate-float"></div>
                <div className="absolute bottom-20 left-10 w-12 h-12 bg-gradient-to-br from-cyan-500/40 to-blue-500/40 rounded-lg transform -rotate-12 animate-float-delayed"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="px-8 pb-12">
          <p className="text-center text-white/50 text-sm mb-8">
            Powered by advanced AI technology and modern web frameworks<br/>
            Built with FastAPI, React, Groq AI, and Tailwind CSS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-60">
            <div className="text-white font-semibold">FastAPI</div>
            <div className="text-white font-semibold">React</div>
            <div className="text-white font-semibold">Groq AI</div>
            <div className="text-white font-semibold">Tailwind CSS</div>
            <div className="text-white font-semibold">Vite</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative z-10 py-20 px-8">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          Intelligent Project Planning
        </h2>
        
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all group">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <div className="text-4xl">💬</div>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Conversational AI</h3>
            <p className="text-white/60">Simply chat about your project goals, timeline, and team. Our AI understands natural language and asks smart questions.</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all group">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <div className="text-4xl">📊</div>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Instant Gantt Charts</h3>
            <p className="text-white/60">Generate professional Gantt charts with tasks, dependencies, timelines, and team assignments in seconds.</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all group">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <div className="text-4xl">🎯</div>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Smart Task Planning</h3>
            <p className="text-white/60">AI automatically creates logical task sequences, assigns priorities, and calculates realistic durations based on your project type.</p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="relative z-10 py-20 px-8">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          Three Simple Steps
        </h2>
        
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              1
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Describe Your Project</h3>
              <p className="text-white/70 text-lg">Tell the AI what you want to build, your timeline, and team size. It's like chatting with a project manager.</p>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              2
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">AI Creates Your Plan</h3>
              <p className="text-white/70 text-lg">Our intelligent system analyzes your requirements and generates a comprehensive project plan with tasks and dependencies.</p>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              3
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">View & Export</h3>
              <p className="text-white/70 text-lg">Get an interactive Gantt chart you can view, customize, and use to manage your project from start to finish.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="relative z-10 px-8 py-12 flex justify-center gap-6">
        <button
          onClick={onNavigateToDocs}
          className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full border border-white/20 hover:bg-white/20 transition-all"
        >
          <BookOpen className="w-4 h-4" />
          Documentation
        </button>
        <a
          href="https://github.com/Brejesh-5784/chat"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full border border-white/20 hover:bg-white/20 transition-all"
        >
          <Github className="w-4 h-4" />
          GitHub
        </a>
      </div>
    </div>
  )
}
