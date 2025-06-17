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

## User Preferences

Preferred communication style: Simple, everyday language.