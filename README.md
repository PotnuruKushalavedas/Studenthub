# Student Dashboard Web Application

A comprehensive web application for managing student academic journeys, featuring course tracking, project management, internship records, and AI-powered academic assistance.

## Features

### Core Modules

#### 1. **Profile Management**
- Complete student profile setup with personal information
- Track GPA, graduation date, major, and skills
- Profile picture upload and management
- Edit profile information anytime

#### 2. **Projects Module**
- Create and manage portfolio projects
- Track project technologies and links
- Set project start/end dates and status
- Store GitHub and live project links
- Delete projects when needed

#### 3. **Internships Module**
- Record internship experiences
- Track company, position, and location
- Document skills learned during internships
- Mark internships as ongoing or completed
- Maintain comprehensive internship history

#### 4. **Courses & Attendance**
- Enroll in and track courses
- Record grades and semester information
- Track course credits and instructor details
- Mark attendance for each class
- View attendance statistics per course

#### 5. **Assignments Module**
- Create assignments linked to courses
- Track due dates and submission status
- Record grades and feedback
- Monitor assignment completion rates
- Filter by course and status

#### 6. **Analytics & Dashboard**
- Visual dashboard with productivity metrics
- GPA tracking and grade distribution charts
- Project and assignment completion rates
- Attendance overview and statistics
- Productivity score calculation

### Advanced Features

#### 7. **Attendance Tracking**
- Record daily attendance for courses
- Mark attendance as Present, Absent, or Late
- View attendance history and statistics
- Track attendance trends per course
- Export attendance reports

#### 8. **PDF Export**
- Export complete profile data to PDF
- Export analytics and progress reports
- Export attendance records
- Professional formatted documents
- One-click PDF generation

#### 9. **AI Academic Assistant**
- Chat with AI-powered academic advisor
- Get study tips and time management suggestions
- Receive project ideas and implementation advice
- Ask career and internship guidance questions
- Available 24/7 with floating chat widget

#### 10. **Dark Mode**
- Toggle between light and dark themes
- Persistent theme preference stored locally
- System preference detection on first visit
- Smooth theme transitions
- Dark mode optimized for reduced eye strain

### Authentication & Security

- **Email/Password Authentication**: Secure login with email verification
- **Google OAuth**: One-click Google login integration
- **Row Level Security**: All data isolated by user with RLS policies
- **Secure Sessions**: HTTP-only cookies for session management
- **Password Protection**: Bcrypt hashing for all passwords

## Tech Stack

### Frontend
- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS v4**: Utility-first styling with dark mode support
- **Shadcn/UI**: High-quality component library
- **Lucide Icons**: Beautiful icon system

### Backend & Database
- **Supabase**: PostgreSQL database with built-in auth
- **Supabase Auth**: Authentication with OAuth support
- **Row Level Security (RLS)**: Data isolation policies

### AI & Advanced Features
- **Vercel AI SDK v6**: Streaming AI responses
- **OpenAI GPT-4o-mini**: AI model for academic assistance
- **jsPDF**: PDF generation
- **html2canvas**: HTML to image conversion for PDFs

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm package manager
- Supabase account (configured)
- OpenAI API key (for AI assistant)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd student-dashboard
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables in Vercel project settings:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

### Tables
- **profiles**: Student profile information
- **projects**: Portfolio projects
- **internships**: Internship experiences
- **courses**: Enrolled courses
- **assignments**: Course assignments
- **attendance**: Class attendance records
- **analytics**: Aggregated user statistics

All tables include:
- Automatic timestamps (created_at, updated_at)
- User isolation via Row Level Security (RLS)
- Proper indexing for performance
- Foreign key constraints for data integrity

## File Structure

```
├── app/
│   ├── layout.tsx                 # Root layout with providers
│   ├── page.tsx                   # Landing page
│   ├── login/page.tsx             # Login page
│   ├── signup/page.tsx            # Signup page
│   ├── auth/callback/route.ts     # OAuth callback
│   ├── api/
│   │   └── chat/route.ts          # AI chat API
│   └── dashboard/
│       ├── page.tsx               # Dashboard overview
│       ├── profile/page.tsx       # Profile management
│       ├── projects/              # Projects CRUD
│       ├── internships/           # Internships CRUD
│       ├── courses/               # Courses CRUD
│       ├── assignments/           # Assignments CRUD
│       ├── attendance/            # Attendance tracking
│       ├── analytics/page.tsx     # Analytics & insights
│       └── settings/page.tsx      # Settings
├── components/
│   ├── profile-form.tsx           # Profile editor
│   ├── projects-list.tsx          # Projects list
│   ├── project-form.tsx           # Project creator
│   ├── internships-list.tsx       # Internships list
│   ├── internship-form.tsx        # Internship creator
│   ├── courses-list.tsx           # Courses list
│   ├── course-form.tsx            # Course creator
│   ├── assignments-list.tsx       # Assignments list
│   ├── assignment-form.tsx        # Assignment creator
│   ├── attendance-list.tsx        # Attendance tracker
│   ├── attendance-form.tsx        # Attendance recorder
│   ├── ai-assistant.tsx           # AI chat widget
│   ├── export-data-button.tsx     # PDF export
│   ├── theme-toggle.tsx           # Dark mode toggle
│   ├── dashboard-nav.tsx          # Top navigation
│   ├── dashboard-sidebar.tsx      # Side navigation
│   └── protected-route.tsx        # Route protection
└── lib/
    ├── supabase.ts                # Supabase client
    ├── auth-context.tsx           # Auth provider
    ├── theme-context.tsx          # Theme provider
```

## Usage Guide

### Creating a Student Profile
1. Sign up with email or Google
2. Navigate to Profile from the sidebar
3. Fill in your personal information, GPA, and skills
4. Click Save to update your profile

### Adding Projects
1. Go to Projects section
2. Click "New Project"
3. Fill in project details (title, technologies, links)
4. Set project start/end dates
5. Save and view in your projects list

### Tracking Attendance
1. Navigate to Attendance section
2. Click "Mark Attendance"
3. Select course and attendance status
4. Save the attendance record
5. View statistics in the analytics page

### Using the AI Assistant
1. Click the chat bubble in the bottom-right corner
2. Ask academic or career-related questions
3. Get AI-powered suggestions and advice
4. Chat history is maintained during the session

### Exporting Data to PDF
1. Go to Profile page
2. Click "Export to PDF" button
3. Select what data to include
4. Generated PDF will auto-download

## API Endpoints

### Chat API
- **POST /api/chat**: Send message to AI assistant
  - Request body: `{ messages: Array<{role: string, content: string}> }`
  - Response: Streaming text response

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Set environment variables in Vercel project settings
4. Deploy - Vercel will automatically detect Next.js

```bash
vercel deploy
```

## Security & Best Practices

- **Row Level Security**: All tables have RLS policies to ensure users only see their own data
- **CORS Protection**: Supabase handles CORS automatically
- **Input Validation**: All forms validate user input before submission
- **Error Handling**: Comprehensive error messages and fallbacks
- **Type Safety**: Full TypeScript coverage for type checking

## Troubleshooting

### Authentication Issues
- Ensure Supabase credentials are correctly set
- Check that Google OAuth is configured in Supabase
- Verify OpenAI API key is set for AI assistant

### Database Issues
- Check RLS policies are enabled on all tables
- Verify foreign key relationships are intact
- Ensure user has proper permissions in Supabase

### Styling Issues
- Clear browser cache if dark mode doesn't work
- Verify Tailwind CSS is properly configured
- Check that theme provider is wrapping the app

## Support

For issues or questions:
1. Check this README first
2. Review Supabase documentation at supabase.com
3. Check OpenAI API documentation at platform.openai.com
4. Visit Next.js documentation at nextjs.org

## License

MIT License - Feel free to use this project for personal or commercial use.

## Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Future Enhancements

- Integration with Google Calendar for schedule sync
- Peer collaboration features
- Grade prediction based on current scores
- Study group finder
- Scholarship opportunities tracking
- Resume builder from profile data
