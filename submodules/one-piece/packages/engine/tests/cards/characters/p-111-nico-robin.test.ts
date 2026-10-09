import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("p-111-nico-robin", () => {
  test("rests one active DON to protect companion from KO then OPT rejects another despite payable DON", () => {
    let e = OnePieceTestEngine.create(
      { character: ["P-111", "P-015"], activeDon: 2 },
      { hand: ["ST01-015", "ST01-015", "ST01-015"], activeDon: 8 },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const id = e.findCardInZone("south", "character", "P-015");
    e.asNorth().play("ST01-015");
    e.asNorth().chooseTargets(id);
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    e.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");
    e.resolveDecision("effectMixedRestSelection", { selectedIds: ["active-don:south:0"] }, "south");
    expect(e.getView("south").players.south.activeDon).toBe(1);
    expect(e.getView("south").players.south.characters[1]?.instanceId).toBe(id);
    e.asNorth().play("ST01-015");
    e.asNorth().chooseTargets(id);
    expect(e.getView("south").players.south.trash.some((c) => c.instanceId === id)).toBe(true);
    expect(e.getView("south").players.south.activeDon).toBe(1);
    e.asNorth().endTurn();
    e.asSouth().endTurn();
    e.asNorth().play("ST01-015");
    const robin = e.findCardInZone("south", "character", "P-111");
    e.asNorth().chooseTargets(robin);
    e.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");
    e.resolveDecision("effectMixedRestSelection", { selectedIds: ["active-don:south:0"] }, "south");
    expect(e.getView("south").players.south.characters[0]?.instanceId).toBe(robin);
  });
  test("declines optional KO replacement then accepts later nonKO removal", () => {
    const e = OnePieceTestEngine.create(
      { character: ["P-111", "P-015", "P-012"], activeDon: 1 },
      { hand: ["ST01-015", "OP04-056"], activeDon: 10 },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().play("ST01-015");
    e.asNorth().chooseTargets(e.findCardInZone("south", "character", "P-015"));
    e.resolveDecision("effectKoReplacement", { optionId: "no" }, "south");
    expect(e.getView("south").players.south.activeDon).toBe(1);
    e.asNorth().play("OP04-056");
    const robin = e.findCardInZone("south", "character", "P-111");
    e.asNorth().chooseTargets(robin);
    e.resolveDecision("effectRemovalReplacement", { optionId: "yes" }, "south");
    e.resolveDecision("effectMixedRestSelection", { selectedIds: ["active-don:south:0"] }, "south");
    expect(e.getView("south").players.south.characters[0]?.instanceId).toBe(robin);
    expect(e.getView("south").players.south.restedDon).toBe(1);
  });
  test("wrong trait cannot be protected despite active DON", () => {
    const e = OnePieceTestEngine.create(
      { character: ["P-111", "P-012"], activeDon: 1 },
      { hand: ["ST01-015"], activeDon: 4 },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().play("ST01-015");
    e.asNorth().chooseTargets(e.findCardInZone("south", "character", "P-012"));
    expect(e.getView("south").players.south.trash[0]?.cardId).toBe("P-012");
    expect(e.getView("south").players.south.activeDon).toBe(1);
  });
  test("battle KO does not offer opponent-effect replacement", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "P-111", rested: true }], activeDon: 1 },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.leader("north"), e.findCardInZone("south", "character", "P-111"));
    expect(e.getView("south").players.south.trash[0]?.cardId).toBe("P-111");
    expect(e.getView("south").players.south.activeDon).toBe(1);
  });
  test("rested DON cannot pay for otherwise eligible self protection", () => {
    const e = OnePieceTestEngine.create(
      { character: ["P-111"], restedDon: 1 },
      { hand: ["ST01-015"], activeDon: 4 },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().play("ST01-015");
    e.asNorth().chooseTargets(e.findCardInZone("south", "character", "P-111"));
    expect(e.getView("south").players.south.trash[0]?.cardId).toBe("P-111");
    expect(e.getView("south").players.south.restedDon).toBe(1);
  });
});
