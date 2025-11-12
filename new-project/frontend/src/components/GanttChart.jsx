import { useState, useEffect } from 'react'
import { Calendar, CheckCircle2, Circle, TrendingUp, User, Users } from 'lucide-react'
import { format, parseISO, differenceInDays } from 'date-fns'

export default function GanttChart({ plan }) {
  const [tasks, setTasks] = useState(plan?.tasks || [])
  const [showProgress, setShowProgress] = useState(true)
  const [showTeamView, setShowTeamView] = useState(true)

  // Update tasks when plan changes
  useEffect(() => {
    if (plan?.tasks) {
      console.log('GanttChart: Updating tasks from plan', plan.tasks.length)
      setTasks(plan.tasks)
    }
  }, [plan])

  if (!plan) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-purple-200/30 h-[calc(100vh-180px)] flex items-center justify-center">
        <div className="text-center p-8">
          <Calendar className="w-12 h-12 text-purple-300 mx-auto mb-3" />
          <p className="text-gray-600">Gantt chart will appear here</p>
        </div>
      </div>
    )
  }

  const totalDays = plan.total_duration_days

  const neonColors = [
    { bg: 'bg-cyan-500', text: 'text-cyan-600', light: 'bg-cyan-50', border: 'border-cyan-200' },
    { bg: 'bg-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-50', border: 'border-emerald-200' },
    { bg: 'bg-orange-500', text: 'text-orange-600', light: 'bg-orange-50', border: 'border-orange-200' },
    { bg: 'bg-purple-500', text: 'text-purple-600', light: 'bg-purple-50', border: 'border-purple-200' },
    { bg: 'bg-pink-500', text: 'text-pink-600', light: 'bg-pink-50', border: 'border-pink-200' },
    { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-50', border: 'border-blue-200' }
  ]

  const getColorScheme = (assignee) => {
    const hash = assignee.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return neonColors[hash % neonColors.length]
  }

  const toggleTaskStatus = (taskId) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
          : task
      )
    )
  }

  const completedTasks = tasks.filter(t => t.status === 'completed').length
  const overallProgress = Math.round((completedTasks / tasks.length) * 100)

  const milestones = [
    { name: 'Project Start', percentage: 0, completed: true },
    { name: 'Planning Phase', percentage: 25, completed: overallProgress >= 25 },
    { name: 'Development Phase', percentage: 50, completed: overallProgress >= 50 },
    { name: 'Testing Phase', percentage: 75, completed: overallProgress >= 75 },
    { name: 'Project Complete', percentage: 100, completed: overallProgress >= 100 }
  ]

  const tasksByMember = {}
  tasks.forEach(task => {
    if (!tasksByMember[task.assignee]) {
      tasksByMember[task.assignee] = []
    }
    tasksByMember[task.assignee].push(task)
  })

  const teamProgress = Object.entries(tasksByMember).map(([member, memberTasks]) => {
    const completed = memberTasks.filter(t => t.status === 'completed').length
    const total = memberTasks.length
    const progress = Math.round((completed / total) * 100)
    const colorScheme = getColorScheme(member)
    
    return { member, tasks: memberTasks, completed, total, progress, colorScheme }
  })

  return (
    <div className="space-y-4">
      {/* Gantt Chart */}
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-purple-200/30">
        <div className="px-6 py-4 border-b border-purple-200/30 bg-gradient-to-r from-purple-50/50 to-pink-50/50">
          <h2 className="text-xl font-bold text-gray-900">{plan.project_name}</h2>
          <p className="text-sm text-gray-600">{plan.total_duration_days} days • {tasks.length} tasks</p>
        </div>

        {tasks.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-gray-400 mb-2">⚠️</div>
            <p className="text-gray-600 font-medium">No tasks generated</p>
            <p className="text-sm text-gray-500 mt-2">Please try generating the plan again with more details</p>
          </div>
        ) : (
          <>
            <div className="p-6 max-h-[500px] overflow-y-auto">
              <div className="mb-6 pb-3 border-b border-gray-200">
                <div className="flex justify-between text-xs text-gray-500 font-medium">
                  <span>{format(parseISO(plan.start_date), 'MMM dd, yyyy')}</span>
                  <span>{format(parseISO(plan.end_date), 'MMM dd, yyyy')}</span>
                </div>
              </div>

              <div className="space-y-6">
                {tasks.map((task) => {
              const startDay = differenceInDays(parseISO(task.start_date), parseISO(plan.start_date))
              const leftPosition = (startDay / totalDays) * 100
              const width = (task.duration_days / totalDays) * 100
              const isCompleted = task.status === 'completed'
              const colorScheme = getColorScheme(task.assignee)

              return (
                <div key={task.id}>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button onClick={() => toggleTaskStatus(task.id)} className="hover:scale-110 transition-transform">
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-300 hover:text-gray-400" />
                        )}
                      </button>
                      <div>
                        <h4 className={`text-sm font-semibold ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                          {task.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          <span className={colorScheme.text}>{task.assignee}</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{task.duration_days}d</span>
                  </div>

                  <div className="relative h-10 bg-gray-50 rounded-lg">
                    <div
                      className={`absolute h-full ${colorScheme.bg} rounded-lg transition-all duration-300 ${isCompleted ? 'opacity-40' : 'opacity-100'}`}
                      style={{ left: `${leftPosition}%`, width: `${width}%` }}
                    >
                      <div className="h-full flex items-center justify-center text-white text-xs font-bold px-3">
                        {task.duration_days > 2 && `${task.duration_days}d`}
                      </div>
                      {isCompleted && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-purple-200/30 bg-gradient-to-r from-purple-50/30 to-pink-50/30">
              <div className="flex flex-wrap gap-4 text-xs">
                {plan.team_members.map((member, idx) => {
                  const colorScheme = getColorScheme(member)
                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <div className={`w-3 h-3 ${colorScheme.bg} rounded`}></div>
                      <span className="text-gray-700 font-medium">{member}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Progress Overview */}
      {showProgress && (
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-purple-200/30 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-cyan-600" />
              <h3 className="text-xl font-bold text-gray-900">Project Progress</h3>
            </div>
            <button onClick={() => setShowProgress(false)} className="text-xs text-gray-500 hover:text-gray-700">
              Hide
            </button>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Overall Completion</span>
              <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600">{overallProgress}%</span>
            </div>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-500" style={{ width: `${overallProgress}%` }}></div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Milestones</h4>
            {milestones.map((milestone, idx) => (
              <div key={idx} className="flex items-center gap-4">
                {milestone.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-300 flex-shrink-0" />
                )}
                <div className="flex-1 flex items-center justify-between">
                  <span className={`text-sm ${milestone.completed ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                    {milestone.name}
                  </span>
                  <span className="text-xs text-gray-500">{milestone.percentage}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{completedTasks}</div>
              <div className="text-xs text-gray-600 mt-1">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{tasks.length - completedTasks}</div>
              <div className="text-xs text-gray-600 mt-1">Remaining</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-600">{tasks.length}</div>
              <div className="text-xs text-gray-600 mt-1">Total</div>
            </div>
          </div>
        </div>
      )}

      {!showProgress && (
        <button onClick={() => setShowProgress(true)} className="w-full py-3 bg-white/80 backdrop-blur-sm border border-purple-200/30 text-cyan-600 rounded-xl text-sm font-semibold hover:bg-white transition-all shadow-md">
          Show Progress Tracker
        </button>
      )}

      {/* Team Member Progress */}
      {showTeamView && (
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-purple-200/30 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-900">Team Member Progress</h3>
            </div>
            <button onClick={() => setShowTeamView(false)} className="text-xs text-gray-500 hover:text-gray-700">
              Hide
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {teamProgress.map(({ member, tasks: memberTasks, completed, total, progress, colorScheme }) => (
              <div key={member} className={`border-2 ${colorScheme.border} ${colorScheme.light} rounded-xl p-5 hover:shadow-lg transition-shadow`}>
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-12 h-12 ${colorScheme.bg} rounded-full flex items-center justify-center shadow-md`}>
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg">{member}</h4>
                    <p className="text-xs text-gray-600">{total} {total === 1 ? 'task' : 'tasks'}</p>
                  </div>
                  <div className={`text-3xl font-bold ${colorScheme.text}`}>{progress}%</div>
                </div>

                <div className="mb-5">
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${colorScheme.bg} transition-all duration-500`} style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-2">
                    <span>{completed} done</span>
                    <span>{total - completed} left</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {memberTasks.map(task => (
                    <div key={task.id} className="flex items-center gap-3 text-sm bg-white rounded-lg p-3 border border-gray-100">
                      <button onClick={() => toggleTaskStatus(task.id)} className="hover:scale-110 transition-transform">
                        {task.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-300 hover:text-gray-400" />
                        )}
                      </button>
                      <span className={`flex-1 ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                        {task.name}
                      </span>
                      <span className="text-xs text-gray-500">{task.duration_days}d</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!showTeamView && (
        <button onClick={() => setShowTeamView(true)} className="w-full py-3 bg-white/80 backdrop-blur-sm border border-purple-200/30 text-purple-600 rounded-xl text-sm font-semibold hover:bg-white transition-all shadow-md">
          Show Team Member Progress
        </button>
      )}
    </div>
  )
}
