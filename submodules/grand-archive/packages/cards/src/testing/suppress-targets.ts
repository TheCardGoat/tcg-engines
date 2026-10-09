import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import { jewelOfEnlightenment } from "../cards/DOA/items/jewel-of-enlightenment.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { answerDecision, advanceToMain, passEffectsStack } from "./decisions.ts";

export function proveSuppressTargets(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  binding: string,
  mode: "ally" | "object" | "up-to-three" | "same-cost-pair",
): void {
  const face = grandArchiveTestFace(card);
  if (face.cost.kind !== "reserve" || typeof face.cost.amount !== "number")
    throw new Error("Expected fixed reserve cost");
  const cost = face.cost.amount;
  const counts = mode === "up-to-three" ? [0, 1, 2, 3] : mode === "same-cost-pair" ? [2] : [1];
  for (const count of counts)
    for (const kind of mode === "object" || mode === "up-to-three"
      ? [woodlandSquirrels, jewelOfEnlightenment, trainingSword]
      : [woodlandSquirrels])
      for (const ownFirst of [false, true])
        for (const duringEnd of [false, true])
          it(`suppresses ${count}, first=${kind.slug}, own=${ownFirst}, during end=${duringEnd}`, () => {
            const champion = enableAllTestElements(
              createClassBonusTestChampion(card, false, "activation-discount"),
            );
            const field = [
              woodlandSquirrels,
              woodlandSquirrels,
              giantTortoise,
              jewelOfEnlightenment,
              trainingSword,
            ];
            const game = GrandArchiveTestEngine.startFixture({
              playerOne: {
                champion,
                zones: {
                  field,
                  hand: [card, ...Array.from({ length: cost }, () => woodlandSquirrels)],
                  graveyard: [woodlandSquirrels],
                  "main-deck": [woodlandSquirrels, woodlandSquirrels],
                },
              },
              playerTwo: {
                champion,
                zones: { field, "main-deck": [woodlandSquirrels, woodlandSquirrels] },
              },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              first = ownFirst ? p : q,
              second = ownFirst ? q : p;
            const firstCard = first.cards(kind, { zone: "field" })[0]!;
            const pool =
              mode === "same-cost-pair"
                ? [firstCard, second.cards(woodlandSquirrels, { zone: "field" })[0]!]
                : [
                    firstCard,
                    second.card(
                      kind === jewelOfEnlightenment ? trainingSword : jewelOfEnlightenment,
                    ),
                    first.cards(kind === trainingSword ? woodlandSquirrels : trainingSword, {
                      zone: "field",
                    })[0]!,
                  ];
            const selected = pool.slice(0, count),
              source = p.card(card);
            const objects = [...p.zone("field"), ...q.zone("field")];
            const incarnations = selected.map((c) => game.state.objects[c.objectId]!.incarnation);
            const reachEnd = () => {
              for (let n = 0; n < 40 && game.state.turn.phase !== "end"; n++) {
                const wait = game.waitState();
                if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
                game.player(wait.playerId).pass();
              }
              expect(game.state.turn.phase).toBe("end");
            };
            if (duringEnd) reachEnd();
            const reservePayment = p
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
            const ids = selected.map((c) => c.objectId);
            const badTargets = [
              [p.card(champion).objectId, ...ids.slice(1)],
              [p.card(woodlandSquirrels, { zone: "graveyard" }).objectId, ...ids.slice(1)],
              [firstCard.objectId, firstCard.objectId],
              ...(mode === "ally" || mode === "same-cost-pair"
                ? [[first.card(trainingSword).objectId, ...ids.slice(1)]]
                : []),
              ...(mode === "same-cost-pair"
                ? [[firstCard.objectId, second.card(giantTortoise).objectId], [firstCard.objectId]]
                : []),
              ...(mode !== "up-to-three"
                ? [[]]
                : [
                    [
                      ...p.cards(woodlandSquirrels, { zone: "field" }),
                      ...q.cards(woodlandSquirrels, { zone: "field" }),
                    ].map((c) => c.objectId),
                  ]),
            ];
            for (const invalid of badTargets) {
              const before = game.state;
              expect(() =>
                p.activate(source, { reservePayment, targets: { [binding]: invalid } }),
              ).toThrow();
              expect(game.state).toEqual(before);
            }
            p.activate(source, { reservePayment, targets: { [binding]: ids } });
            for (const ref of selected)
              expect(game.state.objects[ref.objectId]!.zone).toBe("field");
            passEffectsStack(game);
            expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
            for (const ref of objects)
              expect(game.state.objects[ref.objectId]!.zone).toBe(
                ids.includes(ref.objectId) ? "banishment" : "field",
              );
            if (duringEnd) {
              advanceToMain(game, q.id);
              for (const ref of selected)
                expect(game.state.objects[ref.objectId]!.zone).toBe("banishment");
            }
            reachEnd();
            for (const ref of selected)
              expect(game.state.objects[ref.objectId]!.zone).toBe("banishment");
            if (game.state.decision?.kind === "order-triggered-abilities")
              answerDecision(
                game,
                "order-triggered-abilities",
                game.state.decision.pendingTriggerIds,
              );
            passEffectsStack(game);
            for (const [index, ref] of selected.entries()) {
              const returned = game.state.objects[ref.objectId]!;
              expect(returned.zone).toBe("field");
              expect(returned.controllerId).toBe(ref.ownerId);
              expect(returned.incarnation).toBeGreaterThan(incarnations[index]!);
              expect(returned.states.has("rested")).toBe(false);
            }
            expect(p.zone("memory")).toHaveLength(cost);
          });
}
