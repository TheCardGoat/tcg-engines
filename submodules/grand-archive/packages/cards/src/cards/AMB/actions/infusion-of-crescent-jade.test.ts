import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { galesMare } from "../../RDO/allies/gales-mare.ts";
import { steelHalberd } from "../../P24/weapons/steel-halberd.ts";
import { trainingSword } from "../weapons/training-sword.ts";
import { infusionOfCrescentJade } from "./infusion-of-crescent-jade.ts";

/** @covers 91jnc6v71t-a2 */
describe("Infusion of Crescent Jade — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: infusionOfCrescentJade });
});

/** @covers 91jnc6v71t-a1 */
describe("Infusion of Crescent Jade — Polearm power from wind objects", () => {
  it("adds 1 combat damage per controlled wind non-champion and rejects non-Polearms", () => {
    const champion = createClassBonusTestChampion(
      infusionOfCrescentJade,
      false,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [infusionOfCrescentJade, woodlandSquirrels, woodlandSquirrels],
          field: [steelHalberd, trainingSword, galesMare, galesMare],
        },
      },
      playerTwo: { champion, zones: { field: [galesMare] } },
    });
    const player = game.player("player-one");
    const payment = player.cards(woodlandSquirrels, { zone: "hand" }).map((card) => ({
      kind: "card" as const,
      cardId: card.objectId,
    }));
    const before = game.state;
    expect(() =>
      player.activate(infusionOfCrescentJade, {
        reservePayment: payment,
        targets: { "target-1": [player.card(trainingSword, { zone: "field" }).objectId] },
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
    const polearm = player.card(steelHalberd, { zone: "field" });
    player.activate(infusionOfCrescentJade, {
      reservePayment: payment,
      targets: { "target-1": [polearm.objectId] },
    });
    passEffectsStack(game);
    const defender = game.player("player-two").card(champion, { zone: "field" });
    player.declareAttack(player.card(champion, { zone: "field" }), defender, {
      weaponIds: [polearm.objectId],
    });
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[defender.objectId]!.damage).toBe(3);
  });
});
