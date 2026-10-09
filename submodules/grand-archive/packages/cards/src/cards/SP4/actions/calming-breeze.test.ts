import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { calmingBreeze } from "./calming-breeze.ts";
import { cosmicBolt } from "./cosmic-bolt.ts";
import { demolition } from "../../HVN/actions/demolition.ts";
import { pyroclasticFlow } from "../../MRC/actions/pyroclastic-flow.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers XgJ72Ot13P-a1 */
describe("Calming Breeze", () => {
  for (const expired of [false, true])
    it(`prevents repeated damage up to three, expired=${expired}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(calmingBreeze, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [giantTortoise],
            hand: [
              calmingBreeze,
              cosmicBolt,
              demolition,
              demolition,
              pyroclasticFlow,
              ...Array.from({ length: 15 }, () => woodlandSquirrels),
            ],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] } },
      });
      const p = game.player("player-one"),
        target = p.card(champion);
      const pay = (count: number) =>
        p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, count)
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
      p.activate(calmingBreeze, { reservePayment: pay(2) });
      passEffectsStack(game);
      if (expired) advanceToMain(game, p.id, game.state.turn.number);
      p.activate(cosmicBolt, {
        reservePayment: pay(3),
        targets: { "target-1": [target.objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[target.objectId]!.damage).toBe(4);
      for (let hit = 1; hit <= 2; hit++) {
        p.activate(p.cards(demolition, { zone: "hand" })[0]!, {
          reservePayment: pay(3),
          targets: { "target-1": [target.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.damage).toBe(expired ? 4 + 3 * hit : 4);
      }
      p.activate(pyroclasticFlow, { reservePayment: pay(4) });
      passEffectsStack(game);
      expect(game.state.objects[target.objectId]!.damage).toBe(expired ? 12 : 4);
      expect(game.state.objects[p.card(giantTortoise).objectId]!.damage).toBe(2);
    });
});

import { proveLevelFloatingMemory } from "../../../testing/level-floating-memory.ts";
/** @covers XgJ72Ot13P-a2 */
describe("calmingBreeze — level Floating Memory", () => {
  proveLevelFloatingMemory(calmingBreeze, 1);
});
