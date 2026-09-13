import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { spectralBeacon } from "./spectral-beacon.ts";

/** @covers yxk7e8opr6-a1 */
describe("Spectral Beacon — banish from a graveyard", () => {
  it("pays one and banishes itself to banish a graveyard card", () => {
    const champion = createClassBonusTestChampion(spectralBeacon, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [spectralBeacon],
          hand: [woodlandSquirrels],
          graveyard: [woodlandSquirrels],
        },
      },
      playerTwo: { champion, zones: { graveyard: [woodlandSquirrels] } },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const ownDead = player.card(woodlandSquirrels, { zone: "graveyard" });
    const opposingDead = opponent.card(woodlandSquirrels, { zone: "graveyard" });
    const beforeField = game.state;
    expect(() =>
      player.activateAbility(spectralBeacon, "yxk7e8opr6-a1", {
        targets: { "target-card": [ownDead.objectId] },
      }),
    ).toThrow();
    expect(game.state).toEqual(beforeField);

    player.activateAbility(spectralBeacon, "yxk7e8opr6-a1", {
      targets: { "target-card": [opposingDead.objectId] },
      reservePayment: [
        { kind: "card", cardId: player.card(woodlandSquirrels, { zone: "hand" }).objectId },
      ],
    });
    expect(player.cards(spectralBeacon, { zone: "field" })).toHaveLength(0);
    expect(game.state.objects[opposingDead.objectId]!.zone).toBe("graveyard");
    passEffectsStack(game);
    expect(game.state.objects[opposingDead.objectId]!.zone).toBe("banishment");
    expect(game.state.objects[ownDead.objectId]!.zone).toBe("graveyard");
  });
});
