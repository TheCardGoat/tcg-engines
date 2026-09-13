import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { accompanyingGuard } from "./accompanying-guard.ts";
import { winblessGatekeeper } from "./winbless-gatekeeper.ts";

/** @covers y5ttkk39i1-a1 */
describe("Winbless Gatekeeper — Taunt", () => {
  it("must be attacked before another unit while it is awake", () => {
    const champion = createClassBonusTestChampion(winblessGatekeeper, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: { champion, zones: { field: [winblessGatekeeper] } },
      playerTwo: { champion, zones: { field: [accompanyingGuard] } },
    });
    const attacker = game.player("player-two");
    const defender = game.player("player-one");

    expect(() => attacker.declareAttack(accompanyingGuard, defender.card(champion))).toThrow(
      "legal attack target",
    );
    attacker.declareAttack(accompanyingGuard, defender.card(winblessGatekeeper));
    expect(game.state.combat?.targetIds).toEqual([defender.card(winblessGatekeeper).objectId]);
  });
});

/** @covers y5ttkk39i1-a2 */
describe("Winbless Gatekeeper — pay before announcing the reflexive buff", () => {
  for (const accept of [false, true]) {
    for (const self of [false, true]) {
      it(`optional payment=${accept}, target self=${self}`, () => {
        const champion = createClassBonusTestChampion(
          winblessGatekeeper,
          false,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [winblessGatekeeper, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
              field: [accompanyingGuard, woodlandSquirrels],
            },
          },
          playerTwo: { champion, zones: { field: [accompanyingGuard] } },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        player.activate(winblessGatekeeper, {
          reservePayment: player
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
            .map((ref) => ({ kind: "card", cardId: ref.objectId })),
        });
        player.pass();
        opponent.pass();
        expect(game.state.decision).toBeNull();
        const target = player.card(self ? winblessGatekeeper : accompanyingGuard, {
          zone: "field",
        });
        const buff = () => game.state.objects[target.objectId]!.counters.buff ?? 0;
        expect(buff()).toBe(0);
        passEffectsStack(game);
        answerDecision(game, "resolve-optional-effect", accept);
        if (accept) {
          const payment = player
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
          const before = game.state;
          expect(() =>
            answerDecision(game, "resolve-effect-payment", { reservePayment: payment.slice(0, 1) }),
          ).toThrow();
          expect(game.state).toEqual(before);
          answerDecision(game, "resolve-effect-payment", { reservePayment: payment });
          expect(player.zone("hand")).toHaveLength(0);
          expect(player.zone("memory")).toHaveLength(4);
          expect(buff()).toBe(0);
          for (const invalid of [
            player.card(champion),
            player.card(woodlandSquirrels, { zone: "field" }),
            opponent.card(accompanyingGuard),
          ]) {
            const beforeTarget = game.state;
            expect(() =>
              answerDecision(game, "announce-triggered-ability", {
                targets: { "target-1": [invalid.objectId] },
              }),
            ).toThrow();
            expect(game.state).toEqual(beforeTarget);
          }
          answerDecision(game, "announce-triggered-ability", {
            targets: { "target-1": [target.objectId] },
          });
          expect(buff()).toBe(0);
          passEffectsStack(game);
          expect(buff()).toBe(1);
          player.declareAttack(target, opponent.card(champion));
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[opponent.card(champion).objectId]!.damage).toBe(2);
        } else {
          passEffectsStack(game);
          expect(player.zone("hand")).toHaveLength(2);
          expect(player.zone("memory")).toHaveLength(2);
          expect(buff()).toBe(0);
          expect(game.state.decision).toBeNull();
        }
      });
    }
  }
});
