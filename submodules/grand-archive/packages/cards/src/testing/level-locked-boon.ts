import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  deriveGrandArchiveNumericProperty,
  type GrandArchivePantheonPlayerSetup,
} from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import {
  enableAllTestElements,
  grandArchiveTestFace,
  grantTestChampionLevel,
  requireSingleFace,
} from "./class-bonus-test-champion.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "./decisions.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { lesserBoonOfApollo } from "../cards/PP1/boons/lesser-boon-of-apollo.ts";
import { greaterBoonOfHorses } from "../cards/PP1/boons/greater-boon-of-horses.ts";
import { pantheonBarrier } from "../cards/PP1/tokens/pantheon-barrier.ts";
export function proveLevelLockedBoon({
  card,
  threshold,
  opponentRecollection = false,
  allyTarget = false,
  classLocked = false,
  chooseNone = false,
  drawOnGain,
  buffOnGain,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  threshold: number;
  opponentRecollection?: boolean;
  allyTarget?: boolean;
  classLocked?: boolean;
  chooseNone?: boolean;
  drawOnGain?: number;
  buffOnGain?: number;
}): void {
  const face = grandArchiveTestFace(card);
  if (face.cost.kind !== "reserve" || typeof face.cost.amount !== "number")
    throw new Error("Expected a fixed boon cost");
  const cost = face.cost.amount;
  for (const matchesClass of classLocked ? [false, true] : [true])
    for (const level of [threshold - 1, threshold, threshold + 1])
      for (const boosted of [false, true])
        it(`requires base level ${threshold}: printed=${level}, continuous bonus=${boosted}, matching class=${matchesClass}`, () => {
          const champions = Array.from({ length: level + 1 }, (_, printedLevel) => {
            const base = enableAllTestElements(
              lineageTestChampion("Level Lock Fixture", printedLevel),
            );
            const leveled = boosted ? grantTestChampionLevel(base, 3) : base;
            const printedFace = requireSingleFace(leveled);
            return {
              ...leveled,
              layout: {
                kind: "single-faced" as const,
                face: {
                  ...printedFace,
                  ...(classLocked
                    ? {
                        typeLine: {
                          ...printedFace.typeLine,
                          classes: matchesClass ? face.typeLine.classes : (["SPIRIT"] as const),
                          subtypes: matchesClass ? face.typeLine.classes : (["SPIRIT"] as const),
                        },
                      }
                    : {}),
                  cost: { kind: "memory" as const, amount: 0 },
                },
              },
            };
          });
          const champion = champions[0]!;
          const lesser = face.typeLine.types.includes("LESSER BOON") ? card : lesserBoonOfApollo;
          const greater = face.typeLine.types.includes("GREATER BOON") ? card : greaterBoonOfHorses;
          const player = (id: string): GrandArchivePantheonPlayerSetup => ({
            id,
            name: id,
            startingChampionDefinitionId: champion.canonicalId,
            mainDeck: [{ definitionId: woodlandSquirrels.canonicalId, count: 40 }],
            materialDeck: champions.map((card) => ({ definitionId: card.canonicalId, count: 1 })),
            pantheon: {
              lesserBoonDefinitionId: lesser.canonicalId,
              greaterBoonDefinitionId: greater.canonicalId,
              barrierDefinitionId: pantheonBarrier.canonicalId,
            },
          });
          const game = GrandArchiveTestEngine.start(
            [...champions, lesser, greater, pantheonBarrier, woodlandSquirrels],
            {
              mode: "pantheon",
              randomSeed: 43,
              firstPlayerId: "player-two",
              players: [player("player-one"), player("player-two"), player("player-three")],
            },
            { validateDeckConstruction: false, skipPregameForTests: true },
          );
          const p = game.player("player-one"),
            q = game.player("player-two"),
            boon = p.card(card, { zone: "pantheon" }),
            hero = p.card(champion);
          advanceToMain(game, q.id, game.state.turn.number);
          q.activate(q.cards(woodlandSquirrels, { zone: "hand" })[0]!);
          passEffectsStack(game);
          for (const next of champions.slice(1)) {
            for (let step = 0; step < 128; step++) {
              const wait = game.waitState();
              if (wait.kind === "materialization-choice" && wait.playerId === p.id) break;
              if (wait.kind === "materialization-choice")
                game.player(wait.playerId).execute({ move: "skip-materialization" });
              else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
              else throw new Error(`Unexpected ${wait.kind} before champion materialization`);
            }
            p.materialize(next);
            passEffectsStack(game);
            advanceToMain(game, p.id);
          }
          expect(
            deriveGrandArchiveNumericProperty(game.state.objects[hero.objectId]!, "level", {
              program: game.program,
              state: game.state,
              controllerId: p.id,
              bindings: {},
            }),
          ).toBe(level + (boosted ? 3 : 0));
          for (let draw = 0; draw < cost + 1; draw++)
            advanceToMain(game, p.id, game.state.turn.number);
          p.activate(p.cards(woodlandSquirrels, { zone: "hand" })[0]!);
          passEffectsStack(game);
          if (opponentRecollection) {
            for (let step = 0; step < 128; step++) {
              const wait = game.waitState();
              if (
                game.state.turn.phase === "recollection" &&
                game.state.turn.playerId === q.id &&
                wait.kind === "opportunity" &&
                wait.playerId === p.id
              )
                break;
              if (wait.kind === "materialization-choice")
                game.player(wait.playerId).execute({ move: "skip-materialization" });
              else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
              else throw new Error(`Unexpected ${wait.kind} before recollection`);
            }
            expect(game.state.turn.phase).toBe("recollection");
            expect(game.state.turn.playerId).toBe(q.id);
          }
          const reservePayment = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, cost)
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
          const targets = opponentRecollection
            ? {
                "required-attacker": [q.card(woodlandSquirrels, { zone: "field" }).objectId],
                "defending-opponent": [game.player("player-three").id],
              }
            : undefined;
          expect(reservePayment).toHaveLength(cost);
          const unlocked = level >= threshold && matchesClass;
          expect(
            p
              .legalCommands()
              .some(
                (candidate) =>
                  candidate.command.move === "bestow-boon" &&
                  candidate.command.cardId === boon.objectId,
              ),
          ).toBe(unlocked);
          const before = game.state;
          if (!unlocked) {
            expect(() =>
              p.execute({ move: "bestow-boon", cardId: boon.objectId, reservePayment, targets }),
            ).toThrow();
            expect(game.state).toEqual(before);
            expect(game.state.objects[boon.objectId]!.facing).toBe("face-down");
            return;
          }
          const handBefore = p.zone("hand");
          const deckBefore = p.zone("main-deck");
          const opposingDecks = [q, game.player("player-three")].map((player) =>
            player.zone("main-deck"),
          );
          p.execute({ move: "bestow-boon", cardId: boon.objectId, reservePayment, targets });
          passEffectsStack(game);
          if (allyTarget && game.state.decision?.kind === "announce-triggered-ability") {
            answerDecision(game, "announce-triggered-ability", {
              targets: { "target-1": [p.card(woodlandSquirrels, { zone: "field" }).objectId] },
            });
            passEffectsStack(game);
          }
          if (game.state.decision?.kind === "resolve-effect-choice") {
            answerDecision(
              game,
              "resolve-effect-choice",
              chooseNone ? [] : [p.card(woodlandSquirrels, { zone: "field" }).objectId],
            );
            passEffectsStack(game);
          }
          if (buffOnGain !== undefined) {
            const ally = game.state.objects[p.card(woodlandSquirrels, { zone: "field" }).objectId]!;
            expect(ally.counters.buff ?? 0).toBe(buffOnGain);
            for (const property of ["power", "life"] as const)
              expect(
                deriveGrandArchiveNumericProperty(ally, property, {
                  program: game.program,
                  state: game.state,
                  controllerId: p.id,
                  bindings: {},
                }),
              ).toBe(1 + buffOnGain);
            expect(
              game.state.objects[q.card(woodlandSquirrels, { zone: "field" }).objectId]!.counters
                .buff ?? 0,
            ).toBe(0);
          }
          expect(game.state.decision).toBeNull();
          expect(game.state.objects[boon.objectId]!.zone).toBe("pantheon");
          expect(game.state.objects[boon.objectId]!.facing).toBe("face-up");
          expect(p.zone("memory")).toHaveLength(cost);
          if (drawOnGain !== undefined) {
            expect(p.zone("hand")).toHaveLength(handBefore.length - cost + drawOnGain);
            for (const drawn of deckBefore.slice(0, drawOnGain))
              expect(p.zone("hand")).toContainEqual(drawn);
            expect(p.zone("main-deck")).toEqual(deckBefore.slice(drawOnGain));
            expect(q.zone("main-deck")).toEqual(opposingDecks[0]);
            expect(game.player("player-three").zone("main-deck")).toEqual(opposingDecks[1]);
            const afterGain = game.state;
            expect(() => p.execute({ move: "bestow-boon", cardId: boon.objectId })).toThrow();
            expect(game.state).toEqual(afterGain);
          }
        });
}
