import type { Lead } from "./coach";

export const demoLeads: Lead[] = [
  {
    name: "Priya Mehta",
    stage: "warm",
    context: "Needs a 3-bedroom home with the main bedroom on the ground floor. Budget is flexible after bank pre-approval.",
    reason: "You promised to check her financing progress before widening the search area.",
    nextAction: "Ask whether the bank confirmed her pre-approved amount.",
    due: "Today",
    daysQuiet: 8,
  },
  {
    name: "Arjun Rao",
    stage: "hot",
    context: "Visited two family homes in Fremont. His partner preferred the quieter street near Mission schools.",
    reason: "He viewed both homes yesterday and has not shared which trade-off matters most.",
    nextAction: "Call and ask which concern is stopping a second visit.",
    due: "Today",
    daysQuiet: 1,
  },
  {
    name: "Neha Kapoor",
    stage: "nurture",
    context: "Relocating for work in November. Wants a rental first, then plans to buy after learning the area.",
    reason: "Her relocation date is now close enough to restart the rental search.",
    nextAction: "Send three rental options and offer a 15-minute area call.",
    due: "This afternoon",
    daysQuiet: 34,
  },
  {
    name: "Rohan Shah",
    stage: "waiting",
    context: "Interested in new-build homes but will not move before his current lease ends.",
    reason: "His lease-end date is still unknown.",
    nextAction: "Ask when his current lease ends before scheduling another search.",
    due: "This week",
    daysQuiet: 15,
  },
];
