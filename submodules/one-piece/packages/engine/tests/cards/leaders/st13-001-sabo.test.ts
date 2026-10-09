import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST13-001 Sabo", () => {
  test("pays a current-power qualifying Character into face-up Life and buffs another through the opponent turn", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST13-001",
        activeDon: 2,
        character: ["ST03-003", "ST02-013", "ST02-002"],
        deck: 10,
      },
      { deck: 10 },
    );
    const paid = e.findCardInZone("south", "character", "ST03-003"),
      recipient = e.findCardInZone("south", "character", "ST02-002");
    const base = e
      .getView("south")
      .players.south.characters.find((c) => c?.instanceId === recipient)?.power;
    e.attachDon(e.leader("south"), 1);
    e.attachDon(paid, 1);
    e.asSouth().activateMain(e.leader("south"));
    e.asSouth().acceptOptional();
    const p = e.pendingDecision("effectCostAddCharacterToLife", "south").steps[0];
    if (p?.kind !== "payCost") throw Error("Life cost");
    expect(p.candidates.map((c) => c.ref.id)).toContain(paid);
    expect(p.candidates.map((c) => c.ref.id)).not.toContain(recipient);
    e.resolveDecision("effectCostAddCharacterToLife", { selectedIds: [paid] }, "south");
    e.asSouth().chooseTargets(recipient);
    expect(e.getView("north").players.south.life[0]).toMatchObject({
      instanceId: paid,
      cardId: "ST03-003",
    });
    expect(e.getView("south").players.south.characters.some((c) => c?.instanceId === paid)).toBe(
      false,
    );
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === recipient)?.power,
    ).toBe((base ?? 0) + 2000);
    e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: e.leader("south"),
      trigger: "activateMain",
    });
    e.asSouth().endTurn();
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === recipient)?.power,
    ).toBe((base ?? 0) + 2000);
    e.asNorth().endTurn();
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === recipient)?.power,
    ).toBe(base);
  });
  test("declines Character payment without changing Life or power", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST13-001",
      activeDon: 1,
      character: ["ST02-013"],
    });
    e.attachDon(e.leader("south"), 1);
    const before = e.getView("south").players.south.lifeCount;
    e.asSouth().activateMain(e.leader("south"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.lifeCount).toBe(before);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(7000);
    e.asSouth().activateMain(e.leader("south"));
    e.asSouth().declineOptional();
  });
  test("cannot activate without the Leader DON or with only low-power payment", () => {
    const noDon = OnePieceTestEngine.create({ leaderCardId: "ST13-001", character: ["ST02-013"] });
    noDon.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: noDon.leader("south"),
      trigger: "activateMain",
    });
    const low = OnePieceTestEngine.create({
      leaderCardId: "ST13-001",
      activeDon: 1,
      character: ["ST03-003"],
    });
    low.attachDon(low.leader("south"), 1);
    low.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: low.leader("south"),
      trigger: "activateMain",
    });
    expect(low.getView("south").players.south.characters.filter(Boolean)).toHaveLength(1);
  });
  test("a cost-two Character cannot pay even after DON raises its power to 7000", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST13-001",
      activeDon: 4,
      character: ["ST03-006"],
    });
    e.attachDon(e.leader("south"), 1);
    const card = e.findCardInZone("south", "character", "ST03-006");
    e.attachDon(card, 3);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(7000);
    e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: e.leader("south"),
      trigger: "activateMain",
    });
    expect(e.getView("south").players.south.characters[0]?.instanceId).toBe(card);
  });
});
