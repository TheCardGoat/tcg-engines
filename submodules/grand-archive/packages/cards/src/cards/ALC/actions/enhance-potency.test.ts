import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { nascentBlast } from "../../P24/actions/nascent-blast.ts";
import { potionOfHealing } from "../items/potion-of-healing.ts";
import { enhancePotency } from "./enhance-potency.ts";

/** @covers df9q1wl8ao-a1 */
describe("enhance-potency — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: enhancePotency, discount: 1 });
});

/** @covers df9q1wl8ao-a2 */
describe("Enhance Potency — next Potion ability copy", () => {
  it("rests the Potion and copies its next activated ability exactly once", () => {
    const champion = createClassBonusTestChampion(enhancePotency, true, "activation-discount");
    const opposingChampion = createClassBonusTestChampion(
      nascentBlast,
      false,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: {
          field: [potionOfHealing],
          hand: [enhancePotency, woodlandSquirrels, woodlandSquirrels],
          "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion: opposingChampion,
        zones: {
          hand: [nascentBlast, nascentBlast, ...Array.from({ length: 6 }, () => woodlandSquirrels)],
          "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const ownChampion = player.card(champion, { zone: "field" });
    for (let index = 0; index < 2; index++) {
      opponent.activate(opponent.cards(nascentBlast, { zone: "hand" })[0]!, {
        reservePayment: opponent
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 3)
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
        targets: { "target-1": [ownChampion.objectId] },
      });
      passEffectsStack(game);
    }
    expect(game.state.objects[ownChampion.objectId]!.damage).toBe(6);

    for (let step = 0; step < 64; step++) {
      if (game.state.turn.playerId === player.id && game.state.turn.phase === "main") break;
      const wait = game.waitState();
      if (wait.kind === "materialization-choice")
        game.player(wait.playerId).execute({ move: "skip-materialization" });
      else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
      else throw new Error(`Unexpected ${wait.kind}`);
    }

    const potion = player.card(potionOfHealing, { zone: "field" });
    player.activate(enhancePotency, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 2)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      targets: { "target-potion": [potion.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[potion.objectId]!.states.has("rested")).toBe(true);
    expect(game.state.delayedTriggers).toHaveLength(1);

    player.activateAbility(potion, "qtb31x97n2-a2");
    expect(game.state.stack.map((item) => item.kind)).toContain("triggered-ability");
    passEffectsStack(game);
    expect(game.state.decision?.kind).toBe("resolve-optional-effect");
    answerDecision(game, "resolve-optional-effect", false);
    passEffectsStack(game);
    expect(game.state.objects[potion.objectId]!.zone).toBe("graveyard");
    expect(game.state.objects[ownChampion.objectId]!.damage).toBe(0);
  });
});
