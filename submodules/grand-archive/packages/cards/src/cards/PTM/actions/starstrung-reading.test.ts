import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { vantagePoint } from "../../RDO/actions/vantage-point.ts";
import { starstrungReading } from "./starstrung-reading.ts";
/** @covers gwWociEfxb-a2 */
describe("Starstrung Reading — conditional Glimpse", () => {
  for (const matching of [false, true])
    for (const distant of ["none", "own", "opponent", "response"])
      for (const size of [0, 2, 5]) {
        it(`class=${matching}, distant=${distant}, deck=${size}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(starstrungReading, matching, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  starstrungReading,
                  vantagePoint,
                  ...Array.from({ length: 4 }, () => woodlandSquirrels),
                ],
                "main-deck": Array.from({ length: size }, () => woodlandSquirrels),
              },
            },
            playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const pay = () =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 2)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          const makeDistant = () =>
            p.activate(vantagePoint, {
              targets: { "target-1": [(distant === "opponent" ? q : p).card(champion).objectId] },
              reservePayment: pay(),
            });
          if (distant === "own" || distant === "opponent") {
            makeDistant();
            passEffectsStack(game);
          }
          const deck = p.zone("main-deck"),
            otherDeck = q.zone("main-deck");
          p.activate(starstrungReading, { reservePayment: pay() });
          if (distant === "response") makeDistant();
          const hand = p.zone("hand"),
            memory = p.zone("memory");
          passEffectsStack(game);
          if (size && (distant === "own" || distant === "response")) {
            expect(game.state.decision).toMatchObject({
              kind: "resolve-glimpse",
              playerId: p.id,
              cardIds: deck.slice(0, 4).map((c) => c.objectId),
            });
            const before = game.state;
            expect(() =>
              answerDecision(game, "resolve-glimpse", {
                kind: "reorder",
                top: [otherDeck[0]!.objectId],
                bottom: [],
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
            const bottom = deck.slice(0, 4).reverse();
            answerDecision(game, "resolve-glimpse", {
              kind: "reorder",
              top: [],
              bottom: bottom.map((c) => c.objectId),
            });
            passEffectsStack(game);
            expect(p.zone("main-deck")).toEqual([...deck.slice(4), ...bottom]);
          } else {
            expect(game.state.decision).toBeNull();
            expect(p.zone("main-deck")).toEqual(deck);
          }
          expect(p.zone("hand")).toEqual(hand);
          expect(p.zone("memory")).toEqual(memory);
          expect(q.zone("main-deck")).toEqual(otherDeck);
          expect(game.state.status).not.toBe("finished");
        });
      }
});

import { celestialNavigation } from "../../RDO/actions/celestial-navigation.ts";
import { seekersAetherwing } from "../../P25/weapons/seekers-aetherwing.ts";
import { burningAethercharge } from "./burning-aethercharge.ts";
/** @covers gwWociEfxb-a1 */
describe("Starstrung Reading — three Glimpse grants", () => {
  for (const matching of [false, true])
    for (const distant of [false, true])
      for (const expired of [false, true]) {
        it(`class=${matching}, own Glimpse=${distant}, expired=${expired}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(starstrungReading, matching, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [seekersAetherwing],
                hand: [
                  starstrungReading,
                  vantagePoint,
                  ...Array.from({ length: 4 }, () => celestialNavigation),
                  ...Array.from({ length: 14 }, () => woodlandSquirrels),
                ],
                "main-deck": [
                  woodlandSquirrels,
                  ...Array.from({ length: 10 }, () => burningAethercharge),
                ],
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [seekersAetherwing],
                hand: [celestialNavigation, woodlandSquirrels, woodlandSquirrels],
                "main-deck": Array.from({ length: 6 }, () => burningAethercharge),
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const pay = () =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 2)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          if (distant) {
            p.activate(vantagePoint, {
              targets: { "target-1": [p.card(champion).objectId] },
              reservePayment: pay(),
            });
            passEffectsStack(game);
          }
          p.activate(starstrungReading, { reservePayment: pay() });
          passEffectsStack(game);
          if (distant) {
            const decision = game.state.decision;
            if (decision?.kind !== "resolve-glimpse") throw new Error("Expected Reading Glimpse");
            // Declining to load still consumes one Glimpse occurrence.
            answerDecision(game, "resolve-glimpse", {
              kind: "reorder",
              top: decision.cardIds,
              bottom: [],
            });
            passEffectsStack(game);
          }
          // An opponent gets neither the grant nor a charge against its three uses.
          p.pass();
          q.activate(celestialNavigation, {
            reservePayment: q
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          });
          passEffectsStack(game);
          const other = game.state.decision;
          if (other?.kind !== "resolve-glimpse") throw new Error("Expected opponent Glimpse");
          const beforeOther = game.state;
          expect(() =>
            answerDecision(game, "resolve-glimpse", {
              kind: "reorder",
              loads: [{ cardId: other.cardIds[0]!, weaponId: q.card(seekersAetherwing).objectId }],
              top: other.cardIds.slice(1),
              bottom: [],
            }),
          ).toThrow();
          expect(game.state).toEqual(beforeOther);
          answerDecision(game, "resolve-glimpse", {
            kind: "reorder",
            top: other.cardIds,
            bottom: [],
          });
          passEffectsStack(game);
          if (expired) advanceToMain(game, p.id, game.state.turn.number);
          const weaponId = p.card(seekersAetherwing).objectId;
          for (let use = 0; use < 4; use++) {
            p.activate(p.cards(celestialNavigation, { zone: "hand" })[0]!, {
              reservePayment: pay(),
            });
            passEffectsStack(game);
            const decision = game.state.decision;
            if (decision?.kind !== "resolve-glimpse")
              throw new Error("Expected subsequent Glimpse");
            const cardId = decision.cardIds.find(
              (id) => game.state.objects[id]?.definitionId === burningAethercharge.canonicalId,
            )!;
            const answer = {
              kind: "reorder" as const,
              loads: [{ cardId, weaponId }],
              top: decision.cardIds.filter((id) => id !== cardId),
              bottom: [],
            };
            const allowed = !expired && use < (distant ? 2 : 3);
            const before = game.state;
            if (allowed) {
              const nonCharge = decision.cardIds.find(
                (id) => game.state.objects[id]?.definitionId === woodlandSquirrels.canonicalId,
              );
              if (nonCharge) {
                expect(() =>
                  answerDecision(game, "resolve-glimpse", {
                    kind: "reorder",
                    loads: [{ cardId: nonCharge, weaponId }],
                    top: decision.cardIds.filter((id) => id !== nonCharge),
                    bottom: [],
                  }),
                ).toThrow();
                expect(game.state).toEqual(before);
              }
              expect(() =>
                answerDecision(game, "resolve-glimpse", {
                  ...answer,
                  loads: [{ cardId, weaponId: q.card(seekersAetherwing).objectId }],
                }),
              ).toThrow();
              expect(game.state).toEqual(before);
              answerDecision(game, "resolve-glimpse", answer);
              expect(game.state.objects[cardId]).toMatchObject({
                zone: "loaded",
                hostId: weaponId,
              });
            } else {
              expect(() => answerDecision(game, "resolve-glimpse", answer)).toThrow();
              expect(game.state).toEqual(before);
              answerDecision(game, "resolve-glimpse", {
                kind: "reorder",
                top: decision.cardIds,
                bottom: [],
              });
              expect(game.state.objects[cardId]?.zone).toBe("main-deck");
            }
            passEffectsStack(game);
          }
          expect(p.zone("loaded")).toHaveLength(expired ? 0 : distant ? 2 : 3);
          expect(q.zone("loaded")).toHaveLength(0);
        });
      }
});
