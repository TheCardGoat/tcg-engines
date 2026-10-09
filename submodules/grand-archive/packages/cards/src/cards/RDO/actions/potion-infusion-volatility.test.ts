import { describe } from "vitest";
import { potionInfusionVolatility } from "./potion-infusion-volatility.ts";
import { proveNamedEfficiency } from "../../../testing/named-efficiency.ts";
/** @covers ndnEl5mq7W-a1 */
describe("Arisanna Bonus Efficiency", () =>
  proveNamedEfficiency(potionInfusionVolatility, "Arisanna", 7, true));

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../../ALC/items/potion-of-healing.ts";
import { potionInfusionClarity } from "../../ALC/actions/potion-infusion-clarity.ts";
/** @covers ndnEl5mq7W-a2 */
describe("Volatility — successful rest grants the Potion a temporary On Sacrifice die roll", () => {
  for (const named of [false, true])
    for (const own of [false, true])
      for (const mode of ["awake", "rested", "expired", "removed"] as const)
        for (const randomSeed of [1, 17, 42])
          it(`Arisanna=${named}, own Potion=${own}, mode=${mode}, seed=${randomSeed}`, () => {
            const champion = enableAllTestElements(
              lineageTestChampion(named ? "Arisanna" : "Other", 0),
            );
            const game = GrandArchiveTestEngine.startFixture({
              randomSeed,
              playerOne: {
                champion,
                zones: {
                  field: [potionOfHealing, woodlandSquirrels],
                  hand: [
                    potionInfusionVolatility,
                    potionInfusionClarity,
                    potionOfHealing,
                    ...Array.from({ length: 14 }, () => woodlandSquirrels),
                  ],
                  "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
                },
              },
              playerTwo: {
                champion,
                zones: {
                  field: [potionOfHealing],
                  "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
                },
              },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              owner = own ? p : q,
              target = owner.card(potionOfHealing, { zone: "field" }),
              hero = p.card(champion),
              foe = q.card(champion);
            const pay = () =>
              p
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, 7)
                .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
            if (mode === "rested") {
              p.activate(potionInfusionClarity, {
                targets: { "target-1": [target.objectId] },
                reservePayment: pay(),
              });
              passEffectsStack(game);
              expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(true);
            }
            const before = game.state;
            for (const invalid of [
              hero,
              p.card(woodlandSquirrels, { zone: "field" }),
              p.card(potionOfHealing, { zone: "hand" }),
            ]) {
              expect(() =>
                p.activate(potionInfusionVolatility, {
                  targets: { "target-1": [invalid.objectId] },
                  reservePayment: pay(),
                }),
              ).toThrow();
              expect(game.state).toEqual(before);
            }
            p.activate(potionInfusionVolatility, {
              targets: { "target-1": [target.objectId] },
              reservePayment: pay(),
            });
            if (mode !== "removed") {
              passEffectsStack(game);
              expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(true);
            }
            if (mode === "expired") advanceToMain(game, q.id);
            for (let i = 0; i < 4; i++) {
              const w = game.waitState();
              if (w.kind !== "opportunity") throw new Error(`Unexpected ${w.kind}`);
              if (w.playerId === owner.id) break;
              game.player(w.playerId).pass();
            }
            const randomBefore = game.state.random,
              start = game.state.eventHistory.length;
            owner.activateAbility(target, "qtb31x97n2-a2");
            expect(game.state.objects[target.objectId]!.zone).toBe("graveyard");
            passEffectsStack(game);
            const events = game.state.eventHistory.slice(start),
              rolls = events.flatMap((e) =>
                e.type === "random-state-changed" && e.result?.kind === "die-roll"
                  ? [e.result]
                  : [],
              );
            expect(rolls).toHaveLength(mode === "awake" ? 1 : 0);
            const damage = mode === "awake" ? 4 + rolls[0]!.total : 0;
            if (mode === "awake") {
              expect(rolls[0]!.sides).toBe(6);
              expect(damage).toBeGreaterThanOrEqual(5);
              expect(damage).toBeLessThanOrEqual(10);
            } else expect(game.state.random).toEqual(randomBefore);
            expect(game.state.objects[hero.objectId]!.damage).toBe(own ? 0 : damage);
            expect(game.state.objects[foe.objectId]!.damage).toBe(own ? damage : 0);
            expect(game.state.stack).toHaveLength(0);
            expect(game.state.decision).toBeNull();
          });
});
