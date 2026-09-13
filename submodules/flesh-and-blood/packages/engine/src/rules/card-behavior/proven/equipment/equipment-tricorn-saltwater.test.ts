/**
 * AGB004 Tricorn of Saltwater Death — Pirate Necromancer Head d1 bladeBreak.
 *
 * Printed (i18n):
 *   When this defends, you may discard a card with watery grave. If you do,
 *   draw a card.
 *   Blade Break
 *
 * Model:
 *   static triggered on defend → optional discard (hand, hasKeyword watery-grave)
 *   → then draw 1 controller. keywords: bladeBreak, defense: 1.
 *
 * Reasoning:
 * 1. Trigger is on defend (when this is declared as a defending object), not
 *    on chain-link close. The optional should open while the equipment is still
 *    the defending object — before bladeBreak destroys it at close.
 * 2. Optional discard filter is hasKeyword watery-grave, not a name/subtype.
 *    A hand without watery-grave cards must not offer a legal discard target
 *    that could sneak a non-watery card; declining is always legal.
 * 3. "If you do" is optional.then — only draw when the discard was chosen and
 *    paid. Decline → no draw; accept + discard barnacle → hand net 0 after
 *    discard+draw (or +0 if deck supplies the draw).
 * 4. Blade Break still applies after the defend trigger resolves: d1 blocks
 *    snatch (4−1=3 damage), then equipment leaves head for GY.
 * 5. Once blade-broken, cannot defend again.
 *
 * Watery-grave subject: AGB015 barnacle-yellow (Ally with keywords wateryGrave).
 * Snatch is the canonical power-4 probe attack.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { tricornOfSaltwaterDeath } from "../../../../../../cards/src/cards/equipment/tricorn-of-saltwater-death.ts";
import { barnacleYellow } from "../../../../../../cards/src/cards/actions/barnacle.ts";
import { tomeOfFyendalYellow } from "../../../../../../cards/src/cards/actions/tome-of-fyendal.ts";

const SNATCH_POWER = 4;
const STARTING_LIFE = 20;

/** Drain optional boolean + optional entity-target for the watery-grave discard. */
function answerDefendOptional(
  game: ReturnType<typeof FabTestEngine.start>,
  accept: boolean,
  discardCanonicalId?: string,
): void {
  for (let safety = 0; safety < 32; safety += 1) {
    const decision = game.getState().decision;
    if (!decision) {
      if (game.getState().rulesStack.length === 0 && !game.combat()) return;
      // Still on combat / stack — pass priority and keep looking.
      const prio = game.getState().priority?.holderPlayerId;
      if (prio) {
        game.exec({ move: "pass", actorId: prio, payload: {} });
        continue;
      }
      return;
    }
    if (decision.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: accept },
        },
      });
      if (!accept) return;
      continue;
    }
    if (decision.kind === "entity-target" && accept) {
      const pick =
        (discardCanonicalId
          ? decision.candidates.find(
              (c) => game.getState().objects[c.instanceId]?.canonicalId === discardCanonicalId,
            )
          : undefined) ?? decision.candidates[0];
      if (!pick) throw new Error("no entity-target candidate for watery-grave discard");
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
    // Unexpected decision kind — fail closed rather than auto-answer.
    throw new Error(`unexpected decision kind during tricorn optional: ${decision.kind}`);
  }
}

describe("tricorn-of-saltwater-death (AGB004)", () => {
  it("core mechanic: defend → discard watery-grave → draw, then bladeBreak to GY", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: STARTING_LIFE,
        head: [tricornOfSaltwaterDeath],
        hand: [barnacleYellow],
        deck: 8,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    expect(Defender.zone("head")).toContain(tricornOfSaltwaterDeath.canonicalId);
    expect(Defender.zone("hand")).toContain(barnacleYellow.canonicalId);
    const handBefore = Defender.handCount();
    const deckBefore = Defender.zone("deck").length;

    Attacker.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    Defender.defendWith(tricornOfSaltwaterDeath);

    // Optional opens from the defend trigger.
    answerDefendOptional(game, true, barnacleYellow.canonicalId);
    game.helpers.resolveRestOfCombat();

    // Discard barnacle + draw 1 → hand count unchanged; deck −1.
    expect(Defender.zone("graveyard")).toContain(barnacleYellow.canonicalId);
    expect(Defender.handCount()).toBe(handBefore); // −1 discard +1 draw
    expect(Defender.zone("deck").length).toBe(deckBefore - 1);

    // Blade Break + defense 1.
    expect(Defender.life()).toBe(STARTING_LIFE - (SNATCH_POWER - 1));
    expect(Defender.zone("head")).not.toContain(tricornOfSaltwaterDeath.canonicalId);
    expect(Defender.zone("graveyard")).toContain(tricornOfSaltwaterDeath.canonicalId);
  });

  it("boundaries: decline optional — no discard, no draw; still bladeBreaks", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: STARTING_LIFE,
        head: [tricornOfSaltwaterDeath],
        hand: [barnacleYellow],
        deck: 8,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    const handBefore = Defender.handCount();
    const deckBefore = Defender.zone("deck").length;

    Attacker.attackWith(snatchRed);
    Defender.defendWith(tricornOfSaltwaterDeath);
    answerDefendOptional(game, false);
    game.helpers.resolveRestOfCombat();

    expect(Defender.zone("hand")).toContain(barnacleYellow.canonicalId);
    expect(Defender.handCount()).toBe(handBefore);
    expect(Defender.zone("deck").length).toBe(deckBefore);
    expect(Defender.zone("graveyard")).toContain(tricornOfSaltwaterDeath.canonicalId);
    expect(Defender.zone("graveyard")).not.toContain(barnacleYellow.canonicalId);
  });

  it("boundaries: hand without watery-grave still defends and bladeBreaks without drawing", () => {
    // Tome has no watery-grave — optional may open but must not discard it as
    // a matching target; if no candidates, declining/passing leaves hand intact.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: STARTING_LIFE,
        head: [tricornOfSaltwaterDeath],
        hand: [tomeOfFyendalYellow],
        deck: 8,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    const handBefore = Defender.handCount();

    Attacker.attackWith(snatchRed);
    Defender.defendWith(tricornOfSaltwaterDeath);

    // If optional boolean opens, decline. If entity-target opens with empty
    // candidates, the engine should not allow illegal discards.
    for (let safety = 0; safety < 16; safety += 1) {
      const decision = game.getState().decision;
      if (!decision) break;
      if (decision.kind === "boolean") {
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
      if (decision.kind === "entity-target") {
        // Filter must exclude non-watery cards.
        const illegal = decision.candidates.filter(
          (c) =>
            game.getState().objects[c.instanceId]?.canonicalId === tomeOfFyendalYellow.canonicalId,
        );
        expect(illegal).toHaveLength(0);
        // No legal watery target — cancel/decline path: answer empty if allowed, else boolean decline already preferred.
        if (decision.min === 0) {
          game.exec({
            move: "answer-decision",
            actorId: decision.actorId,
            payload: {
              decisionId: decision.decisionId,
              stateVersion: decision.stateVersion,
              answer: { kind: "entity-target", instanceIds: [] },
            },
          });
        } else {
          // Fail closed: force pass/decline if the engine stuck on a required target with no candidates.
          expect(decision.candidates).toHaveLength(0);
        }
        continue;
      }
      break;
    }
    game.helpers.resolveRestOfCombat();

    expect(Defender.handCount()).toBe(handBefore);
    expect(Defender.zone("hand")).toContain(tomeOfFyendalYellow.canonicalId);
    expect(Defender.zone("graveyard")).toContain(tricornOfSaltwaterDeath.canonicalId);
    expect(Defender.life()).toBe(STARTING_LIFE - (SNATCH_POWER - 1));
  });

  it("boundaries: once blade-broken cannot defend a second attack", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed, snatchRed], actionPoints: 2, deck: 6 },
      {
        hero: dash,
        life: STARTING_LIFE,
        head: [tricornOfSaltwaterDeath],
        hand: [],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(snatchRed);
    Defender.defendWith(tricornOfSaltwaterDeath);
    // Decline if optional opens with empty hand.
    for (let safety = 0; safety < 8; safety += 1) {
      const decision = game.getState().decision;
      if (!decision) break;
      if (decision.kind === "boolean") {
        game.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: { kind: "boolean", value: false },
          },
        });
      } else break;
    }
    game.helpers.resolveRestOfCombat();
    expect(Defender.zone("graveyard")).toContain(tricornOfSaltwaterDeath.canonicalId);

    Attacker.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    expect(() => Defender.defendWith(tricornOfSaltwaterDeath)).toThrow();
  });
});
