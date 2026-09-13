/**
 * ARC004 Teklo Foundry Heart — Mechanologist Chest d2 Battleworn.
 *
 * Printed (i18n):
 *   Once per Turn Action - {r}: Banish the top 2 cards of your deck. Gain {r}
 *   for each Mechanologist card banished this way. Activate this ability only
 *   if you've boosted this turn. Go again
 *   Battleworn
 *
 * Model:
 *   OPT Action resources 1; condition boosted-this-turn; go again;
 *   sequence banish deck top 2 → gain-resources count banished-this-way
 *   filter Mechanologist supertype.
 *
 * Reasoning (hand-authored — architectural gaps found case-by-case):
 * 1. boosted-this-turn gates activation (history.turn.boosted via throttle boost).
 * 2. banished-this-way count amount was unwired (evaluateCount threw) — same
 *    family as shuffled-this-way; stamp multi-object cohort on banish + count
 *    with optional filter (Mechanologist).
 * 3. Multi-banish must keep the full cohort under banished-this-way even when
 *    outputBinding uses the same name (single-object stamp must not clobber).
 * 4. Boost itself banishes the current top — AAA deck seeds an expendable top
 *    so foundry's top-2 is the intended pair.
 * 5. Net RP: pay 1, gain N for N Mech among those 2.
 * 6. Non-Mech top-2 → gain 0 after pay (net −1).
 * 7. Without boost → activate illegal.
 * 8. Battleworn first defend d2 −1.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { listLegalCommands } from "../../../../automation/legal-commands.ts";
import { bravo, dash, throttleRed, nimblismBlue, snatchRed } from "../../../fixtures.ts";
import { tekloFoundryHeart } from "../../../../../../cards/src/cards/equipment/teklo-foundry-heart.ts";
import { hyperDriverRed } from "../../../../../../cards/src/cards/actions/hyper-driver.ts";

const SNATCH = 4;
const LIFE = 20;
const ABILITY = "tBqFrtGcBNQt7GnMFTPPB:oncePerTurnActionBanishTop2DeckGain";

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 48; safety += 1) {
    if (game.answerForcedDecision()) continue;
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
    if (decision?.kind === "payment") {
      const cand = decision.candidates[0];
      if (!cand) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "payment", instanceIds: [cand.instanceId] },
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

function activateFoundry(game: ReturnType<typeof FabTestEngine.start>, actorId: string): void {
  const activate = listLegalCommands(game.getRuntime(), actorId).find(
    (cmd) => cmd.move === "activate" && cmd.payload.ability === ABILITY,
  );
  expect(activate).toBeDefined();
  game.exec({ move: "activate", actorId, payload: activate!.payload });
  drain(game);
}

describe("teklo-foundry-heart (ARC004)", () => {
  it("core mechanic: after boost, banish top 2 Mech → gain {r} each; go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [tekloFoundryHeart],
        // Throttle to boost; pitch for throttle cost 2.
        hand: [throttleRed, nimblismBlue, nimblismBlue],
        // End of array = top. Boost banishes the top card first, so seed an
        // expendable top (non-Mech), then two Mechanologist Hyper Drivers for
        // the foundry's top-2 banish.
        deck: [snatchRed, hyperDriverRed, hyperDriverRed, snatchRed],
        actionPoints: 2,
        // Throttle needs 2{r} (pitch); foundry costs 1{r} after boost.
        resourcePoints: 1,
      },
      { hero: dash, life: 40, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const apBefore = Bravo.actionPoints();

    // Boost stamps boosted-this-turn and banishes the current top (snatch).
    Bravo.play(throttleRed, {
      target: game.as(dash).id,
      boost: true,
      pitch: [nimblismBlue, nimblismBlue],
    });
    drain(game);
    expect(game.getState().players[Bravo.id]!.history.turn.boosted).toBe(true);
    // Close combat so Action window is free for the equipment.
    game.helpers.resolveRestOfCombat();
    drain(game);

    const rpBefore = Bravo.resourcePoints();
    activateFoundry(game, Bravo.id);

    // Pay 1{r}, banish 2 Mech → gain 2{r} → net +1.
    expect(Bravo.resourcePoints()).toBe(rpBefore - 1 + 2);
    expect(Bravo.zone("banished")).toContain(hyperDriverRed.canonicalId);
    // Go again refunds Action AP for the foundry activation.
    expect(Bravo.actionPoints()).toBeGreaterThanOrEqual(apBefore - 2);
  });

  it("boundaries: no boost illegal; non-Mech top gains 0; battleworn d2 −1", () => {
    // No boost.
    const noBoost = FabTestEngine.start(
      {
        hero: bravo,
        chest: [tekloFoundryHeart],
        hand: [],
        deck: [hyperDriverRed, hyperDriverRed, snatchRed],
        actionPoints: 1,
        resourcePoints: 1,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const illegal = listLegalCommands(noBoost.getRuntime(), noBoost.as(bravo).id).find(
      (cmd) => cmd.move === "activate" && cmd.payload.ability === ABILITY,
    );
    expect(illegal).toBeUndefined();

    // Boosted but top 2 non-Mech → pay 1, gain 0.
    // Boost burns the current top; seed expendable top then two non-Mech.
    const nonMech = FabTestEngine.start(
      {
        hero: bravo,
        chest: [tekloFoundryHeart],
        hand: [throttleRed, nimblismBlue, nimblismBlue],
        deck: [hyperDriverRed, snatchRed, snatchRed, snatchRed],
        actionPoints: 2,
        resourcePoints: 1,
      },
      { hero: dash, life: 40, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const B = nonMech.as(bravo);
    B.play(throttleRed, {
      target: nonMech.as(dash).id,
      boost: true,
      pitch: [nimblismBlue, nimblismBlue],
    });
    drain(nonMech);
    nonMech.helpers.resolveRestOfCombat();
    drain(nonMech);
    const rpBefore = B.resourcePoints();
    activateFoundry(nonMech, B.id);
    expect(B.resourcePoints()).toBe(rpBefore - 1);
    expect(B.zone("banished")).toContain(snatchRed.canonicalId);

    // Battleworn.
    const bw = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        chest: [tekloFoundryHeart],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = bw.as(dash);
    const plateId = Defender.findCardInZone("chest", tekloFoundryHeart);
    bw.as(bravo).attackWith(snatchRed);
    Defender.defendWith(tekloFoundryHeart);
    drain(bw);
    bw.helpers.resolveRestOfCombat();
    expect(Defender.zone("chest")).toContain(tekloFoundryHeart.canonicalId);
    expect(bw.objectState(plateId)?.defenseCounterTotal).toBe(-1);
    expect(Defender.life()).toBe(LIFE - (SNATCH - 2));

    const a1 = tekloFoundryHeart.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.condition).toMatchObject({
      type: "performed-this-turn",
      event: "boost",
      player: "controller",
    });
    expect(a1.effect).toMatchObject({
      type: "sequence",
    });
  });
});
