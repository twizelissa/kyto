# My Number Card Application Guide

## Overview

This is a Japanese web application that helps users determine what documents they need to bring when applying for or renewing their My Number Card. The system asks users 5 simple questions and generates a personalized checklist based on their specific situation (age, family composition, procedure type, etc.).

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom government-style theming
- **State Management**: React hooks with TanStack Query for data fetching
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite with custom configuration for monorepo structure

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Development**: Hot reload with Vite middleware integration
- **Storage**: In-memory storage with interface for future database integration
- **API Structure**: RESTful endpoints under `/api` prefix
- **Session Management**: Prepared for connect-pg-simple sessions

### Data Storage Solutions
- **Current**: In-memory storage using Map data structures
- **Prepared**: PostgreSQL with Drizzle ORM configuration
- **Schema**: Users and sessions tables with JSON storage for quiz answers
- **Migration**: Drizzle Kit for database schema management

### Key Components

#### Question System
- **Rule Engine**: TypeScript-based conditional logic for document requirements
- **Question Flow**: Multi-step wizard with progress tracking
- **Answer Storage**: JSON-based answer persistence with TypeScript validation
- **Results Generation**: Dynamic checklist based on user inputs

#### UI Components
- **Question Wizard**: Step-by-step form with progress indicator
- **Results Display**: Interactive checklist with print functionality
- **Modify Answers**: Edit mode for changing responses
- **Print Utilities**: Browser-based PDF generation and printing

## Data Flow

1. **User Journey**: Welcome → Questions → Results
2. **Question Processing**: User selects options → Answers stored → Rules engine processes → Document list generated
3. **State Management**: Local React state for current session, with optional persistence to backend
4. **Print Workflow**: Results formatted for print/PDF with special styling

## External Dependencies

### Core Libraries
- **@neondatabase/serverless**: Database connection (prepared for Neon/PostgreSQL)
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React router

### UI Framework
- **@radix-ui/***: Accessible UI primitives (40+ components)
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast bundling for production
- **vite**: Development server and build tool
- **@replit/vite-plugin-***: Replit-specific development enhancements

## Deployment Strategy

### Development
- **Command**: `npm run dev`
- **Server**: Vite dev server with Express backend
- **Hot Reload**: Full-stack hot reloading enabled
- **Port**: 5000 (configured for Replit)

### Production
- **Build**: `npm run build` - Vite builds frontend, esbuild bundles backend
- **Deploy**: Static frontend + Node.js backend
- **Environment**: Configured for Replit autoscale deployment
- **Database**: Requires DATABASE_URL environment variable for PostgreSQL

### Database Setup
- **Development**: In-memory storage (no setup required)
- **Production**: PostgreSQL with `npm run db:push` for schema deployment

## Changelog

Changelog:
- June 17, 2025. Initial setup
- August 11, 2025. Enhanced question flows and UI improvements:
  - Added complete electronic certificate issuance/renewal question flow with proxy handling
  - Added complete PIN change/reset question flow with complex branching logic
  - Added complete address/name change question flow
  - Added card loss/found question flow
  - Improved responsive design for mobile devices
  - Fixed header click navigation to properly return to home screen
  - Updated lost procedure confirmation page with third checkbox option
  - Progress bar calculation issues identified (pending resolution):
    - Progress calculation logic needs refinement for accurate percentage display
    - Current implementation shows incorrect percentages during question flow
- August 12, 2025. Card issuance document requirements refinement:
  - Fixed identity document requirements for proxy applications with clear separation between applicant and proxy documents
  - Eliminated warning messages for adult guardianship categories (成年被後見人等)
  - Updated notification card display conditions to only show when applicant has notification card
  - Enhanced identity document requirements based on visitor type (self vs proxy) and specific circumstances
  - Refined certificate requirements for various difficulty-to-visit reasons (hospitalized, disabled, facility resident, etc.)
  - Added specific document requirements for guardianship situations and underage applicants
  - Enhanced mobile responsiveness by removing width constraints and reducing padding for improved smartphone viewing:
    - Removed max-width constraints on main containers for full-width content
    - Reduced card padding from p-8 to p-2/p-6 for mobile/desktop respectively
    - Optimized content area utilization for better mobile user experience
  - Implemented complete document requirements for "本人（代理人が同行する場合を含む）" flow:
    - Added proxy identity document requirements for accompanying proxy scenarios
    - Implemented guardian certificate requirements (成年後見人に関する登記事項証明書, 保佐人に関する登記事項証明書・代理行為目録, etc.)
    - Added family register requirements for 15歳未満 non-cohabiting cases with non-Kyoto domicile
    - Updated identity document naming to "申請者ご本人の本人確認書類" for clarity in self-application scenarios
- August 13, 2025. Address/name change procedure completion and visual enhancements:
  - Completed comprehensive address/name change document requirements system with all proxy scenarios
  - Implemented voluntary proxy special handling with inquiry response documents and power of attorney requirements
  - Added specialized proxy identity document wording for voluntary proxy with additional visit notice
  - Enhanced visual consistency with red asterisk (※) display for voluntary proxy options
  - Finalized document matrix covering all proxy reasons: adult guardian, conservatee, assisted person, voluntary guardian, under-15, voluntary proxy, and same household scenarios
- August 17, 2025. Footer implementation and visual improvements:
  - Changed home page checkmarks (✓) to red color for better visibility
  - Implemented comprehensive footer system for final pages with gray backgrounds and full-width layout
  - Added specific footer content for card application/renewal with reference URLs and contact information
  - Added specific footer content for card pickup/delivery with conditional proxy display
  - Added specific footer content for electronic certificate procedures with conditional proxy display
  - Fixed electronic certificate proxy detection using correct property name (cert_visitor_type vs visitor_type)
  - Implemented bullet point formatting (・) for multiple reference URLs
  - All reference URLs are clickable links that open in new tabs with proper security attributes

## User Preferences

Preferred communication style: Simple, everyday language.