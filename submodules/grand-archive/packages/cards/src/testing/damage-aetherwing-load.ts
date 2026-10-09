import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { trivariateDream } from "../cards/DTR/weapons/trivariate-dream.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { imperialCountermeasure } from "../cards/RDO/actions/imperial-countermeasure.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "./decisions.ts";

export function proveDamageAndOptionalAetherwingLoad(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  damage: 1 | 2,
  targetAllies: boolean,
): void {
  for (const matching of [false, true])
    for (const targetOwner of ["own", "opponent"] as const)
      for (const targetKind of targetAllies
        ? (["champion", "ally"] as const)
        : (["champion"] as const))
        for (const load of ["unavailable", "decline", "first", "second"] as const)
          for (const prevented of [false, true])
            it(`damage then loading: class=${matching}, target=${targetOwner} ${targetKind}, load=${load}, prevention=${prevented}`, () => {
              const champion = enableAllTestElements(
                createClassBonusTestChampion(card, matching, "activation-discount"),
              );
              const game = GrandArchiveTestEngine.startFixture({
                playerOne: {
                  champion,
                  zones: {
                    hand: [
                      card,
                      imperialCountermeasure,
                      ...Array.from({ length: 8 }, () => woodlandSquirrels),
                    ],
                    field: [
                      trainingSword,
                      giantTortoise,
                      ...(load === "unavailable" ? [] : [trivariateDream, trivariateDream]),
                    ],
                    graveyard: [trivariateDream],
                    "main-deck": [woodlandSquirrels],
                  },
                },
                playerTwo: { champion, zones: { field: [trivariateDream, giantTortoise] } },
              });
              const p = game.player("player-one"),
                q = game.player("player-two"),
                source = p.card(card);
              const owner = targetOwner === "own" ? p : q;
              const target = owner.card(targetKind === "champion" ? champion : giantTortoise);
              const pay = (n: number) =>
                p
                  .cards(woodlandSquirrels, { zone: "hand" })
                  .slice(0, n)
                  .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
              if (prevented) {
                p.activate(imperialCountermeasure, {
                  reservePayment: pay(1),
                  targets: { "target-1": [target.objectId] },
                });
                passEffectsStack(game);
              }
              for (const ids of [
                [],
                [target.objectId, target.objectId],
                [p.card(trainingSword).objectId],
                ...(!targetAllies ? [[q.card(giantTortoise).objectId]] : []),
              ]) {
                const before = game.state;
                expect(() =>
                  p.activate(source, { reservePayment: pay(damage), targets: { "target-1": ids } }),
                ).toThrow();
                expect(game.state).toEqual(before);
              }
              p.activate(source, {
                reservePayment: pay(damage),
                targets: { "target-1": [target.objectId] },
              });
              expect(game.state.objects[target.objectId]?.damage).toBe(0);
              passEffectsStack(game);
              expect(game.state.objects[target.objectId]?.damage).toBe(prevented ? 0 : damage);
              if (load !== "unavailable") {
                expect(game.state.objects[source.objectId]?.zone).toBe("effects-stack");
                expect(game.state.decision).toMatchObject({
                  kind: "resolve-optional-effect",
                  playerId: p.id,
                });
                answerDecision(game, "resolve-optional-effect", load !== "decline");
                passEffectsStack(game);
                if (load !== "decline") {
                  const hosts = p.cards(trivariateDream, { zone: "field" });
                  for (const ids of [
                    [],
                    [q.card(trivariateDream).objectId],
                    [p.card(trainingSword).objectId],
                    [p.card(giantTortoise).objectId],
                    [p.card(trivariateDream, { zone: "graveyard" }).objectId],
                    [hosts[0]!.objectId, hosts[1]!.objectId],
                    [hosts[0]!.objectId, hosts[0]!.objectId],
                  ]) {
                    const before = game.state;
                    expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
                    expect(game.state).toEqual(before);
                  }
                  const chosen = hosts[load === "first" ? 0 : 1]!;
                  answerDecision(game, "resolve-effect-choice", [chosen.objectId]);
                  passEffectsStack(game);
                  expect(game.state.objects[source.objectId]).toMatchObject({
                    zone: "loaded",
                    hostId: chosen.objectId,
                    ownerId: p.id,
                    controllerId: p.id,
                  });
                }
              }
              if (load === "unavailable" || load === "decline")
                expect(game.state.objects[source.objectId]?.zone).toBe("graveyard");
              expect(game.state.decision).toBeNull();
              expect(game.state.stack).toHaveLength(0);
              expect(game.state.objects[target.objectId]?.damage).toBe(prevented ? 0 : damage);
              expect(p.zone("memory")).toHaveLength(damage + (prevented ? 2 : 0));
            });
}
