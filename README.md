# 🚀 Smart Proposal Builder

A comprehensive web-based proposal management platform for agencies to design, send, and track digital proposals with beautiful neumorphic design.

**Original Figma Design**: https://www.figma.com/design/GSR54nc5zMEJlZCvytfkAP/Neumorphic-Proposal-Management-App

---

## ✨ Features

### Current (Phase 1 Complete ✅)
- ✅ **Beautiful Neumorphic UI** - Soft, tactile design system
- ✅ **Complete Component Library** - 50+ reusable components
- ✅ **Admin Dashboard** - Manage proposals, clients, templates
- ✅ **Proposal Editor** - PowerPoint-style drag-and-drop editor
- ✅ **Client Portal** - Public proposal viewing with dual themes
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Analytics Dashboard** - Track proposal engagement (UI)
- ✅ **Team Management** - Multi-user support (UI)

### Coming Soon (Phase 2 In Progress 🚧)
- 🚧 **Supabase Backend** - Real database and authentication
- 🚧 **User Authentication** - Sign up, login, password reset
- 🚧 **Real-time Updates** - Live collaboration features
- 🚧 **File Storage** - Upload images, logos, attachments
- 🚧 **Email Notifications** - Automated proposal notifications
- 🚧 **PDF Generation** - Export proposals as PDF

---

## 🏗️ Project Status

**Phase 0-1**: ✅ Complete (Frontend UI)  
**Phase 2**: 🚧 12% Complete (Backend Integration)  
**Phase 3-11**: ⏳ Planned

See [PROJECT_PLAN.md](./PROJECT_PLAN.md) for detailed roadmap.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (for backend - Phase 2)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open browser
# Visit http://localhost:3000
```

### For Backend Setup (Phase 2)
See [QUICK_START.md](./QUICK_START.md) for Supabase setup.

---

## 📁 Project Structure

```
c:\Proposal Builder\
├── src/
│   ├── components/         # React components
│   │   ├── admin/         # Admin dashboard components
│   │   ├── auth/          # Authentication screens
│   │   ├── client/        # Client portal components
│   │   ├── ui/            # Reusable UI components
│   │   ├── layout/        # Layout components
│   │   └── modals/        # Modal dialogs
│   ├── lib/               # Utilities and configuration
│   │   ├── supabase.ts    # Supabase client
│   │   └── queryClient.ts # React Query setup
│   ├── styles/            # Global styles
│   └── guidelines/        # Design documentation
├── supabase/              # Database migrations
├── PRD.md                 # Product requirements
├── PROJECT_PLAN.md        # Complete project roadmap
└── UI-Guidelines.md       # Design system guide
```

---

## 🎨 Design System

This project uses a custom **Neumorphic Design System** with:
- **Primary Color**: Orange (#f47421)
- **Background**: Light grey (#e0e0e0)
- **Typography**: Inter font family
- **Components**: Custom neumorphic cards, buttons, inputs
- **Alternative**: Material Design theme for clients

See [src/UI-Guidelines.md](./src/UI-Guidelines.md) for complete design documentation.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Recharts** - Analytics charts

### Backend (Phase 2+)
- **Supabase** - Backend as a Service
- **PostgreSQL** - Database
- **Row Level Security** - Data isolation
- **Supabase Storage** - File uploads
- **Supabase Auth** - User authentication
- **React Query** - State management

---

## 📚 Documentation

- [PRD.md](./PRD.md) - Product Requirements Document
- [PROJECT_PLAN.md](./PROJECT_PLAN.md) - Complete Development Plan
- [UI-Guidelines.md](./src/UI-Guidelines.md) - Design System Guide
- [SUPABASE_IMPLEMENTATION_GUIDE.md](./src/SUPABASE_IMPLEMENTATION_GUIDE.md) - Backend Guide
- [PHASE2_SETUP_GUIDE.md](./PHASE2_SETUP_GUIDE.md) - Supabase Setup Instructions
- [QUICK_START.md](./QUICK_START.md) - Fast Setup Reference

---

## 🧪 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
VITE_APP_URL=http://localhost:3000
```

See [.env.local.example](./.env.local.example) for template.

---

## 🎯 Current Phase: Backend Integration

### What's Done ✅
1. Installed Supabase dependencies
2. Created database schema (8 tables)
3. Set up TypeScript types
4. Created React Query configuration
5. Prepared migration files

### Next Steps 🎯
1. Create Supabase project
2. Run database migration
3. Configure authentication
4. Build AuthContext
5. Connect to existing UI

**Follow**: [QUICK_START.md](./QUICK_START.md) to continue

---

## 🤝 Contributing

This is a personal project, but feedback and suggestions are welcome!

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

- **Design**: Created with Figma
- **UI Components**: Built with Radix UI
- **Icons**: Lucide React
- **Backend**: Powered by Supabase
- **Deployment**: Vercel (planned)

---

## 📞 Support

For questions or issues:
1. Check documentation files
2. Review [PHASE2_SETUP_GUIDE.md](./PHASE2_SETUP_GUIDE.md)
3. Consult Supabase documentation

---

**Built with ❤️ using React, TypeScript, and Supabase**
  