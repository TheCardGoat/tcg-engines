import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { lineageTestChampion } from "./champion-lineage.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
  requireSingleFace,
} from "./class-bonus-test-champion.ts";
import {
  advanceToMain,
  answerDecision,
  passEffectsStack,
  advanceCombatToTrigger,
} from "./decisions.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import { fireball } from "../cards/DOA/actions/fireball.ts";

export function proveOptionalMaterialBanish(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  combat: boolean,
) {
  for (const empty of [false, true])
    it(`skips an impossible optional payment, empty material deck=${empty}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(card, false, "activation-discount"),
      );
      const invalid = lineageTestChampion("Ineligible Material", 2);
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: combat ? "playerTwo" : "playerOne",
        playerOne: {
          champion,
          zones: {
            "material-deck": empty ? [] : [invalid, trainingSword],
            hand: [card, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { field: [woodlandSquirrels] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        deck = p.zone("main-deck"),
        material = p.zone("material-deck");
      if (combat) {
        q.declareAttack(q.card(woodlandSquirrels, { zone: "field" }), p.card(champion));
        q.pass();
      }
      p.activate(card, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, combat ? 2 : 3)
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      });
      const memory = p.zone("memory");
      passEffectsStack(game);
      expect(game.state.decision).toBeNull();
      expect(p.zone("main-deck")).toEqual(deck);
      expect(p.zone("memory")).toEqual(memory);
      expect(p.zone("material-deck")).toEqual(material);
      expect(p.zone("banishment")).toHaveLength(0);
      if (combat) {
        expect(game.state.combat).not.toBeNull();
        advanceCombatToTrigger(game, "none");
        expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(1);
      }
    });
  for (const matching of [false, true])
    for (const accept of [false, true])
      for (const high of [false, true]) {
        it(`respects printed selection, class=${matching}, accept=${accept}, higher=${high}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(card, matching, "activation-discount"),
          );
          const make = (level: number) => {
            const base = lineageTestChampion("Banish Eligible", level),
              face = requireSingleFace(base);
            return combat
              ? {
                  ...base,
                  layout: {
                    kind: "single-faced" as const,
                    face: {
                      ...face,
                      typeLine: {
                        ...face.typeLine,
                        classes: ["WARRIOR"] as const,
                        subtypes: ["WARRIOR"] as const,
                      },
                    },
                  },
                }
              : base;
          };
          const low = make(combat ? 1 : 3),
            upper = make(combat ? 3 : 4);
          const invalid = grantTestChampionLevel(
            lineageTestChampion("Banish Ineligible", combat ? 4 : 2),
            10,
          );
          const opponent = enableAllTestElements(lineageTestChampion("Opponent", 0));
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: "playerOne",
            playerOne: {
              champion,
              zones: {
                "material-deck": [low, upper, invalid, trainingSword],
                hand: [card, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion: opponent,
              zones: {
                field: [woodlandSquirrels],
                "material-deck": [upper],
                hand: [
                  fireball,
                  woodlandSquirrels,
                  woodlandSquirrels,
                  woodlandSquirrels,
                  woodlandSquirrels,
                ],
                "main-deck": [woodlandSquirrels],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            hero = p.card(champion),
            chosen = p.card(high ? upper : low),
            deck = p.zone("main-deck");
          const payment = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, combat ? 2 : 3)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          if (combat) {
            const before = game.state;
            expect(() => p.activate(card, { reservePayment: payment })).toThrow();
            expect(game.state).toEqual(before);
            advanceToMain(game, q.id);
            q.declareAttack(q.card(woodlandSquirrels, { zone: "field" }), hero);
            q.activate(fireball, {
              targets: { "target-1": [hero.objectId] },
              reservePayment: q
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, 4)
                .map((c) => ({ kind: "card", cardId: c.objectId })),
            });
            q.pass();
          }
          p.activate(card, { reservePayment: payment });
          const memory = p.zone("memory"),
            hand = p.zone("hand");
          expect(game.state.objects[chosen.objectId]!.zone).toBe("material-deck");
          passEffectsStack(game);
          expect(game.state.decision).toMatchObject({
            kind: "resolve-optional-effect",
            playerId: p.id,
          });
          answerDecision(game, "resolve-optional-effect", accept);
          passEffectsStack(game);
          if (accept) {
            expect(game.state.decision).toMatchObject({
              kind: "resolve-effect-choice",
              playerId: p.id,
            });
            for (const ids of [
              [],
              [p.card(invalid).objectId],
              [p.card(trainingSword).objectId],
              [q.card(upper).objectId],
              [hero.objectId],
              [chosen.objectId, chosen.objectId],
              [p.card(low).objectId, p.card(upper).objectId],
            ]) {
              const before = game.state;
              expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
              expect(game.state).toEqual(before);
            }
            answerDecision(game, "resolve-effect-choice", [chosen.objectId]);
            passEffectsStack(game);
          }
          expect(game.state.objects[chosen.objectId]!.zone).toBe(
            accept ? "banishment" : "material-deck",
          );
          expect(p.zone("hand")).toEqual(hand);
          expect(p.zone("memory")).toEqual(accept && !combat ? [...memory, deck[0]!] : memory);
          expect(p.zone("main-deck")).toEqual(accept && !combat ? deck.slice(1) : deck);
          if (combat) {
            if (accept) {
              expect(game.state.combat).toBeNull();
              expect(game.state.turn.phase).toBe("main");
              expect(q.cards(fireball, { zone: "banishment" })).toHaveLength(1);
              expect(game.state.objects[hero.objectId]!.damage).toBe(0);
            } else {
              advanceCombatToTrigger(game, "none");
              expect(game.state.objects[hero.objectId]!.damage).toBe(2);
            }
          }
        });
      }
}
