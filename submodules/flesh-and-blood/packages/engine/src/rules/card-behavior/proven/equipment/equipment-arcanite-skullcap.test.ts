/**
 * ARC150 Arcanite Skullcap — Generic Head d1 battleworn.
 *
 * Printed:
 *   If you have less {h} than your opponent, this gains +1{d} and Arcane
 *   Barrier 3. Battleworn
 *
 * Model (after fix):
 *   keywords: battleworn only (AB 3 is not base)
 *   continuous: life self < opponent → +1{d} permanent + grant AB3 permanent
 *
 * Reasoning:
 * 1. Catalog had arcaneBarrier(3) as always-on keyword — printed is conditional.
 * 2. Continuous grants used duration this-turn — continuous statics use
 *    permanent and re-evaluate with the condition.
 * 3. Defending equipment moves to combatChain; continuous statics must stay
 *    functional there or the +1{d} never applies to combat damage.
 * 4. Core: behind on life → defend contributes d2; equal/ahead → d1 only.
 * 5. Keyword AB 3 appears on rules view only when life behind.
 * 6. Battleworn: after defend, −1 defense counter (defenseCounterTotal).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { buildFabRulesView } from "../../../state-rules-view.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { arcaniteSkullcap } from "../../../../../../cards/src/cards/equipment/arcanite-skullcap.ts";

function headView(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
  card: { canonicalId: string },
) {
  const instanceId = game
    .getState()
    .containers.zonesByPlayerId[playerId]!.head.find(
      (id) => game.getState().objects[id]?.canonicalId === card.canonicalId,
    );
  if (!instanceId) return null;
  const record = game.getState().objects[instanceId]!;
  return buildFabRulesView(game.getState()).object({
    instanceId,
    incarnation: record.incarnation,
  });
}

function hasArcaneBarrier3(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
  card: { canonicalId: string },
): boolean {
  const view = headView(game, playerId, card);
  return (
    view?.current.keywords.some(
      (k) => k.name === "arcane-barrier" && (k as { value?: number }).value === 3,
    ) ?? false
  );
}

describe("arcanite-skullcap (ARC150)", () => {
  it("core mechanic: life behind → +1{d} (blocks 2) and Arcane Barrier 3", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: 15,
        head: [arcaniteSkullcap],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    // Opponent dash at default 20; bravo at 15 → behind.
    const Bravo = game.as(bravo);
    const view = headView(game, Bravo.id, arcaniteSkullcap);
    expect(view?.current.numeric.defense).toBe(2);
    expect(hasArcaneBarrier3(game, Bravo.id, arcaniteSkullcap)).toBe(true);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(arcaniteSkullcap);
    // Continuous must still apply while equipment is on the combat chain.
    const defendingId = game
      .getState()
      .containers.zonesByPlayerId[Bravo.id]!.combatChain.find(
        (id) => game.getState().objects[id]?.canonicalId === arcaniteSkullcap.canonicalId,
      );
    expect(defendingId).toBeDefined();
    const defRec = game.getState().objects[defendingId!]!;
    expect(
      buildFabRulesView(game.getState()).object({
        instanceId: defRec.instanceId,
        incarnation: defRec.incarnation,
      })?.current.numeric.defense,
    ).toBe(2);
    game.helpers.resolveRestOfCombat();

    // snatch 4 − defense 2 = 2 damage.
    expect(Bravo.life()).toBe(13);
  });

  it("boundaries: life equal → base d1 only, no Arcane Barrier 3", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      {
        hero: bravo,
        life: 20,
        head: [arcaniteSkullcap],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const view = headView(game, Bravo.id, arcaniteSkullcap);
    expect(view?.current.numeric.defense).toBe(1);
    expect(hasArcaneBarrier3(game, Bravo.id, arcaniteSkullcap)).toBe(false);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(arcaniteSkullcap);
    game.helpers.resolveRestOfCombat();

    // snatch 4 − 1 = 3 damage.
    expect(Bravo.life()).toBe(17);
  });

  it("boundaries: life ahead → base d1 only", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, life: 10, deck: 6 },
      {
        hero: bravo,
        life: 20,
        head: [arcaniteSkullcap],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    expect(headView(game, Bravo.id, arcaniteSkullcap)?.current.numeric.defense).toBe(1);
    expect(hasArcaneBarrier3(game, Bravo.id, arcaniteSkullcap)).toBe(false);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(arcaniteSkullcap);
    game.helpers.resolveRestOfCombat();
    // snatch 4 − 1 = 3 damage → 20 − 3 = 17.
    expect(Bravo.life()).toBe(17);
  });

  it("core interaction: battleworn after defend places −1 defense counter", () => {
    // Behind on life so defend uses d2; battleworn stamps after block.
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: 15,
        head: [arcaniteSkullcap],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const eqId = Bravo.findCardInZone("head", arcaniteSkullcap);
    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(arcaniteSkullcap);
    game.helpers.resolveRestOfCombat();

    expect(Bravo.zone("head")).toContain(arcaniteSkullcap.canonicalId);
    expect(game.objectState(eqId)?.defenseCounterTotal).toBe(-1);
  });
});
