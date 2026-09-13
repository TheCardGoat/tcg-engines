import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { reposition } from "../actions/reposition.ts";
import { battlefieldSpotter } from "./battlefield-spotter.ts";
import { shimmercloakAssassin } from "./shimmercloak-assassin.ts";
import { lenaDorumegiasHerald } from "./lena-dorumegias-herald.ts";

/** @covers gwve1d47o7-a1 */
describe("Lena, Dorumegia's Herald — Class Bonus True Sight", () => {
  for (const classBonus of [false, true]) {
    it(`${classBonus ? "can" : "cannot"} attack a Stealth unit when Class Bonus=${classBonus}`, () => {
      const champion = createClassBonusTestChampion(
        lenaDorumegiasHerald,
        classBonus,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: { champion, zones: { field: [lenaDorumegiasHerald] } },
        playerTwo: { champion, zones: { field: [shimmercloakAssassin] } },
      });
      const player = game.player("player-one");
      const target = game.player("player-two").card(shimmercloakAssassin);
      if (!classBonus) {
        expect(() => player.declareAttack(lenaDorumegiasHerald, target)).toThrow(
          "legal attack target",
        );
        return;
      }
      player.declareAttack(lenaDorumegiasHerald, target);
      expect(game.state.combat?.targetIds).toEqual([target.objectId]);
    });
  }
});

/** @covers gwve1d47o7-a2 */
describe("Lena, Dorumegia's Herald — distant activation", () => {
  it("discounts the ability only while distant and moves a looked-at Ranger ally to hand", () => {
    const champion = createClassBonusTestChampion(
      lenaDorumegiasHerald,
      true,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [lenaDorumegiasHerald],
          hand: [reposition, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          "main-deck": [
            battlefieldSpotter,
            woodlandSquirrels,
            woodlandSquirrels,
            woodlandSquirrels,
          ],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const lena = player.card(lenaDorumegiasHerald);
    const payments = player.cards(woodlandSquirrels, { zone: "hand" });
    expect(() =>
      player.activateAbility(lena, "gwve1d47o7-a2", {
        reservePayment: payments
          .slice(0, 2)
          .map((card) => ({ kind: "card", cardId: card.objectId })),
      }),
    ).toThrow();
    player.activate(reposition, {
      targets: { "target-1": [lena.objectId] },
      reservePayment: [{ kind: "card", cardId: payments[0]!.objectId }],
    });
    passEffectsStack(game);
    player.activateAbility(lena, "gwve1d47o7-a2", {
      reservePayment: payments.slice(1).map((card) => ({ kind: "card", cardId: card.objectId })),
    });
    passEffectsStack(game);
    const chosen = player.card(battlefieldSpotter, { zone: "main-deck" });
    answerDecision(game, "resolve-effect-choice", [chosen.objectId]);
    passEffectsStack(game);
    if (game.state.decision?.kind === "resolve-effect-choice") {
      answerDecision(game, "resolve-effect-choice", [chosen.objectId]);
      passEffectsStack(game);
    }
    expect(player.cards(battlefieldSpotter, { zone: "hand" })).toHaveLength(1);
    expect(player.zone("main-deck")).toHaveLength(3);
    expect(game.state.objects[lena.objectId]!.states.has("rested")).toBe(true);
  });
});
