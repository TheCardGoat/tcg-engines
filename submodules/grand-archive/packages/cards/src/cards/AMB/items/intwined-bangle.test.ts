import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { nimbleLongbowman } from "../../RDO/allies/nimble-longbowman.ts";
import { intwinedBangle } from "./intwined-bangle.ts";

function championAt(level: number) {
  return grantTestChampionLevel(
    createClassBonusTestChampion(intwinedBangle, true, "activation-discount"),
    Math.max(0, level),
  );
}

/** @covers znavmjiefw-a1 */
describe("Intwined Bangle — buff counter", () => {
  it("requires level 2, then rests and pays three to buff a non-Human ally", () => {
    const low = championAt(1);
    const lowGame = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: low,
        zones: {
          field: [intwinedBangle, woodlandSquirrels],
          hand: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion: low },
    });
    const lowPlayer = lowGame.player("player-one");
    const lowBefore = lowGame.state;
    expect(() =>
      lowPlayer.activateAbility(intwinedBangle, "znavmjiefw-a1", {
        targets: {
          "target-1": [lowPlayer.card(woodlandSquirrels, { zone: "field" }).objectId],
        },
        reservePayment: lowPlayer
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      }),
    ).toThrow();
    expect(lowGame.state).toEqual(lowBefore);

    const champion = championAt(2);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [intwinedBangle, woodlandSquirrels, nimbleLongbowman],
          hand: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const beast = player.card(woodlandSquirrels, { zone: "field" });
    const human = player.card(nimbleLongbowman, { zone: "field" });
    const beforeHuman = game.state;
    expect(() =>
      player.activateAbility(intwinedBangle, "znavmjiefw-a1", {
        targets: { "target-1": [human.objectId] },
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      }),
    ).toThrow();
    expect(game.state).toEqual(beforeHuman);

    player.activateAbility(intwinedBangle, "znavmjiefw-a1", {
      targets: { "target-1": [beast.objectId] },
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
    });
    expect(game.state.objects[player.card(intwinedBangle).objectId]!.states.has("rested")).toBe(
      true,
    );
    expect(game.state.objects[beast.objectId]!.counters.buff ?? 0).toBe(0);
    passEffectsStack(game);
    expect(game.state.objects[beast.objectId]!.counters.buff ?? 0).toBe(1);
    expect(game.state.objects[human.objectId]!.counters.buff ?? 0).toBe(0);
  });
});
