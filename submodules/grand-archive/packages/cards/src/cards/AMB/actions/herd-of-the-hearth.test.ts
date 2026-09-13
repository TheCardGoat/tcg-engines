import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { ordinaryHorse } from "../allies/ordinary-horse.ts";
import { palaceGuard } from "../allies/palace-guard.ts";
import { herdOfTheHearth } from "./herd-of-the-hearth.ts";

/** @covers wXsHpcrH3P-a2 */
describe("Herd of the Hearth — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: herdOfTheHearth });
});

/** @covers wXsHpcrH3P-a1 */
describe("Herd of the Hearth — Animal/Beast power and Horse on-attack", () => {
  it("gives Animal allies +1 POWER and grants Horse allies an on-attack loot", () => {
    const champion = createClassBonusTestChampion(herdOfTheHearth, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [herdOfTheHearth, ...Array.from({ length: 2 }, () => woodlandSquirrels)],
          field: [woodlandSquirrels, ordinaryHorse, palaceGuard],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    player.activate(herdOfTheHearth, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
    });
    passEffectsStack(game);
    const animal = player.card(woodlandSquirrels, { zone: "field" });
    const horse = player.card(ordinaryHorse, { zone: "field" });
    const human = player.card(palaceGuard, { zone: "field" });
    player.declareAttack(animal, opponent.card(champion, { zone: "field" }));
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[opponent.card(champion, { zone: "field" }).objectId]!.damage).toBe(2);

    const deck = player.zone("main-deck");
    player.declareAttack(horse, opponent.card(champion, { zone: "field" }));
    passEffectsStack(game);
    if (game.state.decision?.kind === "resolve-effect-choice") {
      answerDecision(game, "resolve-effect-choice", [player.zone("hand")[0]!.objectId]);
      passEffectsStack(game);
    }
    game.resolveCombatWithoutRetaliation();
    expect(player.zone("main-deck").length).toBeLessThanOrEqual(deck.length);

    player.declareAttack(human, opponent.card(champion, { zone: "field" }));
    game.resolveCombatWithoutRetaliation();
  });
});
