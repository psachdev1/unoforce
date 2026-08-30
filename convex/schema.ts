import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  leads: defineTable({
    demoOwner: v.string(),
    name: v.string(),
    stage: v.union(v.literal("hot"), v.literal("warm"), v.literal("nurture"), v.literal("waiting")),
    context: v.string(),
    reason: v.string(),
    nextAction: v.string(),
    due: v.string(),
    daysQuiet: v.number(),
    explicitInstruction: v.optional(v.string()),
  }).index("by_owner", ["demoOwner"]),
  events: defineTable({
    demoOwner: v.string(),
    sessionId: v.string(),
    kind: v.union(
      v.literal("brief_viewed"),
      v.literal("reason_requested"),
      v.literal("draft_requested"),
      v.literal("instruction_saved"),
    ),
    leadName: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_owner", ["demoOwner"]),
});
