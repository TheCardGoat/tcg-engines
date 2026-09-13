import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { reposition } from "../../ALC/actions/reposition.ts";
import { keepOfTheGoldenSashes } from "./keep-of-the-golden-sashes.ts";

/** @covers gjhv2etytr-a1 */
describe("Keep of the Golden Sashes — first opponent activation tax", () => {
  it("taxes only the first opponent activation and resets on the next turn", () => {
    const champion = createClassBonusTestChampion(
      keepOfTheGoldenSashes,
      false,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: {
          field: [keepOfTheGoldenSashes],
          graveyard: [woodlandSquirrels, woodlandSquirrels],
          "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: [woodlandSquirrels],
          hand: [
            reposition,
            reposition,
            reposition,
            ...Array.from({ length: 5 }, () => woodlandSquirrels),
          ],
          "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
        },
      },
    });
    const opponent = game.player("player-two");
    const target = opponent.card(woodlandSquirrels, { zone: "field" });
    const payment = opponent.cards(woodlandSquirrels, { zone: "hand" });
    const before = game.state;
    expect(() =>
      opponent.activate(opponent.cards(reposition, { zone: "hand" })[0]!, {
        reservePayment: [{ kind: "card", cardId: payment[0]!.objectId }],
        targets: { "target-1": [target.objectId] },
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
    opponent.activate(opponent.cards(reposition, { zone: "hand" })[0]!, {
      reservePayment: [
        { kind: "card", cardId: payment[0]!.objectId },
        { kind: "card", cardId: payment[1]!.objectId },
      ],
      targets: { "target-1": [target.objectId] },
    });
    expect(game.state.stack.at(-1)?.kind).toBe("card-activation");
    passEffectsStack(game);
    expect(opponent.cards(reposition, { zone: "graveyard" })).toHaveLength(1);
    expect(opponent.zone("memory")).toHaveLength(2);

    opponent.activate(opponent.cards(reposition, { zone: "hand" })[0]!, {
      reservePayment: [{ kind: "card", cardId: payment[2]!.objectId }],
      targets: { "target-1": [target.objectId] },
    });
    passEffectsStack(game);
    expect(opponent.cards(reposition, { zone: "graveyard" })).toHaveLength(2);
    expect(opponent.zone("memory")).toHaveLength(3);

    const owner = game.player("player-one");
    advanceToRecollection(game, owner.id);
    passEffectsStack(game);
    answerDecision(game, "resolve-optional-effect", true);
    passEffectsStack(game);
    if (game.state.decision?.kind === "resolve-effect-choice")
      answerDecision(
        game,
        "resolve-effect-choice",
        owner.cards(woodlandSquirrels, { zone: "graveyard" }).map((card) => card.objectId),
      );
    passEffectsStack(game);
    expect(owner.cards(keepOfTheGoldenSashes, { zone: "field" })).toHaveLength(1);
    owner.pass();
    const nextTurn = game.state;
    expect(() =>
      opponent.activate(reposition, {
        reservePayment: [{ kind: "card", cardId: payment[3]!.objectId }],
        targets: { "target-1": [target.objectId] },
      }),
    ).toThrow();
    expect(game.state).toEqual(nextTurn);
    opponent.activate(reposition, {
      reservePayment: payment
        .slice(3, 5)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      targets: { "target-1": [target.objectId] },
    });
    passEffectsStack(game);
    expect(opponent.cards(reposition, { zone: "graveyard" })).toHaveLength(3);
    expect(opponent.zone("memory")).toHaveLength(5);
  });

  it("counts an opponent's earlier activation when Keep enters later in the same turn", () => {
    const champion = createClassBonusTestChampion(
      keepOfTheGoldenSashes,
      false,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [keepOfTheGoldenSashes, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: [woodlandSquirrels],
          hand: [reposition, reposition, woodlandSquirrels, woodlandSquirrels],
        },
      },
    });
    const owner = game.player("player-one");
    const opponent = game.player("player-two");
    const target = opponent.card(woodlandSquirrels, { zone: "field" });
    const payment = opponent.cards(woodlandSquirrels, { zone: "hand" });
    owner.pass();
    opponent.activate(opponent.cards(reposition, { zone: "hand" })[0]!, {
      reservePayment: [{ kind: "card", cardId: payment[0]!.objectId }],
      targets: { "target-1": [target.objectId] },
    });
    passEffectsStack(game);
    owner.activate(keepOfTheGoldenSashes, {
      reservePayment: owner
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
    });
    passEffectsStack(game);
    owner.pass();
    opponent.activate(reposition, {
      reservePayment: [{ kind: "card", cardId: payment[1]!.objectId }],
      targets: { "target-1": [target.objectId] },
    });
    passEffectsStack(game);
    expect(opponent.cards(reposition, { zone: "graveyard" })).toHaveLength(2);
    expect(opponent.zone("memory")).toHaveLength(2);
  });
});

/** @covers gjhv2etytr-a2 */
describe("Keep of the Golden Sashes — Upkeep", () => {
  for (const pay of [false, true]) {
    it(`${pay ? "stays after banishing two graveyard cards" : "is sacrificed when the upkeep is declined"}`, () => {
      const champion = createClassBonusTestChampion(
        keepOfTheGoldenSashes,
        false,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: {
            field: [keepOfTheGoldenSashes],
            graveyard: [woodlandSquirrels, woodlandSquirrels],
            "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: { "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels) },
        },
      });
      const player = game.player("player-one");
      const source = player.card(keepOfTheGoldenSashes, { zone: "field" });
      advanceToRecollection(game, player.id);
      passEffectsStack(game);
      answerDecision(game, "resolve-optional-effect", pay);
      passEffectsStack(game);
      if (pay && game.state.decision?.kind === "resolve-effect-choice") {
        const yard = player.cards(woodlandSquirrels, { zone: "graveyard" });
        answerDecision(
          game,
          "resolve-effect-choice",
          yard.map((card) => card.objectId),
        );
        passEffectsStack(game);
      }
      expect(game.state.objects[source.objectId]!.zone).toBe(pay ? "field" : "graveyard");
      expect(player.zone("banishment")).toHaveLength(pay ? 2 : 0);
    });
  }
});
