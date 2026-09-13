import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { ferventBeastmaster } from "../../DOA/allies/fervent-beastmaster.ts";
import { intervention } from "./intervention.ts";

function fixture(classBonus: boolean) {
  const champion = createClassBonusTestChampion(intervention, classBonus, "activation-discount");
  const game = GrandArchiveTestEngine.startFixture({
    firstPlayer: "playerTwo",
    playerOne: {
      champion,
      zones: { hand: [intervention, ...Array.from({ length: 3 }, () => woodlandSquirrels)] },
    },
    playerTwo: {
      champion,
      zones: { field: [ferventBeastmaster, automatedGardener, automatedGardener] },
    },
  });
  game.player("player-two").pass();
  return { game, champion };
}

function restContribution(game: GrandArchiveTestEngine) {
  const card = game.player("player-one").card(intervention, { zone: "hand" });
  return [
    {
      ruleId: `static:${card.objectId}:vmqe225jkb-a1:0`,
    },
  ];
}

/** @covers vmqe225jkb-a1 */
describe("Intervention — Class Bonus rest contribution", () => {
  it("lets a matching champion rest to pay two of the reserve cost", () => {
    const { game, champion } = fixture(true);
    const player = game.player("player-one");
    const target = player.card(champion, { zone: "field" });
    const before = game.state;
    expect(() =>
      player.activate(intervention, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 1)
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      }),
    ).toThrow();
    expect(game.state).toEqual(before);

    player.activate(intervention, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 1)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      paymentContributions: restContribution(game),
      targets: { "target-1": [target.objectId] },
    });
    expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(true);
    expect(player.zone("memory")).toHaveLength(1);
  });

  it("cannot rest the champion for reserve while Class Bonus is disabled", () => {
    const { game, champion } = fixture(false);
    const player = game.player("player-one");
    const before = game.state;
    expect(() =>
      player.activate(intervention, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 1)
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
        paymentContributions: restContribution(game),
        targets: { "target-1": [player.card(champion, { zone: "field" }).objectId] },
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
  });
});

/** @covers vmqe225jkb-a2 */
describe("Intervention — prevent the next 4 damage", () => {
  it("prevents four damage to the chosen unit and then expires", () => {
    const { game, champion } = fixture(false);
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const target = player.card(champion, { zone: "field" });
    player.activate(intervention, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      targets: { "target-1": [target.objectId] },
    });
    passEffectsStack(game);
    opponent.declareAttack(opponent.card(ferventBeastmaster, { zone: "field" }), target);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(0);
    opponent.declareAttack(opponent.cards(automatedGardener, { zone: "field" })[0]!, target);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(1);
  });
});
