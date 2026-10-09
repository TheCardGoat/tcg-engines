import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST20-001 Katakuri", () => {
  test.each(["leader", "character"])(
    "turns only top Life face up to give DON to %s once",
    (kind) => {
      const e = OnePieceTestEngine.create({
        character: ["ST20-001"],
        restedDon: 2,
        life: ["ST02-002", "ST02-012"],
      });
      const k = e.findCardInZone("south", "character", "ST20-001");
      e.asSouth().activateMain(k);
      e.asSouth().acceptOptional();
      e.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
      e.asSouth().chooseTargets(kind === "leader" ? e.leader("south") : k);
      expect(e.getView("north").players.south.life[0]?.cardId).toBe("ST02-002");
      expect(e.getView("north").players.south.life[1]?.cardId).toBeNull();
      expect(e.getView("south").players.south.restedDon).toBe(1);
      expect(
        kind === "leader"
          ? e.getView("south").players.south.leader.attachedDon
          : e.getView("south").players.south.characters[0]?.attachedDon,
      ).toBe(1);
      e.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: k,
        trigger: "activateMain",
      });
    },
  );
  test("face-up top cannot pay using face-down bottom", () => {
    const e = OnePieceTestEngine.create({
      character: ["ST20-001"],
      restedDon: 1,
      life: [{ cardId: "ST02-002", faceUp: true, publicKnowledge: true }, "ST02-012"],
    });
    e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: e.findCardInZone("south", "character", "ST20-001"),
      trigger: "activateMain",
    });
    expect(e.getView("south").players.south.restedDon).toBe(1);
    expect(e.getView("north").players.south.life[1]?.cardId).toBeNull();
  });
  test("declines optional face-up Life cost", () => {
    const e = OnePieceTestEngine.create({
      character: ["ST20-001"],
      restedDon: 1,
      life: ["ST02-002"],
    });
    e.asSouth().activateMain(e.findCardInZone("south", "character", "ST20-001"));
    e.asSouth().declineOptional();
    expect(e.getView("north").players.south.life[0]?.cardId).toBeNull();
    expect(e.getView("south").players.south.restedDon).toBe(1);
  });
  test("empty Life cannot pay", () => {
    const e = OnePieceTestEngine.create({ character: ["ST20-001"], restedDon: 1, life: 0 });
    e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: e.findCardInZone("south", "character", "ST20-001"),
      trigger: "activateMain",
    });
    expect(e.getView("south").players.south.restedDon).toBe(1);
  });
  test("Blocker intercepts and survives weaker attack", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST20-001"], life: 2 },
      { character: [{ cardId: "ST02-012", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const k = e.findCardInZone("south", "character", "ST20-001");
    e.asNorth().attack(e.findCardInZone("north", "character", "ST02-012"), e.leader("south"));
    e.asSouth().chooseBlocker(k);
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").players.south.characters[0]).toMatchObject({
      instanceId: k,
      rested: true,
    });
  });
  test("declines Blocker and takes Leader damage", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST20-001"], life: 2 },
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const c = e.findCardInZone("south", "character", "ST20-001");
    e.asNorth().attack(e.findCardInZone("north", "character", "ST02-006"), e.leader("south"));
    e.asSouth().chooseBlocker();
    expect(e.getView("south").players.south.lifeCount).toBe(1);
    expect(e.getView("south").players.south.characters[0]).toMatchObject({
      instanceId: c,
      rested: false,
    });
  });
});
