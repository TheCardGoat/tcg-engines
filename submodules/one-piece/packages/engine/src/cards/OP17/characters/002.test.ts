import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";
describe("OP17-002 Atmos", () => {
  test("opponent-turn power applies to a real battle and expires on own turn", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-002", rested: true }] },
      { character: [{ cardId: "OP17-006", playedOnTurn: 0 }] },
    );
    const atmos = e.findCardInZone("south", "character", "OP17-002");
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === atmos)?.power,
    ).toBe(6000);
    e.endTurn("south");
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === atmos)?.power,
    ).toBe(9000);
    e.declareAttack(e.findCardInZone("north", "character", "OP17-006"), atmos, "north");
    expect(e.getView("south").players.south.characters.some((c) => c?.instanceId === atmos)).toBe(
      true,
    );
    e.endTurn("north");
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === atmos)?.power,
    ).toBe(6000);
  });
});
