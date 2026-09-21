import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { undyingDreams } from "./undying-dreams.ts";
import { evercurrentRaider } from "../allies/evercurrent-raider.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers y5koddlyv8-a1 */
describe("Undying Dreams — temporary stats and lasting ephemeral buff", () => {
  for (const own of [false, true])
    for (const ephemeral of [false, true])
      it(`buffs ${own ? "own" : "opposing"} ally, ephemeral=${ephemeral}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(undyingDreams, false, "activation-discount"),
        );
        const allies = {
          field: ephemeral ? [] : [evercurrentRaider],
          graveyard: ephemeral ? [evercurrentRaider] : [],
        };
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: own ? "playerOne" : "playerTwo",
          playerOne: {
            champion,
            zones: {
              ...(own ? allies : {}),
              hand: [undyingDreams, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
              "main-deck": [woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              ...(own ? {} : allies),
              hand: [woodlandSquirrels, woodlandSquirrels],
              "main-deck": [woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          owner = own ? p : q,
          foe = own ? q : p;
        const target = owner.card(evercurrentRaider);
        if (ephemeral) {
          owner.activate(target, {
            activationMethod: "ephemerate",
            reservePayment: owner
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 2)
              .map((c) => ({ kind: "card", cardId: c.objectId })),
          });
          passEffectsStack(game);
        }
        const stat = (property: "life" | "power") =>
          deriveGrandArchiveNumericProperty(game.state.objects[target.objectId]!, property, {
            program: game.program,
            state: game.state,
            controllerId: owner.id,
            bindings: {},
          });
        if (!own) q.pass();
        const reservePayment = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const before = game.state;
        expect(() =>
          p.activate(undyingDreams, {
            targets: { "target-1": [q.card(champion).objectId] },
            reservePayment,
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activate(undyingDreams, { targets: { "target-1": [target.objectId] }, reservePayment });
        expect(stat("life")).toBe(2);
        expect(stat("power")).toBe(1);
        passEffectsStack(game);
        expect(stat("life")).toBe(ephemeral ? 4 : 3);
        expect(stat("power")).toBe(ephemeral ? 3 : 2);
        expect(game.state.objects[target.objectId]!.counters.buff ?? 0).toBe(ephemeral ? 1 : 0);
        owner.declareAttack(target, foe.card(champion));
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[foe.card(champion).objectId]!.damage).toBe(ephemeral ? 3 : 2);
        advanceToMain(game, foe.id);
        expect(stat("life")).toBe(ephemeral ? 3 : 2);
        expect(stat("power")).toBe(ephemeral ? 2 : 1);
        expect(game.state.objects[target.objectId]!.counters.buff ?? 0).toBe(ephemeral ? 1 : 0);
      });
});
