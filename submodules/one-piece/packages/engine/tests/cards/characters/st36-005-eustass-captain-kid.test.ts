import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST36-005 Kid", () => {
  test.each([0, 2])("Main turns edge%s face up and gives DON only to Leader", (edge) => {
    let e = OnePieceTestEngine.create({
      character: ["ST36-005"],
      restedDon: 2,
      life: ["ST21-005", "ST21-006", "ST21-008"],
    });
    const k = e.findCardInZone("south", "character", "ST36-005");
    const chosen = e.findCardInZone("south", "life", edge === 0 ? "ST21-005" : "ST21-008");
    e.activateEffect(k, "activateMain");
    e.asSouth().acceptOptional();
    const p = e.pendingDecision("effectCostTurnLifeFaceUp", "south").steps[0];
    if (p?.kind !== "payCost") throw Error("orientation");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([
      e.findCardInZone("south", "life", "ST21-005"),
      e.findCardInZone("south", "life", "ST21-008"),
    ]);
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    e.resolveDecision("effectCostTurnLifeFaceUp", { selectedIds: [chosen] }, "south");
    e.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    expect(e.getView("north").players.south.life[edge]?.cardId).toBe(
      edge === 0 ? "ST21-005" : "ST21-008",
    );
    expect(e.getView("south").players.south.leader.attachedDon).toBe(1);
    expect(e.getView("south").players.south.characters[0]?.attachedDon).toBe(0);
    expect(
      e.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: k,
        trigger: "activateMain",
      }).reason,
    ).toBe("This effect has already been used this turn.");
  });
  test("opponent attack turns an edge face down and can redirect to active Kid Character", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST02-001",
        character: ["ST36-005", "ST21-005"],
        life: [{ cardId: "ST21-005", faceUp: true, publicKnowledge: true }, "ST21-006"],
      },
      { character: [{ cardId: "ST21-006", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.findCardInZone("north", "character", "ST21-006"), e.leader("south"));
    e.asSouth().acceptOptional();
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("redirect");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([
      e.leader("south"),
      e.findCardInZone("south", "character", "ST36-005"),
    ]);
    e.asSouth().chooseTargets(e.findCardInZone("south", "character", "ST36-005"));
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
    expect(e.getView("north").players.south.life[0]?.cardId).toBeNull();
  });
  test("Main prepares face-up Life for the following opponent-turn redirection", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST02-001", character: ["ST36-005"], restedDon: 1, life: ["ST21-005"] },
      { character: [{ cardId: "ST21-006", playedOnTurn: 0 }] },
    );
    e.activateEffect(e.findCardInZone("south", "character", "ST36-005"), "activateMain");
    e.asSouth().acceptOptional();
    e.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    e.asSouth().endTurn();
    e.asNorth().attack(e.findCardInZone("north", "character", "ST21-006"), e.leader("south"));
    e.asSouth().acceptOptional();
    e.asSouth().chooseTargets(e.findCardInZone("south", "character", "ST36-005"));
    expect(e.getView("south").players.south.lifeCount).toBe(1);
    expect(e.getView("north").players.south.life[0]?.cardId).toBeNull();
  });
  test("declines optional Main orientation cost", () => {
    const e = OnePieceTestEngine.create({
      character: ["ST36-005"],
      restedDon: 1,
      life: ["ST21-005"],
    });
    e.activateEffect(e.findCardInZone("south", "character", "ST36-005"), "activateMain");
    e.asSouth().declineOptional();
    expect(e.getView("north").players.south.life[0]?.cardId).toBeNull();
    expect(e.getView("south").players.south.restedDon).toBe(1);
  });
  test("declines optional attack redirection and keeps face-up Life", () => {
    const e = OnePieceTestEngine.create(
      {
        character: ["ST36-005"],
        life: [{ cardId: "ST21-005", faceUp: true, publicKnowledge: true }, "ST21-006"],
      },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.hand[0]?.cardId).toBe("ST21-005");
    expect(e.getView("south").players.south.lifeCount).toBe(1);
  });
  test("already face-up edges cannot pay Main using face-down middle", () => {
    const e = OnePieceTestEngine.create({
      character: ["ST36-005"],
      restedDon: 1,
      life: [
        { cardId: "ST21-005", faceUp: true },
        "ST21-006",
        { cardId: "ST21-008", faceUp: true },
      ],
    });
    expect(
      e.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: e.findCardInZone("south", "character", "ST36-005"),
        trigger: "activateMain",
      }).reason,
    ).toBeTruthy();
    expect(e.getView("south").players.south.restedDon).toBe(1);
  });
  test("opponent-attack OPT does not offer a second redirect while another edge can pay", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST02-001",
        character: ["ST36-005"],
        life: [
          { cardId: "ST21-005", faceUp: true, publicKnowledge: true },
          { cardId: "ST21-006", faceUp: true, publicKnowledge: true },
        ],
      },
      { character: [{ cardId: "ST21-006", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.findCardInZone("north", "character", "ST21-006"), e.leader("south"));
    e.asSouth().acceptOptional();
    e.resolveDecision(
      "effectCostTurnLifeFaceUp",
      { selectedIds: [e.findCardInZone("south", "life", "ST21-005")] },
      "south",
    );
    e.asSouth().chooseTargets(e.findCardInZone("south", "character", "ST36-005"));
    expect(e.getView("north").players.south.life[1]?.cardId).toBe("ST21-006");
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    expect(e.getView("south").players.south.lifeCount).toBe(1);
    expect(e.getView("north").players.south.life[0]?.cardId).toBe("ST21-006");
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
