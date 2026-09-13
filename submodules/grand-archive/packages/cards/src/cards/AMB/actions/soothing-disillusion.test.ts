import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { chasingShadows } from "../../RDO/phantasias/chasing-shadows.ts";
import { meteoricSlime } from "../../RDO/allies/meteoric-slime.ts";
import { soothingDisillusion } from "./soothing-disillusion.ts";

/** @covers geq18a4f2h-a1 */
describe("Soothing Disillusion — choose one", () => {
  it("destroys a targeted phantasia and rejects other objects", () => {
    const champion = createClassBonusTestChampion(
      soothingDisillusion,
      false,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [soothingDisillusion, woodlandSquirrels, woodlandSquirrels],
          field: [chasingShadows, woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const payment = player.cards(woodlandSquirrels, { zone: "hand" }).map((card) => ({
      kind: "card" as const,
      cardId: card.objectId,
    }));
    const before = game.state;
    expect(() =>
      player.activate(soothingDisillusion, {
        modeIds: ["mode-1"],
        reservePayment: payment,
        targets: { "target-1": [player.card(woodlandSquirrels, { zone: "field" }).objectId] },
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
    const phantasia = player.card(chasingShadows, { zone: "field" });
    player.activate(soothingDisillusion, {
      modeIds: ["mode-1"],
      reservePayment: payment,
      targets: { "target-1": [phantasia.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[phantasia.objectId]!.zone).not.toBe("field");
  });

  it("puts a buff on an Animal or Beast ally and rejects other allies", () => {
    const champion = createClassBonusTestChampion(
      soothingDisillusion,
      false,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [soothingDisillusion, woodlandSquirrels, woodlandSquirrels],
          field: [meteoricSlime, automatedGardener],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const payment = player.cards(woodlandSquirrels, { zone: "hand" }).map((card) => ({
      kind: "card" as const,
      cardId: card.objectId,
    }));
    const before = game.state;
    expect(() =>
      player.activate(soothingDisillusion, {
        modeIds: ["mode-2"],
        reservePayment: payment,
        targets: { "target-1": [player.card(automatedGardener, { zone: "field" }).objectId] },
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
    const beast = player.card(meteoricSlime, { zone: "field" });
    player.activate(soothingDisillusion, {
      modeIds: ["mode-2"],
      reservePayment: payment,
      targets: { "target-1": [beast.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[beast.objectId]!.counters.buff).toBe(1);
  });
});
