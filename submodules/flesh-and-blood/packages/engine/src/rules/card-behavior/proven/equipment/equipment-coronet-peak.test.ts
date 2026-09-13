/**
 * UPR136 Coronet Peak — Ice Head d2 Blade Break.
 *
 * Printed:
 *   Action - {r}{r}{r}: Target hero discards a card unless they pay {r}.
 *   Blade Break
 *
 * Reasoning (hand-authored, 1v1 product):
 * 1. Action costs 3 resources; 0 RP illegal.
 * 2. "Target hero" → sole opponent in 1v1 (model player/opponent + payer
 *    opponent — no multi-hero chooser).
 * 3. Unless: opponent may pay {r} to escape discard; decline or unaffordable
 *    → discard 1 from hand. Interactive escape was OPEN; wired via optional
 *    answered by escape payer + proposeUnless branch.
 * 4. Blade Break d2 after defend.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { coronetPeak } from "../../../../../../cards/src/cards/equipment/coronet-peak.ts";

const LIFE = 20;
const SNATCH = 4;
const HELM_D = 2;

function drain(
  game: ReturnType<typeof FabTestEngine.start>,
  opts: { escapePay?: boolean } = {},
): void {
  for (let safety = 0; safety < 64; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: opts.escapePay === true },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const pick = decision.candidates[0];
      if (!pick && (decision.min ?? 1) > 0) break;
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
    if (game.getState().rulesStack.length === 0 && !game.combat()) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("coronet-peak (UPR136)", () => {
  it("core mechanic: Action 3{r} → opponent discards when escape declined", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [coronetPeak],
        hand: [],
        actionPoints: 1,
        resourcePoints: 3,
        deck: 6,
      },
      {
        hero: dash,
        hand: [snatchRed, nimblismBlue],
        resourcePoints: 0,
        deck: 4,
      },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(coronetPeak);
    drain(game, { escapePay: false });

    expect(Bravo.resourcePoints()).toBe(0);
    // Unaffordable/declined escape → discard 1.
    expect(Dash.zone("hand").length).toBe(1);
    expect(Dash.zone("graveyard").length).toBe(1);
  });

  it("core interaction: opponent pays {r} escape → no discard", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [coronetPeak],
        hand: [],
        actionPoints: 1,
        resourcePoints: 3,
        deck: 6,
      },
      {
        hero: dash,
        hand: [snatchRed, nimblismBlue],
        resourcePoints: 1,
        deck: 4,
      },
      { autoPassPriority: false },
    );
    const Dash = game.as(dash);

    game.as(bravo).activate(coronetPeak);
    drain(game, { escapePay: true });

    expect(Dash.resourcePoints()).toBe(0);
    expect(Dash.zone("hand").length).toBe(2);
    expect(Dash.zone("graveyard").length).toBe(0);
  });

  it("boundaries: 0 RP illegal; Blade Break d2; model unless pay", () => {
    const poor = FabTestEngine.start(
      {
        hero: bravo,
        head: [coronetPeak],
        hand: [],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 4,
      },
      { hero: dash, hand: [snatchRed], deck: 4 },
      { autoPassPriority: false },
    );
    const rejected = poor.as(bravo).expectFailure({
      move: "activate",
      payload: { instanceId: poor.as(bravo).card(coronetPeak) },
    });
    expect(rejected.accepted).toBe(false);

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
        head: [coronetPeak],
        hand: [],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = game.as(dash);
    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith(coronetPeak);
    drain(game);
    game.helpers.resolveRestOfCombat();
    drain(game);

    expect(Defender.life()).toBe(LIFE - (SNATCH - HELM_D));
    expect(Defender.zone("graveyard")).toContain(coronetPeak.canonicalId);
    expect(Defender.zone("head")).not.toContain(coronetPeak.canonicalId);

    const a1 = coronetPeak.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("action");
    expect(a1.cost).toMatchObject({
      class: "asset",
      type: "resources",
      amount: 3,
    });
    expect(a1.effect).toMatchObject({
      type: "unless",
      effect: {
        type: "discard",
        target: { player: "opponent", zones: ["hand"], count: 1 },
      },
      escape: {
        type: "pay",
        cost: { class: "asset", type: "resources", amount: 1 },
        payer: "opponent",
      },
    });
    expect(coronetPeak.base.numeric.defense).toBe(2);
    expect(coronetPeak.base.keywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "blade-break" })]),
    );
  });
});
