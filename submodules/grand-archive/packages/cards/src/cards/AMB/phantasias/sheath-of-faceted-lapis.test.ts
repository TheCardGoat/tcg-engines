import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../weapons/training-sword.ts";
import { classBonusLeveledChampion } from "../../../testing/class-bonus-level.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { proveIntrinsicLink } from "../../../testing/intrinsic-link.ts";
import { sheathOfFacetedLapis } from "./sheath-of-faceted-lapis.ts";

/** @covers 0cnn1eh85y-a1 */
describe("Sheath of Faceted Lapis — Warrior Weapon Link", () => {
  proveIntrinsicLink({
    card: sheathOfFacetedLapis,
    host: trainingSword,
    invalidHost: woodlandSquirrels,
  });
});

/** @covers 0cnn1eh85y-a2 */
describe("Sheath of Faceted Lapis — On Enter draw", () => {
  it("draws one card only when the separate entry trigger resolves", () => {
    const { starter } = classBonusLeveledChampion(sheathOfFacetedLapis, false, 0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: starter,
        zones: {
          field: [trainingSword],
          hand: [sheathOfFacetedLapis, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion: starter },
    });
    const player = game.player("player-one");
    const deck = player.zone("main-deck");
    player.activate(sheathOfFacetedLapis, {
      targets: {
        "intrinsic-link-target": [player.card(trainingSword, { zone: "field" }).objectId],
      },
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
    });
    expect(player.zone("hand")).toHaveLength(0);
    player.pass();
    game.player("player-two").pass();
    expect(
      game.state.stack.some(
        (item) => item.kind === "triggered-ability" && item.ability.id === "0cnn1eh85y-a2",
      ),
    ).toBe(true);
    expect(player.zone("hand")).toHaveLength(0);
    passEffectsStack(game);
    expect(player.zone("hand")).toEqual(deck.slice(0, 1));
  });
});

/** @covers 0cnn1eh85y-a3 */
describe("Sheath of Faceted Lapis — Class Bonus [Level 2+] linked power", () => {
  for (const [classBonus, level] of [
    [true, 2],
    [true, 1],
    [false, 2],
  ] as const) {
    it(`adds two linked power only with class=${classBonus} level=${level}`, () => {
      const { starter, lineage } = classBonusLeveledChampion(
        sheathOfFacetedLapis,
        classBonus,
        level,
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion: starter,
          lineage,
          zones: {
            field: [trainingSword],
            hand: [sheathOfFacetedLapis, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: { champion: starter },
      });
      const player = game.player("player-one");
      const host = player.card(trainingSword, { zone: "field" });
      player.activate(sheathOfFacetedLapis, {
        targets: { "intrinsic-link-target": [host.objectId] },
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
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
      ).toBe(classBonus && level >= 2 ? 3 : 1);
    });
  }
});
