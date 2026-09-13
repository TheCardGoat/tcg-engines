import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { accompanyingGuard } from "../../ALC/allies/accompanying-guard.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { guanYuPrimeExemplar } from "./guan-yu-prime-exemplar.ts";

function payments(player: ReturnType<GrandArchiveTestEngine["player"]>, count: number) {
  return player
    .cards(woodlandSquirrels, { zone: "hand" })
    .slice(0, count)
    .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
}

/** @covers 0oyxjld8jh-a1 */
describe("Guan Yu, Prime Exemplar — Human death discount and fast activation", () => {
  it("costs 5 and is slow unless a Human ally has died this turn", () => {
    const champion = createClassBonusTestChampion(
      guanYuPrimeExemplar,
      false,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: {
          field: [accompanyingGuard],
          hand: [
            guanYuPrimeExemplar,
            woodlandSquirrels,
            woodlandSquirrels,
            woodlandSquirrels,
            woodlandSquirrels,
            woodlandSquirrels,
          ],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const before = game.state;
    expect(() =>
      player.activate(guanYuPrimeExemplar, { reservePayment: payments(player, 5) }),
    ).toThrow();
    expect(game.state).toEqual(before);
  });

  it("costs 3 after a controlled Human ally dies this turn", () => {
    const champion = createClassBonusTestChampion(
      guanYuPrimeExemplar,
      false,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: {
          field: [accompanyingGuard],
          hand: [
            guanYuPrimeExemplar,
            woodlandSquirrels,
            woodlandSquirrels,
            woodlandSquirrels,
            woodlandSquirrels,
            woodlandSquirrels,
          ],
        },
      },
      playerTwo: { champion, zones: { field: [automatedGardener, woodlandSquirrels] } },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    opponent.declareAttack(automatedGardener, accompanyingGuard);
    game.resolveCombatWithoutRetaliation();
    const wait = game.waitState();
    if (wait.kind === "opportunity" && wait.playerId !== opponent.id)
      game.player(wait.playerId).pass();
    opponent.declareAttack(woodlandSquirrels, accompanyingGuard);
    game.resolveCombatWithoutRetaliation();
    expect(player.cards(accompanyingGuard, { zone: "graveyard" })).toHaveLength(1);
    opponent.pass();
    const before = game.state;
    expect(() =>
      player.activate(guanYuPrimeExemplar, { reservePayment: payments(player, 3) }),
    ).toThrow(/slow|Main phase/i);
    expect(game.state).toEqual(before);
  });

  it("does not discount after a non-Human ally dies", () => {
    const champion = createClassBonusTestChampion(
      guanYuPrimeExemplar,
      false,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: {
          field: [woodlandSquirrels],
          hand: [
            guanYuPrimeExemplar,
            woodlandSquirrels,
            woodlandSquirrels,
            woodlandSquirrels,
            woodlandSquirrels,
            woodlandSquirrels,
          ],
        },
      },
      playerTwo: { champion, zones: { field: [woodlandSquirrels] } },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    opponent.declareAttack(woodlandSquirrels, player.card(woodlandSquirrels, { zone: "field" }));
    game.resolveCombatWithoutRetaliation();
    const before = game.state;
    expect(() =>
      player.activate(guanYuPrimeExemplar, { reservePayment: payments(player, 3) }),
    ).toThrow();
    expect(game.state).toEqual(before);
  });
});

/** @covers 0oyxjld8jh-a2 */
describe("Guan Yu, Prime Exemplar — Ambush and Retort 2", () => {
  it("retaliates with Retort 2 while defending", () => {
    const champion = createClassBonusTestChampion(
      guanYuPrimeExemplar,
      false,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: { champion, zones: { field: [guanYuPrimeExemplar] } },
      playerTwo: { champion, zones: { field: [automatedGardener] } },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const guanYu = player.card(guanYuPrimeExemplar, { zone: "field" });
    const attacker = opponent.card(automatedGardener, { zone: "field" });
    opponent.declareAttack(attacker, guanYu);
    let retaliated = false;
    for (let step = 0; game.state.combat && step < 40; step++) {
      const wait = game.waitState();
      if (game.state.decision?.kind === "choose-retaliators") {
        answerDecision(game, "choose-retaliators", [guanYu.objectId]);
        retaliated = true;
      } else if (game.answerForcedDecision()) continue;
      else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
      else throw new Error(`Unexpected ${wait.kind}`);
    }
    expect(retaliated).toBe(true);
    expect(game.state.combat).toBeNull();
    expect(opponent.zone("graveyard")).toContainEqual(attacker);
    expect(game.state.objects[guanYu.objectId]!.damage).toBe(2);
  });

  it("lets Ambush retaliate while another unit is defending", () => {
    const champion = createClassBonusTestChampion(
      guanYuPrimeExemplar,
      false,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: { champion, zones: { field: [guanYuPrimeExemplar, accompanyingGuard] } },
      playerTwo: { champion, zones: { field: [automatedGardener] } },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const guanYu = player.card(guanYuPrimeExemplar, { zone: "field" });
    const attacker = opponent.card(automatedGardener, { zone: "field" });
    opponent.declareAttack(attacker, accompanyingGuard);
    let retaliated = false;
    for (let step = 0; game.state.combat && step < 40; step++) {
      const wait = game.waitState();
      if (game.state.decision?.kind === "choose-retaliators") {
        expect(game.state.decision.candidates).toContain(guanYu.objectId);
        answerDecision(game, "choose-retaliators", [guanYu.objectId]);
        retaliated = true;
      } else if (game.answerForcedDecision()) continue;
      else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
      else throw new Error(`Unexpected ${wait.kind}`);
    }
    expect(retaliated).toBe(true);
    expect(game.state.combat).toBeNull();
    expect(opponent.zone("graveyard")).toContainEqual(attacker);
  });
});
