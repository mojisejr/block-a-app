# Workflow Template Repository

This repository contains a production-ready agent-centric workflow template with required docs, issue/task templates, and comprehensive agent instructions. Use this repository as a GitHub template for future projects.

**Latest Update:** November 2025 - Enhanced with Response Quality Standards, Language Policy, and advanced commands (/pck, /aud)

Quick goals:
- Keep workflow rules, safety policies, and command templates intact.
- Provide a simple `setup.sh` to help fill project-specific metadata into `CLAUDE.md`.
- Support multiple execution modes (MANUAL/COPILOT) with agent-specific instructions.
- Enforce response quality standards and language-matching policies.

Files you should see in the root:
- `AGENTS.md` — agent workflow, safety rules, response standards, and implementation checklist
- `CLAUDE.md` — workflow and project metadata (template placeholders)
- `docs/ISSUE-TEMP.md` — context issue template
- `docs/TASK-ISSUE-TEMP.md` — atomic task issue template
- `docs/KNOWLEDGE-TEMP.md` — knowledge capture template
- `.claude/commands/` — 16 slash command definitions (mode, fcs, plan, pck, aud, impl, pr, khub, kupdate, klink, ksync, ksearch, krecent, kcategory, rrr)
- `.claude/settings.local.json` — agent permissions and settings configuration
- `.github/agents/` — agent-specific instruction files (7 files)
- `.github/instructions/` — core response standards and domain-specific guidance (9 files)
- `setup.sh` — interactive setup helper (run after cloning to fill project metadata)

## What's New in This Update

### ✨ New Slash Commands
- **`/pck [issue-number]`** — Plan check: analyze GitHub issue, scan codebase for context, show implementation steps
- **`/aud [question]`** — Audit: find bugs, suggest fixes, validate assumptions, generate implementation plans

### 📋 Enhanced Standards
- **Response Quality Standards** (5-point framework)
  - On-Point (ตรงประเด็น) — answer only what was asked
  - Good Context Ordering — simple to complex progression
  - Exact Details (ยึดมั่นในรายละเอียด) — accurate and specific
  - Security-First Focus — always consider security
  - Senior Developer Mindset — unbiased, expert feedback

- **Language Matching Policy** (Automatic)
  - Thai questions → Thai responses
  - English questions → English responses
  - Mixed → Follow primary language
  - Technical terms always in English

### 🏗️ New Directory Structure
- `.claude/commands/` — 16 slash command implementations
- `.claude/settings.local.json` — permissions and configuration
- `.github/agents/` — 7 agent-specific instruction files
- `.github/instructions/` — 9 core response and domain guidance files

### 📚 Complete Command Suite (16 Total)
`/mode` • `/fcs` • `/plan` • `/pck` • `/aud` • `/impl` • `/pr` • `/khub` • `/kupdate` • `/klink` • `/ksync` • `/ksearch` • `/krecent` • `/kcategory` • `/rrr`

Quick start (macOS, zsh)

1) Clone this repo as a template for your project:

```bash
git clone https://github.com/<your-account>/<template-repo>.git my-project
cd my-project
```

2) Run the setup helper to populate `CLAUDE.md` with project metadata. The script will ask for your repository URL and the `claude` CLI alias (if you use a custom alias):

```bash
./setup.sh
```

Notes about the setup script
- The script attempts to call your `claude` CLI with `-p` and a prompt that instructs the assistant to fill top-level metadata while preserving workflow sections. If your claude CLI uses a different flag or interface, provide the correct alias that wraps it accordingly.
- If the `claude` CLI is not available, the script can run in offline/manual mode and create a temporary file for manual editing.
- The script always shows a diff and requires confirmation before overwriting `CLAUDE.md`.

How to adapt the template for your stack
- Replace placeholder tokens such as `[PROJECT_NAME]`, `[REPOSITORY_URL]`, `[PRIMARY_LANGUAGE]`, `[FRAMEWORK]` with real values.
- Update `docs/TASK-ISSUE-TEMP.md` build/test commands to match your stack (for example, replace `[build command]` and `[test command]`).

Optional next steps to make this a polished template repository:
- Add a LICENSE (MIT recommended) and `CONTRIBUTING.md`.
- Add `.github/ISSUE_TEMPLATE/*` and `PULL_REQUEST_TEMPLATE.md` for repo-level automation.
- Add a minimal CI workflow that validates docs and runs basic checks.

If you want, I can implement any of the optional steps above (LICENSE, CONTRIBUTING, GitHub meta, CI). Tell me which one to start with.

## Advanced Features

### Mode-Based Execution
The template supports two execution modes controlled via `/mode`:
- **MANUAL** — Tasks assigned to you for direct implementation
- **COPILOT** — Tasks assigned to @copilot for automated implementation

### Agent Instructions
Comprehensive agent guidance in `.github/agents/` ensures consistent behavior:
- `plan.agents.md` — Context hallucination prevention and task creation
- `impl.agents.md` — Implementation workflow with Red-Green-Refactor TDD
- `pr.agents.md` — Pull request creation and validation standards
- `fcs.agents.md` — Context issue management and discussion
- And more for mode-specific execution...

### Response Instructions
Domain-specific guidance in `.github/instructions/`:
- `response.instructions.md` — Core response quality standards (MANDATORY for all responses)
- `api.instructions.md` — API design, authentication, and error handling
- `architect.instructions.md` — System architecture and technology stack patterns
- `database.instructions.md` — Database schema, migrations, and security (RLS)
- `impl.instructions.md` — Implementation workflow details and validation
- `plan.instructions.md` — Task planning with hallucination prevention checklist
- `pr.instructions.md` — Pull request workflow from staging to main
- `fcs.instructions.md` — Context issue template and management
- `ui.instructions.md` — UI/UX design systems and accessibility

### Knowledge Management System
Integrated knowledge capture and retrieval for project insights:
- `/khub` — Central knowledge hub (GitHub Issue by default)
- `/kupdate [category] "[topic]"` — Create knowledge entries with structured format
- `/klink [issue-number]` — Automatically link knowledge to hub
- `/ksync` — Synchronize hub with all knowledge entries
- `/ksearch "[query]"` — Full-text search across knowledge base
- `/krecent` — Show recent 5 knowledge updates
- `/kcategory [category]` — Browse category-specific knowledge

Categories include: device, database, architecture, debug, workflow, frontend, backend

### Test-First Development (TDD)
All task templates enforce Red-Green-Refactor cycle:
- **Red Phase** — Write failing tests BEFORE code implementation
- **Green Phase** — Implement minimal code to pass tests
- **Refactor Phase** — Improve code quality while tests remain passing

This ensures high test coverage and code quality from the start.

## Workflow Architecture

```
Context Discussion (/fcs)
         ↓
     Planning (/plan, /pck)
         ↓
  Pre-Implementation Check (/pck, /aud)
         ↓
  Implementation (/impl)
  - Red Phase: Write tests
  - Green Phase: Implement code
  - Refactor Phase: Improve quality
         ↓
  Full Validation:
  - Build: 100% success
  - Lint: 0 warnings
  - Format: Consistent
  - Tests: All passing
         ↓
   Pull Request (/pr)
  - Feature branch → staging
  - Validation report included
  - Ready for review
         ↓
  Knowledge Capture (/kupdate, /klink)
  - Document learnings
  - Link to knowledge hub
  - Make discoverable
```

## Response Quality Standards (Mandatory)

Every response from agents using this template follows these standards:

1. **On-Point (ตรงประเด็น)** — Answer only what was asked, no out-of-scope information
2. **Good Context Ordering** — Simple to complex progression, ordered for comprehension
3. **Exact Details** — Accurate, specific information with file/function names
4. **Security-First Focus** — Always consider security implications first
5. **Senior Developer Mindset** — Provide unbiased, expert feedback

## Language Matching Policy

The template automatically matches user language:
- **Thai questions** → Thai responses (except technical terms in English)
- **English questions** → English responses
- **Mixed language** → Follow the primary language
- **Technical terms** — Always use English (Rust, Cargo, PostgreSQL, etc.)

This ensures better communication and context preservation.
