import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { lineageTestChampion, proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { nascentBlast } from "../../P24/actions/nascent-blast.ts";
import { automatedGardener } from "../allies/automated-gardener.ts";
import { arisannaLucentArbiter } from "./arisanna-lucent-arbiter.ts";

/** @covers 7e22tk3ir1-a1 */
describe("arisanna-lucent-arbiter — Lineage", () => {
  proveChampionLineage({
    card: arisannaLucentArbiter,
    lineageName: "Arisanna",
    level: 3,
    memoryCost: 3,
  });
});

/** @covers 7e22tk3ir1-a2 */
describe("Arisanna, Lucent Arbiter — revealed reserve-cost negation", () => {
  it("pays three and rests to negate a matching card activation on the stack", () => {
    const opposingChampion = createClassBonusTestChampion(
      nascentBlast,
      false,
      "activation-discount",
    );
    const baseChampion = lineageTestChampion("Arisanna", 0);
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion: baseChampion,
        lineage: [
          lineageTestChampion("Arisanna", 1),
          lineageTestChampion("Arisanna", 2),
          arisannaLucentArbiter,
        ],
        zones: {
          hand: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          "main-deck": [automatedGardener],
        },
      },
      playerTwo: {
        champion: opposingChampion,
        zones: { hand: [nascentBlast, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels] },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const champion = player.card(baseChampion, { zone: "field" });
    opponent.activate(nascentBlast, {
      reservePayment: opponent
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      targets: { "target-1": [champion.objectId] },
    });
    const targetActivation = game.state.stack.at(-1)!;
    opponent.pass();

    player.activateAbility(champion, "7e22tk3ir1-a2", {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      targets: { "target-activation": [targetActivation.id] },
    });
    expect(game.state.objects[champion.objectId]!.states.has("rested")).toBe(true);
    passEffectsStack(game);

    expect(game.state.objects[champion.objectId]!.damage).toBe(0);
    expect(game.state.stack).toHaveLength(0);
    expect(opponent.cards(nascentBlast, { zone: "graveyard" })).toHaveLength(1);
  });
});
