import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST29-013 Lucci", () => {
  test("Trigger total uses both current Life counts after damage", () => {
    const e = OnePieceTestEngine.create(
      { life: 1, character: ["ST29-002", "ST29-003"] },
      { life: ["ST29-013", "ST02-002", "ST02-006"] },
      { activeSeat: "south", firstPlayer: "north" },
    );
    const low = e.findCardInZone("south", "character", "ST29-002");
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().activateLifeTrigger();
    const p = e.pendingDecision("effectTargetSelection", "north").steps[0];
    if (p?.kind !== "selectEntity") throw Error("target");
    expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([low]);
    e.asNorth().chooseTargets(low);
    expect(e.getView("north").players.south.trash.map((c) => c.instanceId)).toContain(low);
    expect(e.getView("north").players.south.characters.some((c) => c?.cardId === "ST29-003")).toBe(
      true,
    );
  });
  test("declines optional Trigger KO with legal candidate", () => {
    const e = OnePieceTestEngine.create(
      { life: 1, character: ["ST01-006"] },
      { life: ["ST29-013", "ST02-002"] },
      { activeSeat: "south", firstPlayer: "north" },
    );
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().activateLifeTrigger();
    e.asNorth().chooseTargets();
    expect(e.getView("north").players.south.characters[0]?.cardId).toBe("ST01-006");
  });
});
