import { ArrowLeft, BookOpen, Zap, MessageSquare, BarChart3, Users, Calendar, GitBranch } from 'lucide-react'

export default function DocsPage({ onBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0033] via-[#1a0052] to-[#2d1b69]">
      {/* Header */}
      <nav className="px-8 py-6 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-white font-bold text-xl">
            AI PROJECT PLANNER
          </div>
        </div>
        <div className="flex gap-4">
          <a
            href="https://github.com/Brejesh-5784/chat#readme"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm"
          >
            GitHub README
          </a>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <BookOpen className="w-12 h-12 text-cyan-400" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Documentation</h1>
          <p className="text-white/70 text-xl">Everything you need to know about AI Project Planner</p>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Overview */}
          <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <Zap className="w-8 h-8 text-yellow-400" />
              Overview
            </h2>
            <div className="text-white/80 space-y-4">
              <p>
                AI Project Planner is an intelligent project management tool that uses conversational AI
                to generate comprehensive project timelines and Gantt charts. Simply describe your project
                in natural language, and our AI will create a detailed plan with tasks, dependencies,
                team assignments, and realistic timelines.
              </p>
              <p>
                Built with FastAPI (Python backend), React (frontend), Groq AI (LLM), and modern web
                technologies, this tool streamlines project planning from hours to minutes.
              </p>
            </div>
          </section>

          {/* Key Features */}
          <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-6">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <MessageSquare className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Conversational Interface</h3>
                  <p className="text-white/70">Chat naturally with AI to describe your project. No forms, no complex inputs.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <BarChart3 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Instant Gantt Charts</h3>
                  <p className="text-white/70">Generate professional Gantt charts with visual timelines in seconds.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Users className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Team Assignment</h3>
                  <p className="text-white/70">Automatically assigns tasks to team members based on roles and project type.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <GitBranch className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Smart Dependencies</h3>
                  <p className="text-white/70">AI understands task relationships and creates logical dependency chains.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Calendar className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Realistic Timelines</h3>
                  <p className="text-white/70">Calculates accurate durations based on task complexity and project type.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Zap className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Powered by Groq AI</h3>
                  <p className="text-white/70">Uses Llama 3.3 70B model for intelligent project analysis.</p>
                </div>
              </div>
            </div>
          </section>

          {/* How to Use */}
          <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-6">How to Use</h2>
            <div className="space-y-6">
              <div className="border-l-4 border-cyan-400 pl-6">
                <h3 className="text-xl font-semibold text-white mb-2">Step 1: Start a Conversation</h3>
                <p className="text-white/70 mb-3">Click "Get Started" and begin chatting with the AI. Describe what you want to build.</p>
                <div className="bg-black/30 rounded-lg p-4 font-mono text-sm text-white/90">
                  <span className="text-cyan-400">You:</span> "I want to build a MERN stack e-commerce website"
                </div>
              </div>

              <div className="border-l-4 border-purple-400 pl-6">
                <h3 className="text-xl font-semibold text-white mb-2">Step 2: Provide Details</h3>
                <p className="text-white/70 mb-3">The AI will ask for timeline and team information. Answer naturally.</p>
                <div className="bg-black/30 rounded-lg p-4 font-mono text-sm text-white/90 space-y-2">
                  <div><span className="text-purple-400">AI:</span> "How long do you have?"</div>
                  <div><span className="text-cyan-400">You:</span> "6 weeks"</div>
                  <div><span className="text-purple-400">AI:</span> "How many team members?"</div>
                  <div><span className="text-cyan-400">You:</span> "5 developers"</div>
                </div>
              </div>

              <div className="border-l-4 border-green-400 pl-6">
                <h3 className="text-xl font-semibold text-white mb-2">Step 3: Generate Gantt Chart</h3>
                <p className="text-white/70 mb-3">Once the AI confirms your details, click "Generate Gantt Chart" to create your project plan.</p>
                <div className="bg-black/30 rounded-lg p-4 font-mono text-sm text-white/90">
                  <span className="text-purple-400">AI:</span> "Perfect! Click 'Generate Gantt Chart' to create your timeline."
                </div>
              </div>

              <div className="border-l-4 border-pink-400 pl-6">
                <h3 className="text-xl font-semibold text-white mb-2">Step 4: View Your Plan</h3>
                <p className="text-white/70">Your interactive Gantt chart will appear with all tasks, timelines, dependencies, and team assignments.</p>
              </div>
            </div>
          </section>

          {/* What Information to Provide */}
          <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-6">What Information to Provide</h2>
            <div className="space-y-4 text-white/80">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                <div>
                  <strong className="text-white">Project Goal:</strong> What you want to build (e.g., "MERN e-commerce website", "mobile app", "marketing campaign")
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                <div>
                  <strong className="text-white">Timeline:</strong> How long you have (e.g., "6 weeks", "2 months", "45 days")
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <div>
                  <strong className="text-white">Team Size:</strong> Number of people (e.g., "5 developers", "team of 8")
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-pink-400 rounded-full mt-2"></div>
                <div>
                  <strong className="text-white">Team Names (Optional):</strong> Specific names if you want (e.g., "Rohit, Rupin, and Brej")
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                <div>
                  <strong className="text-white">Tech Stack (Optional):</strong> Technologies you'll use (e.g., "React, Node.js, MongoDB")
                </div>
              </div>
            </div>
          </section>

          {/* Technical Stack */}
          <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-6">Technical Stack</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Backend</h3>
                <ul className="space-y-2 text-white/70">
                  <li>• FastAPI (Python web framework)</li>
                  <li>• Groq AI (Llama 3.3 70B model)</li>
                  <li>• Pydantic (data validation)</li>
                  <li>• CORS middleware</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Frontend</h3>
                <ul className="space-y-2 text-white/70">
                  <li>• React 18 (UI library)</li>
                  <li>• Vite (build tool)</li>
                  <li>• Tailwind CSS (styling)</li>
                  <li>• Lucide React (icons)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* API Endpoints */}
          <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-6">API Endpoints</h2>
            <div className="space-y-4">
              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-mono">POST</span>
                  <code className="text-white font-mono">/api/chat</code>
                </div>
                <p className="text-white/70 text-sm">Conversational endpoint for gathering project information</p>
              </div>

              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-mono">POST</span>
                  <code className="text-white font-mono">/api/generate-plan</code>
                </div>
                <p className="text-white/70 text-sm">Generates comprehensive project plan with Gantt chart data</p>
              </div>

              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-mono">PUT</span>
                  <code className="text-white font-mono">/api/projects/:id/tasks/:taskId</code>
                </div>
                <p className="text-white/70 text-sm">Update task details (progress, status, etc.)</p>
              </div>
            </div>
          </section>

          {/* Setup Instructions */}
          <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-6">Setup Instructions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">1. Clone the Repository</h3>
                <div className="bg-black/50 rounded-lg p-4 font-mono text-sm text-white/90">
                  git clone https://github.com/Brejesh-5784/chat.git
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">2. Backend Setup</h3>
                <div className="bg-black/50 rounded-lg p-4 font-mono text-sm text-white/90 space-y-2">
                  <div>cd backend</div>
                  <div>pip install -r requirements.txt</div>
                  <div>echo "GROQ_API_KEY=your_key_here" &gt; .env</div>
                  <div>python app.py</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">3. Frontend Setup</h3>
                <div className="bg-black/50 rounded-lg p-4 font-mono text-sm text-white/90 space-y-2">
                  <div>cd frontend</div>
                  <div>npm install</div>
                  <div>npm run dev</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">4. Get Groq API Key</h3>
                <p className="text-white/70 mb-2">Visit <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">console.groq.com</a> to get your free API key</p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">What types of projects can I plan?</h3>
                <p className="text-white/70">Any type! Software development, marketing campaigns, research projects, product launches, and more. The AI adapts to your project type.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">How accurate are the timelines?</h3>
                <p className="text-white/70">The AI generates realistic estimates based on project complexity and industry standards. You can always adjust tasks manually.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Can I export the Gantt chart?</h3>
                <p className="text-white/70">Currently, you can view the interactive chart in the browser. Export features are planned for future updates.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Is my data stored?</h3>
                <p className="text-white/70">No, all conversations and plans are session-based and not stored on servers. Your data stays private.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Can I use custom team member names?</h3>
                <p className="text-white/70">Yes! Just mention the names in your conversation (e.g., "team members are Rohit, Rupin, and Brej").</p>
              </div>
            </div>
          </section>

          {/* Support */}
          <section className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Need Help?</h2>
            <p className="text-white/70 mb-6">Check out the GitHub repository for more information, issues, and contributions.</p>
            <div className="flex gap-4 justify-center">
              <a
                href="https://github.com/Brejesh-5784/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all border border-white/20"
              >
                View on GitHub
              </a>
              <a
                href="https://github.com/Brejesh-5784/chat#readme"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-full hover:shadow-lg transition-all"
              >
                Read README
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
