import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { enfeebledDagger } from "../items/enfeebled-dagger.ts";
import { raisedSlash } from "./raised-slash.ts";
import { twoOfHearts } from "../allies/two-of-hearts.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceCombatToTrigger,
  answerDecision,
  declareResolvedAttack,
  passEffectsStack,
} from "../../../testing/decisions.ts";

/** @covers fuqfxq13uz-a1 */
describe("Raised Slash — announce up to two controlled Suited ally targets", () => {
  for (const matching of [false, true])
    for (const selectedCount of [0, 1, 2])
      it(`class=${matching}, targets=${selectedCount}`, () => {
        const champion = createClassBonusTestChampion(raisedSlash, matching, "activation-discount");
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [twoOfHearts, twoOfHearts, twoOfHearts, woodlandSquirrels],
              graveyard: [twoOfHearts],
              hand: [raisedSlash, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: { champion, zones: { field: [twoOfHearts] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const hero = p.card(champion),
          target = q.card(champion),
          allies = p.cards(twoOfHearts, { zone: "field" });
        const payment = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const before = game.state;
        expect(() =>
          p.activate(raisedSlash, {
            attackAttackerId: hero.objectId,
            reservePayment: payment.slice(1),
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activate(raisedSlash, { attackAttackerId: hero.objectId, reservePayment: payment });
        passEffectsStack(game);
        declareResolvedAttack(game, hero.objectId, target.objectId, "Declare Raised Slash");
        advanceCombatToTrigger(game, "fuqfxq13uz-a1");
        if (matching) {
          expect(game.state.decision).toMatchObject({
            kind: "announce-triggered-ability",
            playerId: p.id,
          });
          const pending = game.state;
          for (const invalid of [
            [q.card(twoOfHearts).objectId],
            [p.card(woodlandSquirrels, { zone: "field" }).objectId],
            [p.card(twoOfHearts, { zone: "graveyard" }).objectId],
            [hero.objectId],
            allies.map((c) => c.objectId),
            [allies[0]!.objectId, allies[0]!.objectId],
          ]) {
            expect(() =>
              answerDecision(game, "announce-triggered-ability", {
                targets: { "counter-recipients": invalid },
              }),
            ).toThrow();
            expect(game.state).toEqual(pending);
          }
          answerDecision(game, "announce-triggered-ability", {
            targets: {
              "counter-recipients": allies.slice(0, selectedCount).map((c) => c.objectId),
            },
          });
          for (const ally of allies)
            expect(game.state.objects[ally.objectId]!.counters.buff ?? 0).toBe(0);
          passEffectsStack(game);
        } else expect(game.state.decision).toBeNull();
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(3);
        for (const [index, ally] of allies.entries()) {
          expect(game.state.objects[ally.objectId]!.counters.buff ?? 0).toBe(
            matching && index < selectedCount ? 1 : 0,
          );
          p.declareAttack(ally, target);
          game.resolveCombatWithoutRetaliation();
        }
        expect(game.state.objects[target.objectId]!.damage).toBe(
          6 + (matching ? selectedCount : 0),
        );
        expect(game.state.objects[q.card(twoOfHearts).objectId]!.counters.buff ?? 0).toBe(0);
        expect(p.cards(raisedSlash, { zone: "graveyard" })).toHaveLength(1);
      });
  it("keeps the announced targets when an opponent removes one in response", () => {
    const champion = createClassBonusTestChampion(raisedSlash, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [twoOfHearts, twoOfHearts, twoOfHearts],
          hand: [raisedSlash, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion, zones: { field: [enfeebledDagger] } },
    });
    const p = game.player("player-one"),
      q = game.player("player-two");
    const allies = p.cards(twoOfHearts),
      hero = p.card(champion),
      target = q.card(champion);
    p.activate(raisedSlash, {
      attackAttackerId: hero.objectId,
      reservePayment: p.cards(woodlandSquirrels).map((c) => ({ kind: "card", cardId: c.objectId })),
    });
    passEffectsStack(game);
    declareResolvedAttack(game, hero.objectId, target.objectId, "Declare Raised Slash");
    advanceCombatToTrigger(game, "fuqfxq13uz-a1");
    answerDecision(game, "announce-triggered-ability", {
      targets: { "counter-recipients": allies.slice(0, 2).map((c) => c.objectId) },
    });
    p.pass();
    q.activateAbility(enfeebledDagger, "idpdon8f0h-a1", {
      targets: { "target-unit": [allies[0]!.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[allies[0]!.objectId]!.zone).toBe("graveyard");
    expect(game.state.objects[allies[0]!.objectId]!.counters.buff ?? 0).toBe(0);
    expect(game.state.objects[allies[1]!.objectId]!.counters.buff).toBe(1);
    expect(game.state.objects[allies[2]!.objectId]!.counters.buff ?? 0).toBe(0);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(3);
  });
});
