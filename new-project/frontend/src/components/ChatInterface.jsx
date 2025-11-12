/**
 * ChatInterface Component
 * =======================
 * 
 * Interactive chat interface for conversational AI project planning.
 * 
 * This component provides a chat-based UI where users can describe their project
 * requirements through natural conversation with an AI assistant. The AI asks
 * targeted questions to gather:
 * - Project goals and description
 * - Timeline and duration
 * - Team size and member names
 * - Technology stack (optional)
 * 
 * Once sufficient information is collected, users can generate a complete
 * project plan with Gantt chart visualization.
 * 
 * Features:
 * - Real-time chat with AI assistant
 * - Auto-scroll to latest messages
 * - Loading states during API calls
 * - Error handling with user-friendly messages
 * - Keyboard shortcuts (Enter to send)
 * - Generate Gantt Chart button appears after conversation starts
 * 
 * Props:
 * @param {Function} onPlanGenerated - Callback when project plan is generated
 * @param {boolean} isGenerating - Loading state flag
 * @param {Function} setIsGenerating - Function to update loading state
 * 
 * @author AI Project Planner Team
 * @version 2.0
 */

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'

export default function ChatInterface({ onPlanGenerated, isGenerating, setIsGenerating }) {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  // Chat messages array with initial greeting from AI
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Hi! What project do you want to build?'
    }
  ])
  
  // Current user input text
  const [input, setInput] = useState('')
  
  // Reference to scroll to bottom of messages
  const messagesEndRef = useRef(null)

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================
  
  /**
   * Scrolls the chat view to the bottom to show latest messages
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  /**
   * Auto-scroll when new messages are added
   */
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  /**
   * Handles sending a user message to the AI chat endpoint
   * Makes API call to /api/chat and displays AI response
   */
  const handleSend = async () => {
    // Validate input
    if (!input.trim() || isGenerating) return

    // Add user message to chat
    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsGenerating(true)

    try {
      // Get API URL from environment or use default
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      
      // Call chat endpoint with conversation history
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      })

      if (!response.ok) throw new Error('Chat failed')

      // Parse and display AI response
      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (error) {
      // Show error message in chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Error. Please try again.'
      }])
    } finally {
      setIsGenerating(false)
    }
  }

  /**
   * Handles generating the Gantt chart from conversation
   * Makes API call to /api/generate-plan with full conversation history
   */
  const handleGenerateGantt = async () => {
    setIsGenerating(true)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      
      // Call generate-plan endpoint with conversation
      const response = await fetch(`${apiUrl}/api/generate-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages })
      })

      if (!response.ok) throw new Error('Failed to generate plan')

      // Parse project plan response
      const plan = await response.json()
      
      // Debug logging
      console.log('='.repeat(80))
      console.log('PLAN RECEIVED FROM BACKEND:')
      console.log(JSON.stringify(plan, null, 2))
      console.log('Number of tasks:', plan.tasks?.length || 0)
      console.log('='.repeat(80))
      
      // Pass plan to parent component
      onPlanGenerated(plan)

      // Show success message in chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `✓ ${plan.project_name}\n${plan.tasks.length} tasks • ${plan.total_duration_days} days\n\nGantt chart generated!`
      }])
    } catch (error) {
      // Show error message in chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Error generating Gantt chart. Please provide project details (goal, timeline, team size).'
      }])
    } finally {
      setIsGenerating(false)
    }
  }

  /**
   * Handles keyboard shortcuts (Enter to send message)
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-purple-200/30 flex flex-col h-[calc(100vh-180px)]">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-purple-200/30 bg-gradient-to-r from-purple-50/50 to-pink-50/50">
        <h2 className="text-lg font-semibold text-gray-900">Chat</h2>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg px-4 py-2 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' 
                : 'bg-white border border-gray-200 text-gray-800'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        
        {/* Loading Indicator */}
        {isGenerating && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
              <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
            </div>
          </div>
        )}
        
        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-purple-200/30 bg-gradient-to-r from-purple-50/30 to-pink-50/30 space-y-2">
        {/* Message Input and Send Button */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your project..."
            disabled={isGenerating}
            className="flex-1 px-3 py-2 rounded-lg border border-purple-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent disabled:bg-gray-100 text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isGenerating}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
        
        {/* Generate Gantt Chart Button (appears after first message) */}
        {messages.length > 1 && (
          <button
            onClick={handleGenerateGantt}
            disabled={isGenerating}
            className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
          >
            📊 Generate Gantt Chart
          </button>
        )}
      </div>
    </div>
  )
}
