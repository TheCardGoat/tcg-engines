import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import {
  createClassBonusTestChampion,
  enableAllTestElements,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { restoringEmbers } from "../../AMB/actions/restoring-embers.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { geniGiftedMechanist } from "./geni-gifted-mechanist.ts";
import { marchHareMottledHost } from "./march-hare-mottled-host.ts";

function championForElementBonus(enabled: boolean) {
  const champion = createClassBonusTestChampion(marchHareMottledHost, false, "activation-discount");
  if (enabled) return champion;
  const face = requireSingleFace(champion);
  return enableAllTestElements({
    ...champion,
    layout: {
      kind: "single-faced" as const,
      face: { ...face, elements: ["NORM"] as const },
    },
  });
}

/** @covers 7w4v1hgl3e-a1 */
describe("March Hare, Mottled Host — Element Bonus reserve payment", () => {
  for (const elementBonus of [false, true]) {
    it(`${elementBonus ? "enters" : "stays banished"} after paying reserve from the graveyard`, () => {
      const champion = championForElementBonus(elementBonus);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [restoringEmbers],
            graveyard: [marchHareMottledHost, fireball, fireball, fireball],
            "main-deck": [fireball],
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      const source = player.card(marchHareMottledHost, { zone: "graveyard" });
      player.activate(restoringEmbers, {
        kindleCardIds: [
          source.objectId,
          ...player.cards(fireball, { zone: "graveyard" }).map((card) => card.objectId),
        ],
      });
      expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
      passEffectsStack(game);
      expect(game.state.objects[source.objectId]!.zone).toBe(elementBonus ? "field" : "banishment");
    });
  }

  it("stays banished when a nonpayment effect banishes it from the graveyard", () => {
    const champion = championForElementBonus(true);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [geniGiftedMechanist],
          hand: [fireball, fireball],
          graveyard: [marchHareMottledHost],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const source = player.card(marchHareMottledHost, { zone: "graveyard" });
    const geni = player.card(geniGiftedMechanist);

    player.activateAbility(geni, "wuir99sx6q-a1", {
      reservePayment: player
        .cards(fireball, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      costSelections: [[source.objectId]],
    });

    expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
    passEffectsStack(game);
    expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
  });
});
