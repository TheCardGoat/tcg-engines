import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { reclaim } from "../../DOA/actions/reclaim.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { heightenSpellcraft } from "../../P24/actions/heighten-spellcraft.ts";
import { glacialBinding } from "./glacial-binding.ts";

/** @covers cthZxfkdsY-a1 @covers cthZxfkdsY-a2 */
describe("Glacial Binding — optional graveyard cost and pay-three counter", () => {
  for (const matching of [false, true])
    for (const alternate of [false, true])
      for (const accept of [false, true])
        for (const ownActivation of [false, true]) {
          it(`keeps both payments exact, class=${matching}, alternate=${alternate}, accept=${accept}, own=${ownActivation}`, () => {
            const champion = enableAllTestElements(
              createClassBonusTestChampion(glacialBinding, matching, "activation-discount"),
            );
            const game = GrandArchiveTestEngine.startFixture({
              firstPlayer: ownActivation ? "playerOne" : "playerTwo",
              playerOne: {
                champion,
                zones: {
                  hand: [
                    glacialBinding,
                    fireball,
                    reclaim,
                    ...Array.from({ length: 9 }, () => woodlandSquirrels),
                  ],
                  graveyard: [reclaim, reclaim, woodlandSquirrels, heightenSpellcraft],
                  memory: [reclaim],
                },
              },
              playerTwo: {
                champion,
                zones: {
                  hand: [fireball, ...Array.from({ length: 7 }, () => woodlandSquirrels)],
                  graveyard: [reclaim],
                },
              },
            });
            const p = game.player("player-one"),
              q = game.player("player-two");
            const caster = ownActivation ? p : q,
              victim = ownActivation ? q : p;
            const pay = (player: typeof p, n: number) =>
              player
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, n)
                .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
            const pending = caster.card(fireball);
            caster.activate(pending, {
              reservePayment: pay(caster, 4),
              targets: { "target-1": [victim.card(champion).objectId] },
            });
            if (!ownActivation) caster.pass();
            const targets = { "target-stack-item": [game.state.stack[0]!.id] };
            const donors = p.cards(reclaim, { zone: "graveyard" });
            const before = game.state;
            if (alternate) {
              for (const ids of [
                [],
                donors.map((c) => c.objectId),
                [donors[0]!.objectId, donors[0]!.objectId],
                [p.card(reclaim, { zone: "hand" }).objectId],
                [p.card(reclaim, { zone: "memory" }).objectId],
                [q.card(reclaim, { zone: "graveyard" }).objectId],
                [p.card(woodlandSquirrels, { zone: "graveyard" }).objectId],
                [p.card(heightenSpellcraft).objectId],
              ]) {
                expect(() =>
                  p.activate(glacialBinding, {
                    targets,
                    costOptionIndex: 1,
                    costSelections: [ids],
                  }),
                ).toThrow();
                expect(game.state).toEqual(before);
              }
            } else {
              expect(() =>
                p.activate(glacialBinding, { targets, reservePayment: pay(p, 1) }),
              ).toThrow();
              expect(game.state).toEqual(before);
            }
            p.activate(
              glacialBinding,
              alternate
                ? { targets, costOptionIndex: 1, costSelections: [[donors[0]!.objectId]] }
                : { targets, reservePayment: pay(p, 2) },
            );
            expect(game.state.objects[donors[0]!.objectId]!.zone).toBe(
              alternate ? "banishment" : "graveyard",
            );
            expect(game.state.objects[donors[1]!.objectId]!.zone).toBe("graveyard");
            expect(game.state.objects[pending.objectId]!.zone).toBe("effects-stack");
            passEffectsStack(game);
            expect(game.state.decision?.kind).toBe("resolve-effect-payment");
            expect(game.state.decision?.playerId).toBe(caster.id);
            const beforeTax = game.state;
            expect(() =>
              answerDecision(game, "resolve-effect-payment", { reservePayment: pay(caster, 2) }),
            ).toThrow();
            expect(game.state).toEqual(beforeTax);
            answerDecision(
              game,
              "resolve-effect-payment",
              accept ? { reservePayment: pay(caster, 3) } : false,
            );
            passEffectsStack(game);
            expect(game.state.objects[pending.objectId]!.zone).toBe(
              accept ? "graveyard" : "banishment",
            );
            expect(game.state.objects[victim.card(champion).objectId]!.damage).toBe(accept ? 1 : 0);
            expect(p.zone("memory")).toHaveLength(
              1 + (ownActivation ? 4 + (accept ? 3 : 0) : 0) + (alternate ? 0 : 2),
            );
            expect(q.zone("memory")).toHaveLength(ownActivation ? 0 : 4 + (accept ? 3 : 0));
            expect(p.card(glacialBinding, { zone: "graveyard" })).toBeDefined();
            expect(game.state.decision).toBeNull();
            expect(game.state.stack).toHaveLength(0);
          });
        }
});
