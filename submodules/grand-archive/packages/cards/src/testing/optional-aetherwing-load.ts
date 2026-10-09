import type { GrandArchiveObjectId } from "@tcg/grand-archive-engine/runtime";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { trivariateDream } from "../cards/DTR/weapons/trivariate-dream.ts";
import { resonantAether } from "../cards/DTR/actions/resonant-aether.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "./decisions.ts";

export function proveOptionalAetherwingLoad(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  targetAlly = false,
): void {
  const face = grandArchiveTestFace(card);
  if (face.cost.kind !== "reserve" || typeof face.cost.amount !== "number")
    throw new Error("Expected fixed reserve cost");
  const cost = face.cost.amount;
  for (const available of [false, true])
    for (const accept of [false, true])
      for (const preload of available ? [false, true] : [false])
        it(`optional loading: host=${available}, accept=${accept}, preloaded=${preload}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(card, false, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  card,
                  resonantAether,
                  ...Array.from({ length: cost + 1 }, () => woodlandSquirrels),
                ],
                field: [
                  ...(available ? [trivariateDream, trivariateDream] : []),
                  trainingSword,
                  woodlandSquirrels,
                ],
                graveyard: [trivariateDream],
                "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
              },
            },
            playerTwo: { champion, zones: { field: [trivariateDream] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(card);
          const host = p.cards(trivariateDream, { zone: "field" })[1];
          const loaded = p.card(resonantAether);
          const payment = (amount: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, amount)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          if (preload) {
            p.activate(loaded, { reservePayment: payment(1) });
            passEffectsStack(game);
            answerDecision(game, "resolve-effect-choice", [host!.objectId]);
            passEffectsStack(game);
            expect(game.state.objects[loaded.objectId]!.zone).toBe("loaded");
          }
          p.activate(source, {
            reservePayment: payment(cost),
            ...(targetAlly
              ? { targets: { "target-1": [p.card(woodlandSquirrels, { zone: "field" }).objectId] } }
              : {}),
          });
          passEffectsStack(game);
          if (game.state.decision?.kind === "resolve-glimpse") {
            answerDecision(game, "resolve-glimpse", {
              kind: "reorder",
              top: game.state.decision.cardIds,
              bottom: [],
            });
            passEffectsStack(game);
          }
          if (game.state.decision?.kind === "resolve-effect-payment") {
            expect(game.state.decision.playerId).toBe(q.id);
            answerDecision(game, "resolve-effect-payment", false);
            passEffectsStack(game);
          }
          if (game.state.decision?.kind === "resolve-optional-effect") {
            answerDecision(game, "resolve-optional-effect", accept);
            passEffectsStack(game);
          } else expect(available).toBe(false);
          if (available && accept) {
            expect(game.state.decision?.kind).toBe("resolve-effect-choice");
            for (const ids of [
              [q.card(trivariateDream).objectId],
              [p.card(trainingSword).objectId],
              [p.card(woodlandSquirrels, { zone: "field" }).objectId],
              [p.card(champion).objectId],
              [p.card(trivariateDream, { zone: "graveyard" }).objectId],
              [host!.objectId, host!.objectId],
            ]) {
              const before = game.state;
              expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
              expect(game.state).toEqual(before);
            }
            answerDecision(game, "resolve-effect-choice", [host!.objectId]);
            passEffectsStack(game);
            expect(game.state.objects[source.objectId]!.zone).toBe("loaded");
            expect(game.state.objects[source.objectId]!.hostId).toBe(host!.objectId);
            p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [host!.objectId] });
            expect(game.state.objects[source.objectId]!.zone).toBe("intent");
            expect(game.state.objects[source.objectId]!.hostId).toBe(p.card(champion).objectId);
            if (preload) expect(game.state.objects[loaded.objectId]!.zone).toBe("intent");
            game.resolveCombatWithoutRetaliation();
            expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(
              1 + (face.stats.power ?? 0) + Number(preload),
            );
            if (preload) expect(game.state.objects[loaded.objectId]!.zone).toBe("graveyard");
          } else if (preload) {
            expect(game.state.objects[loaded.objectId]!.zone).toBe("loaded");
            expect(game.state.objects[loaded.objectId]!.hostId).toBe(host!.objectId);
          }
          expect(game.state.decision).toBeNull();
          expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
          expect(p.zone("memory")).toHaveLength(cost + Number(preload));
          expect(game.state.objects[q.card(trivariateDream).objectId]!.zone).toBe("field");
        });
}

/** Resolve the printed optional loading decision and check that invalid hosts do not mutate state. */
export function finishOptionalAetherwingLoad(
  game: GrandArchiveTestEngine,
  source: GrandArchiveObjectId,
  host: GrandArchiveObjectId,
  load: boolean,
  invalidHosts: readonly GrandArchiveObjectId[],
): void {
  expect(game.state.decision?.kind).toBe("resolve-optional-effect");
  expect(game.state.objects[source]!.zone).toBe("effects-stack");
  answerDecision(game, "resolve-optional-effect", load);
  passEffectsStack(game);
  if (load) {
    expect(game.state.decision?.kind).toBe("resolve-effect-choice");
    for (const invalid of invalidHosts) {
      const before = game.state;
      expect(() => answerDecision(game, "resolve-effect-choice", [invalid])).toThrow();
      expect(game.state).toEqual(before);
    }
    answerDecision(game, "resolve-effect-choice", [host]);
    passEffectsStack(game);
    expect(game.state.objects[source]!.zone).toBe("loaded");
    expect(game.state.objects[source]!.hostId).toBe(host);
  } else expect(game.state.objects[source]!.zone).toBe("graveyard");
}
