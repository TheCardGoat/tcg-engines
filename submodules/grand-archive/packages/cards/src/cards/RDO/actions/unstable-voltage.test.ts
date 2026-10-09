import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { unstableVoltage } from "./unstable-voltage.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";

/** @covers hiN2g99FLF-a1 */
describe("Unstable Voltage rolls two independent six-sided dice on resolution", () => {
  for (const randomSeed of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    for (const own of [false, true])
      it(`seed=${randomSeed}, own target=${own}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(unstableVoltage, false, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          randomSeed,
          playerOne: {
            champion,
            zones: {
              field: [giantTortoise],
              hand: [unstableVoltage, woodlandSquirrels, woodlandSquirrels],
              graveyard: [giantTortoise],
            },
          },
          playerTwo: { champion, zones: { field: [giantTortoise] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const target = (own ? p : q).card(giantTortoise, { zone: "field" });
        const reservePayment = p
          .cards(woodlandSquirrels)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        for (const invalid of [q.card(champion), p.card(giantTortoise, { zone: "graveyard" })]) {
          const before = game.state;
          expect(() =>
            p.activate(unstableVoltage, {
              reservePayment,
              targets: { "target-1": [invalid.objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        const randomBefore = game.state.random;
        const activation = p.activate(unstableVoltage, {
          reservePayment,
          targets: { "target-1": [target.objectId] },
        });
        expect(game.state.random).toEqual(randomBefore);
        const events = [...activation.events];
        for (let i = 0; i < 8 && game.state.stack.length; i++) {
          const wait = game.waitState();
          if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
          events.push(...game.player(wait.playerId).pass().events);
        }
        expect(game.state.stack).toHaveLength(0);
        const rolls = events.flatMap((event) =>
          event.type === "random-state-changed" && event.result?.kind === "die-roll"
            ? [event.result]
            : [],
        );
        expect(rolls).toHaveLength(2);
        for (const roll of rolls) {
          expect(roll.sides).toBe(6);
          expect(roll.results).toHaveLength(1);
          expect(roll.total).toBe(roll.results[0]);
          expect(roll.total).toBeGreaterThanOrEqual(1);
          expect(roll.total).toBeLessThanOrEqual(6);
        }
        const damage = rolls.reduce((sum, roll) => sum + roll.total, 0);
        const hits = events.filter((event) => event.type === "damage-marked");
        expect(hits).toHaveLength(1);
        expect(hits[0]).toMatchObject({ objectId: target.objectId, amount: damage });
        expect(game.state.objects[target.objectId]!.zone).toBe(damage >= 6 ? "graveyard" : "field");
        expect(game.state.objects[target.objectId]!.damage).toBe(damage >= 6 ? 0 : damage);
        expect(
          game.state.objects[(own ? q : p).card(giantTortoise, { zone: "field" }).objectId]!.damage,
        ).toBe(0);
      });
});
