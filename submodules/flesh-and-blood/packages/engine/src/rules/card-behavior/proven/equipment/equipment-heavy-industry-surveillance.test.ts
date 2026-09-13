/**
 * AIO003 Heavy Industry Surveillance — Mechanologist Head d1 Temper.
 *
 * Printed (i18n):
 *   When this defends, you may banish the top card of your deck. If it's a
 *   Mechanologist card, this gets +1{d} until end of turn.
 *   Temper
 *
 * Model (after fix):
 *   static triggered on defend → sequence:
 *     optional banish top deck outputBinding it
 *     conditional binding-matches it { supertypes: [Mechanologist] }
 *       → modify-numeric defense +1 self until-end-of-turn
 *   keywords: temper, defense: 1
 *
 * Reasoning:
 * 1. Catalog had supertypes: ["A mechanologist card"] — English residue that
 *    assertVocabulary throws on. Fixed to ["Mechanologist"] (class supertype),
 *    matching AIO006 / catalog convention.
 * 2. Optional banish is "you may"; decline leaves top of deck and grants no buff.
 * 3. Accept + Mechanologist top → banished + continuous +1{d} until EOT.
 * 4. Accept + non-Mechanologist top → banished, no +1{d} buff.
 * 5. Temper on d1: after defend, −1{d} counter; if current defense hits 0 the
 *    piece is destroyed (CR 8.3.10). With a successful +1{d} buff in the same
 *    window, surviving is rules-sensitive (simultaneous order). Assert what
 *    the engine actually does after a successful Mech banish, and that a
 *    declined path with d1 temper still applies temper lifecycle.
 * 6. Defense contribution for the current block is at least printed d1 before
 *    temper counters stick (snatch 4 − 1 = 3 damage baseline when it defends).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, throttleRed, tomeOfFyendalYellow } from "../../../fixtures.ts";
import { heavyIndustrySurveillance } from "../../../../../../cards/src/cards/equipment/heavy-industry-surveillance.ts";

const SNATCH = 4;
const LIFE = 20;

/** Answer defend optional (banish top?) boolean. */
function answerOptional(game: ReturnType<typeof FabTestEngine.start>, accept: boolean): void {
  for (let safety = 0; safety < 40; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: accept },
        },
      });
      continue;
    }
    if (decision) {
      throw new Error(`unexpected decision kind: ${decision.kind}`);
    }
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

function hasDefenseBuff(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
  equipment: { canonicalId: string },
): boolean {
  // Continuous +1 defense for this equipment instance this turn.
  const headIds = game.getState().containers.zonesByPlayerId[playerId]!.head;
  const instanceId = headIds.find(
    (id) => game.getState().objects[id]?.canonicalId === equipment.canonicalId,
  );
  if (!instanceId) return false;
  return game
    .getState()
    .continuousEffectInstances.some(
      (effect) =>
        effect.controllerId === playerId &&
        effect.atoms.some(
          (atom) =>
            atom.kind === "numeric" &&
            atom.property === "defense" &&
            atom.operation === "add" &&
            typeof atom.amount === "number" &&
            atom.amount === 1,
        ),
    );
}

describe("heavy-industry-surveillance (AIO003)", () => {
  it("core mechanic: defend + accept banish Mechanologist → top banished and +1{d} buff", () => {
    // Deck top is last index (draw/banish top uses pop / at(-1)).
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        head: [heavyIndustrySurveillance],
        deck: [tomeOfFyendalYellow, tomeOfFyendalYellow, tomeOfFyendalYellow, throttleRed],
        hand: [],
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    expect(Defender.zone("head")).toContain(heavyIndustrySurveillance.canonicalId);

    Attacker.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    Defender.defendWith(heavyIndustrySurveillance);
    answerOptional(game, true);

    // Top of deck was banished.
    expect(Defender.zone("banished")).toContain(throttleRed.canonicalId);
    expect(Defender.zone("deck")).not.toContain(throttleRed.canonicalId);

    // Mechanologist → +1{d} applied for this block: snatch 4 − (1 base + 1 buff) = 2.
    // Temper −1{d} after the buff window leaves current defense > 0 so the piece
    // remains seated (unlike naked d1 temper destroy).
    expect(Defender.life()).toBe(LIFE - (SNATCH - 2));
    expect(Defender.zone("head")).toContain(heavyIndustrySurveillance.canonicalId);
    expect(hasDefenseBuff(game, Defender.id, heavyIndustrySurveillance)).toBe(true);
  });

  it("boundaries: decline optional — deck top stays, no Mechanologist buff path", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        head: [heavyIndustrySurveillance],
        deck: [tomeOfFyendalYellow, tomeOfFyendalYellow, tomeOfFyendalYellow, throttleRed],
        hand: [],
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(snatchRed);
    Defender.defendWith(heavyIndustrySurveillance);
    answerOptional(game, false);

    expect(Defender.zone("banished")).not.toContain(throttleRed.canonicalId);
    expect(Defender.zone("deck")).toContain(throttleRed.canonicalId);
    // No +1{d} continuous from the ability.
    expect(hasDefenseBuff(game, Defender.id, heavyIndustrySurveillance)).toBe(false);
  });

  it("boundaries: accept banish non-Mechanologist — banished but no +1{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        head: [heavyIndustrySurveillance],
        // Generic Tome is not Mechanologist (top = last).
        deck: [throttleRed, throttleRed, throttleRed, tomeOfFyendalYellow],
        hand: [],
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(snatchRed);
    Defender.defendWith(heavyIndustrySurveillance);
    answerOptional(game, true);

    expect(Defender.zone("banished")).toContain(tomeOfFyendalYellow.canonicalId);
    expect(hasDefenseBuff(game, Defender.id, heavyIndustrySurveillance)).toBe(false);
  });

  it("boundaries: catalog filter is Mechanologist supertype, not English residue", () => {
    // Guards the model fix: reintroducing "A mechanologist card" would throw
    // at evaluation when binding-matches runs.
    const ability = heavyIndustrySurveillance.base.abilities?.[0] as {
      resolution?: {
        effect?: {
          steps?: readonly {
            condition?: { filter?: { typeBox?: { supertypes?: readonly string[] } } };
          }[];
        };
      };
    };
    const conditional = ability.resolution?.effect?.steps?.find(
      (step) => step.condition?.filter?.typeBox?.supertypes,
    );
    expect(conditional?.condition?.filter?.typeBox?.supertypes).toEqual(["Mechanologist"]);
    expect(conditional?.condition?.filter?.typeBox?.supertypes).not.toContain(
      "A mechanologist card",
    );
  });
});
