import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { ferventBeastmaster } from "../../DOA/allies/fervent-beastmaster.ts";
import { cureTheFlesh } from "./cure-the-flesh.ts";

/** @covers 5fgehl270c-a1 */
describe("Cure the Flesh — remove temporary ally damage and draw", () => {
  it("clears combat damage from the targeted ally and draws into memory", () => {
    const champion = createClassBonusTestChampion(cureTheFlesh, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: {
          hand: [cureTheFlesh, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          field: [giantTortoise],
          "main-deck": [woodlandSquirrels],
        },
      },
      playerTwo: { champion, zones: { field: [ferventBeastmaster] } },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const target = player.card(giantTortoise, { zone: "field" });
    opponent.declareAttack(ferventBeastmaster, target);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(3);
    opponent.pass();
    const before = game.state;
    expect(() =>
      player.activate(cureTheFlesh, {
        reservePayment: player.cards(woodlandSquirrels, { zone: "hand" }).map((card) => ({
          kind: "card" as const,
          cardId: card.objectId,
        })),
        targets: { "target-1": [player.card(champion, { zone: "field" }).objectId] },
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
    const deck = player.zone("main-deck");
    player.activate(cureTheFlesh, {
      reservePayment: player.cards(woodlandSquirrels, { zone: "hand" }).map((card) => ({
        kind: "card" as const,
        cardId: card.objectId,
      })),
      targets: { "target-1": [target.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[target.objectId]!.damage).toBe(0);
    expect(player.zone("memory")).toContainEqual(deck[0]);
  });
});
