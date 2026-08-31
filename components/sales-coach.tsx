"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { activityOutcomeNeedsFollowUp, applyLeadUpdate, classifyActiveInput, replyToCoach, type CoachReply, type Lead } from "@/lib/coach";
import { demoLeads } from "@/lib/demo-data";
import { DailyBrief } from "./daily-brief";

type Message = {
  id: number;
  role: "agent" | "coach";
  text: string;
  reply?: CoachReply;
};

const initialMessage: Message = {
  id: 0,
  role: "coach",
  text: "Good morning. I’ve reviewed your sample leads. Ask me to plan your day, explore any relationship, prepare a conversation, or remember what happened.",
};

function openingMessages(leads: Lead[]): Message[] {
  const plan = replyToCoach("Plan my sales day", leads);
  return [initialMessage, { id: 1, role: "coach", text: plan.text, reply: plan }];
}

const prompts = [
  "Plan my sales day",
  "Tell me everything about Priya",
  "Prepare my next message to Priya",
  "Wait for the ABC Builders launch before contacting Priya",
];

const activityPrompts = [
  "Summarize this relationship",
  "Which channel should I use and why?",
  "Prepare me for likely objections",
];

const demoStorageKey = "unoforce-demo-leads-v2";

function isCurrentDemoData(value: unknown): value is Lead[] {
  return Array.isArray(value) && value.length > 0 && value.every((lead) => {
    if (!lead || typeof lead !== "object") return false;
    const candidate = lead as Partial<Lead>;
    return typeof candidate.name === "string" && typeof candidate.workstream === "string" && typeof candidate.channel === "string";
  });
}

export function SalesCoach() {
  const [leads, setLeads] = useState<Lead[]>(demoLeads);
  const [messages, setMessages] = useState<Message[]>(() => openingMessages(demoLeads));
  const [input, setInput] = useState("");
  const [ready, setReady] = useState(false);
  const [activeLeadName, setActiveLeadName] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [laterDate, setLaterDate] = useState("");
  const [pendingOutcome, setPendingOutcome] = useState<string | null>(null);
  const nextId = useRef(2);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(demoStorageKey);
    let openingLeads = demoLeads;
    if (saved) {
      try {
        const parsed: unknown = JSON.parse(saved);
        if (isCurrentDemoData(parsed)) {
          openingLeads = parsed;
          setLeads(parsed);
        }
        else window.localStorage.removeItem(demoStorageKey);
      } catch {
        window.localStorage.removeItem(demoStorageKey);
      }
    }
    window.localStorage.removeItem("unoforce-demo-leads-v1");
    setMessages(openingMessages(openingLeads));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(demoStorageKey, JSON.stringify(leads));
  }, [leads, ready]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  function send(text: string) {
    const clean = text.trim();
    if (!clean) return;

    if (showCheckout && activeLeadName) {
      finishActivity("Update recorded", clean);
      setInput("");
      return;
    }

    if (pendingOutcome && activeLeadName) {
      finishActivity("Update recorded", `${pendingOutcome} ${clean}`);
      setPendingOutcome(null);
      setInput("");
      return;
    }

    const activeIntent = activeLeadName ? classifyActiveInput(clean) : "conversation";

    if (activeLeadName && activeIntent === "reschedule") {
      rescheduleFromMessage(clean);
      setInput("");
      return;
    }

    if (activeLeadName && activeIntent === "outcome") {
      if (activityOutcomeNeedsFollowUp(clean)) {
        setPendingOutcome(clean);
        setMessages((current) => [...current,
          { id: nextId.current++, role: "agent", text: clean },
          { id: nextId.current++, role: "coach", text: "Got it. What should happen next, when, and through which channel?" },
        ]);
        setInput("");
        return;
      }
      finishActivity("Update recorded", clean);
      setInput("");
      return;
    }

    const scopedInput = activeLeadName && !clean.toLowerCase().includes(activeLeadName.split(" ")[0].toLowerCase())
      ? `${clean} about ${activeLeadName}`
      : clean;
    const result = applyLeadUpdate(scopedInput, leads);
    const userMessage: Message = { id: nextId.current++, role: "agent", text: clean };
    const coachMessage: Message = {
      id: nextId.current++,
      role: "coach",
      text: result.reply.text,
      reply: result.reply,
    };
    setLeads(result.leads);
    setMessages((current) => [...current, userMessage, coachMessage]);
    setInput("");
  }

  function startActivity(name: string) {
    const lead = leads.find((item) => item.name === name);
    if (!lead) return;
    setActiveLeadName(name);
    setShowCheckout(false);
    setPendingOutcome(null);
    const coachMessage: Message = {
      id: nextId.current++,
      role: "coach",
      text: `Working on ${lead.name}. ${lead.context}\n\nRecommended channel: ${lead.channel}.\nNext move: ${lead.nextAction}\n\nAsk me anything about this relationship, or start the activity using whatever phone or tool you prefer.`,
    };
    setMessages((current) => [...current, coachMessage]);
  }

  function returnToToday() {
    if (activeLeadName) {
      setShowCheckout(true);
      return;
    }
    send("Plan my sales day");
  }

  function finishActivity(outcome: string, note?: string) {
    if (!activeLeadName) return;
    const name = activeLeadName;
    const detail = note?.trim() || outcome;
    const nextLeads = leads.map((lead) =>
      lead.name === name
        ? { ...lead, taskStatus: "completed" as const, explicitInstruction: detail }
        : lead,
    );
    setLeads(nextLeads);
    const coachMessage: Message = {
      id: nextId.current++,
      role: "coach",
      text: `Recorded for ${name}: ${detail}. Moving you back to the refreshed plan.`,
    };
    const plan = replyToCoach("Plan my sales day", nextLeads);
    const planMessage: Message = { id: nextId.current++, role: "coach", text: plan.text, reply: plan };
    setMessages((current) => [
      ...current,
      { id: nextId.current++, role: "agent", text: detail },
      coachMessage,
      planMessage,
    ]);
    setActiveLeadName(null);
    setShowCheckout(false);
    setPendingOutcome(null);
  }

  function skipActivity() {
    if (!activeLeadName) return;
    const name = activeLeadName;
    const plan = replyToCoach("Plan my sales day", leads);
    setMessages((current) => [...current,
      { id: nextId.current++, role: "coach", text: `${name} is still unfinished. Returning to today’s plan.` },
      { id: nextId.current++, role: "coach", text: plan.text, reply: plan },
    ]);
    setActiveLeadName(null);
    setShowCheckout(false);
  }

  function rescheduleActivity() {
    if (!activeLeadName || !laterDate) return;
    const formatted = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(`${laterDate}T12:00:00`));
    const nextLeads = leads.map((lead) =>
      lead.name === activeLeadName ? { ...lead, taskStatus: "rescheduled" as const, due: formatted } : lead,
    );
    setLeads(nextLeads);
    const plan = replyToCoach("Plan my sales day", nextLeads);
    setMessages((current) => [...current,
      { id: nextId.current++, role: "coach", text: `${activeLeadName} remains unfinished and is rescheduled for ${formatted}. Returning to today’s plan.` },
      { id: nextId.current++, role: "coach", text: plan.text, reply: plan },
    ]);
    setActiveLeadName(null);
    setShowCheckout(false);
    setLaterDate("");
    setPendingOutcome(null);
  }

  function rescheduleFromMessage(instruction: string) {
    if (!activeLeadName) return;
    const name = activeLeadName;
    const timing = instruction.match(/\b(tomorrow|later|next (?:week|month)|this (?:afternoon|evening|week)|monday|tuesday|wednesday|thursday|friday|saturday|sunday)(?:\s+same time)?\b/i)?.[0] ?? "Later";
    const due = timing.replace(/^\w/, (letter) => letter.toUpperCase());
    const nextLeads = leads.map((lead) =>
      lead.name === name
        ? { ...lead, taskStatus: "rescheduled" as const, due, explicitInstruction: instruction, nextAction: instruction }
        : lead,
    );
    setLeads(nextLeads);
    const plan = replyToCoach("Plan my sales day", nextLeads);
    setMessages((current) => [...current,
      { id: nextId.current++, role: "agent", text: instruction },
      { id: nextId.current++, role: "coach", text: `Saved for ${name}: ${instruction}. Returning to the refreshed plan.` },
      { id: nextId.current++, role: "coach", text: plan.text, reply: plan },
    ]);
    setActiveLeadName(null);
    setShowCheckout(false);
    setPendingOutcome(null);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    send(input);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send(input);
    }
  }

  function resetDemo() {
    setLeads(demoLeads);
    setMessages(openingMessages(demoLeads));
    nextId.current = 2;
    window.localStorage.removeItem(demoStorageKey);
    window.localStorage.removeItem("unoforce-demo-leads-v1");
    setActiveLeadName(null);
    setShowCheckout(false);
    setPendingOutcome(null);
  }

  return (
    <div className="coach-frame">
      <div className="coach-bar">
        <div className="coach-identity">
          <span className="coach-mark" aria-hidden="true">U</span>
          <div><strong>Unoforce</strong><span>Your personal sales coach</span></div>
        </div>
        <div className="bar-actions">
          <button className="today-button" type="button" onClick={returnToToday}>Today’s plan</button>
          <button className="reset-button" type="button" onClick={resetDemo}>Reset preview</button>
        </div>
      </div>

      {activeLeadName ? (
        <div className="active-context">
          <span>Working on</span>
          <strong>{activeLeadName}</strong>
          <span>Chat is focused on this relationship</span>
          <button type="button" onClick={returnToToday}>Back to today</button>
        </div>
      ) : null}

      <div className="conversation" aria-live="polite">
        {messages.map((message) => (
          <article className={`message message-${message.role}`} key={message.id}>
            <span className="message-label">{message.role === "coach" ? "Unoforce" : "You"}</span>
            <div className="message-body">
              {message.reply?.kind === "brief" && message.reply.actions ? (
                <>
                  <p>{message.text}</p>
                  <DailyBrief actions={message.reply.actions} onStart={startActivity} disabled={activeLeadName !== null} />
                </>
              ) : (
                <p>{message.text}</p>
              )}
            </div>
          </article>
        ))}
        <div ref={endRef} />
      </div>

      {showCheckout && activeLeadName ? (
        <section className="activity-checkout" aria-labelledby="checkout-title">
          <div>
            <span className="message-label">Before you go back</span>
            <h3 id="checkout-title">What happened with {activeLeadName}?</h3>
            <p>Record the outcome, leave it unfinished, or choose when to do it later.</p>
          </div>
          <div className="quick-outcomes">
            <button type="button" onClick={() => finishActivity("No answer")}>No answer</button>
            <button type="button" onClick={() => finishActivity("Message sent")}>Message sent</button>
            <button type="button" onClick={() => setInput("Connected. ")}>Connected — add details</button>
          </div>
          <div className="checkout-secondary">
            <button type="button" onClick={skipActivity}>Skip for now</button>
            <label>
              Do it later
              <input type="date" value={laterDate} onChange={(event) => setLaterDate(event.target.value)} />
            </label>
            <button type="button" disabled={!laterDate} onClick={rescheduleActivity}>Reschedule</button>
          </div>
        </section>
      ) : null}

      {showCheckout ? null : (
        <div className="prompt-row" aria-label="Suggested questions">
          {(activeLeadName ? activityPrompts : prompts).map((prompt) => (
            <button type="button" key={prompt} onClick={() => send(prompt)}>{prompt}</button>
          ))}
        </div>
      )}

      <form className="composer" onSubmit={submit}>
        <label htmlFor="coach-input">
          {showCheckout ? `Record what happened with ${activeLeadName}` : "Ask anything or record what happened"}
        </label>
        <div className="composer-control">
          <textarea
            id="coach-input"
            rows={2}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={showCheckout
              ? "What changed, what was agreed, and what happens next?"
              : activeLeadName
                ? `Ask about ${activeLeadName.split(" ")[0]} or log what happened…`
                : "Ask anything or add a customer update…"}
          />
          <button type="submit" disabled={!input.trim()} aria-label={showCheckout ? "Save outcome" : "Send message"}>
            {showCheckout ? "Save outcome" : "Send"}
          </button>
        </div>
        <span>Enter to send · Shift + Enter for a new line</span>
      </form>
    </div>
  );
}
