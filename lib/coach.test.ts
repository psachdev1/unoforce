import { describe, expect, it } from "vitest";
import { applyLeadUpdate, replyToCoach } from "./coach";
import { demoLeads } from "./demo-data";

describe("sales coach", () => {
  it("returns the full unfinished plan for today's brief", () => {
    const reply = replyToCoach("Plan my sales day", demoLeads);
    expect(reply.kind).toBe("brief");
    expect(reply.actions).toHaveLength(8);
    expect(reply.actions?.[0].name).toBe("Anita Desai");
    expect(new Set(reply.actions?.map((action) => action.workstream)).size).toBe(4);
  });

  it("answers an open relationship summary question", () => {
    const reply = replyToCoach("Tell me everything about Priya", demoLeads);
    expect(reply.kind).toBe("answer");
    expect(reply.text).toContain("3-bedroom home");
    expect(reply.text).toContain("Recommended move");
  });

  it("explains a lead from stored context", () => {
    const result = applyLeadUpdate("Why should I contact Priya?", demoLeads);
    expect(result.reply.text).toContain("main bedroom on the ground floor");
    expect(result.reply.text).toContain("pre-approved amount");
    expect(result.leads).toBe(demoLeads);
  });

  it("drafts a specific next message", () => {
    const result = applyLeadUpdate("Draft a message for Priya", demoLeads);
    expect(result.reply.text).toContain("Hi Priya");
    expect(result.reply.text).toContain("bank confirmed");
    expect(result.leads).toBe(demoLeads);
  });

  it("lets an explicit update override one lead only", () => {
    const beforeArjun = demoLeads.find((lead) => lead.name === "Arjun Rao");
    const result = applyLeadUpdate(
      "Wait for the ABC Builders launch before contacting Priya.",
      demoLeads,
    );
    const priya = result.leads.find((lead) => lead.name === "Priya Mehta");
    const arjun = result.leads.find((lead) => lead.name === "Arjun Rao");

    expect(priya?.nextAction).toContain("ABC Builders launch");
    expect(priya?.stage).toBe("waiting");
    expect(arjun).toEqual(beforeArjun);
  });

  it("does not silently update an unknown lead", () => {
    const result = applyLeadUpdate("Follow up with Sameer in two months", demoLeads);
    expect(result.leads).toBe(demoLeads);
    expect(result.reply.kind).toBe("help");
  });

  it("completes the demo from brief through changed brief", () => {
    const firstBrief = replyToCoach("What should I do today?", demoLeads);
    expect(firstBrief.actions?.some((action) => action.name === "Priya Mehta")).toBe(true);

    const result = applyLeadUpdate(
      "Wait for the ABC Builders launch before contacting Priya",
      demoLeads,
    );
    expect(result.reply.kind).toBe("confirmation");

    const changedBrief = replyToCoach("What should I do today?", result.leads);
    const changedPriya = changedBrief.actions?.find((action) => action.name === "Priya Mehta");
    expect(changedPriya?.workstream).toBe("warm_nurture");
    expect(changedPriya?.nextAction).toContain(
      "ABC Builders launch",
    );
  });
});
