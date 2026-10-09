import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P-147", () => {
  test.each(["south", "north"] as const)("cost-eight on %s field grants power", (seat) => {
    const e = OnePieceTestEngine.create(
      { character: ["P-147", ...(seat === "south" ? ["OP16-003"] : [])] },
      { character: seat === "north" ? ["OP16-003"] : [] },
    );
    e.endTurn("south");
    expect(
      e.getView("south").players.south.characters.find((c) => c?.cardId === "P-147")?.power,
    ).toBe(5000);
  });
  test("On K.O. can recover itself and excludes unrelated trash", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "P-147", rested: true }], trash: ["EB01-005"] },
      { character: ["OP16-003"] },
      { activeSeat: "north" },
    );
    const id = e.findCardInZone("south", "character", "P-147");
    e.asNorth().attack("OP16-003", id);
    const s = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (s.kind !== "selectEntity") throw Error("target");
    expect(s.candidates.map((c) => c.ref.id)).toEqual([id]);
    e.resolveDecision("effectTargetSelection", { selectedIds: [id] }, "south");
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual([id]);
  });
  test("cost-zero gate switches the continuous power bonus on", () => {
    const e = OnePieceTestEngine.create(
      { character: ["P-147"], hand: ["OP02-106"], activeDon: 1 },
      { character: ["EB01-005"] },
    );
    expect(e.getView("south").players.south.characters[0]?.power).toBe(3000);
    e.playCard("OP02-106");
    e.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [e.findCardInZone("north", "character", "EB01-005")] },
      "south",
    );
    expect(e.getView("south").players.south.characters[0]?.power).toBe(5000);
    e.endTurn("south");
    expect(e.getView("south").players.south.characters[0]?.power).toBe(3000);
  });
});
