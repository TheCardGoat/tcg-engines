import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { automatedGardener } from "../allies/automated-gardener.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { nascentBlast } from "../../P24/actions/nascent-blast.ts";
import { stormOfThorns } from "./storm-of-thorns.ts";

/** @covers 39i1f0ht2t-a2 */
describe("Storm of Thorns — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: stormOfThorns });
});

/** @covers 39i1f0ht2t-a1 */
describe("Storm of Thorns — turn-long prevention and unit retaliation", () => {
  it("prevents one from repeated damage to controlled units and retaliates only against unit sources", () => {
    const champion = createClassBonusTestChampion(stormOfThorns, true, "activation-discount");
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
          hand: [stormOfThorns, woodlandSquirrels, woodlandSquirrels],
          field: [giantTortoise],
        },
      },
      playerTwo: {
        champion: opposingChampion,
        zones: {
          field: [automatedGardener],
          hand: [nascentBlast, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const protectedAlly = player.card(giantTortoise, { zone: "field" });
    const opposingAlly = opponent.card(automatedGardener, { zone: "field" });
    opponent.pass();
    player.activate(stormOfThorns, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
    });
    passEffectsStack(game);

    opponent.activate(nascentBlast, {
      reservePayment: opponent
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      targets: { "target-1": [protectedAlly.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[protectedAlly.objectId]!.damage).toBe(2);
    expect(game.state.objects[opposingAlly.objectId]!.damage).toBe(0);

    opponent.declareAttack(opposingAlly, protectedAlly);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[protectedAlly.objectId]!.damage).toBe(3);
    expect(game.state.objects[opposingAlly.objectId]!.damage).toBe(1);
  });
});
