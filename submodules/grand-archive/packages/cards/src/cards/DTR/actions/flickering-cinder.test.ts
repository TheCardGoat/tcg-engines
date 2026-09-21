import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { flickeringCinder } from "./flickering-cinder.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers fqxo9o8yeq-a1 */
describe("Flickering Cinder — damage then controller's champion becomes distant", () => {
  for (const own of [false, true])
    for (const ally of [false, true])
      it(`hits ${own ? "own" : "opposing"} ${ally ? "ally" : "champion"}`, () => {
        const champion = createClassBonusTestChampion(
          flickeringCinder,
          false,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [flickeringCinder, woodlandSquirrels],
              field: [woodlandSquirrels, trainingSword],
              "main-deck": [woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: { field: [woodlandSquirrels], "main-deck": [woodlandSquirrels] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          owner = own ? p : q;
        const target = owner.card(ally ? woodlandSquirrels : champion, { zone: "field" });
        const hero = p.card(champion),
          foe = q.card(champion);
        const payment = [
          { kind: "card" as const, cardId: p.card(woodlandSquirrels, { zone: "hand" }).objectId },
        ];
        const before = game.state;
        expect(() =>
          p.activate(flickeringCinder, {
            targets: { "target-1": [p.card(trainingSword).objectId] },
            reservePayment: payment,
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        expect(() =>
          p.activate(flickeringCinder, { targets: { "target-1": [target.objectId] } }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activate(flickeringCinder, {
          targets: { "target-1": [target.objectId] },
          reservePayment: payment,
        });
        expect(game.state.objects[target.objectId]!.damage).toBe(0);
        expect(game.state.objects[hero.objectId]!.states.has("distant")).toBe(false);
        passEffectsStack(game);
        if (ally) expect(game.state.objects[target.objectId]!.zone).toBe("graveyard");
        else expect(game.state.objects[target.objectId]!.damage).toBe(1);
        expect(game.state.objects[hero.objectId]!.states.has("distant")).toBe(true);
        expect(game.state.objects[foe.objectId]!.states.has("distant")).toBe(false);
        advanceToMain(game, q.id);
        expect(game.state.objects[hero.objectId]!.states.has("distant")).toBe(false);
      });
});
