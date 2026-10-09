import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  deriveGrandArchiveCharacteristics,
  deriveGrandArchiveNumericProperty,
} from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { trainingSession } from "../cards/DOA/actions/training-session.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "./decisions.ts";

type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
export function proveClassPhaseSummon(
  card: Card,
  token: Card,
  phase: "end" | "recollection",
  copy = false,
) {
  for (const matching of [false, true])
    for (const copies of [1, 2])
      for (const zone of ["field", "hand", "graveyard"] as const) {
        it(`summons only on its controller's phase: class=${matching}, copies=${copies}, zone=${zone}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(card, matching, "activation-discount"),
          );
          const opponent = enableAllTestElements(
            createClassBonusTestChampion(card, true, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            definitions: [token],
            playerOne: {
              champion,
              zones: {
                [zone]: Array.from({ length: copies }, () => card),
                ...(copy && zone === "field"
                  ? { hand: [trainingSession, woodlandSquirrels, woodlandSquirrels] }
                  : {}),
                "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion: opponent,
              zones: { "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels) },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const original =
            copy && zone === "field" ? p.cards(card, { zone: "field" })[0] : undefined;
          if (original) {
            p.activate(trainingSession, {
              reservePayment: p
                .cards(woodlandSquirrels, { zone: "hand" })
                .map((ref) => ({ kind: "card", cardId: ref.objectId })),
              targets: { "target-1": [original.objectId] },
            });
            passEffectsStack(game);
            expect(game.state.objects[original.objectId]!.counters.buff).toBe(1);
          }
          const tokens = () =>
            Object.values(game.state.objects).filter(
              (object) => object.isToken && object.zone === "field",
            );
          function reach(playerId: string, after = -1) {
            for (let i = 0; i < 256; i++) {
              if (
                game.state.turn.playerId === playerId &&
                game.state.turn.phase === phase &&
                game.state.turn.number > after
              )
                return;
              const wait = game.waitState();
              if (game.state.decision?.kind === "order-triggered-abilities")
                answerDecision(
                  game,
                  "order-triggered-abilities",
                  game.state.decision.pendingTriggerIds,
                );
              else if (wait.kind === "materialization-choice")
                game.player(wait.playerId).execute({ move: "skip-materialization" });
              else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
              else throw new Error(`Unexpected phase wait ${wait.kind}`);
            }
            throw new Error("Phase did not advance");
          }
          function settle() {
            for (let i = 0; i < 32; i++) {
              if (game.state.decision?.kind === "order-triggered-abilities")
                answerDecision(
                  game,
                  "order-triggered-abilities",
                  game.state.decision.pendingTriggerIds,
                );
              passEffectsStack(game);
              if (!game.state.decision) return;
            }
            throw new Error("Token triggers did not settle");
          }
          if (phase === "recollection") {
            reach(q.id);
            settle();
            expect(tokens()).toHaveLength(0);
          }
          reach(p.id);
          expect(tokens()).toHaveLength(0);
          settle();
          const count = matching && zone === "field" ? copies : 0;
          expect(tokens()).toHaveLength(count);
          const firstIds = tokens().map((object) => object.id);
          for (const object of tokens()) {
            expect(object).toMatchObject({ ownerId: p.id, controllerId: p.id, isToken: true });
            expect(object.states.has("rested")).toBe(copy);
            expect(object.counters.buff ?? 0).toBe(0);
            const context = {
              program: game.program,
              state: game.state,
              controllerId: p.id,
              bindings: {},
            };
            const printed = grandArchiveTestFace(token);
            expect(deriveGrandArchiveCharacteristics(object, context)).toMatchObject({
              names: [printed.name],
              types: printed.typeLine.types,
              classes: printed.typeLine.classes,
              elements: printed.elements,
            });
            for (const property of ["power", "life"] as const)
              if (printed.stats[property] !== undefined)
                expect(deriveGrandArchiveNumericProperty(object, property, context)).toBe(
                  printed.stats[property],
                );
          }
          if (original) expect(game.state.objects[original.objectId]!.counters.buff).toBe(1);
          const firstTurn = game.state.turn.number;
          reach(q.id);
          settle();
          expect(tokens().map((object) => object.id)).toEqual(firstIds);
          reach(p.id, firstTurn);
          settle();
          expect(tokens()).toHaveLength(count * (copy ? 3 : 2));
          expect(tokens().every((object) => object.controllerId === p.id)).toBe(true);
          expect(game.state.stack).toHaveLength(0);
        });
      }
}
