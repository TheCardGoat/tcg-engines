import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  classBonusLeveledChampion,
  namedClassBonusChampion,
} from "../../../testing/class-bonus-level.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { proveIntrinsicLink } from "../../../testing/intrinsic-link.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { crescentGlaive } from "../weapons/crescent-glaive.ts";
import { trainingSword } from "../weapons/training-sword.ts";
import { fangOfDragonsBreath } from "./fang-of-dragons-breath.ts";

/** @covers iebo5fu381-a1 */
describe("Fang of Dragon's Breath — Polearm Weapon Link", () => {
  proveIntrinsicLink({
    card: fangOfDragonsBreath,
    host: crescentGlaive,
    invalidHost: trainingSword,
  });
});

/** @covers iebo5fu381-a2 */
describe("Fang of Dragon's Breath — linked power", () => {
  it("adds two power to the linked polearm", () => {
    const { starter } = classBonusLeveledChampion(fangOfDragonsBreath, true, 0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: starter,
        zones: {
          field: [crescentGlaive],
          hand: [fangOfDragonsBreath, woodlandSquirrels],
        },
      },
      playerTwo: { champion: starter },
    });
    const player = game.player("player-one");
    const host = player.card(crescentGlaive, { zone: "field" });
    player.activate(fangOfDragonsBreath, {
      targets: { "intrinsic-link-target": [host.objectId] },
      reservePayment: [
        { kind: "card", cardId: player.card(woodlandSquirrels, { zone: "hand" }).objectId },
      ],
    });
    passEffectsStack(game);
    player.declareAttack(
      player.card(starter, { zone: "field" }),
      game.player("player-two").card(starter, { zone: "field" }),
      { weaponIds: [host.objectId] },
    );
    game.resolveCombatWithoutRetaliation();
    expect(
      game.state.objects[game.player("player-two").card(starter, { zone: "field" }).objectId]!
        .damage,
    ).toBe(3);
  });
});

/** @covers iebo5fu381-a3 */
describe("Fang of Dragon's Breath — Jin Bonus granted ability", () => {
  for (const jin of [false, true]) {
    it(`${jin ? "grants" : "does not grant"} the durability ping with Jin=${jin}`, () => {
      const { starter } = namedClassBonusChampion(fangOfDragonsBreath, jin ? "Jin" : "Other", true);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion: starter,
          zones: {
            field: [crescentGlaive],
            hand: [fangOfDragonsBreath, woodlandSquirrels],
          },
        },
        playerTwo: { champion: lineageTestChampion("Opponent", 0) },
      });
      const player = game.player("player-one");
      const host = player.card(crescentGlaive, { zone: "field" });
      const target = game.player("player-two").card(lineageTestChampion("Opponent", 0), {
        zone: "field",
      });
      player.activate(fangOfDragonsBreath, {
        targets: { "intrinsic-link-target": [host.objectId] },
        reservePayment: [
          { kind: "card", cardId: player.card(woodlandSquirrels, { zone: "hand" }).objectId },
        ],
      });
      passEffectsStack(game);
      const before = game.state;
      if (!jin) {
        expect(() =>
          player.activateAbility(host, "granted-yyi36f-a1", {
            targets: { "target-1": [target.objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        return;
      }
      player.activateAbility(host, "granted-yyi36f-a1", {
        targets: { "target-1": [target.objectId] },
      });
      expect(game.state.objects[host.objectId]!.states.has("rested")).toBe(true);
      expect(game.state.objects[host.objectId]!.counters.durability).toBe(2);
      passEffectsStack(game);
      expect(game.state.objects[target.objectId]!.damage).toBe(2);
      expect(game.state.objects[host.objectId]!.counters.durability).toBe(2);
    });
  }
});
