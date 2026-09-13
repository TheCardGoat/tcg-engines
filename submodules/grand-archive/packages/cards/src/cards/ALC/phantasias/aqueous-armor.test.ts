import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { nascentBlast } from "../../P24/actions/nascent-blast.ts";
import { automatedGardener } from "../allies/automated-gardener.ts";
import { aqueousArmor } from "./aqueous-armor.ts";

/** @covers t3q2svd53z-a1 @covers t3q2svd53z-a3 */
describe("Aqueous Armor — Ally Link and Class Bonus life", () => {
  it("links to an ally, keeps it alive through three damage, then sacrifices when the ally dies", () => {
    const champion = createClassBonusTestChampion(aqueousArmor, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [automatedGardener],
          hand: [aqueousArmor, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: {
        champion,
        zones: {
          hand: [nascentBlast, nascentBlast, ...Array.from({ length: 6 }, () => woodlandSquirrels)],
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const ally = player.card(automatedGardener);
    player.activate(aqueousArmor, {
      targets: { "intrinsic-link-target": [ally.objectId] },
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card", cardId: card.objectId })),
    });
    passEffectsStack(game);
    const armor = player.card(aqueousArmor, { zone: "field" });
    expect(game.state.objects[armor.objectId]!.hostId).toBe(ally.objectId);

    const payments = opponent.cards(woodlandSquirrels, { zone: "hand" });
    player.pass();
    opponent.activate(opponent.cards(nascentBlast, { zone: "hand" })[0]!, {
      targets: { "target-1": [ally.objectId] },
      reservePayment: payments.slice(0, 3).map((card) => ({ kind: "card", cardId: card.objectId })),
    });
    passEffectsStack(game);
    expect(game.state.objects[ally.objectId]!.zone).toBe("field");
    expect(game.state.objects[ally.objectId]!.damage).toBe(3);

    player.pass();
    opponent.activate(opponent.card(nascentBlast, { zone: "hand" }), {
      targets: { "target-1": [ally.objectId] },
      reservePayment: payments.slice(3).map((card) => ({ kind: "card", cardId: card.objectId })),
    });
    passEffectsStack(game);
    expect(game.state.objects[ally.objectId]!.zone).toBe("graveyard");
    expect(game.state.objects[armor.objectId]!.zone).not.toBe("field");
  });
});

/** @covers t3q2svd53z-a2 */
describe("Aqueous Armor — recollection mill", () => {
  it("moves exactly the top card of its controller's deck to the graveyard", () => {
    const champion = createClassBonusTestChampion(aqueousArmor, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [automatedGardener],
          hand: [aqueousArmor, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels] } },
    });
    const player = game.player("player-one");
    const ally = player.card(automatedGardener);
    player.activate(aqueousArmor, {
      targets: { "intrinsic-link-target": [ally.objectId] },
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card", cardId: card.objectId })),
    });
    passEffectsStack(game);
    const top = player.zone("main-deck")[0]!;
    advanceToRecollection(game, player.id);
    passEffectsStack(game);
    expect(player.zone("graveyard")).toContainEqual(top);
    expect(player.zone("main-deck")).toHaveLength(1);
  });
});
