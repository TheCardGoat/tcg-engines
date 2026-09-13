import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { songOfNurturing } from "../actions/song-of-nurturing.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack, advanceToMain } from "../../../testing/decisions.ts";
import { proveHarmonyMelodyTrigger } from "../../../testing/harmony-melody-trigger.ts";
import { describe } from "vitest";
import { discordiaHarpOfMalice } from "./discordia-harp-of-malice.ts";

/** @covers 5LoOprBJay-a1 */
describe("Discordia, Harp of Malice \u2014 resolution", () => {
  proveHarmonyMelodyTrigger(discordiaHarpOfMalice, "music");
});

/** @covers 5LoOprBJay-a2 */
describe("Discordia's temporary level transfer and next-end banishment", () => {
  for (const count of [0, 2])
    for (const self of [false, true])
      it(`transfers ${count} levels from ${self ? "own" : "opposing"} champion`, () => {
        const champion = grantTestChampionLevel(
          createClassBonusTestChampion(discordiaHarpOfMalice, false, "activation-discount"),
          5,
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [discordiaHarpOfMalice],
              hand: [
                ...Array.from({ length: count }, () => songOfNurturing),
                ...Array.from({ length: count * 2 }, () => woodlandSquirrels),
              ],
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
          item = p.card(discordiaHarpOfMalice);
        const level = (player: typeof p) =>
          deriveGrandArchiveNumericProperty(
            game.state.objects[player.card(champion).objectId]!,
            "level",
            { program: game.program, state: game.state, controllerId: player.id, bindings: {} },
          );
        for (let n = 0; n < count; n++) {
          p.activate(p.cards(songOfNurturing, { zone: "hand" })[0]!, {
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 2)
              .map((c) => ({ kind: "card", cardId: c.objectId })),
          });
          passEffectsStack(game);
        }
        expect(game.state.objects[item.objectId]!.counters["named:music"] ?? 0).toBe(count);
        const before = game.state;
        expect(() =>
          p.activateAbility(item, "5LoOprBJay-a2", {
            targets: { "target-champion": [q.card(woodlandSquirrels).objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activateAbility(item, "5LoOprBJay-a2", {
          targets: { "target-champion": [(self ? p : q).card(champion).objectId] },
        });
        expect(game.state.objects[item.objectId]!.states.has("rested")).toBe(true);
        expect(level(p)).toBe(5);
        expect(level(q)).toBe(5);
        passEffectsStack(game);
        expect(level(p)).toBe(self ? 5 : 5 + count);
        expect(level(q)).toBe(self ? 5 : 5 - count);
        expect(() =>
          p.activateAbility(item, "5LoOprBJay-a2", {
            targets: { "target-champion": [q.card(champion).objectId] },
          }),
        ).toThrow();
        advanceToMain(game, q.id);
        expect(game.state.objects[item.objectId]!.zone).toBe("banishment");
        expect(level(p)).toBe(5);
        expect(level(q)).toBe(5);
      });
});
