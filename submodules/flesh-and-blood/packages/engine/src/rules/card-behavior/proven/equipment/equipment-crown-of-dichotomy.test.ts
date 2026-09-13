/**
 * ARC079 Crown of Dichotomy — Runeblade Head d0 Arcane Barrier 1.
 *
 * Printed:
 *   Action - {r}, destroy this: Put target Runeblade attack action card and
 *   target Runeblade 'non-attack' action card from your graveyard on top of
 *   your deck in any order.
 *   Arcane Barrier 1
 *
 * Model:
 *   mixed cost: 1 resource + destroy-self
 *   sequence: on-stack GY Runeblade AAC → deck top, then on-stack GY Runeblade
 *   Non-attack Action → deck top (second is topmost)
 *
 * Reasoning:
 * 1. Prior model used OR filter + count 2 with subtypes ["'non-attack'"] residue
 *    — allowed two AACs and never matched real non-attacks. Fixed to two
 *    distinct on-stack targets with Non-attack pseudo-subtype.
 * 2. "In any order" free reorder is not a separate decision; sequential put-top
 *    is the rules-visible core (both leave GY onto deck).
 * 3. Boundaries: missing either GY half → required targets unavailable; 0 RP
 *    with no pitchables; Arcane Barrier not exercised here (keyword parity
 *    covered elsewhere).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import {
  bravo,
  dash,
  nimblismBlue,
  rattleBonesRed,
  runeragerSwarmYellow,
  snatchRed,
} from "../../../fixtures.ts";
import { crownOfDichotomy } from "../../../../../../cards/src/cards/equipment/crown-of-dichotomy.ts";

/** Answer on-stack GY targets (by canonical id preference) then pass stack. */
function resolveCrownActivate(
  game: ReturnType<typeof FabTestEngine.start>,
  prefer: readonly { canonicalId: string }[],
): void {
  for (let safety = 0; safety < 40; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "entity-target") {
      const pick =
        prefer
          .map((card) =>
            decision.candidates.find(
              (c) => game.getState().objects[c.instanceId]?.canonicalId === card.canonicalId,
            ),
          )
          .find(Boolean) ?? decision.candidates[0];
      if (!pick) throw new Error("no crown target candidate");
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: [pick.instanceId] },
        },
      });
      continue;
    }
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: false },
        },
      });
      continue;
    }
    if (decision?.kind === "ordering") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "ordering",
            orderedIds: decision.entries.map((e) => e.id),
          },
        },
      });
      continue;
    }
    if (decision) break;
    if (game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("crown-of-dichotomy (ARC079)", () => {
  it("core mechanic: {r}+destroy → Runeblade AAC and non-attack from GY to deck top", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [crownOfDichotomy],
        hand: [],
        // GY: Runeblade AAC + Runeblade non-attack Action + unrelated filler
        graveyard: [runeragerSwarmYellow, rattleBonesRed, snatchRed],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue],
        actionPoints: 1,
        resourcePoints: 1,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    expect(Bravo.zone("graveyard")).toContain(runeragerSwarmYellow.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(rattleBonesRed.canonicalId);

    Bravo.activate(crownOfDichotomy);
    // Prefer AAC first decision, then non-attack — resolveCrownActivate walks prefer list.
    resolveCrownActivate(game, [runeragerSwarmYellow, rattleBonesRed]);

    expect(Bravo.zone("head")).not.toContain(crownOfDichotomy.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(crownOfDichotomy.canonicalId);
    // Both Runeblade cards left GY for deck.
    expect(Bravo.zone("graveyard")).not.toContain(runeragerSwarmYellow.canonicalId);
    expect(Bravo.zone("graveyard")).not.toContain(rattleBonesRed.canonicalId);
    expect(Bravo.zone("deck")).toContain(runeragerSwarmYellow.canonicalId);
    expect(Bravo.zone("deck")).toContain(rattleBonesRed.canonicalId);
    // Unrelated non-Runeblade AAC stays in GY.
    expect(Bravo.zone("graveyard")).toContain(snatchRed.canonicalId);
    // Second put-top is Non-attack (rattle) → deck top (last index).
    const deck = Bravo.zone("deck");
    expect(deck[deck.length - 1]).toBe(rattleBonesRed.canonicalId);
    expect(Bravo.resourcePoints()).toBe(0);
    expect(Bravo.actionPoints()).toBe(0);
  });

  it("boundaries: activate illegal without both GY halves (only AAC)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [crownOfDichotomy],
        graveyard: [runeragerSwarmYellow, snatchRed],
        deck: 6,
        actionPoints: 1,
        resourcePoints: 1,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    expect(() => game.as(bravo).activate(crownOfDichotomy)).toThrow();
    expect(game.as(bravo).zone("head")).toContain(crownOfDichotomy.canonicalId);
  });

  it("boundaries: activate illegal without both GY halves (only non-attack)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [crownOfDichotomy],
        graveyard: [rattleBonesRed, snatchRed],
        deck: 6,
        actionPoints: 1,
        resourcePoints: 1,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    expect(() => game.as(bravo).activate(crownOfDichotomy)).toThrow();
    expect(game.as(bravo).zone("head")).toContain(crownOfDichotomy.canonicalId);
  });

  it("boundaries: activate illegal with 0 resources and no pitchable hand", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [crownOfDichotomy],
        hand: [],
        graveyard: [runeragerSwarmYellow, rattleBonesRed],
        deck: 6,
        actionPoints: 1,
        resourcePoints: 0,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    expect(() => game.as(bravo).activate(crownOfDichotomy)).toThrow();
    expect(game.as(bravo).zone("head")).toContain(crownOfDichotomy.canonicalId);
  });
});
