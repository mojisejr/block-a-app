## Project Overview

**Project Name**: Smart Race Pacer (LINE LIFF Edition)

**Repository**: https://github.com/mojisejr/block-a-app
**Author**: [AUTHOR_NAME] <[EMAIL]>

**Description**: Generic, reusable agent workflow and implementation template. This repository documents mandatory agent safety rules, workflow commands, templates, and the implementation checklist used by automated agents and developers. Replace placeholders with project-specific metadata when adapting this template.

---

## ⚠️ CRITICAL SAFETY RULES

### 🚨 FORBIDDEN ACTIONS (NEVER ALLOWED)

- ❌ **NEVER merge PRs yourself** - Provide PR link and wait for user instructions
- ❌ **NEVER work on main/staging branches** - Always use feature branches
- ❌ **NEVER delete critical files** (.env, .git/, node_modules/, package.json, lib/database/)
- ❌ **NEVER commit sensitive data** (API keys, passwords, secrets) - Use environment variables
- ❌ **NEVER skip 100% validation** (build, lint, test) - Must pass completely
- ❌ **NEVER use git push --force** - Only use --force-with-lease when absolutely necessary
- ❌ **NEVER implement without task issue** - Must use /plan command first

### 📋 MANDATORY WORKFLOW RULES

- ✅ **ALWAYS** sync main branch before any implementation: `git checkout main && git pull origin main`
- ✅ **ALWAYS** verify task issue exists: `#[issue-number]` before `/impl`
- ✅ **ALWAYS** use feature branch naming: `feature/task-[issue-number]-[description]`
- ✅ **ALWAYS** ensure 100% build success before commit: `npm run build`
- ✅ **ALWAYS** ensure 100% lint pass before commit: `npm run lint`
- ✅ **ALWAYS** use template-guided workflow with proper context validation
- ✅ **ALWAYS** verify code formatting: `npm run format` (if available) or Prettier

---

## 📊 Response Quality Standards (MANDATORY)

### 1. **On-Point (ตรงประเด็น)**
- Answer only what was asked
- No out-of-scope information
- Cut unnecessary details

### 2. **Good Context Ordering**
- Simple to complex progression
- Start with robust answer first
- Gradually increase complexity
- Order information for easy comprehension

### 3. **Exact Details (ยึดมั่นในรายละเอียด)**
- Provide accurate and specific information
- Reference actual file, function, variable names
- No hallucinating about code or structure
- Verify assumptions before answering

### 4. **Security-First Focus (โฟกัสความปลอดภัย)**
- Always consider security implications
- Recommend secure approach first
- Warn about potential risks
- Explain why approach is secure

### 5. **Senior Developer Mindset**
- Provide unbiased feedback
- Answer directly and straightforwardly
- Demonstrate expertise in domain
- Use best practices for technology stack

---

## 🌐 Response Language Policy

### Automatic Language Matching (MANDATORY)

- **If user asks in Thai** → Respond in Thai (ยกเว้น technical terms)
- **If user asks in English** → Respond in English
- **Mixed language** → Follow the primary language of the question
- **Technical terms** → Always use English (Next.js, React, TypeScript, Shadcn, etc.)

### Examples

**User (Thai)**: "ทำไม queue ถึง fail ?"
**Agent (Thai)**: "จากการวิเคราะห์ queue system ใน `src/queue/` พบว่า..."

**User (English)**: "Why is the queue failing?"
**Agent (English)**: "After analyzing the queue system in `src/queue/`, I found..."

**User (Mixed)**: "explain ว่า database connection pool ทำงานยังไง"
**Agent (Thai)**: "Component `StepDistance` ใน `components/` ทำงานแบบ... (code examples use English)"

---

## 📋 Workflow System

### Template Integration

**Context Issue Template** - `/docs/ISSUE-TEMP.md`:

- Used for: `=fcs > [topic-name]` or `=fcs > [CONTEXT]`
- **ALWAYS creates GitHub Issue** - Never creates local .md files
- Creates living document for iterative discussion
- Contains: DISCUSSION LOG, ACCUMULATED CONTEXT, PLANNING READINESS CHECKLIST

**Task Issue Template** - `/docs/TASK-ISSUE-TEMP.md`:

- Used for: `=plan > [task description]`
- **ALWAYS creates GitHub Issue** - Never creates local .md files
- Creates atomic tasks based on current mode (MANUAL/COPILOT)
- Contains: EXECUTION MODE field, 100% validation requirements

**Knowledge Issue Template** - `/docs/KNOWLEDGE-TEMP.md`:

- Used for: `=kupdate [category] "[topic]"`
- **ALWAYS creates GitHub Issue** - Never creates local .md files
- Creates structured knowledge entries with AI honest feedback
- Contains: Problem → Solution → Lessons Learned → Links

### Mode-Based Execution System

**Default Mode**: MANUAL (agent implementation)

**Mode Commands**:

```bash
/mode manual     # Tasks assigned to agent (Claude)
/mode copilot     # Tasks assigned to @copilot
/mode status      # Show current execution mode
```

**Mode-Specific Behavior**:

- **MANUAL Mode**: `/plan` creates tasks assigned to agent, `/impl` triggers agent implementation using code editing tools
- **COPILOT Mode**: `/plan` creates tasks assigned to @copilot, `/impl` triggers copilot implementation

### Core Commands

**✅ NEW: Claude Code Slash Commands Implemented!**
All workflow commands are now available as proper Claude Code slash commands (markdown files in `.claude/commands/`).

```bash
# Mode Management
/mode [manual|copilot|status]  # Set or show execution mode

# Analysis & Planning
/pck [issue-number]            # Plan check - analyze task before impl
/aud [question]                # Audit - analyze codebase and answer

# Context Management
/fcs [topic-name]              # Create new Context GitHub Issue
/fcs list                      # Show all active Context Issues

# Task Management
/plan [task description]       # Create Task GitHub Issue using docs/TASK-ISSUE-TEMP.md
/impl [issue-number]           # Implementation workflow for specific GitHub issue
/impl [issue-number] [msg]     # Implementation with additional context
/pr [feedback]                 # Create Pull Request from feature branch (to staging)

# Knowledge Management
/khub                          # 🔍 Read Knowledge Hub (MANDATORY first step)
/kupdate [category] "[topic]"  # Create Knowledge GitHub Issue (CHECK existing numbers!)
/klink [knowledge-issue-number] # Link knowledge entry to Knowledge Hub
/ksync                         # Synchronize Knowledge Hub with all entries
/ksearch "[query]"             # Search across all knowledge entries
/krecent                       # Show last 5 knowledge updates
/kcategory [category]          # Show knowledge for specific category

# Other Commands
/rrr [message]                 # Create daily retrospective GitHub Issue

# Legacy = Commands (still supported for backward compatibility)
=fcs > [topic-name]           # Create new Context GitHub Issue
=plan > [task description]    # Create Task GitHub Issue
=impl > [issue-number]        # Implementation workflow
=khub                         # Read Knowledge Hub
# ... (all other = commands still work)
```

### Claude Code Slash Command Features

- **Proper Implementation**: Markdown files in `.claude/commands/` directory
- **Claude Integration**: Processed and executed by Claude Code
- **Rich Documentation**: Each command includes comprehensive usage, examples, and implementation details
- **Error Handling**: Clear error messages and helpful suggestions
- **Validation**: Automatic checking of prerequisites and dependencies
- **Help System**: All commands support help via detailed documentation

### Template-Driven Workflow Process

1. **Phase 1**: `/fcs [topic]` → Create initial context **GitHub Issue** (NEVER .md file)
2. **Phase 2**: `/fcs [topic]` → Update context **GitHub Issue** iteratively
3. **Phase 3**: Context reaches `[Ready for Planning]` status → Ready for planning
4. **Phase 4**: `/plan [task]` → Create atomic **GitHub Issues** (NEVER .md files)
5. **Phase 5**: `/impl [issue-number]` → Implement specific GitHub issue based on mode

**💡 Enhanced Workflow with Claude Code Slash Commands:**
- Use `/mode [manual|copilot]` to set execution mode
- Commands processed by Claude Code with intelligent execution
- Rich documentation and help built into each command
- Comprehensive error handling and validation
- All workflows maintain the same template-driven approach
- Legacy `=` commands remain supported for backward compatibility

### Implementation Workflow (MANDATORY)

**Pre-Implementation Checklist**:

1. **Staging Sync**: `git checkout staging && git pull origin staging`
2. **Task Verification**: Confirm Task **GitHub Issue** `#[issue-number]` exists and is [TASK] type
3. **Context Status**: Verify Context **GitHub Issue** is `[Ready for Planning]` or `[Implementation Ready]`
4. **Environment Check**: `git status` - working directory must be clean

**Implementation Steps**:

1. **Create Feature Branch**: `git checkout -b feature/task-[issue-number]-[description]`
2. **Execute Implementation**: Follow task requirements, use TodoWrite for complex tasks
3. **Build Validation**: `cargo build --release` (100% success - zero warnings)
4. **Lint Validation**: `cargo clippy --all-targets --all-features` (100% pass)
5. **Format Check**: `cargo fmt -- --check` (consistent formatting)
6. **Type Check**: `cargo check` (comprehensive type checking)
7. **Run Tests**: `cargo test` (if applicable)
8. **Commit Changes**:

   ```bash
   git add .
   git commit -m "feat: [feature description]

   - Address #[issue-number]: [task title]
   - Build validation: 100% PASS (cargo build --release)
   - Clippy validation: 100% PASS (cargo clippy)
   - Format validation: 100% PASS (cargo fmt)

   🤖 Generated with Claude Code
   Co-Authored-By: Claude <noreply@anthropic.com>"
   ```

9. **Push Branch**: `git push -u origin feature/task-[issue-number]-[description]`

**Post-Implementation**:

- **MANUAL Mode**: Agent implements and pushes to feature branch, user uses `/pr` to create PR
- **COPILOT Mode**: GitHub Copilot implements and pushes to feature branch, user uses `/pr` to create PR

---

## 🧠 Knowledge Management System

### Knowledge Workflow Integration

**Knowledge Capture Points**:

- **After Implementation**: When `=impl` completes successfully, use `=kupdate` to document learnings **(auto-prompts for hub linking)**
- **After Context Discussion**: When `=fcs` reaches key decisions, use `=kupdate` to capture insights **(auto-prompts for hub linking)**
- **After Chat Discoveries**: When breakthrough solutions are found, use `=kupdate` to preserve knowledge **(auto-prompts for hub linking)**

**Enhanced Knowledge Workflow**:

1. **🔍 Pre-Creation Check**: `=khub` → Read Knowledge Hub #102 FIRST to check existing KNOW-[CATEGORY]-XXX numbers
2. **Verify**: Check category section for existing numbers to avoid duplicates (e.g., KNOW-DEVICE-001, KNOW-DEVICE-002)
3. **Create**: `=kupdate [category] "[topic]"` → Creates knowledge issue with next available number
4. **Prompt**: System asks "Link to Knowledge Hub #102? (y/n)"
5. **Link**: If "y" → Automatically runs `=klink`
6. **Sync**: Use `=ksync` to ensure hub is fully synchronized
7. **Discover**: All knowledge accessible through `=khub` navigation

### Knowledge Categories

**Standard Categories**:

- `device` - CU12, KU16, SerialPort, hardware integration
- `database` - SQLite, Sequelize, migrations, queries
- `architecture` - Design patterns, structural decisions
- `debug` - Error solutions, troubleshooting, workarounds
- `workflow` - Process improvements, automation
- `frontend` - React, Electron, UI components
- `backend` - Node.js, APIs, services

### Knowledge ID System

**Format**: `KNOW-[CATEGORY]-[NUMBER]`

- Example: `KNOW-DEVICE-001`, `KNOW-DATABASE-015`
- Auto-increment per category
- Easy reference and cross-linking

### 🔍 Knowledge ID Conflict Prevention (CRITICAL)

**MANDATORY Pre-Creation Checklist**:

1. **ALWAYS run `=khub` first** - Read Knowledge Hub #102 completely
2. **Check existing numbers** in your category section (e.g., "Device Knowledge")
3. **Identify next available number** (if 001, 002 exist, use 003)
4. **Never assume** - always verify existing entries before creating

**Common Mistakes to Avoid**:

- ❌ Creating KNOW-DEVICE-001 when it already exists
- ❌ Not checking Knowledge Hub #102 before creating entries
- ❌ Assuming numbers without verification
- ❌ Creating duplicate knowledge IDs

**Correct Workflow Example**:

```bash
# ❌ WRONG (creates duplicate)
= kupdate device "SHT30 sensor fix"  # Creates KNOW-DEVICE-001 (duplicate!)

# ✅ RIGHT (prevents duplicates)
= khub                              # Read Knowledge Hub #102
# See: KNOW-DEVICE-001, KNOW-DEVICE-002 exist
= kupdate device "SHT30 sensor fix" # Creates KNOW-DEVICE-003 (correct!)
```

### Auto-Label Creation

**System Behavior**:

```bash
# When =kupdate device "CU12 lock-back solution" is used:
# 1. Check if 'knowledge-device' label exists
# 2. If not, create: gh label create knowledge-device --color "1d76db" --description "Device integration knowledge"
# 3. Apply label to knowledge issue
# 4. Auto-generate Knowledge ID: KNOW-DEVICE-001
```

**Knowledge Labels Created Automatically**:

- `knowledge-device` - Device integration knowledge
- `knowledge-database` - Database and persistence knowledge
- `knowledge-architecture` - System design and patterns
- `knowledge-debug` - Debugging and troubleshooting
- `knowledge-workflow` - Development workflow improvements

### Enhanced Knowledge Hub Integration

**New Automated Commands**:

**`=klink [knowledge-issue-number]`**:

- Automatically detects category from knowledge issue labels
- Places knowledge link in appropriate Knowledge Hub section
- Updates statistics counters
- Maintains proper markdown formatting

**`=ksync`**:

- Scans all issues with `knowledge-*` labels
- Synchronizes Knowledge Hub with all existing knowledge entries
- Updates statistics and distribution
- Fixes broken links and formatting
- Ensures hub reflects current knowledge base state

**Enhanced `=kupdate` Workflow**:

1. Creates knowledge GitHub issue ✅
2. **Automatically prompts**: "Link to Knowledge Hub #102? (y/n)"
3. If "y": Runs `=klink` automatically ✨
4. Maintains consistency across knowledge system

**Command Implementation Details**:

**`=klink [issue-number]` Implementation**:

1. **Issue Analysis**: Extract title, labels, and description
2. **Category Detection**: Parse `knowledge-[category]` label
3. **Format Entry**: `**KNOW-[CATEGORY]-[NUMBER]**: [Title](issue-link) - Brief description`
4. **Section Insert**: Add to appropriate "Recent Entries" section
5. **Statistics Update**: Increment total and category counts
6. **Timestamp Update**: Set "Last Updated" to current date

**`=ksync` Implementation**:

1. **Knowledge Discovery**: Scan all issues with `knowledge-*` labels
2. **Category Processing**: Group by label type (device, database, etc.)
3. **Entry Generation**: Create standardized format for each found issue
4. **Hub Reconstruction**: Replace all category sections with complete lists
5. **Statistics Calculation**: Recalculate all counts from scratch
6. **Format Validation**: Ensure proper markdown structure and valid links

**Hub Integration Benefits**:

- ✅ **No more manual linking required**
- ✅ **Automatic statistics updates**
- ✅ **Consistent formatting maintained**
- ✅ **Centralized knowledge discovery**
- ✅ **Real-time hub synchronization**

### Knowledge Search & Retrieval

**Search Capabilities**:

```bash
=ksearch "CU12 lock-back"    # Full-text search across all knowledge
=kcategory device           # Show all device-related knowledge
=krecent                    # Last 5 knowledge entries
=khub                       # Go to main Knowledge Hub issue
=ksync                      # Synchronize hub with all knowledge entries
=klink 116                  # Link knowledge issue #116 to hub
```

**Search Optimization**:

- Knowledge entries include searchable tags
- Problem statements use clear, technical language
- Solutions include specific keywords and technologies
- Cross-references link related knowledge
- Hub ensures all knowledge is discoverable from central location

### Knowledge Structure

**Each Knowledge Entry Contains**:

- **Problem Statement**: Clear description of what was solved
- **Solution Implementation**: Step-by-step working solution
- **AI Honest Feedback**: What worked, what didn't, lessons learned
- **Things to Avoid**: Common pitfalls and their consequences
- **Prerequisites**: What to check before starting
- **AI Self-Improvement**: Insights for future problem-solving
- **Links & References**: Connections to source issues/PRs/code
- **Verification Status**: Testing and validation state

---


## 🏗️ Technical Architecture

### Core Stack

- **Language**: TypeScript
- **Web Framework**: Next.js 14+ (App Router)
- **UI Library**: Shadcn UI (Tailwind CSS)
- **State Management**: React Hooks / Context
- **Database**: None (Stateless / Local Storage)
- **Deployment**: Vercel
- **Platform**: LINE LIFF

### Project Structure

```
app/
├── layout.tsx       # Root layout & Fonts
├── page.tsx         # Main Logic Container
└── components/
    ├── step-distance.tsx
    ├── step-input.tsx
    ├── step-result.tsx
    └── ui/          # Shadcn components
utils/
    └── calculator.ts # Core logic
```

### Key Features

- **Race Plan Calculation**: Negative Split algorithm
- **Story Mode**: Narrative result generation
- **Stateless**: No database required
- **Responsive**: Mobile-first for LINE LIFF

### Development Commands

```bash
npm run dev            # Development server
npm run build          # Production build
npm run lint           # Lint checks
```

### Performance Metrics

- **LCP**: < 1.5s (Mobile)
- **Calculation Time**: < 100ms (Client-side)
- **Bundle Size**: Optimized for 3G networks

---

## 🎯 Quality Standards

### Code Quality Requirements

- **TypeScript**: Strict mode enabled
- **ESLint**: Zero warnings
- **Prettier**: Consistent formatting
- **Build**: 100% success rate
- **Responsiveness**: Verified on Mobile view (320px+)

### Security Standards

- **Client-Side**: No sensitive data storage
- **Input Validation**: Basic checks for user inputs
- **No Auth**: Public access (Stateless)

### Template-Guided Quality

- **Context Issues**: Complete PLANNING READINESS CHECKLIST ✅ (Always GitHub Issues)
- **Task Issues**: 100% build/lint/test requirements mandatory (Always GitHub Issues)
- **Mode Execution**: Follow mode-specific behavior exactly
- **Template Consistency**: All issues follow template structures
- **File Policy**: NEVER create local .md files for issues - ALWAYS use GitHub Issues

---

## 📚 Reference Materials

### Templates

- `/docs/ISSUE-TEMP.md` - Context Issue Template for iterative discussions
- `/docs/TASK-ISSUE-TEMP.md` - Atomic Task Template for implementation
- `/docs/KNOWLEDGE-TEMP.md` - Knowledge Issue Template for structured learning

### Performance Metrics

- **Target**: API response time < 200ms (p95)
- **Goal**: 99.9% uptime for Tarot reading service
- **Reliability**: 99.99% accurate reading delivery
- **Database**: PostgreSQL via Supabase with automatic scaling
- **Queue**: Upstash Redis with serverless scaling
- **Cost**: ~$50-75/month for full stack at scale

### Security Notes

- **Input Validation**: Comprehensive validation for all user inputs
- **Authentication**: LINE LIFF OAuth + JWT with 7-day expiration
- **Data Protection**: Encrypted connections, secure token storage
- **Access Control**: Role-based access (user, admin levels)
- **Payment Security**: Stripe webhook verification, idempotent operations
- **Audit Trail**: Complete logs for readings and transactions

---

_This document focuses on agent-critical information for efficient workflow execution and safe development practices._