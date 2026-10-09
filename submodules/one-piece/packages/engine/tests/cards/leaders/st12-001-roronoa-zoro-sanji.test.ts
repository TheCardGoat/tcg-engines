import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST12-001 Roronoa Zoro & Sanji", () => {
  test("returns cost-two Character before reactivating at live power7000, excludes8000", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST12-001",
        character: [
          "ST12-015",
          "ST12-009",
          { cardId: "ST12-008", rested: true, attachedDon: 1 },
          { cardId: "ST09-005", rested: true, attachedDon: 1 },
        ],
        activeDon: 1,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const paid = e.findCardInZone("south", "character", "ST12-015"),
      zoro = e.findCardInZone("south", "character", "ST12-008");
    e.attachDon(e.leader("south"), 1);
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asSouth().acceptOptional();
    const cost = e.pendingDecision("effectCostReturnCharacter", "south").steps[0];
    if (cost?.kind !== "payCost") throw Error("cost");
    expect(cost.candidates.map((c) => c.ref.id)).not.toContain(
      e.findCardInZone("south", "character", "ST12-009"),
    );
    e.resolveDecision("effectCostReturnCharacter", { selectedIds: [paid] }, "south");
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("active");
    expect(p.candidates.map((c) => c.ref.id)).toContain(zoro);
    expect(p.candidates.map((c) => c.ref.id)).not.toContain(
      e.findCardInZone("south", "character", "ST09-005"),
    );
    e.asSouth().chooseTargets(zoro);
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(paid);
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === zoro)?.rested,
    ).toBe(false);
  });
  test("declines optional return payment", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST12-001", character: [{ cardId: "ST12-015", rested: true }], activeDon: 1 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.attachDon(e.leader("south"), 1);
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.handCount).toBe(0);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
  });
  test("without DON the attack does not offer return payment", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST12-001", character: [{ cardId: "ST12-015", rested: true }] },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
  });

  test("once-per-turn return effect stays spent after real Event readies the Leader", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST12-001",
        character: ["OP02-050", "OP02-059", "OP02-053", "OP02-065", "OP02-064"],
        hand: ["OP02-063", "OP16-038"],
        activeDon: 10,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const paid = e.findCardInZone("south", "character", "OP02-050");
    e.attachDon(e.leader("south"), 1);
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asSouth().acceptOptional();
    e.resolveDecision("effectCostReturnCharacter", { selectedIds: [paid] }, "south");
    e.asSouth().chooseNoTargets();
    e.playCard("OP02-063");
    e.playCard("OP16-038");
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.leader.rested).toBe(false);
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(5);
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual([paid]);
    expect(e.getView("north").players.north.lifeCount).toBe(2);
  });
});
