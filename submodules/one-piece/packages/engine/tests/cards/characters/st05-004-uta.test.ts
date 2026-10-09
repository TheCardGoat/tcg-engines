import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

import { st04King004 } from "@tcg/op-cards";
describe("ST05-004 Uta", () => {
  test("pays On Block DON to rest only an opposing Character with cost 5 or less", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST05-004"], activeDon: 1, restedDon: 1 },
      { character: [{ card: st04King004, playedOnTurn: 0 }, "ST05-006"] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const uta = e.findCardInZone("south", "character", "ST05-004");
    const low = e.findCardInZone("north", "character", "ST05-006");
    const life = e.getView("south").players.south.lifeCount;
    e.asNorth().attack(e.findCardInZone("north", "character", "ST04-004"), e.leader("south"));
    e.asSouth().chooseBlocker(uta);

    e.asSouth().acceptOptional();
    e.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw Error("rest");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([low]);
    e.asSouth().chooseTargets(low);

    expect(
      e.getView("north").players.north.characters.find((c) => c?.instanceId === low)?.rested,
    ).toBe(true);
    expect(e.getView("south").players.south.activeDon).toBe(0);
    expect(e.getView("south").players.south.lifeCount).toBe(life);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(uta);
  });
  test("declines On Block payment and leaves the opposing Character active", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST05-004"], activeDon: 1, restedDon: 1 },
      { character: [{ card: st04King004, playedOnTurn: 0 }, "ST05-006"] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const uta = e.findCardInZone("south", "character", "ST05-004");
    const low = e.findCardInZone("north", "character", "ST05-006");
    const life = e.getView("south").players.south.lifeCount;
    e.asNorth().attack(e.findCardInZone("north", "character", "ST04-004"), e.leader("south"));
    e.asSouth().chooseBlocker(uta);
    e.asSouth().declineOptional();
    expect(
      e.getView("north").players.north.characters.find((c) => c?.instanceId === low)?.rested,
    ).toBe(false);
    expect(e.getView("south").players.south.activeDon).toBe(1);
    expect(e.getView("south").players.south.lifeCount).toBe(life);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(uta);
  });
});
