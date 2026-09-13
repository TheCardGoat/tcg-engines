import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { floodborneWarrior } from "../../RDO/allies/floodborne-warrior.ts";
import { zhangFeiSpiritedSteel } from "../allies/zhang-fei-spirited-steel.ts";
import { combatTraining } from "./combat-training.ts";

/** @covers 3bxtj3te9i-a2 */
describe("Combat Training — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: combatTraining });
});

/** @covers 3bxtj3te9i-a1 */
describe("Combat Training — next Warrior attack", () => {
  it("gives +2 to a non-unique Warrior and +3 to a unique Warrior, and rejects non-Warriors", () => {
    const champion = createClassBonusTestChampion(combatTraining, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [
            combatTraining,
            combatTraining,
            ...Array.from({ length: 4 }, () => woodlandSquirrels),
          ],
          field: [floodborneWarrior, zhangFeiSpiritedSteel, woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const opponentChampion = game.player("player-two").card(champion, { zone: "field" });
    const payments = player.cards(woodlandSquirrels, { zone: "hand" });
    const before = game.state;
    expect(() =>
      player.activate(combatTraining, {
        reservePayment: payments.slice(0, 2).map((card) => ({
          kind: "card" as const,
          cardId: card.objectId,
        })),
        targets: { "target-1": [player.card(woodlandSquirrels, { zone: "field" }).objectId] },
      }),
    ).toThrow();
    expect(game.state).toEqual(before);

    player.activate(player.cards(combatTraining, { zone: "hand" })[0]!, {
      reservePayment: payments.slice(0, 2).map((card) => ({
        kind: "card" as const,
        cardId: card.objectId,
      })),
      targets: { "target-1": [player.card(floodborneWarrior, { zone: "field" }).objectId] },
    });
    passEffectsStack(game);
    player.activate(player.cards(combatTraining, { zone: "hand" })[0]!, {
      reservePayment: payments.slice(2, 4).map((card) => ({
        kind: "card" as const,
        cardId: card.objectId,
      })),
      targets: { "target-1": [player.card(zhangFeiSpiritedSteel, { zone: "field" }).objectId] },
    });
    passEffectsStack(game);

    player.declareAttack(floodborneWarrior, opponentChampion);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[opponentChampion.objectId]!.damage).toBe(3);
    player.declareAttack(zhangFeiSpiritedSteel, opponentChampion);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[opponentChampion.objectId]!.damage).toBe(8);
  });
});
