import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { spellshieldTera } from "./spellshield-tera.ts";

/** @covers yunjm0of8e-a1 */
describe("Spellshield: Tera — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: spellshieldTera, discount: 1 });
});

/** @covers yunjm0of8e-a2 */
describe("Spellshield: Tera — prevent next champion damage", () => {
  it("prevents the next champion damage once and preserves that many cards", () => {
    const champion = createClassBonusTestChampion(spellshieldTera, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: {
          hand: [spellshieldTera, ...Array.from({ length: 3 }, () => woodlandSquirrels)],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion, zones: { field: [automatedGardener, automatedGardener] } },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    opponent.pass();
    const target = player.card(champion, { zone: "field" });
    const deck = player.zone("main-deck");
    player.activate(spellshieldTera, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
    });
    passEffectsStack(game);
    opponent.declareAttack(opponent.cards(automatedGardener, { zone: "field" })[0]!, target);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(0);
    opponent.declareAttack(opponent.cards(automatedGardener, { zone: "field" })[1]!, target);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(2);
    expect(player.zone("main-deck").length).toBeLessThanOrEqual(deck.length);
  });
});
