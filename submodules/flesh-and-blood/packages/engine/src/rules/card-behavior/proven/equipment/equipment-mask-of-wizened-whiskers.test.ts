/**
 * MST160 Mask of Wizened Whiskers — Ninja Head d1 Blade Break.
 *
 * Printed:
 *   When this defends, put a card with combo from your graveyard on the bottom
 *   of your deck.
 *   Blade Break
 *
 * Reasoning (hand-authored):
 * 1. Defend subject:self → move combo-keyword GY card to deck bottom.
 * 2. hasKeyword combo matches keyword entry or ability label.name (CR 8.4.1).
 * 3. Empty GY / no combo → no move; still BB d1.
 * 4. Non-combo GY card is not a legal candidate (filter).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { maskOfWizenedWhiskers } from "../../../../../../cards/src/cards/equipment/mask-of-wizened-whiskers.ts";
import { backHeelKickRed } from "../../../../../../cards/src/cards/actions/back-heel-kick.ts";

const SNATCH = 4;
const LIFE = 20;
const DEF = 1;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 48; safety += 1) {
    const decision = game.getState().decision;
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
    if (decision?.kind === "entity-target") {
      const pick = decision.candidates[0];
      if (!pick && (decision.min ?? 1) > 0) {
        game.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: { kind: "entity-target", instanceIds: [] },
          },
        });
        continue;
      }
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "entity-target",
            instanceIds: pick ? [pick.instanceId] : [],
          },
        },
      });
      continue;
    }
    if (decision) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("mask-of-wizened-whiskers (MST160)", () => {
  it("core mechanic: defend → combo GY to deck bottom + BB d1", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [maskOfWizenedWhiskers],
        graveyard: [backHeelKickRed, nimblismBlue],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    expect(Defender.zone("graveyard")).toContain(backHeelKickRed.canonicalId);
    expect(Defender.zone("graveyard")).toContain(nimblismBlue.canonicalId);

    Attacker.attackWith(snatchRed);
    Defender.defendWith(maskOfWizenedWhiskers);
    drain(game);
    game.helpers.resolveRestOfCombat();

    // Combo card left GY; non-combo nimblism may remain.
    expect(Defender.zone("graveyard")).not.toContain(backHeelKickRed.canonicalId);
    expect(Defender.zone("deck")).toContain(backHeelKickRed.canonicalId);
    expect(Defender.zone("graveyard")).toContain(nimblismBlue.canonicalId);

    expect(Defender.life()).toBe(LIFE - (SNATCH - DEF));
    expect(Defender.zone("graveyard")).toContain(maskOfWizenedWhiskers.canonicalId);
  });

  it("boundaries: no combo in GY → no deck change; subject:self model", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [maskOfWizenedWhiskers],
        graveyard: [nimblismBlue],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const deckBefore = game.as(dash).zone("deck").length;
    game.as(bravo).attackWith(snatchRed);
    game.as(dash).defendWith(maskOfWizenedWhiskers);
    drain(game);
    // After trigger: nimblism still GY, deck size unchanged (no combo move).
    expect(game.as(dash).zone("graveyard")).toContain(nimblismBlue.canonicalId);
    expect(game.as(dash).zone("deck").length).toBe(deckBefore);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(LIFE - (SNATCH - DEF));
    expect(game.as(dash).zone("graveyard")).toContain(maskOfWizenedWhiskers.canonicalId);

    const a1 = maskOfWizenedWhiskers.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static" || !a1.trigger) return;
    expect(a1.trigger).toMatchObject({
      kind: "event",
      event: {
        name: "defend",
        actor: {
          kind: "player",
          player: "ability-controller",
        },
        observes: {
          kind: "source",
          selector: "defender",
        },
      },
    });
    expect(a1.resolution?.effect).toMatchObject({
      type: "move-card",
      target: {
        selector: "object",
        zones: ["graveyard"],
        filter: { hasKeyword: "combo" },
        count: 1,
      },
      to: { zone: "deck", position: "bottom" },
    });
    expect(maskOfWizenedWhiskers.base.keywords?.some((k) => k.name === "blade-break")).toBe(true);
  });
});
