import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-016 Rakuyo", () => {
  test.each([0, 1, 2])("On Play K.O.s %i eligible Characters using base power", (count) => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-016"], activeDon: 3 },
      { character: ["ST01-006", "OP01-019", "ST01-003"], activeDon: 2 },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const eligible = [
      e.findCardInZone("north", "character", "ST01-006"),
      e.findCardInZone("north", "character", "OP01-019"),
    ];
    e.asNorth().attachDon(eligible[1]!, 2);
    e.endTurn("north");
    expect(
      e.getView("south").players.north.characters.find((c) => c?.instanceId === eligible[1])?.power,
    ).toBe(5000);
    e.playCard("OP17-016");
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step.kind !== "selectEntity") throw new Error("Expected K.O. selection");
    expect(step.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual(eligible);
    e.asSouth().chooseTargets(...eligible.slice(0, count));
    expect(e.getView("south").players.north.trash.map((c) => c.instanceId)).toEqual(
      eligible.slice(0, count),
    );
    expect(e.getView("south").players.north.characters.filter(Boolean)).toHaveLength(3 - count);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
