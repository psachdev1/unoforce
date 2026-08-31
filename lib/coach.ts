export type LeadStage = "hot" | "warm" | "nurture" | "waiting";
export type Workstream = "new_outreach" | "warm_nurture" | "active_opportunity" | "overdue";

export type Lead = {
  name: string;
  stage: LeadStage;
  context: string;
  reason: string;
  nextAction: string;
  due: string;
  daysQuiet: number;
  workstream: Workstream;
  channel: "Call" | "WhatsApp" | "Email" | "LinkedIn";
  taskStatus?: "ready" | "completed" | "rescheduled";
  explicitInstruction?: string;
};

export type LeadAction = Pick<Lead, "name" | "stage" | "reason" | "nextAction" | "due" | "workstream" | "channel" | "taskStatus">;

export type CoachReply = {
  kind: "brief" | "answer" | "confirmation" | "help";
  text: string;
  actions?: LeadAction[];
  leadName?: string;
};

export function isActivityOutcome(input: string) {
  return /^(spoke|called|met|sent|emailed|messaged|connected|no answer|left (a )?voicemail|could not connect|did not connect|done|completed|finished|they replied|customer replied)\b/i.test(input.trim());
}

const firstName = (name: string) => name.split(" ")[0];

function findLead(input: string, leads: Lead[]) {
  const normalized = input.toLowerCase();
  return leads.find((lead) =>
    [lead.name, firstName(lead.name)].some((name) => normalized.includes(name.toLowerCase())),
  );
}

function ranked(leads: Lead[]) {
  const stageWeight: Record<LeadStage, number> = { hot: 4, warm: 3, nurture: 2, waiting: 1 };
  return [...leads]
    .sort((a, b) => stageWeight[b.stage] - stageWeight[a.stage] || b.daysQuiet - a.daysQuiet)
    .filter((lead) => lead.taskStatus !== "completed")
    .map(({ name, stage, reason, nextAction, due, workstream, channel, taskStatus }) => ({ name, stage, reason, nextAction, due, workstream, channel, taskStatus }));
}

export function replyToCoach(input: string, leads: Lead[]): CoachReply {
  const normalized = input.trim().toLowerCase();
  const lead = findLead(input, leads);

  if (/what.*(today|do)|daily brief|plan my sales day|who.*(contact|call|outreach|follow)/.test(normalized)) {
    return {
      kind: "brief",
      text: "Here are the three conversations most worth moving today.",
      actions: ranked(leads),
    };
  }

  if (lead && /why|context|remember|know about|everything about|summary|summarize/.test(normalized)) {
    return {
      kind: "answer",
      leadName: lead.name,
      text: `${lead.context} ${lead.reason} Recommended channel: ${lead.channel}. Recommended move: ${lead.nextAction}`,
    };
  }

  if (lead && /draft|message|say|prepare|call|objection/.test(normalized)) {
    const givenName = firstName(lead.name);
    return {
      kind: "answer",
      leadName: lead.name,
      text: `Try this:\n\n“Hi ${givenName}, I was thinking about what you shared. ${lead.nextAction} Would a quick call today be useful?”\n\nKeep it personal: refer to one detail from your last conversation, then ask one clear question.`,
    };
  }

  return {
    kind: "help",
    text: "I can give you today’s brief, explain why a lead needs attention, draft the next message or call, or remember an update. Try: “What should I do today?”",
  };
}

export function applyLeadUpdate(input: string, leads: Lead[]) {
  const lead = findLead(input, leads);
  const normalized = input.trim().toLowerCase();
  const looksLikeUpdate =
    /^(for\s+\w+[,:]?\s+)?(wait|follow up|follow-up|remind|spoke|called|contacted|met)/.test(normalized) ||
    /\bplease (wait|follow up|remind|remember)\b/.test(normalized);

  if (!lead || !looksLikeUpdate) {
    return { leads, reply: replyToCoach(input, leads) };
  }

  const instruction = input.trim().replace(/[.!]+$/, "");
  const nextLeads = leads.map((item) =>
    item.name === lead.name
      ? {
          ...item,
          stage: "waiting" as const,
          explicitInstruction: instruction,
          reason: `You asked Unoforce to remember: “${instruction}.”`,
          nextAction: instruction,
          due: /two months/i.test(instruction) ? "In two months" : "Waiting for your cue",
        }
      : item,
  );

  return {
    leads: nextLeads,
    reply: {
      kind: "confirmation" as const,
      leadName: lead.name,
      text: `Saved for ${lead.name}. I’ll use this instruction the next time I prepare your brief: “${instruction}.”`,
    },
  };
}
