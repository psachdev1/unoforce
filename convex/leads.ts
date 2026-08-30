import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const seed = [
  {
    name: "Priya Mehta",
    stage: "warm" as const,
    context: "Needs a 3-bedroom home with the main bedroom on the ground floor. Budget is flexible after bank pre-approval.",
    reason: "You promised to check her financing progress before widening the search area.",
    nextAction: "Ask whether the bank confirmed her pre-approved amount.",
    due: "Today",
    daysQuiet: 8,
  },
  {
    name: "Arjun Rao",
    stage: "hot" as const,
    context: "Visited two family homes in Fremont. His partner preferred the quieter street near Mission schools.",
    reason: "He viewed both homes yesterday and has not shared which trade-off matters most.",
    nextAction: "Call and ask which concern is stopping a second visit.",
    due: "Today",
    daysQuiet: 1,
  },
  {
    name: "Neha Kapoor",
    stage: "nurture" as const,
    context: "Relocating for work in November. Wants a rental first, then plans to buy after learning the area.",
    reason: "Her relocation date is now close enough to restart the rental search.",
    nextAction: "Send three rental options and offer a 15-minute area call.",
    due: "This afternoon",
    daysQuiet: 34,
  },
];

export const list = query({
  args: { demoOwner: v.string() },
  handler: async (ctx, args) => {
    return ctx.db.query("leads").withIndex("by_owner", (q) => q.eq("demoOwner", args.demoOwner)).collect();
  },
});

export const seedDemo = mutation({
  args: { demoOwner: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("leads")
      .withIndex("by_owner", (q) => q.eq("demoOwner", args.demoOwner))
      .first();
    if (existing) return false;
    await Promise.all(seed.map((lead) => ctx.db.insert("leads", { ...lead, demoOwner: args.demoOwner })));
    return true;
  },
});

export const saveInstruction = mutation({
  args: { demoOwner: v.string(), leadName: v.string(), instruction: v.string(), due: v.string() },
  handler: async (ctx, args) => {
    const matches = await ctx.db
      .query("leads")
      .withIndex("by_owner", (q) => q.eq("demoOwner", args.demoOwner))
      .filter((q) => q.eq(q.field("name"), args.leadName))
      .collect();
    if (matches.length !== 1) throw new Error("Lead name must match exactly once.");
    await ctx.db.patch(matches[0]._id, {
      stage: "waiting",
      explicitInstruction: args.instruction,
      reason: `You asked Unoforce to remember: “${args.instruction}.”`,
      nextAction: args.instruction,
      due: args.due,
    });
    return matches[0]._id;
  },
});
