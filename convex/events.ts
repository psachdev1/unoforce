import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const eventKind = v.union(
  v.literal("brief_viewed"),
  v.literal("reason_requested"),
  v.literal("draft_requested"),
  v.literal("instruction_saved"),
);

export const record = mutation({
  args: {
    demoOwner: v.string(),
    sessionId: v.string(),
    kind: eventKind,
    leadName: v.optional(v.string()),
  },
  handler: async (ctx, args) => ctx.db.insert("events", { ...args, createdAt: Date.now() }),
});

export const counts = query({
  args: { demoOwner: v.string() },
  handler: async (ctx, args) => {
    const events = await ctx.db.query("events").withIndex("by_owner", (q) => q.eq("demoOwner", args.demoOwner)).collect();
    return events.reduce<Record<string, number>>((totals, event) => {
      totals[event.kind] = (totals[event.kind] ?? 0) + 1;
      return totals;
    }, {});
  },
});
