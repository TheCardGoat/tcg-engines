import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { recklessConversion } from "./reckless-conversion.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers gJ2dsgywEs-a1 @covers gJ2dsgywEs-a2 */
describe("Reckless Conversion's random memory banishment", () => {
  for (const classBonus of [false, true])
    for (const memoryCount of [0, 2, 5])
      it(`class=${classBonus}, starting memory=${memoryCount}`, () => {
        const champion = createClassBonusTestChampion(
          recklessConversion,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [recklessConversion],
              memory: Array.from({ length: memoryCount }, () => woodlandSquirrels),
              "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: { memory: [woodlandSquirrels], hand: [woodlandSquirrels] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          available = [...p.zone("memory"), ...p.zone("main-deck").slice(0, 2)].map(
            (c) => c.objectId,
          ),
          tail = p.zone("main-deck")[2]!;
        p.activate(recklessConversion);
        passEffectsStack(game);
        expect(game.state.decision).toBeNull();
        const banished = p.zone("banishment"),
          remaining = Math.max(0, memoryCount - 2);
        expect(banished).toHaveLength(Math.min(4, memoryCount + 2));
        for (const c of banished) expect(available).toContain(c.objectId);
        expect(p.zone("main-deck")).toEqual([tail]);
        expect(p.zone("hand")).toHaveLength(classBonus ? remaining : 0);
        expect(p.zone("memory")).toHaveLength(classBonus ? 0 : remaining);
        expect(
          [...banished, ...p.zone("hand"), ...p.zone("memory")].map((c) => c.objectId).sort(),
        ).toEqual(available.sort());
        expect(q.zone("memory")).toHaveLength(1);
        expect(q.zone("hand")).toHaveLength(1);
        expect(p.cards(recklessConversion, { zone: "graveyard" })).toHaveLength(1);
      });
});
