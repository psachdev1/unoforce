# Unoforce — Build Week Idea Scope

**Owner:** Prashant Sachdev  
**Build Week:** 29 August–5 September 2026  
**Primary track:** AI Agent as a Service  
**Time limit:** About four hours per day  
**Stack:** Codex or Claude Code, GitHub, Convex, Vercel  
**Status:** Idea locked; validation not yet passed; no code started

This file is the control plane for the build. If a new feature is not required by an acceptance test below, put it in the parking lot instead of building it.

## Build and Deployment Discipline

For every live change, use this order:

1. Make one small, reviewable change.
2. Run the relevant automated checks and the core-flow check locally.
3. Commit the working change to Git with a clear message.
4. Push that exact commit to the public GitHub repository.
5. Deploy that committed revision to Vercel; never deploy uncommitted local work.
6. Run the core-flow check on the live URL and record whether it passed.

Keep the previous verified deployment available as the rollback point. If the live check fails, restore that known working revision before making another feature change.

## Before Any Build: Test the Riskiest Assumption

**Assumption:** A real-estate agent's normal 1:1 WhatsApp messages, plus occasional natural instructions to a private bot, contain enough context to produce a daily action list the agent trusts. The agent should not need CRM fields, forms, or a recap template.

**30-minute no-code test:**

1. Ask one WhatsApp-first solo real-estate agent for five anonymized, recent 1:1 lead threads.
2. Read only the messages. Do not ask the agent to explain them first.
3. For each lead, write the known facts, unknown facts, waiting condition, next action, and follow-up timing.
4. Let the agent add missing context in natural language, as if messaging Unoforce: “For Rahul, wait for the ABC Builders launch,” or “Follow up in two months.”
5. Produce a ranked “Today's Calls” list by hand.
6. Ask the agent to mark every proposed action **useful**, **wrong**, or **missing context**.

**Pass:** At least four of five proposed actions are useful; no important fact is invented; the agent says the list would change whom they contact next.

**Fail:** Fewer than four actions are useful, the agent must explain most threads verbally, or the agent says, “I already know whom to call.”

**Decision:**

- If it passes, build the smallest complete flow below.
- If it fails because chat lacks context, test whether natural bot notes repair the result.
- If it still fails, stop building Unoforce for this week. Do not hide the failure by adding a dashboard or CRM fields.

## Idea Lock

### One-Paragraph Test

> “A growing solo real-estate agent receives prospect inquiries in WhatsApp from paid ads or property marketplaces and accumulates more active chats than they can reliably manage from memory. Whenever they need to follow up, they try to reconstruct what each prospect needs and what should happen next, but important context and promised actions can remain buried across WhatsApp and the tools they already use. Today they search old conversations and systems, rely on memory, and follow up ad hoc. My product: the agent asks their personal sales coach inside WhatsApp what needs attention → gets a ranked list showing whom to contact, why, and what to do next. It worked if the agent acts on the right follow-ups without opening or maintaining another system.”

This is the primary-audience hypothesis, not a verified description of a named agent. Ila P., SriRam, Ram, and Vaibhav are candidate contacts. Prioritize agents who receive inbound WhatsApp inquiries from paid ads or property marketplaces, but do not exclude agents who already manage a meaningful volume of long-running client follow-ups in WhatsApp. Replace the generic opening with the first tested agent's private label and age after confirming how they acquire and manage leads.

| Decision | Locked scope |
|---|---|
| Product | Unoforce is a personal sales coach inside WhatsApp that uses available customer context to tell an agent who needs attention today, why, and what to do next. |
| User | Primary entry segment: a growing solo residential real-estate agent who receives inbound prospect inquiries in WhatsApp from paid ads or property marketplaces. Wider eligible user: a solo agent who manages a meaningful volume of long-running client follow-ups in WhatsApp, even if those clients came through referrals or their network. The account belongs to the agent, not a brokerage. |
| Pain | Important client context and promised follow-ups remain scattered across long-running conversations, so the agent loses the right next action. |
| Core action | The agent continues normal client conversations. Unoforce captures supported messages, accepts natural corrections or instructions in a private bot chat, and returns “Today's Calls” in WhatsApp. |
| Account boundary | One account belongs to one agent. Nothing is shared with a brokerage, manager, team, or other agent. |
| Explicit instruction rule | An agent's explicit instruction overrides an inferred fact or action. Uncertain inferences must be confirmed rather than silently saved as facts. |
| Client matching | Match by phone number or an unambiguous existing name. Ask one clarification question when more than one client matches. |
| Data promise | Keep captured client records available while the customer's paid account is active. Production use also requires export, deletion, consent, and secure account identity. |

### Product Surface: WhatsApp Only for the Agent

The agent's working surface is the dedicated WhatsApp Business number they already use. They do not install a mobile app, open a web dashboard, or maintain a second workspace.

**Frozen product constraint:** Every regular agent action and product response must happen inside WhatsApp through an interface officially supported by WhatsApp. Unoforce will not build an Android app, iOS app, agent-facing web app, CRM screen, or second messaging workspace. Changing this constraint requires choosing a different product, not adding a feature.

The private Unoforce bot inside WhatsApp has two jobs in v1:

1. Accept natural instructions and corrections about a client.
2. Send the ranked “Today's Calls” list with the reason and suggested action for each client.

The required Vercel page exists for Build Week testing, onboarding, evidence, and failure inspection. It is not the agent's daily workspace and must not grow into a CRM dashboard.

### Landing Page Contract

The landing page exists to explain the product and open the WhatsApp demo. It is not the product workspace.

**Headline:** Your personal sales coach, inside WhatsApp.

**Supporting line:** Know who needs attention today, remember why, and prepare the next message or call—without opening another system.

**How it works:**

1. Keep working with clients in WhatsApp.
2. Ask Unoforce about a lead or add missing context naturally.
3. Get a daily action list plus help preparing the next message or call.

**Primary action:** Try the WhatsApp demo.

**Honesty note:** The Build Week version uses a Meta test number and anonymized sample customer context.

Do not add pricing, testimonials, comparisons, a feature catalogue, or a CRM dashboard before the core demo works.

### Two-Minute MVP Demo

1. Open `unoforce.com` and tap **Try the WhatsApp demo**.
2. Ask Unoforce: “What should I do today?”
3. Receive three ranked leads with a reason and suggested next action.
4. Ask: “Why should I contact Priya?”
5. Receive the remembered context plus a draft message or call outline.
6. Say: “Wait for the ABC Builders launch before contacting her.”
7. Receive confirmation that the instruction was remembered.
8. Ask for today's list again and see Priya's action changed.

The demo proves persistent customer memory, useful prioritization, preparation help, and natural correction—all inside WhatsApp.

### Long-Term Product Direction — Not Build Week Scope

Unoforce can eventually become the agent's real-estate “second brain”: a WhatsApp partner that remembers permitted customer context and answers questions such as “What did Rahul need?”, “Who is waiting for the ABC Builders launch?”, or “Which buyers may now fit this property?” This direction strengthens the same WhatsApp-native relationship memory; it does not authorize extra channels, a mobile app, a web app for agents, or broad features during Build Week.

If an agent already uses a CRM, Unoforce may eventually read and update that CRM behind the scenes while WhatsApp remains the only interface the agent uses. If the agent has no CRM, Unoforce keeps the durable customer memory in Convex. “Works with every CRM” is not a Build Week promise.

### Build Week Seed Data

Use a one-time, deliberately selected Close CRM export to seed a small set of anonymized demonstration leads in Convex. Remove or replace real names, phone numbers, email addresses, addresses, and private conversation content before the data enters the repository or test environment.

Do not connect the live Close organization during the first build. Close API keys and OAuth currently inherit broad access from the authorizing Close user. A live Close integration is allowed only after the WhatsApp core flow works and only if it is the largest observed blocker.

## The Smallest Complete Flow

1. A supported new 1:1 client message is received after the agent is connected.
2. Unoforce associates it with that agent and client.
3. It stores extracted facts separately from explicit agent instructions.
4. The agent can send a natural instruction such as “For Rahul, follow up in two months.”
5. Unoforce applies the instruction to the correct client, asking one question if the name is ambiguous.
6. Unoforce produces one ranked “Today's Calls” message containing the client name, why the client appears today, and the suggested action.
7. The agent can correct the result through another natural message.

The Sunday version may use hardcoded test data and one preselected agent. It must still complete this whole loop.

## v1 Does Not Do

- No brokerage, manager, team, or shared account access.
- No old-message, phone-contact, CRM, or spreadsheet import.
- No group chats.
- No WhatsApp, cellular, or video call capture.
- No physical-meeting capture unless the agent later mentions the context in WhatsApp.
- No email, SMS, Slack, dialer, mobile app, or browser dashboard for daily use.
- No property listings, MLS, transaction management, legal records, accounting, or document storage.
- No bulk messages, campaigns, or automatic nurturing sequences.
- No pipeline interface beyond facts, waiting conditions, next actions, and dates.
- No billing, brokerage reporting, multiple segments, or US-market customization.
- No claim that Unoforce can access unsupported WhatsApp data.

## Known Boundaries to Verify

Treat these as build risks until tested on the actual account:

- India eligibility and onboarding for WhatsApp Business App Coexistence.
- Which new 1:1 messages and agent-sent messages arrive through the official API.
- Whether the agent can keep using the same WhatsApp Business App number during the pilot.
- The exact onboarding, consent, template, and business-verification requirements.
- What message history is available. v1 does not depend on historical sync.

If Meta onboarding blocks the week, preserve the product test with a clearly labelled WhatsApp-like test console on Vercel. Do not present that fallback as a live WhatsApp integration.

## First Delivery Milestone

The first delivery is one ugly, hardcoded, complete flow deployed to Vercel and pushed to a public GitHub repository. It is not a polished interface or a reusable platform.

**Acceptance test:** A person who receives only the live link can complete the test conversation, add one natural instruction, and see the resulting “Today's Calls” list without Prashant explaining the product.

**If behind, cut to this:** Use one fixed agent, two fixed clients, and hardcoded extraction results. Keep real storage, the natural-instruction step, the ranked output, the public deployment, and the public repository.

## Fixed Build Week Milestones

### 1. Saturday, 29 August — Pick the Idea

**Tasks:**

- Name the user, their current behavior, and the one outcome.
- Lock the scope and non-goals in this file.
- Record that the decision was completed late on Sunday, 30 August; do not pretend the original deadline was met.

**Acceptance test:** This file identifies one user, one painful moment, one core action, one primary track, and explicit non-goals.

**If behind, cut to this:** Keep only solo India-first residential agents, new supported 1:1 messages, natural bot instructions, and one daily list.

### 2. Sunday, 30 August — Smallest End-to-End Version

**Tasks:**

- Run the 30-minute assumption test before building.
- Create the first ugly, hardcoded, complete flow.
- Store the minimum agent, client, message, fact, instruction, and action data in Convex.
- Deploy it to Vercel.
- Push it to a public GitHub repository.
- Give the live link to one person without explaining the flow.

**Acceptance test:** The no-code test passes, and the live product completes the seven-step core flow without spoken guidance. The Vercel deployment loads and the public repository contains the deployed version.

**If behind, cut to this:** Use the WhatsApp-like Vercel test console, one agent, two clients, and hardcoded extraction. Do not spend Sunday waiting for Meta approval.

### 3. Monday, 31 August — Watch Three Agents Use It

**Tasks:**

- Ask Ila P., SriRam, Ram, and Vaibhav how they acquire leads, whether ad or property-marketplace prospects start conversations in WhatsApp, and how many long-running follow-ups they manage there.
- Prioritize agents receiving inbound WhatsApp inquiries from ads or property marketplaces for the three sessions. If fewer than three are reachable, include high-volume WhatsApp follow-up agents and label the acquisition source in the notes.
- Give each agent the live link or connected WhatsApp flow without a walkthrough.
- Watch where each person stops, hesitates, corrects a result, or distrusts an action.
- Record useful, wrong, and missing-context actions separately.
- Ask what they would have done that day without the list.

**Acceptance test:** Three observed sessions are completed. Each has notes showing the first blocker, action-quality results, and whether the list changed a real next action.

**If behind, cut to this:** Complete two live sessions and one recorded self-serve test. Do not replace observation with opinions about the idea.

### 4. Tuesday, 1 September — Direct Outreach Where Users Already Are

**Tasks:**

- Send direct WhatsApp invitations to at least ten relevant agents already in Prashant's network.
- Use one short message, one short demonstration, and one live link.
- Track delivered invitations, replies, accepted tests, completed first actions, and objections.
- Follow up personally with interested agents; do not launch in unrelated public communities.

**Acceptance test:** Ten named, relevant agents receive the invitation, and every reply or signup is recorded without duplication.

**If behind, cut to this:** Send five highly personal invitations to agents most likely to test immediately. Do not spend time polishing a public launch post.

### 5. Wednesday, 2 September–Friday, 4 September — Learn, Fix, Repeat

**Tasks:**

- Speak with users who tried the product.
- Rank blockers by how many users they stop and whether they break the core action.
- Fix only the single biggest blocker first.
- Redeploy and ask the affected users to repeat the failed action.
- Repeat this loop while time remains.
- Move every unrelated request to the parking lot.

**Acceptance test:** At least one observed blocker is fixed, deployed, and retested by a user who previously encountered it. The before-and-after result is recorded.

**If behind, cut to this:** Fix one blocker for one complete user flow. Do not add features to compensate for a broken core loop.

### 6. Saturday, 5 September — Verify and Submit

**Deadline:** 11:00 AM IST submission; 3:00 PM IST demos.

**Morning tasks, in order:**

1. Verify the production link in a private browser window.
2. Run the complete core flow once using non-sensitive test data.
3. Verify the public GitHub repository opens and matches the deployed product.
4. Export the final numbers and check them against source records.
5. Capture screenshots of the live flow and every number claimed.
6. Write a short statement separating actual WhatsApp integration from any simulated fallback.
7. Submit the live product, public repository, numbers, and required description before 11:00 AM IST.
8. Preserve the remaining time for demo rehearsal and failure recovery.

**Acceptance test:** The submission is acknowledged before 11:00 AM IST; the live link and public repository work; every claimed number has a screenshot or source record; the demo can be completed without private customer data.

**If behind, cut to this:** Freeze features Friday night. Submit the smallest verified flow with honest numbers and a clearly disclosed integration fallback. Do not make an unverified WhatsApp claim.

## Numbers to Track

- Relevant agents invited.
- Agents who replied.
- Agents who started onboarding or a product test.
- Agents who completed the core flow.
- Supported client threads captured.
- Natural agent instructions recorded.
- Suggested actions produced.
- Suggested actions marked useful, wrong, or missing context.
- Suggested actions acted upon.
- Agents returning on a later day.
- Prospect replies attributed to an Unoforce-suggested action.
- Users who state a willingness to pay; keep stated willingness separate from actual payments.

Do not invent targets or combine different measures into one larger number.

## Parking Lot

Put every mid-build feature request here. Nothing leaves this list during Build Week unless it removes the largest observed blocker in the core flow.

- Six-month WhatsApp history sync.
- Phone-contact import.
- General CSV import. The one-time developer-prepared anonymized Close seed is allowed; agent-facing import is not.
- HubSpot and Close import or sync.
- Group conversations.
- Call capture or transcription.
- Physical-meeting capture beyond natural agent notes.
- Automatic nurturing sequences.
- Property listings or project-launch feeds.
- Open-ended questions to the bot across all remembered customer context.
- Proactive “second brain” suggestions beyond the ranked daily action list.
- Dashboard and reporting.
- Brokerage and team features.
- Shared accounts and manager visibility.
- Other solo-business segments.
- US-market version.
- Billing and subscription management.
- Multiple messaging providers or a Business Solution Provider adapter.
- Brand or trademark investment in the Unoforce name.

### Permanent Non-Goals

- Android app.
- iOS app.
- Agent-facing web app or CRM dashboard.
- Custom dialer or device call-log access.
- Any daily workflow that makes the agent leave WhatsApp.

## Scope-Change Rule

When a feature is proposed, ask:

1. Did an observed target user fail the core flow without it?
2. Is it the largest current blocker?
3. Can it be built, deployed, and retested within the remaining time?

All three answers must be yes. Otherwise, add it to the parking lot.

## Next Single Action

Message one WhatsApp-first solo real-estate agent now and book a 30-minute session today to review five anonymized recent lead threads for the riskiest-assumption test.
