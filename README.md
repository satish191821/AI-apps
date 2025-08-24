
# 🚀 React Todo List App

A modern, feature-rich todo list application built with React, Vite, and JavaScript. Perfect for B.Tech students learning web development!

## ✨ Features

- ✅ Add, edit, and delete todos
- 🏷️ Categorize tasks (work, personal, shopping, health, other)
- 🎯 Set priority levels (low, medium, high)
- 📅 Due date management with overdue warnings
- 🔍 Search and filter functionality
- 📊 Progress statistics and completion tracking
- 💾 Local storage persistence
- 🤖 AI Assistant for productivity tips
- 📱 Fully responsive design
- 🎨 Modern gradient UI with animations

## 🛠️ Tech Stack & Dependencies

### Core Technologies
- **React**: ^19.1.1
- **React DOM**: ^19.1.1
- **Vite**: ^6.2.2 (Build tool)
- **JavaScript (ES6+)**: Modern JavaScript with JSX

### Development Dependencies
- **@vitejs/plugin-react**: ^5.0.1
- **@types/react**: ^19.1.11
- **@types/react-dom**: ^19.1.7

### Build Tool
- **Vite**: Fast build tool and development server
- **Node.js**: 22+ (handled by Replit)

## 📁 Project Structure

```
react-todo-app/
├── src/
│   ├── App.jsx          # Main React component
│   ├── App.css          # Component styles
│   ├── main.jsx         # React app entry point
│   └── index.css        # Global styles
├── public/
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
└── README.md           # This file
```

## 🚀 Installation & Setup

### Option 1: Run on Replit (Recommended)
1. Fork this Replit project
2. Click the **Run** button
3. The app will automatically install dependencies and start
4. Open the webview to see your todo app!

### Option 2: Local Development
1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd react-todo-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📜 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run serve
```

## 🎯 How to Use

### Adding Todos
1. Enter your task in the input field
2. Select a category (work, personal, shopping, health, other)
3. Choose priority level (low, medium, high)
4. Set due date (optional)
5. Click "Add Todo" or press Enter

### Managing Todos
- **Complete**: Click the checkbox to mark as done
- **Edit**: Click the edit button (pencil icon) to modify text
- **Delete**: Click the delete button (trash icon) to remove
- **Filter**: Use category, priority, and status filters
- **Search**: Use the search bar to find specific todos
- **Sort**: Choose sorting by creation date, due date, or priority

### AI Assistant
- Click the "🤖 AI Helper" button to open the assistant
- Ask for productivity tips, task analysis, or help with prioritization
- Try questions like:
  - "What should I focus on?"
  - "How am I doing?"
  - "Give me productivity tips"

## 🎨 Features Breakdown

### 📊 Statistics Dashboard
- Total tasks counter
- Active vs completed ratio
- Overdue task warnings
- Progress tracking

### 🔍 Advanced Filtering
- Filter by category
- Filter by priority level
- Filter by completion status
- Real-time search functionality

### 💾 Data Persistence
- Automatically saves to browser localStorage
- Data persists between sessions
- No external database required

### 📱 Responsive Design
- Works on desktop, tablet, and mobile
- Touch-friendly interface
- Adaptive layout

## 🎓 Learning Objectives (For Students)

This project demonstrates:
- **React Hooks**: useState, useEffect
- **State Management**: Managing complex state
- **Local Storage**: Browser storage APIs
- **Event Handling**: User interactions
- **Array Methods**: filter, map, reduce
- **CSS Flexbox/Grid**: Modern layouts
- **Responsive Design**: Mobile-first approach
- **Component Architecture**: Reusable components

## 🔧 Customization

### Adding New Categories
Edit the `categories` array in `App.jsx`:
```javascript
const categories = ['work', 'personal', 'shopping', 'health', 'study', 'other']
```

### Changing Colors
Modify CSS variables in `App.css`:
```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
}
```

### Adding New Features
- Extend the todo object structure
- Add new state variables
- Create additional filter options

## 🐛 Troubleshooting

### Common Issues
1. **App not loading**: Make sure all dependencies are installed
2. **Hot reload not working**: Restart the development server
3. **Styles not updating**: Clear browser cache
4. **AI Assistant not responding**: Check console for errors

### Debug Mode
Open browser DevTools (F12) to see console logs and debug issues.

## 📚 Next Steps & Enhancements

### Beginner Level
- Add task notes/descriptions
- Include task completion time tracking
- Add more color themes

### Intermediate Level
- Implement drag-and-drop reordering
- Add task templates
- Include productivity analytics

### Advanced Level
- Add user authentication
- Implement cloud sync
- Create team collaboration features

## 🤝 Contributing

1. Fork the project
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is created for educational purposes. Feel free to use and modify for learning!

## 👨‍💻 Author

Created by a B.Tech student as a learning project showcasing modern React development practices.

---

**Happy Coding! 🚀**

*Built with ❤️ using React and Vite*
