import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { luridDreaming } from "./lurid-dreaming.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

function reachEnd(game: GrandArchiveTestEngine): void {
  for (let step = 0; game.state.turn.phase !== "end" && step < 32; step++) {
    const wait = game.waitState();
    if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
    game.player(wait.playerId).pass();
  }
  expect(game.state.turn.phase).toBe("end");
}

/**
 * @covers ps8unuy20m-a1
 * @covers ps8unuy20m-a2
 */
describe("Lurid Dreaming — wake during the opponent's end phase", () => {
  for (const rested of [false, true])
    for (const hasDeck of [false, true])
      it(`rested=${rested}, card available=${hasDeck}`, () => {
        const champion = createClassBonusTestChampion(luridDreaming, false, "activation-discount");
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [trainingSword],
              hand: [luridDreaming, woodlandSquirrels, woodlandSquirrels],
              "main-deck": hasDeck ? [woodlandSquirrels] : [],
            },
          },
          playerTwo: {
            champion,
            zones: { field: [trainingSword], "main-deck": [woodlandSquirrels, woodlandSquirrels] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const hero = p.card(champion),
          other = q.card(champion);
        const payment = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const reject = () => {
          const before = game.state;
          expect(() => p.activate(luridDreaming, { reservePayment: payment })).toThrow();
          expect(game.state).toEqual(before);
        };
        reject();
        if (rested) {
          p.declareAttack(hero, other, { weaponIds: [p.card(trainingSword).objectId] });
          game.resolveCombatWithoutRetaliation();
        }
        reachEnd(game);
        reject();
        advanceToMain(game, q.id);
        q.declareAttack(other, hero, { weaponIds: [q.card(trainingSword).objectId] });
        game.resolveCombatWithoutRetaliation();
        q.pass();
        reject();
        reachEnd(game);
        const wait = game.waitState();
        if (wait.kind === "opportunity" && wait.playerId === q.id) q.pass();
        expect(game.state.turn.playerId).toBe(q.id);
        expect(game.state.turn.phase).toBe("end");
        const before = game.state;
        expect(() => p.activate(luridDreaming, { reservePayment: payment.slice(0, 1) })).toThrow();
        expect(game.state).toEqual(before);
        const top = p.zone("main-deck")[0];
        const opposingMemory = q.zone("memory").map((c) => c.objectId);
        p.activate(luridDreaming, { reservePayment: payment });
        expect(p.zone("memory")).toHaveLength(2);
        expect(p.zone("hand")).toHaveLength(0);
        expect(game.state.objects[hero.objectId]!.states.has("rested")).toBe(rested);
        if (top) expect(game.state.objects[top.objectId]!.zone).toBe("main-deck");
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]!.states.has("rested")).toBe(false);
        expect(game.state.objects[other.objectId]!.states.has("rested")).toBe(true);
        expect(p.zone("memory")).toHaveLength(2 + Number(rested && hasDeck));
        expect(p.zone("hand")).toHaveLength(0);
        if (top)
          expect(game.state.objects[top.objectId]!.zone).toBe(rested ? "memory" : "main-deck");
        expect(q.zone("memory").map((c) => c.objectId)).toEqual(opposingMemory);
        expect(p.cards(luridDreaming, { zone: "graveyard" })).toHaveLength(1);
      });
});
