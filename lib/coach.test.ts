import { describe, expect, it } from "vitest";
import { applyLeadUpdate, replyToCoach } from "./coach";
import { demoLeads } from "./demo-data";

describe("sales coach", () => {
  it("returns three ranked actions for today's brief", () => {
    const reply = replyToCoach("What should I do today?", demoLeads);
    expect(reply.kind).toBe("brief");
    expect(reply.actions).toHaveLength(3);
    expect(reply.actions?.[0].name).toBe("Arjun Rao");
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
});
