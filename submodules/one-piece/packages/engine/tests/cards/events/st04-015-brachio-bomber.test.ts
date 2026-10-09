import { st04King004 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST04-015 Brachio Bomber", () => {
  test.each([true, false])("KO cost6 or less (selection=%s) then adds active DON", (select) => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST04-015"], activeDon: 6 },
      { character: ["ST04-004", "ST04-003"] },
    );
    const target = e.findCardInZone("north", "character", "ST04-004");
    e.asSouth().play("ST04-015");
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw Error("KO");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([target]);
    e.resolveDecision("effectTargetSelection", { selectedIds: select ? [target] : [] }, "south");
    e.asSouth().chooseAddDon(1);
    expect(e.getView("north").players.north.trash).toHaveLength(select ? 1 : 0);
    expect(e.getView("south").players.south.activeDon).toBe(1);
  });
  test("Life Trigger adds DON without the Main KO", () => {
    const e = OnePieceTestEngine.create(
      { life: ["ST04-015"] },
      { character: [{ card: st04King004, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attacker = e.findCardInZone("north", "character", "ST04-004");
    e.asNorth().attack(attacker, e.leader("south"));
    e.asSouth().activateLifeTrigger();
    e.asSouth().chooseAddDon(1);
    expect(e.getView("south").players.south.activeDon).toBe(1);
    expect(e.getView("north").players.north.characters.map((c) => c?.instanceId)).toContain(
      attacker,
    );
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
