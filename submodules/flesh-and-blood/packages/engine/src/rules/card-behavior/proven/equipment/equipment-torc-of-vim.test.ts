/**
 * ARR004 Torc of Vim — Brute Chest d1 Battleworn.
 *
 * Printed:
 *   Whenever you beat chest, you may destroy this. If you do, the next Brute
 *   attack action card you play this turn costs {r}{r} less to play.
 *   Battleworn
 *
 * Reasoning (hand-authored):
 * 1. beat-chest additional cost discards 6+ power and emits beat-chest event
 *    (same path as ARR003 echo-casque).
 * 2. Optional destroy self → then cost −2 this-turn appliesTo.next Brute AAC.
 * 3. Model fix: Action is types not subtypes; prior and-filter never matched.
 * 4. Pack Hunt (Brute AAC cost 2) plays for 0{r} after accept; without torc
 *    illegal at 0{r}.
 * 5. Decline → torc stays, no cost grant.
 * 6. Non-Brute cost-2 AAC (brutal assault Generic) does not get the −2.
 * 7. Battleworn first defend d1 −1.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { hitTrainer } from "../../../test-trainers.ts";
import { bravo, dash, regurgitatingSlogRed, snatchRed } from "../../../fixtures.ts";
import { torcOfVim } from "../../../../../../cards/src/cards/equipment/torc-of-vim.ts";
import { packHuntRed } from "../../../../../../cards/src/cards/actions/pack-hunt.ts";
import { brutalAssaultRed } from "../../../../../../cards/src/cards/actions/brutal-assault.ts";

const SNATCH = 4;
const LIFE = 20;

const beatAtk = hitTrainer({
  slug: "torc-of-vim-beat-atk",
  keywords: [{ name: "beat-chest" }],
  power: 4,
  cost: 0,
});

function drain(game: ReturnType<typeof FabTestEngine.start>, acceptOptional: boolean | null): void {
  for (let safety = 0; safety < 56; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      if (acceptOptional === null) {
        throw new Error("unexpected boolean decision when no optional expected");
      }
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: acceptOptional },
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

describe("torc-of-vim (ARR004)", () => {
  it("core mechanic: beat chest → destroy torc → next Brute AAC costs {r}{r} less", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [torcOfVim],
        // beatAtk + slog (6+ discard for beat chest) + pack hunt (Brute cost 2).
        hand: [beatAtk, regurgitatingSlogRed, packHuntRed],
        actionPoints: 2,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const slogId = Bravo.findCardInZone("hand", regurgitatingSlogRed);

    Bravo.play(beatAtk, {
      target: game.as(dash).id,
      beatChest: true,
      beatChestInstanceId: slogId,
    });
    drain(game, true);

    expect(Bravo.zone("chest")).not.toContain(torcOfVim.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(torcOfVim.canonicalId);
    expect(game.getState().continuousEffectInstances.length).toBeGreaterThanOrEqual(1);
    const costGrant = game
      .getState()
      .continuousEffectInstances.find((inst) =>
        inst.atoms.some((atom) => atom.kind === "numeric" && atom.property === "cost"),
      );
    expect(costGrant?.futureApplicability?.remaining).toBe(1);

    game.helpers.resolveRestOfCombat();
    drain(game, null);

    // Pack Hunt cost 2 − 2 = 0; plays with 0 RP.
    const rpBefore = Bravo.resourcePoints();
    Bravo.attackWith(packHuntRed);
    drain(game, null);
    game.helpers.resolveRestOfCombat();
    expect(Bravo.resourcePoints()).toBe(rpBefore);
    expect(Bravo.zone("hand")).not.toContain(packHuntRed.canonicalId);
  });

  it("boundaries: decline; no-beat no trigger; non-Brute no discount; BW d1", () => {
    // Decline optional → torc stays, pack hunt still costs 2.
    const decline = FabTestEngine.start(
      {
        hero: bravo,
        chest: [torcOfVim],
        hand: [beatAtk, regurgitatingSlogRed, packHuntRed],
        actionPoints: 2,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const B = decline.as(bravo);
    B.play(beatAtk, {
      target: decline.as(dash).id,
      beatChest: true,
      beatChestInstanceId: B.findCardInZone("hand", regurgitatingSlogRed),
    });
    drain(decline, false);
    expect(B.zone("chest")).toContain(torcOfVim.canonicalId);
    decline.helpers.resolveRestOfCombat();
    drain(decline, null);
    expect(() => B.attackWith(packHuntRed)).toThrow();

    // Play beat-chest attack without beating chest → no trigger.
    const noBeat = FabTestEngine.start(
      {
        hero: bravo,
        chest: [torcOfVim],
        hand: [beatAtk, regurgitatingSlogRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    noBeat.as(bravo).play(beatAtk, { target: noBeat.as(dash).id });
    drain(noBeat, null);
    expect(noBeat.as(bravo).zone("chest")).toContain(torcOfVim.canonicalId);

    // Accept torc discount does not reduce non-Brute cost-2 AAC (brutal assault).
    const nonBrute = FabTestEngine.start(
      {
        hero: bravo,
        chest: [torcOfVim],
        hand: [beatAtk, regurgitatingSlogRed, brutalAssaultRed],
        actionPoints: 2,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const NB = nonBrute.as(bravo);
    NB.play(beatAtk, {
      target: nonBrute.as(dash).id,
      beatChest: true,
      beatChestInstanceId: NB.findCardInZone("hand", regurgitatingSlogRed),
    });
    drain(nonBrute, true);
    nonBrute.helpers.resolveRestOfCombat();
    drain(nonBrute, null);
    // Brutal Assault is Generic cost 2 — still illegal at 0 RP.
    expect(() => NB.attackWith(brutalAssaultRed)).toThrow();

    // Without discount, pack hunt also illegal at 0 RP (sanity).
    const bare = FabTestEngine.start(
      {
        hero: bravo,
        hand: [packHuntRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => bare.as(bravo).attackWith(packHuntRed)).toThrow();

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
        chest: [torcOfVim],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = bw.as(dash);
    const plateId = Defender.findCardInZone("chest", torcOfVim);
    bw.as(bravo).attackWith(snatchRed);
    Defender.defendWith(torcOfVim);
    drain(bw, null);
    bw.helpers.resolveRestOfCombat();
    expect(Defender.zone("chest")).toContain(torcOfVim.canonicalId);
    expect(bw.objectState(plateId)?.defenseCounterTotal).toBe(-1);
    expect(Defender.life()).toBe(LIFE - (SNATCH - 1));

    // Model guard.
    const a1 = torcOfVim.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static" || !a1.effect) return;
    expect(a1.trigger).toMatchObject({
      event: { name: "beat-chest", actor: "controller" },
    });
    expect(a1.effect).toMatchObject({
      type: "optional",
      effect: { type: "destroy", target: { selector: "self" } },
      then: {
        type: "modify-numeric",
        property: "cost",
        op: "subtract",
        amount: 2,
        appliesTo: {
          next: {
            typeBox: {
              types: ["Action"],
              subtypes: ["Attack"],
              supertypes: ["Brute"],
            },
          },
        },
      },
    });
  });
});
