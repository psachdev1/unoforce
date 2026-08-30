# Unoforce Web MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a mobile-friendly chat at `unoforce.com` that shows a ranked daily lead brief, explains or drafts the next move, and remembers a natural-language lead update.

**Architecture:** Next.js renders one conversational workspace and a short product introduction. Convex stores anonymized leads, explicit agent updates, chat events, and daily-brief results. The first response engine is deterministic and narrow so the live demo does not depend on an unconfigured model or messaging provider; its interface can later be replaced by an LLM without changing storage or UI.

**Tech Stack:** Next.js 16.3.3, React 19.2.8, TypeScript, Convex 1.45.0, Vitest 4.1.11, CSS Modules/global CSS, Vercel.

**Spec:** `IDEA_SCOPE.md`

## Global Constraints

- The agent works through chat and never maintains a CRM screen.
- Today has no Meta, Twilio, Close, HubSpot, email, SMS, or live customer-data dependency.
- Seed data is fictional or anonymized before it reaches code or Convex.
- An explicit agent instruction always overrides an inferred next action.
- The golden path is: daily brief → why/draft → natural update → changed daily brief.
- Every deployed change is tested locally, committed, pushed, deployed from that commit, and smoke-tested live.
- No native Android or iOS app, brokerage features, automated prospect messages, campaigns, billing, or CRM dashboard.

## File Structure

- `app/layout.tsx` — page metadata, fonts, and application shell.
- `app/page.tsx` — public entry screen and chat workspace composition.
- `app/globals.css` — Unoforce tokens, responsive layout, states, and motion.
- `components/sales-coach.tsx` — chat interaction, quick prompts, loading and error states.
- `components/daily-brief.tsx` — ranked lead actions inside an assistant message.
- `lib/coach.ts` — narrow intent parsing, ranking, explanations, drafts, and updates.
- `lib/coach.test.ts` — golden-path and failure-case tests.
- `lib/demo-data.ts` — fictional real-estate lead context.
- `convex/schema.ts` — leads, instructions, and interaction-event tables.
- `convex/leads.ts` — seed, list, and explicit-update functions.
- `convex/events.ts` — evidence events for brief, explanation, draft, and saved update.
- `convex/README.md` — commands and environment setup without secrets.

---

### Task 1: Working Next.js Shell

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `next-env.d.ts`
- Create: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`
- Create: `.gitignore`

**Interfaces:**
- Produces: a server-rendered `/` route with an `#coach` target and no external service dependency.

- [ ] **Step 1: Add the app manifest and scripts**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint": "tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "convex": "1.45.0",
    "next": "16.3.3",
    "react": "19.2.8",
    "react-dom": "19.2.8"
  },
  "devDependencies": {
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "typescript": "latest",
    "vitest": "4.1.11"
  }
}
```

- [ ] **Step 2: Add the minimum route and styles**

The page must render the exact headline `Know which lead needs you next.` and an anchor labelled `Open my daily brief` targeting `#coach`. The honesty note must say the demo uses fictional customer context and is not connected to WhatsApp or a CRM.

- [ ] **Step 3: Install and verify**

Run: `npm install && npm run lint && npm run build`

Expected: all commands exit 0 and `/` is statically generated.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts next-env.d.ts app .gitignore
git commit -m "feat: add Unoforce web shell"
```

### Task 2: Tested Sales-Coach Engine

**Files:**
- Create: `lib/demo-data.ts`
- Create: `lib/coach.ts`
- Create: `lib/coach.test.ts`

**Interfaces:**
- Produces: `replyToCoach(input: string, leads: Lead[]): CoachReply`
- Produces: `applyLeadUpdate(input: string, leads: Lead[]): { leads: Lead[]; reply: CoachReply }`
- Produces types: `Lead`, `LeadAction`, and `CoachReply`.

- [ ] **Step 1: Write failing golden-path tests**

Tests must prove that `What should I do today?` returns three ranked actions, `Why Priya?` cites stored context, `Draft a message for Priya` produces an editable draft, and `Wait for the ABC Builders launch before contacting Priya` changes Priya's next action without changing another lead.

- [ ] **Step 2: Verify failure**

Run: `npm test`

Expected: FAIL because `lib/coach.ts` does not exist.

- [ ] **Step 3: Implement only the supported intents**

Use case-insensitive phrase matching for daily brief, why, draft, and update. Return a helpful unsupported-input response listing those four actions. Never invent missing customer facts; name the missing fact in the response.

- [ ] **Step 4: Verify behavior**

Run: `npm test && npm run lint`

Expected: all golden-path and unsupported-input tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib
git commit -m "feat: add tested sales coach flow"
```

### Task 3: Conversational Product Interface

**Files:**
- Create: `components/sales-coach.tsx`
- Create: `components/daily-brief.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `replyToCoach`, `applyLeadUpdate`, `CoachReply`, and fictional leads from Task 2.
- Produces: keyboard-accessible chat with local session persistence and evidence-friendly visible outcomes.

- [ ] **Step 1: Build the golden path**

Render three quick prompts: `What should I do today?`, `Help me prepare for Priya`, and `Add an update about Priya`. The composer submits on Enter and preserves Shift+Enter for a new line. Each submitted message and assistant reply remains visible.

- [ ] **Step 2: Make the daily brief the signature element**

Show ranked lead actions as a compact field briefing inside the conversation: rank, lead, reason, recommended move, and due cue. Do not render a sidebar, data table, pipeline, or dashboard metric cards.

- [ ] **Step 3: Apply the visual system**

Intent: a busy solo real-estate agent between meetings needs a calm, decisive briefing. Hierarchy: today's ranked brief wins through contrast and space. Palette: blueprint navy, listing-paper white, survey-line grey, site-safety amber, and action teal. Depth: quiet surface shifts and one subtle shadow system. Typography: a distinctive editorial heading face plus a highly readable humanist body face. Spacing: 4px base, compact controls, open space around the brief.

- [ ] **Step 4: Verify responsive and interaction states**

Run: `npm test && npm run lint && npm run build`

Expected: commands exit 0; the layout has visible focus styles, mobile rules at 720px, reduced-motion handling, empty/loading/error copy, and 44px action targets.

- [ ] **Step 5: Commit**

```bash
git add app components lib
git commit -m "feat: ship conversational daily brief"
```

### Task 4: Convex Memory and Evidence

**Files:**
- Create: `convex/schema.ts`
- Create: `convex/leads.ts`
- Create: `convex/events.ts`
- Create: `convex/README.md`
- Modify: `components/sales-coach.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: `api.leads.list`, `api.leads.seedDemo`, `api.leads.saveInstruction`, and `api.events.record`.
- Consumes: `NEXT_PUBLIC_CONVEX_URL`; if missing, the UI remains usable in clearly labelled local-demo mode.

- [ ] **Step 1: Define minimum durable state**

`leads` stores `demoOwner`, `name`, `context`, `reason`, `nextAction`, `followUpAt`, and `explicitInstruction`. `events` stores `sessionId`, `kind`, `leadName`, and `createdAt`. Allowed event kinds are `brief_viewed`, `reason_requested`, `draft_requested`, and `instruction_saved`.

- [ ] **Step 2: Add narrow Convex functions**

Seed only when the demo owner has no leads. Save instructions by exact normalized lead name and return a clear error for zero or multiple matches. Record one event per completed user action, never page views as completed actions.

- [ ] **Step 3: Connect with a safe fallback**

When `NEXT_PUBLIC_CONVEX_URL` exists, use Convex queries and mutations. Without it, keep the same golden path in browser state and show `Demo data is stored on this device for this session.` Do not claim durable cloud memory in fallback mode.

- [ ] **Step 4: Generate and verify Convex types**

Run: `npx convex dev --once && npm test && npm run lint && npm run build`

Expected: Convex generates `_generated`, all checks exit 0, and one saved instruction survives a refresh when connected.

- [ ] **Step 5: Commit**

```bash
git add convex components app package.json package-lock.json
git commit -m "feat: persist coach memory in Convex"
```

### Task 5: GitHub, Vercel, and Live Proof

**Files:**
- Modify: `IDEA_SCOPE.md`
- Create: `CHANGELOG.md`

**Interfaces:**
- Produces: a public live URL, public source commit, and a written smoke-test result.

- [ ] **Step 1: Run the local release gate**

Run: `npm test && npm run lint && npm run build`

Expected: every command exits 0.

- [ ] **Step 2: Test the four-turn flow locally**

Run the daily brief, ask why Priya is present, request a draft, save the ABC Builders waiting instruction, then request the brief again. Expected: Priya's action changes and no other lead is modified.

- [ ] **Step 3: Push the exact tested commit**

```bash
git add IDEA_SCOPE.md CHANGELOG.md
git commit -m "docs: record web MVP release"
git push origin main
```

- [ ] **Step 4: Deploy the committed revision**

Run: `vercel --prod`

Expected: Vercel returns an HTTPS production URL tied to the pushed revision. Add `unoforce.com` only after the Vercel URL passes.

- [ ] **Step 5: Smoke test production**

Open the live URL logged out on desktop and mobile. Repeat the four-turn flow, refresh, confirm the saved instruction remains, and confirm the honesty note is visible. Record the tested commit and result in `CHANGELOG.md`.

## Self-Review

- Spec coverage: all three daily jobs, explicit-instruction precedence, fictional data, chat-only UI, Convex evidence, and deployment discipline have tasks.
- Scope protected: WhatsApp, CRM APIs, automated messages, authentication, billing, and dashboards are absent.
- Type consistency: the UI consumes the same `Lead` and `CoachReply` types produced by the coach engine; Convex functions use exact names listed in Task 4.

