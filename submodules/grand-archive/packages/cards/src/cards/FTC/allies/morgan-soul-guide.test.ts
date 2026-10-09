import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { morganSoulGuide } from "./morgan-soul-guide.ts";
import {
  proveLevelNoncombatPrevention,
  proveTemporaryLevelPrevention,
} from "../../../testing/level-noncombat-prevention.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";
import { remnantOfWill } from "../../PTM/actions/remnant-of-will.ts";
/** @covers ka5av43ehj-a1 */
describe("Morgan — Level 1 non-combat prevention", () => {
  proveLevelNoncombatPrevention(morganSoulGuide, 1);
  proveTemporaryLevelPrevention(morganSoulGuide, 1);
});
/** @covers ka5av43ehj-a2 */
describe("Morgan — Level 2 opposing recovery restriction", () => {
  for (const matching of [false, true])
    for (const level of [0, 1, 2, 3])
      for (const own of [false, true])
        for (const zone of ["field", "hand", "graveyard"] as const)
          it(`class=${matching}, level=${level}, own recovery=${own}, Morgan=${zone}`, () => {
            const champion = grantTestChampionLevel(
              enableAllTestElements(
                createClassBonusTestChampion(morganSoulGuide, matching, "activation-discount"),
              ),
              level,
            );
            const opponent = enableAllTestElements(
              createClassBonusTestChampion(morganSoulGuide, false, "activation-discount"),
            );
            const recoveryHand = [
              sparkAlight,
              remnantOfWill,
              woodlandSquirrels,
              woodlandSquirrels,
              woodlandSquirrels,
            ];
            const game = GrandArchiveTestEngine.startFixture({
              firstPlayer: own ? "playerOne" : "playerTwo",
              playerOne: {
                champion,
                zones: {
                  hand: [
                    ...(own ? recoveryHand : []),
                    ...(zone === "hand" ? [morganSoulGuide] : []),
                  ],
                  ...(zone !== "hand" ? { [zone]: [morganSoulGuide] } : {}),
                },
              },
              playerTwo: { champion: opponent, zones: { hand: own ? [] : recoveryHand } },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              active = own ? p : q,
              hero = active.card(own ? champion : opponent);
            const pay = (n: number) =>
              active
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, n)
                .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
            active.activate(sparkAlight, {
              reservePayment: pay(2),
              targets: { "target-1": [hero.objectId] },
            });
            passEffectsStack(game);
            expect(game.state.objects[hero.objectId]!.damage).toBe(own && matching ? 3 : 2);
            active.activate(remnantOfWill, { reservePayment: pay(1) });
            passEffectsStack(game);
            expect(game.state.objects[hero.objectId]!.damage).toBe(
              !own && zone === "field" && level >= 2 ? 2 : 0,
            );
            expect(active.zone("memory")).toHaveLength(3);
            expect(active.card(remnantOfWill, { zone: "graveyard" })).toBeDefined();
          });
});

import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { answerDecision } from "../../../testing/decisions.ts";
/** @covers ka5av43ehj-a3 */
describe("Morgan — own recollection glimpse or recovery", () => {
  for (const matching of [false, true])
    for (const damage of [0, 2])
      for (const choice of ["decline", "top", "bottom"] as const)
        it(`class=${matching}, damage=${damage}, choice=${choice}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(morganSoulGuide, matching, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [morganSoulGuide],
                hand: damage ? [sparkAlight, woodlandSquirrels, woodlandSquirrels] : [],
                "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: { "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels) },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            hero = p.card(champion);
          if (damage) {
            p.activate(sparkAlight, {
              reservePayment: p
                .cards(woodlandSquirrels, { zone: "hand" })
                .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
              targets: { "target-1": [hero.objectId] },
            });
            passEffectsStack(game);
          }
          advanceToRecollection(game, q.id);
          expect(game.state.stack).toHaveLength(0);
          expect(game.state.objects[hero.objectId]!.damage).toBe(damage && matching ? 3 : damage);
          advanceToRecollection(game, p.id);
          const deck = p.zone("main-deck"),
            otherDeck = q.zone("main-deck");
          passEffectsStack(game);
          if (matching) {
            answerDecision(game, "resolve-optional-effect", choice !== "decline");
            passEffectsStack(game);
            if (choice !== "decline") {
              const decision = game.state.decision;
              if (decision?.kind !== "resolve-glimpse")
                throw new Error(`Expected glimpse, got ${decision?.kind}`);
              expect(decision.cardIds).toEqual([deck[0]!.objectId]);
              const before = game.state;
              expect(() =>
                answerDecision(game, "resolve-glimpse", {
                  kind: "reorder",
                  top: [otherDeck[0]!.objectId],
                  bottom: [],
                }),
              ).toThrow();
              expect(game.state).toEqual(before);
              answerDecision(game, "resolve-glimpse", {
                kind: "reorder",
                top: choice === "top" ? [deck[0]!.objectId] : [],
                bottom: choice === "bottom" ? [deck[0]!.objectId] : [],
              });
              passEffectsStack(game);
            }
          }
          expect(game.state.objects[hero.objectId]!.damage).toBe(
            matching && choice === "decline"
              ? Math.max(0, (damage ? 3 : 0) - 1)
              : damage && matching
                ? 3
                : damage,
          );
          expect(p.zone("main-deck")).toEqual(
            matching && choice === "bottom" ? [...deck.slice(1), deck[0]!] : deck,
          );
          expect(q.zone("main-deck")).toEqual(otherDeck);
          expect(game.state.decision).toBeNull();
          expect(game.state.stack).toHaveLength(0);
        });
});
