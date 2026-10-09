import type { GrandArchiveObjectId } from "@tcg/grand-archive-engine/runtime";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { ferventBeastmaster } from "../cards/DOA/allies/fervent-beastmaster.ts";
import { loneGunslinger } from "../cards/ALC/allies/lone-gunslinger.ts";
import { reposition } from "../cards/ALC/actions/reposition.ts";
import { tomeOfSorcery } from "../cards/AMB/items/tome-of-sorcery.ts";
import { queensCinderhog } from "../cards/PTM/allies/queens-cinderhog.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { potionOfHealing } from "../cards/ALC/items/potion-of-healing.ts";
import { classBonusLeveledChampion } from "./class-bonus-level.ts";
import { enableAllTestElements } from "./class-bonus-test-champion.ts";
import { acceptedContract } from "../cards/DOA/actions/accepted-contract.ts";
import { soultraceTessellation } from "../cards/PTM/actions/soultrace-tessellation.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";

export function proveRadiantOrigin({
  card,
  abilityId,
  threshold,
  cost,
  training,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  abilityId: `${string}-a${number}`;
  threshold: number;
  cost: number;
  training:
    | "recovery"
    | "animal-attacks"
    | "empower"
    | "unit-damage"
    | "distant"
    | "weapon-attacks"
    | "prepared";
}): void {
  for (const matching of [false, true])
    for (const counters of [threshold - 1, threshold, threshold + 1])
      for (const successor of [false, true])
        it(`class=${matching}, training=${counters}, successor=${successor}`, () => {
          const { starter, lineage } = classBonusLeveledChampion(card, matching, 1);
          const next = lineage[0]!;
          const champion = enableAllTestElements(starter);
          const trainingCard =
            training === "weapon-attacks"
              ? trainingSword
              : training === "prepared"
                ? soultraceTessellation
                : training === "recovery"
                  ? potionOfHealing
                  : training === "empower"
                    ? tomeOfSorcery
                    : training === "distant"
                      ? loneGunslinger
                      : training === "unit-damage"
                        ? queensCinderhog
                        : woodlandSquirrels;
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [
                  card,
                  ...(["animal-attacks", "unit-damage", "distant", "weapon-attacks"].includes(
                    training,
                  )
                    ? [ferventBeastmaster]
                    : []),
                  ...(training === "prepared"
                    ? []
                    : Array.from({ length: counters }, () => trainingCard)),
                ],
                "main-deck": Array.from({ length: 12 }, () => woodlandSquirrels),
                hand: [
                  ...(training === "prepared"
                    ? [
                        acceptedContract,
                        acceptedContract,
                        ...Array.from({ length: counters + 1 }, () => soultraceTessellation),
                      ]
                    : []),
                  ...Array.from(
                    {
                      length:
                        cost +
                        1 +
                        (training === "distant"
                          ? counters + 2
                          : training === "prepared"
                            ? 10 + 2 * (counters + 1)
                            : 0),
                    },
                    () => woodlandSquirrels,
                  ),
                  ...(training === "distant"
                    ? Array.from({ length: counters + 2 }, () => reposition)
                    : []),
                ],
                "material-deck": successor ? [next] : [],
              },
            },
            playerTwo: {
              champion,
              zones: {
                "main-deck": Array.from({ length: 12 }, () => woodlandSquirrels),
                field: [
                  card,
                  ...(training === "unit-damage"
                    ? Array.from({ length: counters }, () => giantTortoise)
                    : []),
                ],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const source = p.card(card),
            opposing = q.card(card),
            hero = p.card(champion);
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          if (["animal-attacks", "unit-damage", "weapon-attacks"].includes(training)) {
            p.declareAttack(ferventBeastmaster, q.card(champion));
            game.resolveCombatWithoutRetaliation();
            passEffectsStack(game);
            expect(game.state.objects[source.objectId]!.counters["named:training"] ?? 0).toBe(0);
          }
          const makeDistant = (objectId: GrandArchiveObjectId) => {
            p.activate(p.cards(reposition, { zone: "hand" })[0]!, {
              targets: { "target-1": [objectId] },
              reservePayment: pay(1),
            });
            passEffectsStack(game);
          };
          if (training === "distant") {
            makeDistant(p.card(ferventBeastmaster).objectId);
            expect(game.state.objects[source.objectId]!.counters["named:training"] ?? 0).toBe(0);
          }
          if (training === "prepared") {
            for (const contract of p.cards(acceptedContract, { zone: "hand" })) {
              p.activate(contract, { reservePayment: pay(5) });
              passEffectsStack(game);
            }
            expect(game.state.objects[hero.objectId]!.counters.preparation).toBe(6);
            p.activate(p.cards(soultraceTessellation, { zone: "hand" })[0]!, {
              reservePayment: pay(2),
              targets: { "target-unit": [hero.objectId] },
            });
            passEffectsStack(game);
            expect(game.state.objects[source.objectId]!.counters["named:training"] ?? 0).toBe(0);
          }
          for (const [index, trainer] of p
            .cards(trainingCard, { zone: training === "prepared" ? "hand" : "field" })
            .entries()) {
            expect(game.state.objects[source.objectId]!.counters["named:training"] ?? 0).toBe(
              index,
            );
            if (training === "weapon-attacks") {
              if (index > 0) {
                advanceToMain(game, q.id);
                advanceToMain(game, p.id);
              }
              p.declareAttack(hero, q.card(champion), { weaponIds: [trainer.objectId] });
              game.resolveCombatWithoutRetaliation();
              passEffectsStack(game);
            } else if (training === "prepared") {
              p.activate(trainer, {
                reservePayment: pay(2),
                targets: { "target-unit": [hero.objectId] },
                prepareAbilityIndexes: [0],
              });
              passEffectsStack(game);
              expect(game.state.objects[hero.objectId]!.counters.preparation).toBe(5 - index);
            } else if (training === "recovery") {
              p.activateAbility(trainer, "qtb31x97n2-a2");
              passEffectsStack(game);
            } else if (training === "distant") {
              makeDistant(trainer.objectId);
            } else if (training === "empower") {
              p.activateAbility(trainer, "sq0ou8vas3-a2");
              passEffectsStack(game);
            } else {
              p.declareAttack(
                trainer,
                training === "unit-damage"
                  ? q.cards(giantTortoise, { zone: "field" })[index]!
                  : q.card(champion),
              );
              game.resolveCombatWithoutRetaliation();
              passEffectsStack(game);
            }
            expect(game.state.objects[source.objectId]!.counters["named:training"]).toBe(index + 1);
            expect(game.state.objects[opposing.objectId]!.counters["named:training"] ?? 0).toBe(0);
          }
          if (training === "distant") {
            makeDistant(p.cards(trainingCard, { zone: "field" })[0]!.objectId);
            expect(game.state.objects[source.objectId]!.counters["named:training"]).toBe(counters);
          }
          const memoryBefore = p.zone("memory").length;
          if (!matching || counters < threshold) {
            const before = game.state;
            expect(() =>
              p.activateAbility(source, abilityId, { reservePayment: pay(cost) }),
            ).toThrow();
            expect(game.state).toEqual(before);
            return;
          }
          const before = game.state;
          expect(() =>
            p.activateAbility(source, abilityId, { reservePayment: pay(cost - 1) }),
          ).toThrow();
          expect(game.state).toEqual(before);
          p.activateAbility(source, abilityId, { reservePayment: pay(cost) });
          expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
          expect(p.zone("memory")).toHaveLength(memoryBefore + cost);
          expect(game.state.objects[hero.objectId]!.activeDefinitionId).toBeUndefined();
          const paid = game.state;
          expect(() => p.activateAbility(source, abilityId, { reservePayment: pay(0) })).toThrow();
          expect(game.state).toEqual(paid);
          passEffectsStack(game);
          expect(game.state.objects[hero.objectId]!.activeDefinitionId).toBe(
            successor ? next.canonicalId : undefined,
          );
          expect(p.zone("memory")).toHaveLength(memoryBefore + cost);
          expect(p.zone("banishment")).toHaveLength(0);
          expect(game.state.objects[q.card(champion).objectId]!.activeDefinitionId).toBeUndefined();
          expect(
            game.state.eventHistory.filter((e) => e.type === "champion-leveled-up"),
          ).toHaveLength(successor ? 1 : 0);
        });
}
