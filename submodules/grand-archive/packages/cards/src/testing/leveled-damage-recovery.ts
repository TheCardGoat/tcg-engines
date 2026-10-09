import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import { burningAethercharge } from "../cards/PTM/actions/burning-aethercharge.ts";
import { imperialCountermeasure } from "../cards/RDO/actions/imperial-countermeasure.ts";
import { heightenSpellcraft } from "../cards/P24/actions/heighten-spellcraft.ts";

export function proveLeveledDamageRecovery(
  source: GrandArchiveCard<GrandArchiveAbilityDefinition, "card">,
  cost: number,
  recovery: "fixed-two" | "damage-dealt",
  preserveEmpowered: boolean,
) {
  for (const matching of [false, true])
    for (const level of [0, 1, 4, 5])
      for (const targetKind of [
        "own-champion",
        "own-ally",
        "opposing-champion",
        "opposing-ally",
      ] as const)
        for (const prevented of [false, true])
          for (const empowered of [false, true])
            for (const injured of [false, true])
              it(`class=${matching}, LV=${level}, target=${targetKind}, prevention=${prevented}, empower=${empowered}, injured=${injured}`, () => {
                const champion = enableAllTestElements(
                  grantTestChampionLevel(
                    createClassBonusTestChampion(source, matching, "activation-discount"),
                    level,
                  ),
                );
                const game = GrandArchiveTestEngine.startFixture({
                  playerOne: {
                    champion,
                    zones: {
                      hand: [
                        source,
                        burningAethercharge,
                        imperialCountermeasure,
                        heightenSpellcraft,
                        ...Array.from({ length: 12 }, () => woodlandSquirrels),
                      ],
                      field: [giantTortoise, trainingSword],
                      "main-deck": [woodlandSquirrels],
                    },
                  },
                  playerTwo: { champion, zones: { field: [giantTortoise] } },
                });
                const p = game.player("player-one"),
                  q = game.player("player-two");
                const hero = p.card(champion),
                  sourceRef = p.card(source, { zone: "hand" });
                const owner = targetKind.startsWith("own") ? p : q;
                const target = owner.card(
                  targetKind.endsWith("champion") ? champion : giantTortoise,
                );
                const pay = (amount: number) =>
                  p
                    .cards(woodlandSquirrels, { zone: "hand" })
                    .slice(0, amount)
                    .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
                if (injured) {
                  p.activate(burningAethercharge, {
                    reservePayment: pay(2),
                    targets: { "target-1": [hero.objectId] },
                  });
                  passEffectsStack(game);
                }
                if (prevented) {
                  p.activate(imperialCountermeasure, {
                    reservePayment: pay(1),
                    targets: { "target-1": [target.objectId] },
                  });
                  passEffectsStack(game);
                }
                if (empowered) {
                  p.activate(heightenSpellcraft, { reservePayment: pay(1) });
                  passEffectsStack(game);
                }
                const initialDamage = injured ? 2 : 0;
                expect(game.state.objects[hero.objectId]?.damage).toBe(initialDamage);
                const before = game.state;
                for (const targets of [
                  [],
                  [target.objectId, target.objectId],
                  [p.card(trainingSword).objectId],
                  [sourceRef.objectId],
                ]) {
                  expect(() =>
                    p.activate(sourceRef, {
                      reservePayment: pay(cost),
                      targets: { "target-1": targets },
                    }),
                  ).toThrow();
                  expect(game.state).toEqual(before);
                }
                p.activate(sourceRef, {
                  reservePayment: pay(cost),
                  targets: { "target-1": [target.objectId] },
                });
                expect(game.state.objects[hero.objectId]?.damage).toBe(initialDamage);
                passEffectsStack(game);
                const damage = Math.max(0, level + (empowered ? 3 : 0) - (prevented ? 4 : 0));
                const recovered = recovery === "fixed-two" ? 2 : damage;
                const selfDamage = target.objectId === hero.objectId ? damage : 0;
                expect(game.state.objects[hero.objectId]?.damage).toBe(
                  Math.max(0, initialDamage + selfDamage - recovered),
                );
                const damageEvents = game.state.eventHistory.filter(
                  (e) => e.type === "damage-marked" && e.sourceId === sourceRef.objectId,
                );
                expect(damageEvents).toHaveLength(damage > 0 ? 1 : 0);
                for (const e of damageEvents)
                  if (e.type === "damage-marked") {
                    expect(e.amount).toBe(damage);
                    expect(e.objectId).toBe(target.objectId);
                  }
                const preserved = preserveEmpowered && matching && empowered;
                expect(game.state.objects[sourceRef.objectId]?.zone).toBe(
                  preserved ? "material-deck" : "graveyard",
                );
                expect(game.state.objects[sourceRef.objectId]?.states.has("preserved")).toBe(
                  preserved,
                );
                expect(game.state.decision).toBeNull();
                expect(game.state.stack).toHaveLength(0);
                expect(game.state.winnerIds).toEqual([]);
              });
}
