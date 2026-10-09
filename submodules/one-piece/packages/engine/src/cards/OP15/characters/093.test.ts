import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-093 The Risky Brothers", () => {
  test("self-trash is paid but fourteen cards in trash do not grant either effect", () => {
    let e = OnePieceTestEngine.create(
      {
        leaderCardId: "OP05-001",
        character: ["OP15-093"],
        hand: ["OP16-095"],
        trash: Array.from({ length: 13 }, () => "OP13-013"),
        activeDon: 2,
      },
      { leaderCardId: "ST01-001", character: [{ cardId: "EB01-005", rested: true }] },
    );
    e.asSouth().play("OP16-095");
    e.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    const source = e.findCardInZone("south", "character", "OP15-093");
    const luffy = e.findCardInZone("south", "character", "OP16-095");
    e.asSouth().activateMain(source);
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.trash).toHaveLength(14);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(source);
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === luffy)?.attribute,
    ).not.toContain("slash");
    expect(e.getView("south").prompts).toHaveLength(0);
    const failed = e.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: luffy,
      targetId: e.findCardInZone("north", "character", "EB01-005"),
    });
    e = OnePieceTestEngine.fromState(failed.state);
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === luffy)?.rested,
    ).toBe(false);
  });
});
