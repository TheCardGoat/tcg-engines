import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("p-045-roronoa-zoro", () => {
  test("Banish trashes damaged Trigger Life without activation", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", character: ["P-045"] },
      { leaderCardId: "ST01-001", life: ["P-042", "ST02-002"] },
    );
    const life = e.getState().players.north.life[0];
    e.asSouth().attack(e.findCardInZone("south", "character", "P-045"), e.leader("north"));
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(life);
    expect(e.getView("north").players.north.handCount).toBe(0);
    expect(e.getView("north").prompts).toHaveLength(0);
  });
  test("Banish does not prevent ordinary Life from the next attacker reaching hand", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", character: ["P-045"] },
      { leaderCardId: "ST01-001", life: ["ST02-002", "ST02-006", "ST02-012"] },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "P-045"), e.leader("north"));
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    expect(e.getView("north").players.north.handCount).toBe(1);
    expect(e.getView("north").players.north.lifeCount).toBe(1);
  });
});
