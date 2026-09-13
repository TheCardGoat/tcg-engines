import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { arcaneDisposition } from "./arcane-disposition.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { smokeBombs } from "../items/smoke-bombs.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers blq7qXGvWH-a1 @covers blq7qXGvWH-a2 */
describe("Arcane Disposition's draw and next-end discard", () => {
  for (const classBonus of [false, true])
    it(`draws ${classBonus ? 3 : 2}, then discards the current hand only once`, () => {
      const champion = createClassBonusTestChampion(
        arcaneDisposition,
        classBonus,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [arcaneDisposition, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            field: [smokeBombs, woodlandSquirrels],
            "main-deck": Array.from({ length: 7 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: { hand: [woodlandSquirrels], "main-deck": [woodlandSquirrels, woodlandSquirrels] },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      p.activate(arcaneDisposition, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      });
      passEffectsStack(game);
      expect(p.zone("hand")).toHaveLength(classBonus ? 3 : 2);
      p.activate(p.cards(woodlandSquirrels, { zone: "hand" })[0]!);
      passEffectsStack(game);
      p.activateAbility(smokeBombs, "ScGcOmkoQt-a1", {
        targets: { "target-1": [p.cards(woodlandSquirrels, { zone: "field" })[0]!.objectId] },
      });
      passEffectsStack(game);
      const discarded = p.zone("hand");
      expect(discarded).toHaveLength(classBonus ? 3 : 2);
      advanceToMain(game, q.id);
      expect(p.zone("hand")).toHaveLength(0);
      expect(
        p
          .cards(woodlandSquirrels, { zone: "graveyard" })
          .map((c) => c.objectId)
          .sort(),
      ).toEqual(discarded.map((c) => c.objectId).sort());
      expect(q.zone("hand")).toHaveLength(2);
      advanceToMain(game, p.id);
      const retained = p.zone("hand");
      expect(retained.length).toBeGreaterThan(0);
      advanceToMain(game, q.id);
      expect(p.zone("hand")).toEqual(retained);
    });
});
