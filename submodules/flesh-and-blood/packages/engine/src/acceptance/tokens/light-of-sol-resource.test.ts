/**
 * DTD000 Light of Sol — pitch trigger: reveal top deck → if yellow → optionally
 * put into hero's soul.
 */
import { describe, expect, it } from "vitest";

import { lightOfSolYellow as lightOfSol } from "../../../../cards/src/cards/resources/light-of-sol.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash, nimbleStrikeRed, packHuntYellow, snatchRed } from "../../rules/fixtures.ts";
import { createFabLoopGuard } from "@tcg/flesh-and-blood-types";

/**
 * Resolve all pending triggered layers and their decisions (ordering,
 * optional accept/decline, etc).  Designed to walk the full pitch-trigger
 * resolution — including optional "you may…" prompts.
 */
function resolvePendingTriggers(game: FabTestEngine, opts?: { acceptOptional?: boolean }): void {
  const accept = opts?.acceptOptional ?? true;
  const triggerGuard = createFabLoopGuard({ label: "light-of-sol: resolve pending triggers" });
  while (true) {
    triggerGuard.tick();
    const decision = game.getState().decision;
    const stateVersion = decision?.stateVersion ?? 0;
    const decisionId = decision?.decisionId ?? "";
    const actorId = decision?.actorId ?? "";
    if (decision?.kind === "ordering") {
      game.exec({
        move: "answer-decision",
        actorId,
        payload: {
          decisionId,
          stateVersion,
          answer: { kind: "ordering", orderedIds: decision.entries.map((entry) => entry.id) },
        },
      });
      continue;
    }
    if (decision?.kind === "boolean") {
      // "Use the optional effect of …?" or other boolean prompt.
      game.exec({
        move: "answer-decision",
        actorId,
        payload: {
          decisionId,
          stateVersion,
          answer: { kind: "boolean", value: accept },
        },
      });
      continue;
    }
    if (decision || game.getState().rulesStack.at(-1)?.kind !== "triggered") return;
    game.passBoth();
  }
}

describe("Light of Sol resource (DTD000)", () => {
  it("AAA: pitch with yellow top → optionally move to soul (accepted)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [nimbleStrikeRed, lightOfSol],
        deck: [nimbleStrikeRed, packHuntYellow],
        resourcePoints: 0,
      },
      { hero: dash, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    expect(Bravo.zone("soul")).toHaveLength(0);

    Bravo.play(nimbleStrikeRed, { pitch: [lightOfSol] });
    // Accept the optional ("put it into your hero's soul").
    resolvePendingTriggers(game, { acceptOptional: true });

    expect(game.committedEvents().some((event) => event.name === "reveal")).toBe(true);
    expect(game.committedEvents().some((event) => event.name === "move-zone")).toBe(true);
    expect(Bravo.zone("pitch")).toContain(lightOfSol.canonicalId);
    expect(Bravo.zone("soul")).toContain(packHuntYellow.canonicalId);
    expect(Bravo.zone("deck")).not.toContain(packHuntYellow.canonicalId);
  });

  it("AAA: yellow top card stays in deck when optional is declined", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [nimbleStrikeRed, lightOfSol],
        deck: [nimbleStrikeRed, packHuntYellow],
        resourcePoints: 0,
      },
      { hero: dash, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    expect(Bravo.zone("soul")).toHaveLength(0);

    Bravo.play(nimbleStrikeRed, { pitch: [lightOfSol] });
    // Decline the optional.
    resolvePendingTriggers(game, { acceptOptional: false });

    expect(game.committedEvents().some((event) => event.name === "reveal")).toBe(true);
    // Soul stays empty — the optional was declined.
    expect(Bravo.zone("soul")).toHaveLength(0);
    // Card stays in deck.
    expect(Bravo.zone("deck")).toContain(packHuntYellow.canonicalId);
  });

  it("boundary: non-yellow top card does not move to soul", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [nimbleStrikeRed, lightOfSol],
        deck: [nimbleStrikeRed, snatchRed],
        resourcePoints: 0,
      },
      { hero: dash, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    expect(Bravo.zone("soul")).toHaveLength(0);

    Bravo.play(nimbleStrikeRed, { pitch: [lightOfSol] });
    resolvePendingTriggers(game);

    expect(game.committedEvents().some((event) => event.name === "reveal")).toBe(true);
    expect(Bravo.zone("soul")).toHaveLength(0);
  });
});
