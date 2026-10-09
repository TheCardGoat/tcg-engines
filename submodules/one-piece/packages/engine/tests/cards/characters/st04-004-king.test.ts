import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST04-004", () => {
  test("pays DON to KO only an opposing Character with cost 4 or less", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST04-004"], activeDon: 6 + 1 },
      { character: ["ST04-013", "ST04-012", "EB01-018"] },
    );
    const low = e.findCardInZone("north", "character", "ST04-013");
    e.asSouth().play("ST04-004");

    e.asSouth().acceptOptional();
    e.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw Error("KO");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([
      low,
      e.findCardInZone("north", "character", "ST04-012"),
    ]);
    e.asSouth().chooseTargets(low);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(low);
    expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(2);
  });
  test("declines DON payment and leaves all opposing Characters in play", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST04-004"], activeDon: 6 + 1 },
      { character: ["ST04-013", "ST04-012", "EB01-018"] },
    );
    const low = e.findCardInZone("north", "character", "ST04-013");
    e.asSouth().play("ST04-004");

    e.asSouth().declineOptional();
    expect(e.getView("north").players.north.characters.map((c) => c?.instanceId)).toContain(low);
    expect(e.getView("south").players.south.activeDon).toBe(1);
    expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(3);
  });
});
