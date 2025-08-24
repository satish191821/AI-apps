
import React, { useState, useEffect } from 'react'
import './App.css'

function App() {
  // State variables to manage the todo app data and UI
  const [todos, setTodos] = useState([]) // Array to store all todo items
  const [inputValue, setInputValue] = useState('') // Text input for new todos
  const [selectedCategory, setSelectedCategory] = useState('') // Category for new todo
  const [selectedPriority, setSelectedPriority] = useState('medium') // Priority for new todo
  const [dueDate, setDueDate] = useState('') // Due date for new todo
  const [searchTerm, setSearchTerm] = useState('') // Search filter text
  const [filterCategory, setFilterCategory] = useState('all') // Category filter
  const [filterPriority, setFilterPriority] = useState('all') // Priority filter
  const [filterStatus, setFilterStatus] = useState('all') // Status filter (completed/active)
  const [sortBy, setSortBy] = useState('created') // Sort option
  const [isEditing, setIsEditing] = useState(null) // ID of todo being edited
  const [editValue, setEditValue] = useState('') // Text for editing todo
  const [showAI, setShowAI] = useState(false) // Show/hide AI assistant
  const [aiMessages, setAiMessages] = useState([]) // AI chat messages
  const [aiInput, setAiInput] = useState('') // AI chat input

  // Available categories and priorities for todos
  const categories = ['work', 'personal', 'shopping', 'health', 'other']
  const priorities = ['low', 'medium', 'high']

  // Load saved todos from browser storage when app starts
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  // Save todos to browser storage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  // Function to add a new todo item
  const addTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodo = {
        id: Date.now(), // Unique ID using timestamp
        text: inputValue,
        completed: false,
        category: selectedCategory || 'other',
        priority: selectedPriority,
        dueDate: dueDate,
        createdAt: new Date(),
        completedAt: null
      }
      setTodos([...todos, newTodo]) // Add new todo to existing list
      
      // Reset form fields after adding
      setInputValue('')
      setSelectedCategory('')
      setSelectedPriority('medium')
      setDueDate('')
    }
  }

  // Function to delete a todo by ID
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  // Function to toggle completion status of a todo
  const toggleComplete = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { 
        ...todo, 
        completed: !todo.completed,
        completedAt: !todo.completed ? new Date() : null
      } : todo
    ))
  }

  // Function to start editing a todo
  const startEdit = (id, text) => {
    setIsEditing(id)
    setEditValue(text)
  }

  // Function to save edited todo
  const saveEdit = (id) => {
    if (editValue.trim() !== '') {
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, text: editValue } : todo
      ))
    }
    setIsEditing(null)
    setEditValue('')
  }

  // Function to cancel editing
  const cancelEdit = () => {
    setIsEditing(null)
    setEditValue('')
  }

  // Handle keyboard shortcuts (Enter to save/add, Escape to cancel)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (isEditing) {
        saveEdit(isEditing)
      } else {
        addTodo()
      }
    } else if (e.key === 'Escape') {
      cancelEdit()
    }
  }

  // Function to remove all completed todos
  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed))
  }

  // Check if a todo is overdue
  const isOverdue = (dueDate) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date().setHours(0, 0, 0, 0)
  }

  // Check if a todo is due soon (today or tomorrow)
  const isDueSoon = (dueDate) => {
    if (!dueDate) return false
    const due = new Date(dueDate)
    const today = new Date().setHours(0, 0, 0, 0)
    const tomorrow = new Date(today + 24 * 60 * 60 * 1000)
    return due >= today && due <= tomorrow
  }

  // Filter and sort todos based on user preferences
  const filteredTodos = todos
    .filter(todo => {
      const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filterCategory === 'all' || todo.category === filterCategory
      const matchesPriority = filterPriority === 'all' || todo.priority === filterPriority
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'completed' && todo.completed) ||
        (filterStatus === 'active' && !todo.completed)
      
      return matchesSearch && matchesCategory && matchesPriority && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate) - new Date(b.dueDate)
        case 'category':
          return a.category.localeCompare(b.category)
        default:
          return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })

  // Enhanced AI assistant with better context awareness and responses
  const getAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase().trim()
    
    // Calculate current stats for context-aware responses
    const completedCount = todos.filter(todo => todo.completed).length
    const activeCount = todos.filter(todo => !todo.completed).length
    const overdueCount = todos.filter(todo => !todo.completed && isOverdue(todo.dueDate)).length
    const dueSoonCount = todos.filter(todo => !todo.completed && isDueSoon(todo.dueDate)).length
    const highPriorityCount = todos.filter(todo => !todo.completed && todo.priority === 'high').length
    
    // Greeting responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      const timeOfDay = new Date().getHours()
      const greeting = timeOfDay < 12 ? 'Good morning!' : timeOfDay < 17 ? 'Good afternoon!' : 'Good evening!'
      
      if (todos.length === 0) {
        return `${greeting} 👋 I'm your smart todo assistant! Ready to help you get organized? Start by adding your first task!`
      } else {
        return `${greeting} 👋 You currently have ${activeCount} active tasks${overdueCount > 0 ? ` (${overdueCount} overdue)` : ''}. How can I help you stay productive today?`
      }
    }
    
    // Help and commands
    if (message.includes('help') || message.includes('what can you do') || message.includes('commands')) {
      return `🤖 I'm your intelligent todo assistant! Here's what I can help with:\n\n📊 **Analysis**: Ask about your progress, overdue tasks, or productivity patterns\n⚡ **Suggestions**: Get smart recommendations for task prioritization\n💡 **Tips**: Productivity advice tailored to your current workload\n🎯 **Focus**: Help you identify what to work on next\n📈 **Motivation**: Celebrate achievements and provide encouragement\n\nTry asking: "What should I focus on?" or "How am I doing?"`
    }
    
    // Current status and analysis
    if (message.includes('status') || message.includes('how am i doing') || message.includes('progress') || message.includes('summary')) {
      let response = `📊 **Your Todo Status:**\n\n`
      
      if (todos.length === 0) {
        return `📊 You have a clean slate! No todos yet. This is a great time to plan your day or week. What would you like to accomplish?`
      }
      
      response += `• Total tasks: ${todos.length}\n`
      response += `• Completed: ${completedCount} (${Math.round(completedCount/todos.length * 100)}%)\n`
      response += `• Active: ${activeCount}\n`
      
      if (overdueCount > 0) {
        response += `• ⚠️ Overdue: ${overdueCount}\n`
      }
      if (dueSoonCount > 0) {
        response += `• ⏰ Due soon: ${dueSoonCount}\n`
      }
      if (highPriorityCount > 0) {
        response += `• 🔴 High priority: ${highPriorityCount}\n`
      }
      
      // Add motivational message
      if (completedCount > activeCount) {
        response += `\n🎉 Great job! You're crushing it with more completed than active tasks!`
      } else if (overdueCount === 0) {
        response += `\n✨ Excellent! No overdue tasks - you're staying on top of things!`
      } else if (overdueCount > 3) {
        response += `\n🚨 You have quite a few overdue tasks. Consider reviewing deadlines or breaking large tasks into smaller ones.`
      }
      
      return response
    }
    
    // Focus and what to work on next
    if (message.includes('focus') || message.includes('what should i work on') || message.includes('next task') || message.includes('prioritize')) {
      if (activeCount === 0) {
        return `🎯 All caught up! No active tasks right now. Perfect time to:\n• Plan upcoming projects\n• Set new goals\n• Take a well-deserved break\n• Review and celebrate your achievements!`
      }
      
      let response = `🎯 **Here's what I recommend focusing on:**\n\n`
      
      // Prioritize overdue tasks first
      if (overdueCount > 0) {
        const overdueTask = todos.find(todo => !todo.completed && isOverdue(todo.dueDate))
        response += `🚨 **URGENT**: Handle overdue tasks first!\n`
        response += `Start with: "${overdueTask?.text}" (${overdueTask?.category})\n\n`
      }
      
      // Then due soon tasks
      if (dueSoonCount > 0 && overdueCount === 0) {
        const dueSoonTask = todos.find(todo => !todo.completed && isDueSoon(todo.dueDate))
        response += `⏰ **TIME-SENSITIVE**: Due soon tasks\n`
        response += `Focus on: "${dueSoonTask?.text}" (due ${dueSoonTask?.dueDate})\n\n`
      }
      
      // High priority tasks
      if (highPriorityCount > 0 && overdueCount === 0) {
        const highPriorityTask = todos.find(todo => !todo.completed && todo.priority === 'high')
        response += `🔴 **HIGH IMPACT**: "${highPriorityTask?.text}"\n`
        response += `Category: ${highPriorityTask?.category}\n\n`
      }
      
      // General advice
      if (overdueCount === 0 && dueSoonCount === 0) {
        response += `💡 **Tip**: Start with high-priority tasks or tackle quick wins to build momentum!`
      }
      
      return response
    }
    
    // Productivity tips based on current situation
    if (message.includes('tips') || message.includes('productivity') || message.includes('advice')) {
      let tips = [`💡 **Smart Productivity Tips:**\n\n`]
      
      if (overdueCount > 2) {
        tips.push(`🚨 **For Overdue Tasks**: Break them into smaller, 15-minute chunks. Often we avoid tasks because they feel overwhelming.`)
      }
      
      if (highPriorityCount > 5) {
        tips.push(`⚡ **Priority Management**: You have many high-priority tasks. Consider if they're all truly urgent - use the Eisenhower Matrix!`)
      }
      
      if (todos.length > 20) {
        tips.push(`📝 **Task Overload**: You have many tasks! Try the "Rule of 3" - focus on just 3 important tasks per day.`)
      }
      
      // General tips
      const generalTips = [
        `🍅 **Pomodoro Technique**: Work in 25-minute focused bursts with 5-minute breaks`,
        `🎯 **2-Minute Rule**: If it takes less than 2 minutes, do it immediately`,
        `📅 **Time Blocking**: Schedule specific times for different types of tasks`,
        `🔄 **Weekly Review**: Spend 15 minutes each week reviewing and planning`,
        `🏆 **Celebrate Wins**: Acknowledge completed tasks - even small ones!`
      ]
      
      tips.push(generalTips[Math.floor(Math.random() * generalTips.length)])
      return tips.join('\n')
    }
    
    // Motivational responses
    if (message.includes('motivation') || message.includes('encourage') || message.includes('struggling')) {
      const motivations = [
        `💪 You've got this! Remember, progress isn't about perfection - it's about consistency.`,
        `🌟 Every completed task is a step forward. You're building momentum one todo at a time!`,
        `🎯 Focus on progress, not perfection. You're doing better than you think!`,
        `⭐ Great things are built one task at a time. Keep going - you're making it happen!`,
        `🚀 You're not behind - you're exactly where you need to be. Keep moving forward!`
      ]
      
      let response = motivations[Math.floor(Math.random() * motivations.length)]
      
      if (completedCount > 0) {
        response += `\n\n🏆 You've already completed ${completedCount} tasks - that's proof you can do this!`
      }
      
      return response
    }
    
    // Category and organization advice
    if (message.includes('organize') || message.includes('categories') || message.includes('structure')) {
      return `📂 **Smart Organization Tips:**\n\n🏢 **Work**: Professional tasks, meetings, deadlines\n👤 **Personal**: Self-care, hobbies, personal goals\n🛒 **Shopping**: Groceries, household items, purchases\n🏥 **Health**: Exercise, appointments, wellness activities\n📌 **Other**: Miscellaneous tasks that don't fit elsewhere\n\n💡 **Pro tip**: Use the priority levels within each category - not everything needs to be high priority!`
    }
    
    // Celebration and achievement
    if (message.includes('done') || message.includes('finished') || message.includes('completed') || message.includes('celebrate')) {
      if (completedCount === 0) {
        return `🎯 Ready to tackle your first task? I'm here to cheer you on! Every journey starts with a single step.`
      } else if (completedCount >= todos.length * 0.8) {
        return `🎉 **AMAZING!** You've completed ${Math.round(completedCount/todos.length * 100)}% of your tasks! You're absolutely crushing it! 🏆`
      } else {
        return `🎊 Fantastic work! ${completedCount} tasks completed! Each one brings you closer to your goals. Keep that momentum going! 💪`
      }
    }
    
    // Time management
    if (message.includes('time') || message.includes('deadline') || message.includes('schedule')) {
      if (dueSoonCount > 0) {
        return `⏰ **Time Management Alert**: You have ${dueSoonCount} tasks due soon. Consider time-blocking your calendar to ensure you have dedicated time for these important tasks!`
      } else if (overdueCount > 0) {
        return `🚨 **Deadline Recovery**: ${overdueCount} tasks are overdue. Try the "Debt Snowball" method - tackle the smallest overdue task first to build momentum!`
      } else {
        return `✅ **Great Timing!** No urgent deadlines right now. Perfect opportunity to work ahead or tackle those important-but-not-urgent tasks!`
      }
    }
    
    // Smart contextual responses
    if (message.includes('overwhelmed') || message.includes('too much') || message.includes('stressed')) {
      return `🌱 **Take a breath** - feeling overwhelmed is normal! Try this:\n\n1️⃣ **Brain dump**: Add any floating thoughts as todos\n2️⃣ **Prioritize ruthlessly**: What absolutely must happen today?\n3️⃣ **Start small**: Pick the easiest task to build momentum\n4️⃣ **Break it down**: Turn big tasks into smaller, manageable steps\n\nYou don't have to do everything at once. One step at a time! 🌟`
    }
    
    // Fun and casual responses
    if (message.includes('boring') || message.includes('fun') || message.includes('game')) {
      return `🎮 **Gamify your productivity!**\n\n🏆 **Challenge yourself**: Complete 3 tasks in a row for a "streak bonus"\n⭐ **Point system**: High priority = 3 points, Medium = 2, Low = 1\n🎯 **Daily quest**: Set a goal to earn 10 points today\n🥇 **Achievement unlocked**: Celebrate when you complete all tasks in a category!\n\nTurn your todo list into your personal productivity game! 🚀`
    }
    
    // Default intelligent response
    const responses = [
      `🤖 I'm your smart todo assistant! I can analyze your tasks, suggest what to focus on, provide productivity tips, and help you stay motivated. What specific help do you need?`,
      `💡 I'm here to help you be more productive! Try asking me "What should I focus on?" or "How am I doing?" for personalized insights based on your current todos.`,
      `🎯 I can provide intelligent insights about your tasks! Ask me about your progress, what to prioritize, or request productivity tips tailored to your current workload.`
    ]
    
    return responses[Math.floor(Math.random() * responses.length)]
  }

  // Handle AI chat
  const sendAIMessage = () => {
    if (aiInput.trim() === '') return
    
    const userMessage = { type: 'user', text: aiInput, timestamp: new Date() }
    const aiResponse = { type: 'ai', text: getAIResponse(aiInput), timestamp: new Date() }
    
    setAiMessages(prev => [...prev, userMessage, aiResponse])
    setAiInput('')
  }

  // Calculate statistics for display
  const stats = {
    total: todos.length,
    completed: todos.filter(todo => todo.completed).length,
    active: todos.filter(todo => !todo.completed).length,
    overdue: todos.filter(todo => !todo.completed && isOverdue(todo.dueDate)).length
  }

  return (
    <div className="app">
      {/* Header section with title and statistics */}
      <header className="app-header">
        <h1>✨ My Awesome Todo App</h1>
        <p className="subtitle">Stay organized and productive!</p>
        <div className="stats">
          <div className="stat-card">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.active}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
          {stats.overdue > 0 && (
            <div className="stat-card overdue">
              <span className="stat-number">{stats.overdue}</span>
              <span className="stat-label">Overdue</span>
            </div>
          )}
        </div>
      </header>

      {/* Input section for adding new todos */}
      <div className="input-section">
        <div className="input-container">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="What do you need to do today? ✍️"
            className="todo-input"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="">📂 Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="priority-select"
          >
            {priorities.map(priority => (
              <option key={priority} value={priority}>
                🚨 {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="date-input"
            title="Set due date"
          />
          <button onClick={addTodo} className="add-btn">
            ➕ Add Todo
          </button>
        </div>
      </div>

      {/* Filters and search section */}
      <div className="filters-section">
        <div className="search-container">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Search your todos..."
            className="search-input"
          />
        </div>
        
        <div className="filters-container">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Priorities</option>
            {priorities.map(priority => (
              <option key={priority} value={priority}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="created">🕒 Sort by Created</option>
            <option value="priority">⚡ Sort by Priority</option>
            <option value="dueDate">📅 Sort by Due Date</option>
            <option value="category">📂 Sort by Category</option>
          </select>
        </div>

        {stats.completed > 0 && (
          <button onClick={clearCompleted} className="clear-btn">
            🗑️ Clear Completed ({stats.completed})
          </button>
        )}
      </div>

      {/* Todo list display */}
      <ul className="todo-list">
        {filteredTodos.map(todo => (
          <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''} priority-${todo.priority} ${isOverdue(todo.dueDate) && !todo.completed ? 'overdue' : ''} ${isDueSoon(todo.dueDate) && !todo.completed ? 'due-soon' : ''}`}>
            <div className="todo-content">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo.id)}
                className="todo-checkbox"
              />
              
              {/* Show edit form or todo text */}
              {isEditing === todo.id ? (
                <div className="edit-container">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="edit-input"
                    autoFocus
                  />
                  <button onClick={() => saveEdit(todo.id)} className="save-btn">💾 Save</button>
                  <button onClick={cancelEdit} className="cancel-btn">❌ Cancel</button>
                </div>
              ) : (
                <>
                  <span className="todo-text" onDoubleClick={() => startEdit(todo.id, todo.text)}>
                    {todo.text}
                  </span>
                  <div className="todo-meta">
                    <span className={`category category-${todo.category}`}>
                      📂 {todo.category}
                    </span>
                    <span className={`priority priority-${todo.priority}`}>
                      {todo.priority === 'high' ? '🔴' : todo.priority === 'medium' ? '🟡' : '🟢'} {todo.priority}
                    </span>
                    {todo.dueDate && (
                      <span className={`due-date ${isOverdue(todo.dueDate) && !todo.completed ? 'overdue' : ''} ${isDueSoon(todo.dueDate) && !todo.completed ? 'due-soon' : ''}`}>
                        📅 Due: {new Date(todo.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
            
            {/* Action buttons */}
            <div className="todo-actions">
              {!isEditing && (
                <button 
                  onClick={() => startEdit(todo.id, todo.text)}
                  className="edit-btn"
                  title="Click to edit or double-click text"
                >
                  ✏️ Edit
                </button>
              )}
              <button 
                onClick={() => deleteTodo(todo.id)}
                className="delete-btn"
              >
                🗑️ Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Empty state messages */}
      {filteredTodos.length === 0 && todos.length > 0 && (
        <div className="empty-state">
          <p>🔍 No todos match your current filters.</p>
          <p>Try adjusting your search or filter settings!</p>
        </div>
      )}

      {todos.length === 0 && (
        <div className="empty-state">
          <p>🎉 Welcome to your Todo App!</p>
          <p>Add your first todo above to get started!</p>
        </div>
      )}

      {/* AI Assistant Toggle Button */}
      <button 
        className="ai-toggle-btn"
        onClick={() => setShowAI(!showAI)}
        title="AI Assistant"
      >
        🤖 AI Helper
      </button>

      {/* AI Assistant Chat Interface */}
      {showAI && (
        <div className="ai-assistant">
          <div className="ai-header">
            <h3>🤖 AI Todo Assistant</h3>
            <button 
              className="ai-close-btn"
              onClick={() => setShowAI(false)}
            >
              ✕
            </button>
          </div>
          
          <div className="ai-messages">
            {aiMessages.length === 0 && (
              <div className="ai-welcome">
                <p>👋 Hi! I'm your AI todo assistant!</p>
                <p>Ask me about productivity tips, task priorities, or anything todo-related!</p>
              </div>
            )}
            
            {aiMessages.map((message, index) => (
              <div key={index} className={`ai-message ${message.type}`}>
                <div className="message-content">
                  {message.text.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
          
          <div className="ai-input-container">
            <input
              type="text"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendAIMessage()}
              placeholder="Ask me anything about your todos..."
              className="ai-input"
            />
            <button 
              onClick={sendAIMessage}
              className="ai-send-btn"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
