import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { tactfulSergeant } from "./tactful-sergeant.ts";
import { woodlandSquirrels } from "./woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack, advanceToMain } from "../../../testing/decisions.ts";
/** @covers 7UXGwC7lSO-a1 */
describe("Tactful Sergeant's champion attack this turn", () => {
  for (const mode of ["champion", "ally", "prior-turn", "none"] as const)
    it(`draws into memory only after a current champion attack (${mode})`, () => {
      const champion = createClassBonusTestChampion(tactfulSergeant, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [tactfulSergeant, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
            field: [trainingSword, woodlandSquirrels],
            "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
          },
        },
        playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      if (mode !== "none") {
        p.declareAttack(
          p.card(mode === "ally" ? woodlandSquirrels : champion, { zone: "field" }),
          q.card(champion),
          { weaponIds: mode === "ally" ? [] : [p.card(trainingSword).objectId] },
        );
        game.resolveCombatWithoutRetaliation();
      }
      if (mode === "prior-turn") {
        advanceToMain(game, q.id);
        advanceToMain(game, p.id);
      }
      const top = p.zone("main-deck")[0]!,
        beforeHand = p.zone("hand").length;
      p.activate(tactfulSergeant, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 4)
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      });
      expect(p.zone("memory")).toHaveLength(4);
      passEffectsStack(game);
      expect(p.zone("memory")).toHaveLength(mode === "champion" ? 5 : 4);
      expect(game.state.objects[top.objectId]!.zone).toBe(
        mode === "champion" ? "memory" : "main-deck",
      );
      expect(p.zone("hand")).toHaveLength(beforeHand - 5);
      expect(q.zone("memory")).toHaveLength(0);
    });
});
