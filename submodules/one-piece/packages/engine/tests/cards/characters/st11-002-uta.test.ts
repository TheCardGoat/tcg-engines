import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST11-002 Uta", () => {
  test("at turn end trashes only an Event and readies a FILM Character", () => {
    const e = OnePieceTestEngine.create({
      character: [
        { cardId: "ST11-002", rested: true },
        { cardId: "ST05-002", rested: true },
        { cardId: "ST04-012", rested: true },
      ],
      hand: ["ST11-003", "ST11-004", "ST04-012"],
    });
    const event = e.findCardInZone("south", "hand", "ST11-003"),
      film = e.findCardInZone("south", "character", "ST05-002"),
      other = e.findCardInZone("south", "character", "ST04-012");
    e.asSouth().endTurn();
    e.asSouth().acceptOptional();
    const cost = e.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    if (cost?.kind !== "payCost") throw Error("cost");
    expect(cost.candidates.map((c) => c.ref.id)).not.toContain(
      e.findCardInZone("south", "hand", "ST04-012"),
    );
    e.resolveDecision("effectCostTrashFromHand", { selectedIds: [event] }, "south");
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("ready");
    expect(p.candidates.map((c) => c.ref.id)).toEqual(
      expect.arrayContaining([film, e.findCardInZone("south", "character", "ST11-002")]),
    );
    expect(p.candidates.map((c) => c.ref.id)).not.toContain(other);
    e.asSouth().chooseTargets(film);
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === film)?.rested,
    ).toBe(false);
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === other)?.rested,
    ).toBe(true);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(event);
  });
  test("declines the end-turn discard and leaves Uta rested", () => {
    const e = OnePieceTestEngine.create({
      character: [{ cardId: "ST11-002", rested: true }],
      hand: ["ST11-003"],
    });
    e.asSouth().endTurn();
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("south").players.south.trash).toHaveLength(0);
  });
  test("can ready itself and then block an opposing attack", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST11-002", rested: true }], hand: ["ST11-003"] },
      { character: [{ cardId: "ST04-012", playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const uta = e.findCardInZone("south", "character", "ST11-002");
    e.asSouth().endTurn();
    e.asSouth().acceptOptional();
    e.asSouth().chooseTargets(uta);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
    const life = e.getView("south").players.south.lifeCount;
    e.asNorth().attack(e.findCardInZone("north", "character", "ST04-012"), e.leader("south"));
    e.asSouth().chooseBlocker(uta);
    expect(e.getView("south").players.south.lifeCount).toBe(life);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(uta);
  });
  test("cannot pay with a Character when no Event is in hand", () => {
    const e = OnePieceTestEngine.create({
      character: [{ cardId: "ST11-002", rested: true }],
      hand: ["ST04-012"],
    });
    e.asSouth().endTurn();
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
  });
});
