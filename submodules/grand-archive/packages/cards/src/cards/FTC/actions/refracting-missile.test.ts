import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { describe, expect, it } from "vitest";
import { refractingMissile } from "./refracting-missile.ts";
import { deepSeaFractal } from "../phantasias/deep-sea-fractal.ts";
import { fractalOfPolarDepths } from "../../AMB/phantasias/fractal-of-polar-depths.ts";
import { proveSubtypeCountDamage } from "../../../testing/subtype-count-damage.ts";
import { proveFloatingMemory } from "../../../testing/floating-memory.ts";
/** @covers 6ffqsuo6gb-a1 */
describe("Refracting Missile — controlled Fractals plus one", () => {
  proveSubtypeCountDamage(
    refractingMissile,
    3,
    deepSeaFractal,
    [
      { label: "none", cards: [] },
      { label: "one", cards: [deepSeaFractal] },
      { label: "duplicates", cards: [deepSeaFractal, deepSeaFractal, deepSeaFractal] },
      { label: "mixed", cards: [deepSeaFractal, fractalOfPolarDepths] },
    ],
    "fractals-plus-one",
  );
});
/** @covers 6ffqsuo6gb-a2 */
describe("Refracting Missile — Floating Memory", () => proveFloatingMemory(refractingMissile));

/** @covers 6ffqsuo6gb-a1 */
describe("Refracting Missile — resolution count", () => {
  for (const sacrifice of [false, true])
    it(`counts rested Fractals; sacrifice=${sacrifice}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(fractalOfPolarDepths, true, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [refractingMissile, woodlandSquirrels, woodlandSquirrels],
            field: [deepSeaFractal, fractalOfPolarDepths],
          },
        },
        playerTwo: { champion },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const fractal = p.card(deepSeaFractal),
        polar = p.card(fractalOfPolarDepths);
      const target = q.card(champion);
      p.activate(refractingMissile, {
        reservePayment: [
          { kind: "reservable", objectId: fractal.objectId },
          ...p.cards(woodlandSquirrels).map((c) => ({ kind: "card" as const, cardId: c.objectId })),
        ],
        targets: { "target-1": [target.objectId] },
      });
      expect(game.state.objects[fractal.objectId]?.states.has("rested")).toBe(true);
      if (sacrifice)
        p.activateAbility(polar, "5fnmnpavo4-a2", { targets: { "target-player": [q.id] } });
      passEffectsStack(game);
      expect(game.state.objects[target.objectId]?.damage).toBe(sacrifice ? 2 : 3);
      expect(game.state.objects[polar.objectId]?.zone).toBe(sacrifice ? "graveyard" : "field");
      expect(game.state.stack).toHaveLength(0);
      expect(game.state.decision).toBeNull();
    });
});
