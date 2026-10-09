import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P-086 Trafalgar Law", () => {
  test("pays DON -3 and bottoms a 3000 Character to play a cost 4 Heart Pirate", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "P-086",
      activeDon: 3,
      character: ["EB01-005"],
      hand: ["P-038", "ST01-008", "ST02-009"],
    });
    const paid = e.findCardInZone("south", "character", "EB01-005"),
      played = e.findCardInZone("south", "hand", "P-038");
    e.asSouth().activateMain(e.leader("south"));
    e.asSouth().acceptOptional();
    const p = e.pendingDecision("effectPlaySelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("play");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([played]);
    e.resolveDecision("effectPlaySelection", { selectedIds: [played] }, "south");
    e.asSouth().declineOptional();
    expect(e.findCardInZone("south", "deck", "EB01-005")).toBe(paid);
    expect(e.findCardInZone("south", "character", "P-038")).toBe(played);
    expect(e.getView("south").players.south.activeDon).toBe(0);
  });
  test("declines optional compound payment with both costs payable", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "P-086",
      activeDon: 3,
      character: ["EB01-005"],
      hand: ["P-038"],
    });
    const id = e.findCardInZone("south", "character", "EB01-005");
    e.asSouth().activateMain(e.leader("south"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.activeDon).toBe(3);
    expect(e.findCardInZone("south", "character", "EB01-005")).toBe(id);
    expect(e.getView("south").players.south.handCount).toBe(1);
  });
  test("cannot pay without a 3000-power Character even with enough DON", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "P-086",
      activeDon: 3,
      character: ["P-108"],
      hand: ["P-038"],
    });
    const result = e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: e.leader("south"),
      trigger: "activateMain",
    });
    const after = OnePieceTestEngine.fromState(result.state).getView("south");
    expect(after.players.south.activeDon).toBe(3);
    expect(after.players.south.characters[0]?.power).toBe(2000);
    expect(after.players.south.handCount).toBe(1);
  });
  test("current power qualifies after DON payment and attached DON returns rested on bottom-deck cost", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "P-086",
      activeDon: 3,
      character: [{ cardId: "P-108", attachedDon: 1 }],
      hand: ["P-038"],
    });
    const paid = e.findCardInZone("south", "character", "P-108");
    e.asSouth().activateMain(e.leader("south"));
    e.asSouth().acceptOptional();
    e.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: ["active-don:0", "active-don:1", "active-don:2"] },
      "south",
    );
    e.resolveDecision("effectPlaySelection", { selectedIds: [] }, "south");
    expect(e.findCardInZone("south", "deck", "P-108")).toBe(paid);
    expect(e.getView("south").players.south).toMatchObject({ activeDon: 0, restedDon: 1 });
  });
  test("saves the paid DON prefix before choosing between two Characters and retains payable OPT", () => {
    let e = OnePieceTestEngine.create({
      leaderCardId: "P-086",
      activeDon: 6,
      character: ["EB01-005", "ST02-012"],
      hand: ["P-038"],
    });
    const first = e.findCardInZone("south", "character", "EB01-005"),
      second = e.findCardInZone("south", "character", "ST02-012");
    e.asSouth().activateMain(e.leader("south"));
    e.asSouth().acceptOptional();
    const decision = e.pendingDecision("effectCostReturnCharacterToDeck", "south"),
      step = decision.steps[0];
    if (step?.kind !== "payCost") throw Error("Character payment");
    expect(step.candidates.map((c) => c.ref.id).sort()).toEqual([first, second].sort());
    expect(e.getView("south").players.south.activeDon).toBe(3);
    const failed = e.expectFailure({
      type: "resolvePrompt",
      seat: "south",
      promptId: decision.id,
      selectedIds: [e.leader("south")],
    });
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(failed.state)));
    expect(e.getView("south").players.south.activeDon).toBe(3);
    expect(e.pendingDecision("effectCostReturnCharacterToDeck", "south").id).toBe(decision.id);
    e.resolveDecision("effectCostReturnCharacterToDeck", { selectedIds: [first] }, "south");
    e.resolveDecision("effectPlaySelection", { selectedIds: [] }, "south");
    expect(e.getState().players.south.deck.at(-1)).toBe(first);
    expect(e.findCardInZone("south", "character", "ST02-012")).toBe(second);
    const retry = e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: e.leader("south"),
      trigger: "activateMain",
    });
    expect(OnePieceTestEngine.fromState(retry.state).getView("south").players.south.activeDon).toBe(
      3,
    );
  });
  test("returning an attached DON removes that Character from the later power-cost candidates", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "P-086",
      activeDon: 3,
      character: [{ cardId: "P-108", attachedDon: 1 }, "EB01-005", "ST02-012"],
      hand: ["P-038"],
    });
    const weak = e.findCardInZone("south", "character", "P-108"),
      first = e.findCardInZone("south", "character", "EB01-005"),
      second = e.findCardInZone("south", "character", "ST02-012");
    e.asSouth().activateMain(e.leader("south"));
    e.asSouth().acceptOptional();
    e.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: ["active-don:0", "active-don:1", `attached-don:${weak}:0`] },
      "south",
    );
    const step = e.pendingDecision("effectCostReturnCharacterToDeck", "south").steps[0];
    if (step?.kind !== "payCost") throw Error("Character payment");
    expect(step.candidates.map((c) => c.ref.id).sort()).toEqual([first, second].sort());
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === weak)?.power,
    ).toBe(2000);
    e.resolveDecision("effectCostReturnCharacterToDeck", { selectedIds: [second] }, "south");
    e.resolveDecision("effectPlaySelection", { selectedIds: [] }, "south");
    expect(e.getState().players.south.deck.at(-1)).toBe(second);
    expect(e.getView("south").players.south.activeDon).toBe(1);
  });
  test("losing the only power-qualified Character retains paid DON and consumes OPT without playing", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "P-086",
      activeDon: 8,
      character: [{ cardId: "P-108", attachedDon: 1 }],
      hand: ["P-038", "EB01-005"],
    });
    const weak = e.findCardInZone("south", "character", "P-108"),
      hand = e.findCardInZone("south", "hand", "P-038");
    e.asSouth().activateMain(e.leader("south"));
    e.asSouth().acceptOptional();
    e.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: ["active-don:0", "active-don:1", `attached-don:${weak}:0`] },
      "south",
    );
    expect(e.getView("south").players.south.activeDon).toBe(6);
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.findCardInZone("south", "hand", "P-038")).toBe(hand);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(2000);
    e.asSouth().play("EB01-005");
    expect(e.getView("south").players.south.activeDon).toBe(5);
    const failed = e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: e.leader("south"),
      trigger: "activateMain",
    });
    const after = OnePieceTestEngine.fromState(failed.state).getView("south");
    expect(after.players.south.activeDon).toBe(5);
    expect(after.players.south.handCount).toBe(1);
    expect(after.players.south.characters.find((c) => c?.cardId === "EB01-005")?.power).toBe(3000);
  });
});
