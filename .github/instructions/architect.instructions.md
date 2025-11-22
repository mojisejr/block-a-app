---
applyTo: '**'
---

# System Architecture Documentation
## Smart Race Pacer (LINE LIFF)

### Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [System Components](#system-components)
4. [Data Flow Architecture](#data-flow-architecture)
5. [Security Architecture](#security-architecture)
6. [Performance Architecture](#performance-architecture)
7. [Deployment Architecture](#deployment-architecture)

### Architecture Overview

The Smart Race Pacer is a **Stateless Single Page Application (SPA)** designed to run within the LINE LIFF environment. It focuses on client-side calculation and narrative generation without persistent backend storage.

#### Core Architecture Principles
1. **Mobile-First Design**: Optimized for LINE In-App Browser.
2. **Client-Side Logic**: All race planning algorithms run in the browser.
3. **Stateless**: No database; data persists only during the session (or via URL/LocalStorage).
4. **Zero-API Dependency**: Core features work offline after initial load.

#### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                         │
├─────────────────────────────────────────────────────────────┤
│  LINE In-App Browser (Mobile)                               │
│  ┌─────────────────┐  ┌─────────────────┐                     │
│  │   Next.js App   │  │   Shadcn UI     │                     │
│  │   (React)       │  │   (Tailwind)    │                     │
│  └─────────────────┘  └─────────────────┘                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Static Assets (Vercel CDN)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Infrastructure Layer                      │
├─────────────────────────────────────────────────────────────┤
│  Vercel (Hosting & CDN)                                      │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

#### Frontend Stack
```
Framework: Next.js 14+ (App Router)
UI Library: Shadcn UI + Tailwind CSS
Language: TypeScript
State Management: React Hooks / Context
Icons: Lucide React
Animation: Framer Motion (optional) or CSS Transitions
```

#### Backend Stack
```
None (Client-side only)
```

#### Infrastructure Stack
```
Platform: Vercel
CDN: Vercel Edge Network
Analytics: Vercel Analytics (optional)
```

### System Components

#### 1. Frontend Application Layer

**Next.js App Router Structure**
```
app/
├── layout.tsx       # Root layout (Fonts, Metadata)
├── page.tsx         # Main Container (State Holder)
├── globals.css      # Global Styles (Tailwind)
└── components/
    ├── step-distance.tsx  # Distance Selection
    ├── step-input.tsx     # Time/Pace Input
    ├── step-result.tsx    # Calculation Result
    └── ui/                # Shadcn Components
```

**Component Architecture**
- **Container/Presenter Pattern**: `page.tsx` manages state (`distance`, `targetTime`, `result`), passing props to presentational components (`step-*.tsx`).
- **Shadcn UI**: Use `Card`, `Button`, `Input`, `Tabs`, `Table`, `Alert` for consistent design.

#### 2. Logic Layer (Calculator)

**Core Algorithm (`utils/calculator.ts`)**
- **Input**: Distance (km), Target Time (seconds)
- **Process**:
  1. Calculate Average Pace.
  2. Apply Negative Split Strategy (Warmup +12.5%, Cruise +0%, Kick -7.5%).
  3. Generate Splits Table.
  4. Generate Narrative Text.
- **Output**: JSON object with splits and story segments.

### Data Flow Architecture

#### 1. User Journey Flow
```
User Selects Distance → State Update →
User Inputs Target → State Update →
Click "Analyze" → Calculator Utility →
Result State Update → Render Result View
```

### Security Architecture

#### 1. Client-Side Security
- **Input Validation**: Prevent invalid numbers/formats in `step-input.tsx`.
- **No Sensitive Data**: App does not collect PII (Personally Identifiable Information).

### Performance Architecture

#### 1. Frontend Performance
- **Code Splitting**: Next.js automatic splitting.
- **Image Optimization**: Use `next/image` if assets are needed.
- **Bundle Size**: Keep initial load minimal for 3G networks.

### Deployment Architecture

#### 1. Vercel Deployment
- **Build Command**: `npm run build`
- **Output**: Static Export (optional) or Node.js Serverless (default).


#### 1. Application Monitoring

**Error Tracking**
```typescript
// lib/error-tracking.ts
export function captureError(error: Error, context?: any) {
  console.error('Application Error:', error, context)

  // Send to error tracking service (Vercel Analytics or external)
  if (process.env.NODE_ENV === 'production') {
    // Send to error tracking service
  }
}
```

**Performance Monitoring**
```typescript
// lib/performance.ts
export function measurePerformance<T>(
  name: string,
  fn: () => T
): T {
  const start = performance.now()
  try {
    return fn()
  } finally {
    const duration = performance.now() - start
    console.log(`${name} took ${duration.toFixed(2)}ms`)

    // Send to monitoring service
    if (duration > 1000) { // Alert on slow operations
      captureError(new Error(`Slow operation: ${name}`), { duration })
    }
  }
}
```

#### 2. Database Monitoring

**Query Performance Tracking**
```typescript
// lib/db-monitoring.ts
const originalQuery = db.animal.findMany

db.animal.findMany = function(...args) {
  const start = Date.now()
  return originalQuery.apply(this, args).then(result => {
    const duration = Date.now() - start

    // Log slow queries
    if (duration > 1000) {
      console.warn('Slow query detected:', {
        duration,
        query: args[0],
        resultCount: result.length
      })
    }

    return result
  })
}
```

### Development Workflow

#### 1. Local Development

**Development Environment Setup (Rust)**
```bash
# Fetch/build dependencies
cargo fetch

# Set up environment
cp .env.example .env.local

# Start database
docker-compose up -d postgres

# Run migrations (tool-dependent, e.g., sqlx-cli or a migration binary)
# Example using a migration binary built into the repo:
cargo run --bin migrate

# Start development server
cargo run
```

**Testing Strategy**
```typescript
// Component testing
import { render, screen } from '@testing-library/react'
import { AnimalCard } from '@/components/features/animals/animal-card'

test('displays animal information', () => {
  const animal = {
    id: '1',
    tagId: '001',
    name: 'นาเดีย',
    type: 'WATER_BUFFALO',
    status: 'ACTIVE'
  }

  render(<AnimalCard animal={animal} />)

  expect(screen.getByText('นาเดีย')).toBeInTheDocument()
  expect(screen.getByText('001')).toBeInTheDocument()
})

// API testing
import { createMocks } from 'node-mocks-http'
import { GET } from '@/app/api/animals/[id]/route'

test('returns animal data', async () => {
  const mocks = createMocks()

  const request = new Request('http://localhost:3000/api/animals/1')
  const response = await GET(request, { params: { id: '1' } })

  expect(response.status).toBe(200)
  expect(response.data.success).toBe(true)
})
```

#### 2. CI/CD Pipeline

**GitHub Actions Workflow**
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Rust toolchain
        uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
          profile: minimal
      - name: Cache Cargo registry
        uses: actions/cache@v4
        with:
          path: |
            ~/.cargo/registry
            ~/.cargo/git
          key: ${{ runner.os }}-cargo-${{ hashFiles('**/Cargo.lock') }}

      - name: Build (release)
        run: cargo build --release

      - name: Run tests
        run: cargo test --all

      - name: Lint (clippy)
        run: cargo clippy --all-targets -- -D warnings

      - name: Format check
        run: cargo fmt -- --check

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

**Document Version**: 1.0
**Last Updated**: November 12, 2025