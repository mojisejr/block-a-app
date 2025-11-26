# 🏃‍♂️ Smart Race Pacer

**Smart Race Pacer** is a comprehensive running training and race planning web application built as a LINE LIFF (LINE Front-end Framework) application. The app provides science-based training plans and race strategies to help runners achieve their goals through intelligent pacing and interval training design.

## 📋 Overview

Smart Race Pacer combines sports science principles with modern web technologies to deliver two powerful features:

1. **Race Pacer** - Negative split race strategy calculator
2. **Interval Designer** - VO2Max interval training planner

The application is designed to be stateless, client-side focused, and optimized for mobile-first experiences within the LINE ecosystem.

## ✨ Key Features

### 🎯 Race Pacer (Negative Split Strategy)

A race planning tool that calculates optimal pacing strategies using the **Negative Split** approach (start slow → maintain → finish strong).

**Core Capabilities:**
- Support for 4 race distances: 5K, 10K, 21K (Half Marathon), 42K (Full Marathon)
- Input by target pace or total time
- Three-phase pacing strategy:
  - **Warm Up (0-20%)**: 12.5% slower than race pace
  - **Cruise (20-80%)**: Target race pace
  - **Kick (80-100%)**: 7.5% faster than race pace
- Narrative-style results with strategic guidance
- Hydration reminders every 2km

**Scientific Foundation:**
- Based on energy conservation principles
- Prevents early glycogen depletion
- Maximizes finish-line performance

### 🔥 Interval Designer (VO2Max Training)

An intelligent interval training calculator that designs custom speed workouts to improve maximum oxygen uptake and running economy.

**Core Capabilities:**
- Creates interval sessions based on race goals
- Adjusts volume based on weekly mileage (15% safety cap)
- Support for multiple interval formats:
  - Short intervals: 400m, 800m
  - Medium intervals: 1000m
  - Long intervals: 1200m, 1600m (miles)
- Complete session structure with warm-up and cool-down
- Recovery ratio optimization

**Scientific Foundation:**
- VO2Max zone targeting (95-100% effort)
- Distance-specific pace calculation
- Safe volume progression based on training base

### 🎨 Smart Tempo Designer (Planned)

An upcoming feature for threshold training (Lactate Threshold runs) to build endurance and stamina.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org) (App Router)
- **Language**: TypeScript
- **UI Components**: [Shadcn UI](https://ui.shadcn.com) (Radix UI + Tailwind CSS)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel
- **LINE Integration**: LINE LIFF SDK

## 🏗️ Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main race pacer page
│   ├── interval/
│   │   └── page.tsx          # Interval designer page
│   ├── layout.tsx            # Root layout with fonts
│   └── globals.css           # Global styles
├── components/
│   ├── step-distance.tsx     # Distance selection UI
│   ├── step-input.tsx        # Target input UI (pace/time)
│   ├── step-result.tsx       # Race plan results
│   ├── interval-designer.tsx # Interval training UI
│   ├── bottom-nav.tsx        # Navigation bar
│   ├── calculation-info-drawer.tsx  # Race pacer calculations info
│   ├── interval-info-drawer.tsx     # Interval calculations info
│   └── ui/                   # Shadcn UI components
├── lib/
│   ├── calculator.ts         # Race pacer logic
│   └── interval-calculator.ts # Interval training logic
└── types/
    └── interval.ts           # TypeScript interfaces
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd block-a-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm run start
```

## 📐 Calculation Formulas

### Race Pacer (Negative Split)

**Base Pace Calculation:**
- From Pace Input: `BasePace = Target Pace`
- From Time Input: `BasePace = (Target Time / Distance) / 1.01`

**Three-Phase Pacing:**
- Warm Up: `BasePace × 1.125` (first 20% of distance)
- Cruise: `BasePace × 1.00` (middle 60% of distance)
- Kick: `BasePace × 0.925` (final 20% of distance)

### Interval Designer

**Target Pace Calculation:**
- 5K/10K: `Race Pace - 5 seconds/km` (slightly faster)
- Half Marathon: `Race Pace - 15 seconds/km`
- Full Marathon: `Race Pace - 25 seconds/km`

**Volume Calculation:**
- Maximum interval volume: `15% of weekly mileage`
- Safe, progressive overload principle

## 🎨 Design Philosophy

**Minimalist Racer Aesthetic:**
- Clean, focused interface
- Dark mode support
- Smooth animations and transitions
- Mobile-first responsive design
- Storytelling approach to results

**UX Principles:**
- Stateless (no login required)
- Single-page flow
- Instant client-side calculations
- Clear visual hierarchy
- Narrative guidance

## 📱 LINE LIFF Integration

The app is designed to run seamlessly within LINE messenger using the LIFF SDK:
- Optimized for LINE's in-app browser
- Responsive to different display modes
- No external authentication required

## 📚 Documentation

- [PRD (Product Requirements Document)](./docs/PRD.md) - Race Pacer specifications
- [FRD-INTERVAL (Feature Requirements)](./docs/FRD-INTERVAL.md) - Interval Designer specifications

## 🧪 Development Notes

### Key Design Decisions

1. **Stateless Architecture**: No database or user authentication required
2. **Client-Side First**: All calculations happen in the browser
3. **Component-Driven**: Reusable Shadcn UI components
4. **TypeScript**: Type safety for complex calculations
5. **Mobile-First**: Optimized for smartphone screens

### Performance Considerations

- Minimal JavaScript bundle size
- Optimized font loading (Next.js font optimization)
- Lazy loading for non-critical components
- CSS-in-JS via Tailwind for optimal caching

## 🤝 Contributing

This is currently a private project. For questions or suggestions, please contact the development team.

## 📄 License

Private and proprietary.

## 🙏 Acknowledgments

- Sports science principles adapted from modern running coaching methodologies
- UI components from [Shadcn UI](https://ui.shadcn.com)
- Built with [Next.js](https://nextjs.org)

---

**Version**: 2.0 (MVP)  
**Last Updated**: November 26, 2025
