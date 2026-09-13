/**
 * HVY195 Balance of Justice — Generic Head d2 Guardwell.
 *
 * Printed:
 *   Instant - Destroy this: Draw a card. Activate this only if an opponent
 *   has drawn 2 or more cards this turn.
 *   Guardwell
 *
 * Reasoning (hand-authored):
 * 1. Activation condition uses has-status
 *    an-opponent-drawn-2-or-more-cards-this-turn (facts.playerCardsDrawn).
 * 2. Instant destroy-self → controller draws 1; equipment to GY.
 * 3. Without 2 opponent draws, activation is illegal.
 * 4. Guardwell: first defend d2 → −2 defense counters; stays equipped.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, tomeOfFyendalYellow } from "../../../fixtures.ts";
import { listLegalCommands } from "../../../../automation/legal-commands.ts";
import { balanceOfJustice } from "../../../../../../cards/src/cards/equipment/balance-of-justice.ts";

const SNATCH = 4;
const LIFE = 20;
const ABILITY = "fFHTT7tCd9NDBqn9qCgh6:instantDestroyDrawActivateOnlyIfOpponentHasDrawn";

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
      const need = decision.min ?? 1;
      const picks = decision.candidates.slice(0, need).map((c) => c.instanceId);
      if (picks.length < need && need > 0) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: picks },
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
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("balance-of-justice (HVY195)", () => {
  it("core mechanic: after opponent draws 2+, Instant destroy → draw", () => {
    // Opponent (dash, seat 1) plays Tome of Fyendal (draw 2). Controller (bravo)
    // then activates Balance of Justice.
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [tomeOfFyendalYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 8,
      },
      {
        hero: bravo,
        head: [balanceOfJustice],
        deck: 8,
        hand: [],
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Opponent = game.as(dash);
    const Controller = game.as(bravo);
    const handBefore = Controller.zone("hand").length;
    const deckBefore = Controller.zone("deck").length;

    // Before any draws — Instant must be illegal.
    const before = listLegalCommands(game.getRuntime(), Controller.id).find(
      (cmd) => cmd.move === "activate" && cmd.payload.ability === ABILITY,
    );
    expect(before).toBeUndefined();

    // Opponent draws 2 via Tome (cost 1 RP). Condition is "this turn", so
    // activate during the same turn after opponent draws — Instant windows
    // require priority (CR 1.11).
    Opponent.play(tomeOfFyendalYellow);
    drain(game);
    expect(Opponent.zone("hand").length).toBeGreaterThanOrEqual(2);
    expect(game.getState().players[Opponent.id]?.history.turn.cardsDrawn).toBeGreaterThanOrEqual(2);

    // Active player passes priority so the controller may activate Instant.
    if (game.getState().priority?.holderPlayerId === Opponent.id) {
      Opponent.pass();
    }
    expect(game.getState().priority?.holderPlayerId).toBe(Controller.id);

    // Instant is now legal for the controller.
    const activate = listLegalCommands(game.getRuntime(), Controller.id).find(
      (cmd) => cmd.move === "activate" && cmd.payload.ability === ABILITY,
    );
    expect(activate).toBeDefined();
    game.exec({ move: "activate", actorId: Controller.id, payload: activate!.payload });
    drain(game);
    game.passBoth();

    expect(Controller.zone("head")).not.toContain(balanceOfJustice.canonicalId);
    expect(Controller.zone("graveyard")).toContain(balanceOfJustice.canonicalId);
    expect(Controller.zone("hand").length).toBe(handBefore + 1);
    expect(Controller.zone("deck").length).toBe(deckBefore - 1);
  });

  it("boundaries: no opponent draws → illegal; Guardwell d2 −2; model shape", () => {
    // Zero opponent draws — never legal.
    const blocked = FabTestEngine.start(
      {
        hero: bravo,
        head: [balanceOfJustice],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const illegal = listLegalCommands(blocked.getRuntime(), blocked.as(bravo).id).find(
      (cmd) => cmd.move === "activate" && cmd.payload.ability === ABILITY,
    );
    expect(illegal).toBeUndefined();
    const rejected = blocked.as(bravo).expectFailure({
      move: "activate",
      payload: { instanceId: blocked.as(bravo).card(balanceOfJustice) },
    });
    expect(rejected.accepted).toBe(false);
    expect(rejected.errorCode).toMatch(/activation_condition|illegal|unsupported|condition/i);

    // Guardwell first defend.
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
        head: [balanceOfJustice],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = game.as(dash);
    const helmId = Defender.findCardInZone("head", balanceOfJustice);
    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith(balanceOfJustice);
    drain(game);
    game.helpers.resolveRestOfCombat();
    expect(Defender.life()).toBe(LIFE - (SNATCH - 2));
    expect(Defender.zone("head")).toContain(balanceOfJustice.canonicalId);
    expect(game.objectState(helmId)?.defenseCounterTotal).toBe(-2);

    const a1 = balanceOfJustice.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("instant");
    expect(a1.cost).toMatchObject({ class: "effect", type: "destroy-self" });
    expect(a1.condition).toMatchObject({
      type: "compare-amount",
      amount: { type: "count", what: "cards-drawn-this-turn", player: "opponent" },
      comparison: { op: "gte", value: 2 },
    });
    expect(a1.effect).toMatchObject({
      type: "draw",
      count: 1,
      player: "controller",
    });
    expect(balanceOfJustice.base.keywords?.some((k) => k.name === "guardwell")).toBe(true);
  });
});
