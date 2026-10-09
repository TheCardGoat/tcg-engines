import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";
describe("OP17-094 Rodo", () => {
  test("FAQ: costs1 to play from hand then has13cost under Elbaph Leader", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP17-079", hand: ["OP17-094"], activeDon: 1 },
      {},
    );
    e.playCard("OP17-094");
    expect(e.getView("south").players.south.activeDon).toBe(0);
    expect(e.getView("south").players.south.characters[0]?.cost).toBe(13);
  });
  test("wrong Leader leaves its field cost1", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP01-001", hand: ["OP17-094"], activeDon: 1 },
      {},
    );
    e.playCard("OP17-094");
    expect(e.getView("south").players.south.activeDon).toBe(0);
    expect(e.getView("south").players.south.characters[0]?.cost).toBe(1);
  });
  test("FAQ: cost1 in trash is eligible for Luffy's cost2 play, then becomes13", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP17-079", hand: ["OP17-093"], trash: ["OP17-094"], activeDon: 10 },
      {},
    );
    const id = e.findCardInZone("south", "trash", "OP17-094");
    e.playCard("OP17-093");
    e.resolveDecision("effectPlaySelection", { selectedIds: [id] }, "south");
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === id)?.cost,
    ).toBe(13);
    expect(e.getView("south").players.south.trash).toHaveLength(0);
  });
});
