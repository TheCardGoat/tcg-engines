import { typeBoxTokens } from "@tcg/flesh-and-blood-types";
/**
 * FLR003 Helm of Lignum Vitae — Earth Head d1 Blade Break.
 *
 * Printed:
 *   If there are 4 or more Earth cards in your banished zone, this gets +1{d}.
 *   Blade Break
 *
 * Reasoning:
 * 1. Continuous while-condition (zone-count banished Earth ≥ 4) → +1{d} on self.
 * 2. Prior duration this-turn was wrong for a continuous static (would drop at
 *    EOT even while still 4+ Earth banished) — fixed to permanent like
 *    Arcanite Skullcap's conditional +1{d}.
 * 3. Earth is a talent supertype on banished cards.
 * 4. Blade Break destroy after defend; +1{d} must apply while defending if the
 *    condition holds (equipment on combat chain).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { buildFabRulesView } from "../../../state-rules-view.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { helmOfLignumVitae } from "../../../../../../cards/src/cards/equipment/helm-of-lignum-vitae.ts";
import { cadaverousTillingRed } from "../../../../../../cards/src/cards/actions/cadaverous-tilling.ts";
import { cadaverousTillingBlue } from "../../../../../../cards/src/cards/actions/cadaverous-tilling.ts";
import { earthFormBlue } from "../../../../../../cards/src/cards/actions/earth-form.ts";
import { fruitsOfTheForestRed } from "../../../../../../cards/src/cards/actions/fruits-of-the-forest.ts";

const LIFE = 20;

function headDefense(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
): number | undefined {
  const state = game.getState();
  const instanceId = state.containers.zonesByPlayerId[playerId]?.head.find(
    (id) => state.objects[id]?.canonicalId === helmOfLignumVitae.canonicalId,
  );
  if (!instanceId) return undefined;
  const view = buildFabRulesView(state);
  return view.object({
    instanceId,
    incarnation: state.objects[instanceId]!.incarnation,
  })?.current.numeric.defense;
}

const FOUR_EARTH = [
  cadaverousTillingRed,
  cadaverousTillingBlue,
  earthFormBlue,
  fruitsOfTheForestRed,
] as const;

describe("helm-of-lignum-vitae (FLR003)", () => {
  it("core mechanic: 4 Earth banished → +1{d} (blocks for 2)", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: LIFE,
        head: [helmOfLignumVitae],
        banished: [...FOUR_EARTH],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    expect(Bravo.zone("banished").length).toBeGreaterThanOrEqual(4);
    expect(headDefense(game, Bravo.id)).toBe(2);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(helmOfLignumVitae);
    // Continuous must still apply while defending on the combat chain.
    const defendingId = game
      .getState()
      .containers.zonesByPlayerId[Bravo.id]!.combatChain.find(
        (id) => game.getState().objects[id]?.canonicalId === helmOfLignumVitae.canonicalId,
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

    // snatch 4 − d2 = 2 damage; bladeBreak → GY.
    expect(Bravo.life()).toBe(LIFE - 2);
    expect(Bravo.zone("head")).not.toContain(helmOfLignumVitae.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(helmOfLignumVitae.canonicalId);
  });

  it("boundaries: fewer than 4 Earth banished → base d1 only", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: LIFE,
        head: [helmOfLignumVitae],
        banished: [cadaverousTillingRed, cadaverousTillingBlue, earthFormBlue],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    expect(headDefense(game, Bravo.id)).toBe(1);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(helmOfLignumVitae);
    game.helpers.resolveRestOfCombat();

    // snatch 4 − 1 = 3; bladeBreak.
    expect(Bravo.life()).toBe(LIFE - 3);
    expect(Bravo.zone("graveyard")).toContain(helmOfLignumVitae.canonicalId);
  });

  it("boundaries: non-Earth banished cards do not count toward the 4", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: LIFE,
        head: [helmOfLignumVitae],
        // 3 Earth + 1 Generic snatch — still only 3 Earth.
        banished: [cadaverousTillingRed, cadaverousTillingBlue, earthFormBlue, snatchRed],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    expect(headDefense(game, game.as(bravo).id)).toBe(1);
  });

  it("model guard: continuous zone-count Earth banished ≥4 → +1{d} permanent", () => {
    const a1 = helmOfLignumVitae.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static" || !a1.effect) return;
    expect(a1.staticKind).toBe("continuous");
    expect(a1.condition).toMatchObject({
      type: "zone-count",
      zone: "banished",
      player: "controller",
      filter: { typeBox: { supertypes: ["Earth"] } },
      comparison: { op: "gte", value: 4 },
    });
    expect(a1.effect).toMatchObject({
      type: "modify-numeric",
      property: "defense",
      op: "add",
      amount: 1,
      target: { selector: "self" },
      duration: "permanent",
    });
  });

  it("catalog: bladeBreak d1 Earth Head", () => {
    expect(helmOfLignumVitae.base.numeric.defense).toBe(1);
    expect(helmOfLignumVitae.base.keywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "blade-break" })]),
    );
    expect(typeBoxTokens(helmOfLignumVitae.base.typeBox)).toEqual(
      expect.arrayContaining(["Earth", "Head"]),
    );
  });
});
