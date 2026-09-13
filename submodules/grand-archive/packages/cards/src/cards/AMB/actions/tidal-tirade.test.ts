import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { palaceGuard } from "../allies/palace-guard.ts";
import { promisingRecruit } from "../allies/promising-recruit.ts";
import { tidalTirade } from "./tidal-tirade.ts";

/** @covers kyhl7zy5yj-a2 */
describe("Tidal Tirade — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: tidalTirade });
});

/** @covers kyhl7zy5yj-a1 */
describe("Tidal Tirade — Human ally +1 LIFE and retort 2", () => {
  it("grants retort 2 and +1 LIFE to a Human ally until end of turn", () => {
    const champion = createClassBonusTestChampion(tidalTirade, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: {
          hand: [tidalTirade, woodlandSquirrels, woodlandSquirrels],
          field: [promisingRecruit],
        },
      },
      playerTwo: {
        champion,
        zones: { field: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels] },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    opponent.pass();
    const human = player.card(promisingRecruit, { zone: "field" });
    const before = game.state;
    expect(() =>
      player.activate(tidalTirade, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
        targets: { "target-1": [player.card(champion, { zone: "field" }).objectId] },
      }),
    ).toThrow();
    expect(game.state).toEqual(before);

    player.activate(tidalTirade, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      targets: { "target-1": [human.objectId] },
    });
    passEffectsStack(game);

    const first = opponent.cards(woodlandSquirrels, { zone: "field" })[0]!;
    opponent.declareAttack(first, human);
    for (let step = 0; game.state.combat && step < 40; step++) {
      const wait = game.waitState();
      if (game.state.decision?.kind === "choose-retaliators")
        answerDecision(game, "choose-retaliators", [human.objectId]);
      else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
      else throw new Error(`Unexpected ${wait.kind}`);
    }
    expect(game.state.objects[first.objectId]!.zone).toBe("graveyard");
    expect(game.state.objects[human.objectId]!.zone).toBe("field");
    expect(game.state.objects[human.objectId]!.damage).toBe(1);

    opponent.declareAttack(opponent.cards(woodlandSquirrels, { zone: "field" })[0]!, human);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[human.objectId]!.zone).toBe("field");
    expect(game.state.objects[human.objectId]!.damage).toBe(2);
  });

  it("rejects a non-Human ally", () => {
    const champion = createClassBonusTestChampion(tidalTirade, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [tidalTirade, woodlandSquirrels, woodlandSquirrels],
          field: [woodlandSquirrels, palaceGuard],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const before = game.state;
    expect(() =>
      player.activate(tidalTirade, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
        targets: { "target-1": [player.card(woodlandSquirrels, { zone: "field" }).objectId] },
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
  });
});
