import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { rafalesSlash } from "./rafales-slash.ts";
import { vacuousServant } from "../tokens/vacuous-servant.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createLineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  advanceCombatToTrigger,
  advanceToMain,
  answerDecision,
  declareResolvedAttack,
  passEffectsStack,
} from "../../../testing/decisions.ts";

/** @covers rn1gmo124j-a1 */
describe("Rafale's Slash — optional Ciel payment summons a rested servant", () => {
  for (const ciel of [false, true])
    for (const choice of ["pay", "decline", "unaffordable"] as const)
      it(`Ciel=${ciel}, choice=${choice}`, () => {
        const champion = createLineageTestChampion(rafalesSlash, ciel ? "Ciel" : "Other");
        const opposing = createLineageTestChampion(rafalesSlash, "Ciel");
        const game = GrandArchiveTestEngine.startFixture({
          definitions: [vacuousServant],
          playerOne: {
            champion,
            zones: {
              hand: [
                rafalesSlash,
                ...Array.from(
                  { length: choice === "unaffordable" ? 2 : 5 },
                  () => woodlandSquirrels,
                ),
              ],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion: opposing,
            zones: {
              hand: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const hero = p.card(champion),
          target = q.card(opposing);
        const payment = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const before = game.state;
        expect(() =>
          p.activate(rafalesSlash, { attackAttackerId: hero.objectId, reservePayment: payment(1) }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activate(rafalesSlash, { attackAttackerId: hero.objectId, reservePayment: payment(2) });
        passEffectsStack(game);
        expect(p.cards(vacuousServant)).toHaveLength(0);
        declareResolvedAttack(game, hero.objectId, target.objectId, "Declare Rafale's Slash");
        advanceCombatToTrigger(game, "rn1gmo124j-a1");
        if (ciel) {
          passEffectsStack(game);
          expect(game.state.decision).toMatchObject({
            kind: "resolve-optional-effect",
            playerId: p.id,
          });
          expect(p.cards(vacuousServant)).toHaveLength(0);
          if (choice === "unaffordable") {
            const snapshot = game.state;
            expect(() => answerDecision(game, "resolve-optional-effect", true)).toThrow();
            expect(game.state).toEqual(snapshot);
          }
          answerDecision(game, "resolve-optional-effect", choice === "pay");
          if (choice === "pay") {
            const snapshot = game.state;
            expect(() =>
              answerDecision(game, "resolve-effect-payment", { reservePayment: payment(2) }),
            ).toThrow();
            expect(game.state).toEqual(snapshot);
            expect(() => answerDecision(game, "resolve-effect-payment", false)).toThrow();
            expect(game.state).toEqual(snapshot);
            answerDecision(game, "resolve-effect-payment", { reservePayment: payment(3) });
          }
          passEffectsStack(game);
        }
        game.resolveCombatWithoutRetaliation();
        const summoned = ciel && choice === "pay";
        expect(p.cards(vacuousServant, { zone: "field" })).toHaveLength(Number(summoned));
        expect(q.cards(vacuousServant)).toHaveLength(0);
        expect(p.zone("memory")).toHaveLength(summoned ? 5 : 2);
        expect(game.state.objects[target.objectId]!.damage).toBe(2);
        expect(p.cards(rafalesSlash, { zone: "graveyard" })).toHaveLength(1);
        if (summoned) {
          const servant = p.card(vacuousServant);
          expect(game.state.objects[servant.objectId]!.states.has("rested")).toBe(true);
          const snapshot = game.state;
          expect(() => p.declareAttack(servant, target)).toThrow();
          expect(game.state).toEqual(snapshot);
          advanceToMain(game, q.id);
          advanceToMain(game, p.id);
          expect(game.state.objects[servant.objectId]!.states.has("rested")).toBe(false);
          p.declareAttack(servant, target);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[target.objectId]!.damage).toBe(3);
        }
      });
});
