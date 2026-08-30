"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { applyLeadUpdate, replyToCoach, type CoachReply, type Lead } from "@/lib/coach";
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
  text: "Good morning. I’ve reviewed your sample leads. Ask for today’s brief, prepare for a conversation, or tell me what changed.",
};

const prompts = [
  "What should I do today?",
  "Why should I contact Priya?",
  "Draft a message for Priya",
  "Wait for the ABC Builders launch before contacting Priya",
];

export function SalesCoach() {
  const [leads, setLeads] = useState<Lead[]>(demoLeads);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [ready, setReady] = useState(false);
  const nextId = useRef(1);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem("unoforce-demo-leads-v1");
    if (saved) {
      try {
        setLeads(JSON.parse(saved) as Lead[]);
      } catch {
        window.localStorage.removeItem("unoforce-demo-leads-v1");
      }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem("unoforce-demo-leads-v1", JSON.stringify(leads));
  }, [leads, ready]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  function send(text: string) {
    const clean = text.trim();
    if (!clean) return;

    const result = applyLeadUpdate(clean, leads);
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
    setMessages([initialMessage]);
    window.localStorage.removeItem("unoforce-demo-leads-v1");
  }

  return (
    <div className="coach-frame">
      <div className="coach-bar">
        <div className="coach-identity">
          <span className="coach-mark" aria-hidden="true">U</span>
          <div><strong>Unoforce</strong><span>Ready with your daily brief</span></div>
        </div>
        <button className="reset-button" type="button" onClick={resetDemo}>Reset preview</button>
      </div>

      <div className="conversation" aria-live="polite">
        {messages.map((message) => (
          <article className={`message message-${message.role}`} key={message.id}>
            <span className="message-label">{message.role === "coach" ? "Unoforce" : "You"}</span>
            <div className="message-body">
              {message.reply?.kind === "brief" && message.reply.actions ? (
                <>
                  <p>{message.text}</p>
                  <DailyBrief actions={message.reply.actions} />
                </>
              ) : (
                <p>{message.text}</p>
              )}
            </div>
          </article>
        ))}
        <div ref={endRef} />
      </div>

      <div className="prompt-row" aria-label="Suggested questions">
        {prompts.map((prompt) => (
          <button type="button" key={prompt} onClick={() => send(prompt)}>{prompt}</button>
        ))}
      </div>

      <form className="composer" onSubmit={submit}>
        <label htmlFor="coach-input">Ask about a lead or add an update</label>
        <div className="composer-control">
          <textarea
            id="coach-input"
            rows={2}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="For Priya, wait for the ABC Builders launch…"
          />
          <button type="submit" disabled={!input.trim()} aria-label="Send message">Send</button>
        </div>
        <span>Enter to send · Shift + Enter for a new line</span>
      </form>
    </div>
  );
}
