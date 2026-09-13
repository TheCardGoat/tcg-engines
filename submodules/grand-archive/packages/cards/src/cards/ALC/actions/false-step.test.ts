import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { nascentBlast } from "../../P24/actions/nascent-blast.ts";
import { falseStep } from "./false-step.ts";

/** @covers 47o7eanl1g-a1 */
describe("False Step — persistent prevention and optional distance", () => {
  it("ignores ally damage, prevents two from every champion hit, and gates ally distance behind payment", () => {
    const champion = createClassBonusTestChampion(falseStep, false, "activation-discount");
    const opponentChampion = createClassBonusTestChampion(
      nascentBlast,
      false,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: {
          hand: [falseStep, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          field: [giantTortoise],
        },
      },
      playerTwo: {
        champion: opponentChampion,
        zones: {
          hand: [
            nascentBlast,
            nascentBlast,
            nascentBlast,
            ...Array.from({ length: 9 }, () => woodlandSquirrels),
          ],
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const protectedChampion = player.card(champion, { zone: "field" });
    const ally = player.card(giantTortoise, { zone: "field" });
    opponent.pass();
    player.activate(falseStep, {
      reservePayment: [
        {
          kind: "card",
          cardId: player.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId,
        },
      ],
    });
    passEffectsStack(game);

    function castBlast(targetId: typeof ally.objectId): void {
      const spell = opponent.cards(nascentBlast, { zone: "hand" })[0]!;
      const reservePayment = opponent
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 3)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
      opponent.activate(spell, {
        reservePayment,
        targets: { "target-1": [targetId] },
      });
      passEffectsStack(game);
    }

    castBlast(ally.objectId);
    expect(game.state.objects[ally.objectId]!.damage).toBe(3);
    expect(game.state.decision).toBeNull();

    castBlast(protectedChampion.objectId);
    expect(game.state.objects[protectedChampion.objectId]!.damage).toBe(1);
    expect(game.state.objects[protectedChampion.objectId]!.states.has("distant")).toBe(true);
    expect(game.state.objects[ally.objectId]!.states.has("distant")).toBe(false);
    answerDecision(game, "resolve-optional-effect", true);
    passEffectsStack(game);
    expect(game.state.decision?.kind).toBe("resolve-effect-payment");
    const optionalPayment = player
      .cards(woodlandSquirrels, { zone: "hand" })
      .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
    const beforeUnderpayment = game.state;
    expect(() =>
      answerDecision(game, "resolve-effect-payment", {
        reservePayment: optionalPayment.slice(0, 1),
      }),
    ).toThrow();
    expect(game.state).toEqual(beforeUnderpayment);
    answerDecision(game, "resolve-effect-payment", { reservePayment: optionalPayment });
    passEffectsStack(game);
    expect(game.state.objects[ally.objectId]!.states.has("distant")).toBe(true);

    castBlast(protectedChampion.objectId);
    expect(game.state.objects[protectedChampion.objectId]!.damage).toBe(2);
    answerDecision(game, "resolve-optional-effect", false);
    passEffectsStack(game);
    expect(game.state.objects[ally.objectId]!.states.has("distant")).toBe(true);
  });
});
