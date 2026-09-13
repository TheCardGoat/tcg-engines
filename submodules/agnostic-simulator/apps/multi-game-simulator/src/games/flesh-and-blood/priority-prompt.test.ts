import { describe, expect, it } from "vitest";
import { deriveFabPriorityPrompt } from "./priority-prompt";

const state = {
  terminal: false,
  priorityPlayerId: "defender",
  activePlayerId: "attacker",
  phase: "action",
  priorityWindow: { kind: "ordinary-priority" },
  combat: { open: true, step: "attack", defenseDeclarationPending: false, activeLink: null },
} as const;

describe("priority explanations", () => {
  it("separates the instant window before defenders from the later reaction window", () => {
    const beforeDefense = deriveFabPriorityPrompt(state, "defender", undefined, false);
    expect(beforeDefense?.title).toBe("Before declaring defenders");
    expect(beforeDefense?.body).toContain("Instant");
    expect(beforeDefense?.body).not.toContain("reaction");
    const reaction = deriveFabPriorityPrompt(
      { ...state, combat: { ...state.combat, step: "reaction" } },
      "defender",
      undefined,
      false,
    );
    expect(reaction?.title).toBe("Before combat damage");
    expect(reaction?.body).toContain("reaction or Instant");
  });

  it("explains a pending effect before offering chain continuation", () => {
    const resolution = {
      ...state,
      priorityPlayerId: "attacker",
      priorityWindow: { kind: "combat-chain-continuation", role: "attacker" },
      combat: { ...state.combat, step: "resolution" },
    } as const;
    const pending = deriveFabPriorityPrompt(
      resolution,
      "attacker",
      { title: "Sigil of Solace" },
      false,
    );
    expect(pending?.title).toBe("Before Sigil of Solace resolves");
    expect(pending?.submitLabel).toBe("Pass priority");
    expect(pending?.body).not.toContain("another attack");
    expect(deriveFabPriorityPrompt(resolution, "attacker", undefined, false)?.submitLabel).toBe(
      "Close combat chain",
    );
  });

  it("does not invite a response when passing is the only legal choice", () => {
    const prompt = deriveFabPriorityPrompt(state, "defender", undefined, true);
    expect(prompt?.body).toContain("no available responses");
    expect(prompt?.body).not.toContain("Play");
  });

  it("does not show priority instructions to an inactive viewer or during a decision", () => {
    expect(deriveFabPriorityPrompt(state, "attacker", undefined, false)).toBeUndefined();
    expect(
      deriveFabPriorityPrompt(
        { ...state, priorityWindow: { kind: "decision" } },
        "defender",
        undefined,
        false,
      ),
    ).toBeUndefined();
    expect(
      deriveFabPriorityPrompt({ ...state, terminal: true }, "defender", undefined, false),
    ).toBeUndefined();
  });

  it("hides idle turn-player Action Phase copy and keeps empty-stack responses", () => {
    const idle = {
      terminal: false,
      priorityPlayerId: "attacker",
      activePlayerId: "attacker",
      phase: "action",
      priorityWindow: { kind: "terminal-action-phase" },
      combat: null,
    } as const;
    expect(deriveFabPriorityPrompt(idle, "attacker", undefined, false)).toBeUndefined();
    expect(deriveFabPriorityPrompt(idle, "attacker", undefined, true)).toBeUndefined();
    expect(
      deriveFabPriorityPrompt(idle, "attacker", { title: "Sigil of Solace" }, false)?.title,
    ).toBe("Before Sigil of Solace resolves");
    const opponentIdle = { ...idle, priorityPlayerId: "defender" };
    const opponentResponse = deriveFabPriorityPrompt(opponentIdle, "defender", undefined, false);
    expect(opponentResponse?.title).toBe("Before the action phase ends");
    expect(opponentResponse?.body).toContain("Instant");
    expect(deriveFabPriorityPrompt(opponentIdle, "defender", undefined, true)?.body).toContain(
      "no available responses",
    );
  });

  it("still explains combat windows when the turn player has priority", () => {
    const turnCombat = {
      terminal: false,
      priorityPlayerId: "attacker",
      activePlayerId: "attacker",
      phase: "action",
      priorityWindow: { kind: "ordinary-priority" },
      combat: {
        open: true,
        step: "attack",
        defenseDeclarationPending: false,
        activeLink: null,
      },
    } as const;
    expect(deriveFabPriorityPrompt(turnCombat, "attacker", undefined, false)?.title).toBe(
      "Before declaring defenders",
    );
    expect(
      deriveFabPriorityPrompt(
        { ...turnCombat, combat: { ...turnCombat.combat, step: "reaction" } },
        "attacker",
        undefined,
        false,
      )?.title,
    ).toBe("Before combat damage");
  });
});
