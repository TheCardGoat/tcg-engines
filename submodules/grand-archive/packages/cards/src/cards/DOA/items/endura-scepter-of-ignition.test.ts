import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { enduraScepterOfIgnition } from "./endura-scepter-of-ignition.ts";
import { jewelOfEnlightenment } from "./jewel-of-enlightenment.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers SGsDKB9CN5-a1 */
describe("Endura's slow-speed counter payment", () => {
  for (const opponentTurn of [false, true])
    for (const ally of [false, true])
      it(`opponent turn=${opponentTurn}, ally target=${ally}`, () => {
        const champion = createClassBonusTestChampion(
          enduraScepterOfIgnition,
          false,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: opponentTurn ? "playerTwo" : "playerOne",
          playerOne: {
            champion,
            zones: {
              field: [
                enduraScepterOfIgnition,
                jewelOfEnlightenment,
                jewelOfEnlightenment,
                giantTortoise,
              ],
            },
          },
          playerTwo: {
            champion,
            zones: { field: [giantTortoise], "main-deck": [woodlandSquirrels] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(enduraScepterOfIgnition),
          target = q.card(ally ? giantTortoise : champion),
          hero = p.card(champion);
        if (opponentTurn) q.pass();
        const missing = game.state;
        expect(() =>
          p.activateAbility(source, "SGsDKB9CN5-a1", {
            targets: { "target-1": [target.objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(missing);
        for (const jewel of p.cards(jewelOfEnlightenment, { zone: "field" })) {
          p.activateAbility(jewel, "AKA19OwaCh-a1");
          passEffectsStack(game);
          if (opponentTurn) q.pass();
        }
        expect(game.state.objects[hero.objectId]!.counters.enlighten).toBe(2);
        const before = game.state;
        if (opponentTurn) {
          expect(() =>
            p.activateAbility(source, "SGsDKB9CN5-a1", {
              targets: { "target-1": [target.objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          return;
        }
        expect(() =>
          p.activateAbility(source, "SGsDKB9CN5-a1", {
            targets: { "target-1": [source.objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activateAbility(source, "SGsDKB9CN5-a1", { targets: { "target-1": [target.objectId] } });
        expect(game.state.objects[hero.objectId]!.counters.enlighten).toBe(1);
        expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
        expect(game.state.objects[target.objectId]!.damage).toBe(0);
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.damage).toBe(1);
        expect(game.state.objects[p.card(giantTortoise).objectId]!.damage).toBe(0);
        const rested = game.state;
        expect(() =>
          p.activateAbility(source, "SGsDKB9CN5-a1", {
            targets: { "target-1": [target.objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(rested);
      });
});
