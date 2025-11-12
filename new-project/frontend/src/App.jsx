import { useState } from 'react'
import ChatPanel from './components/ChatPanel'
import GanttChart from './components/GanttChart'
import HomePage from './components/HomePage'
import DocsPage from './components/DocsPage'
import { Calendar, ArrowLeft } from 'lucide-react'

function App() {
  const [currentView, setCurrentView] = useState('home') // 'home', 'planner', or 'docs'
  const [projectPlan, setProjectPlan] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handlePlanGenerated = (plan) => {
    setProjectPlan(plan)
  }

  const handleNewProject = () => {
    if (confirm('Start a new project? Current progress will be lost.')) {
      setProjectPlan(null)
    }
  }

  const handleGetStarted = () => {
    setCurrentView('planner')
  }

  const handleBackToHome = () => {
    if (projectPlan) {
      if (confirm('Go back to home? Current progress will be lost.')) {
        setProjectPlan(null)
        setCurrentView('home')
      }
    } else {
      setCurrentView('home')
    }
  }

  const handleNavigateToDocs = () => {
    setCurrentView('docs')
  }

  // Show home page
  if (currentView === 'home') {
    return <HomePage onGetStarted={handleGetStarted} onNavigateToDocs={handleNavigateToDocs} />
  }

  // Show docs page
  if (currentView === 'docs') {
    return <DocsPage onBack={handleBackToHome} />
  }

  // Show planner page
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0033] via-[#1a0052] to-[#2d1b69] relative overflow-hidden">
      {/* Subtle Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/20 border-b border-purple-500/20 backdrop-blur-md">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToHome}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Back to Home"
              >
                <ArrowLeft className="w-5 h-5 text-purple-300" />
              </button>
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-cyan-400" />
                <div>
                  <h1 className="text-xl font-bold text-white">AI Project Planner</h1>
                  <p className="text-sm text-purple-300/70">Simple Gantt Chart Generator</p>
                </div>
              </div>
            </div>
            {projectPlan && (
              <button
                onClick={handleNewProject}
                className="px-6 py-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all"
              >
                New Project
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-full mx-auto px-6 py-6">
        <div className="flex gap-6 transition-all duration-700 ease-in-out">
          {/* Chat Panel - Shrinks when chart is generated */}
          <div 
            className={`transition-all duration-700 ease-in-out ${
              projectPlan ? 'w-[30%]' : 'w-[50%]'
            }`}
            style={{ minWidth: projectPlan ? '350px' : '500px' }}
          >
            <ChatPanel 
              onPlanGenerated={handlePlanGenerated}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
            />
          </div>

          {/* Gantt Chart Panel - Expands when chart is generated */}
          <div 
            className={`transition-all duration-700 ease-in-out ${
              projectPlan ? 'w-[70%]' : 'w-[50%]'
            }`}
          >
            <GanttChart plan={projectPlan} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
