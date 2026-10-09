import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deflectingAdvantage } from "./deflecting-advantage.ts";
import { singeingLeap } from "../../PTM/actions/singeing-leap.ts";
import { demolition } from "../../HVN/actions/demolition.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers 40TLLuE6oG-a1 */
describe("Deflecting Advantage", () => {
  for (const initialDamage of [0, 2, 3, 5, 6])
    it(`shields against opposing sources using ${initialDamage} damage counters`, () => {
      const champion = enableAllTestElements(lineageTestChampion("Other", 0));
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [
              deflectingAdvantage,
              ...Array.from({ length: initialDamage + 1 }, () => singeingLeap),
              ...Array.from({ length: initialDamage + 2 }, () => woodlandSquirrels),
            ],
          },
        },
        playerTwo: {
          champion,
          zones: {
            hand: [demolition, demolition, ...Array.from({ length: 6 }, () => woodlandSquirrels)],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        target = p.card(champion);
      const selfDamage = () => {
        p.activate(p.cards(singeingLeap, { zone: "hand" })[0]!, {
          reservePayment: [
            { kind: "card", cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
          ],
        });
        passEffectsStack(game);
      };
      for (let i = 0; i < initialDamage; i++) selfDamage();
      expect(game.state.objects[target.objectId]!.damage).toBe(initialDamage);
      p.activate(deflectingAdvantage, {
        reservePayment: [
          { kind: "card", cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
        ],
        targets: { "target-unit": [target.objectId] },
      });
      passEffectsStack(game);
      selfDamage();
      expect(game.state.objects[target.objectId]!.damage).toBe(initialDamage + 1);
      for (let hit = 1; hit <= 2; hit++) {
        const wait = game.waitState();
        if (wait.kind === "opportunity" && wait.playerId === p.id) p.pass();
        q.activate(q.cards(demolition, { zone: "hand" })[0]!, {
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 3)
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
          targets: { "target-1": [target.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.damage).toBe(
          initialDamage + 1 + 3 * hit - Math.floor(initialDamage / 3),
        );
      }
    });
});
