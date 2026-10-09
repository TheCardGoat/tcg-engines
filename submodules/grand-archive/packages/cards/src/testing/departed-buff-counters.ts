import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { createLineageTestChampion } from "./champion-lineage.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "./class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "./decisions.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { goldenPawn } from "../cards/PTM/allies/golden-pawn.ts";
import { trainingSession } from "../cards/DOA/actions/training-session.ts";
import { fireball } from "../cards/DOA/actions/fireball.ts";
import { reclaim } from "../cards/DOA/actions/reclaim.ts";

export function proveDepartedBuffCounters(
  card: GrandArchiveCard<GrandArchiveAbilityDefinition, "card">,
  targeted: boolean,
) {
  for (const enabled of [false, true])
    for (const bounce of [false, true])
      for (const extra of [0, 1, 3]) {
        it(`restores departed buffs: bonus=${enabled}, bounce=${bounce}, extra=${extra}`, () => {
          const base = targeted
            ? createClassBonusTestChampion(card, enabled, "activation-discount")
            : createLineageTestChampion(card, enabled ? "Alice" : "Other");
          const champion = enableAllTestElements(grantTestChampionLevel(base, 9));
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  card,
                  fireball,
                  reclaim,
                  ...Array.from({ length: extra }, () => trainingSession),
                  ...Array.from({ length: 20 }, () => woodlandSquirrels),
                ],
                field: [goldenPawn, giantTortoise],
              },
            },
            playerTwo: { champion, zones: { field: [goldenPawn] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(card),
            target = p.card(goldenPawn);
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          p.activate(source, { reservePayment: pay(3) });
          passEffectsStack(game);
          for (const spell of p.cards(trainingSession)) {
            p.activate(spell, {
              targets: { "target-1": [source.objectId] },
              reservePayment: pay(2),
            });
            passEffectsStack(game);
          }
          const count = extra + (targeted ? 2 : 0);
          expect(game.state.objects[source.objectId]!.counters.buff ?? 0).toBe(count);
          p.activate(bounce ? reclaim : fireball, {
            targets: { "target-1": [source.objectId] },
            reservePayment: pay(bounce ? 2 : 4),
          });
          passEffectsStack(game);
          expect(game.state.objects[source.objectId]!.zone).toBe(bounce ? "hand" : "graveyard");
          expect(game.state.objects[source.objectId]!.counters.buff ?? 0).toBe(0);
          expect(game.state.objects[target.objectId]!.counters.buff ?? 0).toBe(0);
          if (enabled) {
            if (targeted) {
              const before = game.state;
              for (const id of [
                p.card(champion).objectId,
                q.card(goldenPawn).objectId,
                source.objectId,
              ]) {
                expect(() =>
                  answerDecision(game, "announce-triggered-ability", {
                    targets: { "target-1": [id] },
                  }),
                ).toThrow();
                expect(game.state).toEqual(before);
              }
              answerDecision(game, "announce-triggered-ability", {
                targets: { "target-1": [target.objectId] },
              });
            } else {
              const before = game.state;
              for (const ids of [
                [],
                [p.card(giantTortoise).objectId],
                [q.card(goldenPawn).objectId],
                [source.objectId],
              ]) {
                expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
                expect(game.state).toEqual(before);
              }
              answerDecision(game, "resolve-effect-choice", [target.objectId]);
            }
            passEffectsStack(game);
          }
          expect(game.state.objects[target.objectId]!.counters.buff ?? 0).toBe(enabled ? count : 0);
          expect(game.state.objects[source.objectId]!.counters.buff ?? 0).toBe(0);
          expect(game.state.objects[q.card(goldenPawn).objectId]!.counters.buff ?? 0).toBe(0);
          expect(game.state.decision).toBeNull();
        });
      }
}
