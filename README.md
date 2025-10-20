# PNG Digital Electoral Transformation System (PNGElectSys)

🇵🇬 **Papua New Guinea Electoral Commission's Digital Transformation System**

A comprehensive prototype system demonstrating fit-for-purpose technologies for biometric voter registration, secure digital identity integration, results transmission, and offline operation in rural PNG contexts.

![PNG Electoral System](https://img.shields.io/badge/PNG-Electoral%20System-green) ![Next.js](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Supabase](https://img.shields.io/badge/Supabase-Database-green)

## 🎯 Workshop Information

**Event:** "Transforming Elections through Biometrics and Technology Workshop"
**Date:** October 13-15, 2025
**Location:** Hilton Hotel, Port Moresby
**Organizer:** Papua New Guinea Electoral Commission (PNGEC)

## ✨ Key Features

### 🔐 Biometric Voter Registration
- **AI-Powered Face Recognition** with quality scoring and deduplication
- **Fingerprint Simulation** for comprehensive biometric capture
- **Smart ID Integration** with PNG Digital Identity verification
- **Step-by-step Registration Wizard** with real-time validation

### 📊 Real-time Election Management
- **Live Results Dashboard** with provincial breakdowns
- **Interactive PNG Map** showing voter turnout by province
- **WebSocket Updates** for real-time data synchronization
- **Comprehensive Audit Trail** with security monitoring

### 🌐 Digital Inclusion & Accessibility
- **Multilingual Support** (English & Tok Pisin)
- **Mobile-Responsive Design** for field devices
- **Offline PWA Capabilities** for remote areas
- **Cultural Localization** for PNG context

### 🏛️ Electoral Process Modules
- **Voter Registration** with biometric capture
- **Identity Verification** with PNG Smart ID
- **Polling Results Upload** with validation
- **Results Transmission** with encryption
- **System Administration** with role-based access

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ (required)
- Bun or npm
- Supabase account
- Modern web browser with camera access

### 5-Minute Setup

```bash
# 1. Clone repository
git clone https://github.com/emabi2002/pngelectoralsystem.git
cd pngelectoralsystem

# 2. Install dependencies
bun install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 4. Run development server
bun run dev

# 5. Open browser
# Visit: http://localhost:3000
```

### 📚 Detailed Setup

**For complete setup instructions**, see: **`SETUP_GUIDE.md`**

This comprehensive guide covers:
- ✅ Prerequisites and installation
- ✅ Database schema setup (3 SQL scripts)
- ✅ Environment variable configuration
- ✅ Demo user account creation
- ✅ Testing and troubleshooting
- ✅ Production deployment steps

### 🔐 Credentials

**Project Credentials**: See `CREDENTIALS_PRIVATE.md` (keep secure, not in version control)

**Public Repository**: https://github.com/emabi2002/pngelectoralsystem

**Live System**: https://same-6yf918d9bnu-latest.netlify.app

## 🗄️ Database Setup

The system uses Supabase for real-time data management. The database includes:

- **households** - Census household data with dwelling characteristics
- **population** - Individual census records (all ages, disability-inclusive)
- **citizens** - PNG NID citizen data replica
- **voters** - Electoral roll with biometric data
- **polling_results** - Election results transmission
- **audit_logs** - Comprehensive activity logging
- **user_profiles** - User authentication with role-based access

### Quick Database Setup

1. Access Supabase SQL Editor
2. Run `database/schema.sql` - Core tables
3. Run `database/user_profiles_schema.sql` - Authentication
4. Run `database/create_demo_accounts.sql` - Demo users (optional)

**Detailed Instructions**: See `SETUP_GUIDE.md` or `DEMO_ACCOUNT_SETUP_GUIDE.md`

## 📚 Comprehensive Documentation (221 Pages)

This repository includes complete production-ready documentation:

### **User Guides** (4 guides, 78 pages)
- `USER_GUIDES/ENUMERATOR_GUIDE.md` (15 pages) - Field enumeration procedures
- `USER_GUIDES/SUPERVISOR_GUIDE.md` (20 pages) - Progress monitoring & QC
- `USER_GUIDES/ANALYST_GUIDE.md` (18 pages) - Data analysis & visualization
- `USER_GUIDES/ADMINISTRATOR_GUIDE.md` (25 pages) - System administration

### **Technical Documentation** (5 guides, 80 pages)
- `TESTING_CHECKLIST.md` (22 pages) - QA test scenarios (120+ tests)
- `DATABASE_BACKUP_RECOVERY.md` (18 pages) - Backup & disaster recovery
- `BACKUP_CONFIG_GUIDE.md` (14 pages) - Backup configuration
- `CENSUS_SYSTEM_DOCUMENTATION.md` (12 pages) - Census overview
- `PRODUCTION_READINESS_SUMMARY.md` (14 pages) - Production checklist

### **Workshop Materials** (3 guides, 71 pages)
- `WORKSHOP_PRESENTATION.md` (35 pages) - 30+ slides, 5 live demos
- `LIVE_DEMO_SCRIPTS.md` (28 pages) - Step-by-step demo scenarios
- `WORKSHOP_MATERIALS_PREP.md` (8 pages) - Materials & printing

### **Setup & Implementation** (4 guides, 34 pages)
- `SETUP_GUIDE.md` (NEW) - Complete installation guide
- `DEMO_ACCOUNT_SETUP_GUIDE.md` (6 pages) - User account creation
- `PRE_WORKSHOP_TEST_EXECUTION.md` (12 pages) - Critical test checklist
- `ALL_TASKS_COMPLETE.md` (8 pages) - Production readiness summary

**Total**: 15 comprehensive documents, 221 pages

## 🏗️ System Architecture

### Frontend
- **Next.js 15** with TypeScript
- **Tailwind CSS** + **ShadCN UI** components
- **React i18next** for internationalization
- **Leaflet** for interactive maps

### Backend & Database
- **Supabase** for real-time database and authentication
- **PostgreSQL** with Row Level Security
- **WebSocket subscriptions** for live updates

### Biometric & AI
- **Face-API.js** for facial recognition
- **Quality scoring algorithms** for image validation
- **Deduplication logic** to prevent duplicate registrations

### Maps & Visualization
- **Leaflet** with PNG provincial boundaries
- **Real-time data visualization** with Chart.js/Recharts
- **Interactive province selection** with detailed statistics

## 🌍 Multilingual Support

The system supports:
- **English** - Primary interface language
- **Tok Pisin** - PNG national language

Language switching is available in the header with persistent storage.

## 📱 PWA & Offline Support

- **Service Worker** for offline caching
- **IndexedDB** for local data storage
- **Background sync** when connection restored
- **Installation** as mobile/desktop app

## 🔒 Security Features

- **End-to-end encryption** for sensitive data
- **Row Level Security** in database
- **Comprehensive audit logging** for all actions
- **Role-based access control** (Admin, Officer, Observer)
- **Biometric deduplication** to prevent fraud

## 🎨 UI/UX Features

- **PNG Electoral Commission branding**
- **Professional color scheme** (green/blue)
- **Responsive design** for all devices
- **Accessibility considerations** throughout
- **Real-time status indicators**

## 📋 Available Pages

| Route | Description |
|-------|-------------|
| `/` | Main dashboard with overview |
| `/register` | Biometric voter registration |
| `/verify` | Smart ID verification |
| `/dashboard` | Real-time election results |
| `/polling` | Polling results upload |
| `/audit` | System audit trail |
| `/login` | Secure authentication |
| `/setup` | Database initialization |

## 🧪 Testing the System

### Voter Registration
1. Visit `/register`
2. Use demo NID: `12345678`
3. Test facial recognition with camera
4. Complete registration process

### Smart ID Verification
1. Visit `/verify`
2. Enter any 8-digit ID number
3. See verification workflow

### Dashboard Monitoring
1. Visit `/dashboard`
2. View real-time statistics
3. Interact with PNG map

## 🚀 Deployment

### Netlify (Recommended)
```bash
# Build the application
bun run build

# Deploy to Netlify
# (Configure build command: bun run build)
# (Configure publish directory: .next)
```

### Vercel
```bash
# Connect your GitHub repository to Vercel
# Automatic deployment on git push
```

### Manual Deployment
```bash
# Build static version
bun run build
bun run export

# Deploy the 'out' directory to your hosting provider
```

## 🛠️ Development

### Project Structure
```
src/
├── app/                    # Next.js app router pages
├── components/             # Reusable UI components
├── lib/                    # Utility functions and services
├── hooks/                  # Custom React hooks
└── database/              # Database schema and migrations
```

### Key Components
- **Face Recognition Service** (`lib/faceRecognitionDemo.ts`)
- **Database Service** (`lib/database.ts`)
- **Real-time Hooks** (`hooks/useRealTimeElection.ts`)
- **i18n Configuration** (`lib/i18n.ts`)

### Adding New Features
1. Create component in `src/components/`
2. Add database operations in `src/lib/database.ts`
3. Update translations in `src/lib/i18n.ts`
4. Add routes in `src/app/`

## 🤝 Contributing

This is a demonstration system for the PNG Electoral Commission workshop. For production deployment:

1. Implement actual Face-API.js models
2. Connect to real PNG Digital ID API
3. Add comprehensive security measures
4. Implement proper user authentication
5. Add extensive error handling

## 📄 License

This project is created for the Papua New Guinea Electoral Commission workshop demonstration.

## 🏆 Workshop Demonstration

Perfect for showcasing:
- **Modern electoral technology**
- **Biometric voter registration**
- **Real-time results management**
- **Multilingual accessibility**
- **Offline operation capabilities**
- **Professional system design**

## 📞 Support

For workshop support or technical questions:
- **Email:** support@pngec.gov.pg
- **Workshop:** October 13-15, 2025, Hilton Hotel, Port Moresby

---

**Built with ❤️ for Papua New Guinea Electoral Commission**
*Transforming Elections through Technology* 🇵🇬
