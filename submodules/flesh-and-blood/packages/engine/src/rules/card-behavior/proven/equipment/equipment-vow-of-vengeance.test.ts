/**
 * CIN003 Vow of Vengeance — Draconic Head d1 bladeBreak.
 *
 * Printed:
 *   Attack Reaction - Destroy this: Mark target Arakni. Blade Break
 *
 * Model (after fix):
 *   AR destroy-self → mark object at-resolution hero moniker Arakni
 *
 * Reasoning:
 * 1. permanent + name "Arakni" never finds heroes (they're in heroZone).
 * 2. moniker:"Arakni" matches all Arakni identity printings.
 * 3. AR illegal outside reaction; no Arakni target → cannot complete mark
 *    (quote/empty candidates).
 * 4. bladeBreak defend path is separate from AR activate.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { vowOfVengeance } from "../../../../../../cards/src/cards/equipment/vow-of-vengeance.ts";
import { arakni } from "../../../../../../cards/src/cards/heroes/arakni.ts";

const STARTING_LIFE = 40;

describe("vow-of-vengeance (CIN003)", () => {
  it("core mechanic: AR destroy-self marks opposing Arakni hero", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [vowOfVengeance],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: arakni, life: STARTING_LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Arakni = game.as(arakni);

    expect(game.getState().players[Arakni.id]!.marked).toBe(false);

    Bravo.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    Arakni.defendWith([]);
    Bravo.pass();
    Arakni.pass();
    expect(game.combat()?.step).toBe("reaction");

    Bravo.activate(vowOfVengeance);
    // Sole Arakni hero may auto-pick or need entity-target.
    for (let i = 0; i < 20; i += 1) {
      const d = game.getState().decision;
      if (d?.kind === "entity-target") {
        const pick =
          d.candidates.find(
            (c) => game.getState().objects[c.instanceId]?.canonicalId === arakni.canonicalId,
          ) ?? d.candidates[0];
        if (!pick) break;
        game.exec({
          move: "answer-decision",
          actorId: d.actorId,
          payload: {
            decisionId: d.decisionId,
            stateVersion: d.stateVersion,
            answer: { kind: "entity-target", instanceIds: [pick.instanceId] },
          },
        });
        continue;
      }
      if (d) break;
      if (game.getState().rulesStack.length === 0) break;
      if (game.declareNoDefenseIfPending()) continue;
      const prio = game.getPriorityPlayerId();
      if (prio) game.exec({ move: "pass", actorId: prio, payload: {} });
      else break;
    }

    expect(Bravo.zone("head")).not.toContain(vowOfVengeance.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(vowOfVengeance.canonicalId);
    expect(game.getState().players[Arakni.id]!.marked).toBe(true);
  });

  it("boundaries: Attack Reaction illegal outside combat reaction step", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [vowOfVengeance],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: arakni, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => game.as(bravo).activate(vowOfVengeance)).toThrow();
    expect(game.as(bravo).zone("head")).toContain(vowOfVengeance.canonicalId);
  });

  it("boundaries: non-Arakni opponent — mark has no legal Arakni target", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [vowOfVengeance],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: STARTING_LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);

    Bravo.attackWith(snatchRed);
    Opponent.defendWith([]);
    Bravo.pass();
    Opponent.pass();
    expect(game.combat()?.step).toBe("reaction");

    // May throw on activate or resolve without marking Dash.
    try {
      Bravo.activate(vowOfVengeance);
      for (let i = 0; i < 15; i += 1) {
        const d = game.getState().decision;
        if (d?.kind === "entity-target") {
          // No Arakni candidates — empty or wrong picks.
          if (d.candidates.length === 0 || (d.min ?? 1) > d.candidates.length) {
            break;
          }
          break;
        }
        if (d) break;
        if (game.getState().rulesStack.length === 0) break;
        if (game.declareNoDefenseIfPending()) continue;
        const prio = game.getPriorityPlayerId();
        if (prio) game.exec({ move: "pass", actorId: prio, payload: {} });
        else break;
      }
    } catch {
      // Illegal activate is fine.
    }

    expect(game.getState().players[Opponent.id]!.marked).toBe(false);
  });
});
