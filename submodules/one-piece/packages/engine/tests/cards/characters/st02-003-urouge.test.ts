import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST02-003 Urouge", () => {
  test.each([2, 3])(
    "requires three Characters including itself and one given DON: count %i",
    (count) => {
      const e = OnePieceTestEngine.create({
        character: ["ST02-003", ...Array.from({ length: count - 1 }, () => "ST02-002")],
        activeDon: 1,
      });
      const id = e.findCardInZone("south", "character", "ST02-003");
      expect(
        e.getView("south").players.south.characters.find((c) => c?.instanceId === id)?.power,
      ).toBe(3000);
      e.attachDon(id, 1, "south");
      expect(
        e.getView("south").players.south.characters.find((c) => c?.instanceId === id)?.power,
      ).toBe(count === 3 ? 6000 : 4000);
    },
  );
});
