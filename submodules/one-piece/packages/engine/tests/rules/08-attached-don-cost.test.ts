import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

// ST28-004 distinguishes the cost area from the DON!! deck (rules 3-9, 8-3-1).
test("returns selected attached DON to the rested cost area without a DON-deck reaction", () => {
  let e = OnePieceTestEngine.create({
    character: ["ST28-004", "ST10-011"],
    activeDon: 6,
    restedDon: 1,
    donDeckCount: 3,
  });
  const momo = e.findCardInZone("south", "character", "ST28-004");
  const heat = e.findCardInZone("south", "character", "ST10-011");
  const leader = e.asSouth().leader();
  e.asSouth().attachDon(leader, 1);
  e.asSouth().attachDon(heat, 2);
  e.asSouth().activateMain(momo);
  e.asSouth().acceptOptional();
  const decision = e.pendingDecision("effectCostReturnDon", "south");
  const step = decision.steps[0];
  if (step?.kind !== "payCost") throw Error("Expected DON payment");
  expect(step).toMatchObject({ min: 2, max: 2 });
  expect(step.candidates.map((c) => c.ref.id)).toEqual([
    `attached-don:${leader}:0`,
    `attached-don:${heat}:0`,
    `attached-don:${heat}:1`,
  ]);
  const prompt = e.getView("south").prompts[0];
  expect(prompt?.label).toContain("cost area rested");
  e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
  e.resolveDecision(
    "effectCostReturnDon",
    { selectedIds: [`attached-don:${leader}:0`, `attached-don:${heat}:1`] },
    "south",
  );
  const view = e.getView("south");
  expect(view.players.south).toMatchObject({ activeDon: 3, restedDon: 3, donDeckCount: 3 });
  expect(view.players.south.leader.attachedDon).toBe(0);
  expect(view.players.south.characters[1]).toMatchObject({ attachedDon: 1, power: 5000 });
  expect(view.players.south.characters[0]?.power).toBe(8000);
  expect(view.prompts).toHaveLength(0);
});

test("an exact attached pool pays automatically without touching active or rested DON", () => {
  const e = OnePieceTestEngine.create({
    character: ["ST28-004"],
    activeDon: 4,
    restedDon: 2,
    donDeckCount: 4,
  });
  const momo = e.findCardInZone("south", "character", "ST28-004");
  e.asSouth().attachDon(momo, 2);
  e.asSouth().activateMain(momo);
  e.asSouth().acceptOptional();
  const view = e.getView("south");
  expect(view.players.south).toMatchObject({ activeDon: 2, restedDon: 4, donDeckCount: 4 });
  expect(view.players.south.characters[0]).toMatchObject({ attachedDon: 0, power: 8000 });
  expect(view.prompts).toHaveLength(0);
});

test("rejects foreign, cost-area, duplicate and wrong-count payments without consuming DON", () => {
  let e = OnePieceTestEngine.create(
    { character: ["ST28-004", { cardId: "ST10-011", attachedDon: 2 }], activeDon: 2 },
    { character: [{ cardId: "ST02-002", attachedDon: 2 }] },
  );
  const momo = e.findCardInZone("south", "character", "ST28-004");
  const heat = e.findCardInZone("south", "character", "ST10-011");
  const foreign = e.findCardInZone("north", "character", "ST02-002");
  e.asSouth().attachDon(momo, 1);
  e.asSouth().activateMain(momo);
  e.asSouth().acceptOptional();
  const decision = e.pendingDecision("effectCostReturnDon", "south");
  const valid = `attached-don:${heat}:0`;
  const before = e.getView("south");
  for (const selectedIds of [
    [valid],
    [valid, valid],
    [valid, `attached-don:${foreign}:0`],
    [valid, "active-don:0"],
    [valid, `attached-don:${heat}:1`, `attached-don:${momo}:0`],
  ]) {
    const failure = e.expectFailure({
      type: "resolvePrompt",
      seat: "south",
      promptId: decision.id,
      selectedIds,
    });
    e = OnePieceTestEngine.fromState(failure.state);
    expect(e.getView("south").players).toEqual(before.players);
    expect(e.pendingDecision("effectCostReturnDon", "south").id).toBe(decision.id);
  }
  e.resolveDecision(
    "effectCostReturnDon",
    { selectedIds: [valid, `attached-don:${momo}:0`] },
    "south",
  );
  expect(e.getView("south").players.south.restedDon).toBe(before.players.south.restedDon + 2);
});

test("saved payment candidates are rechecked against the live attached pool", () => {
  const e = OnePieceTestEngine.create({
    character: ["ST28-004", { cardId: "ST10-011", attachedDon: 2 }],
    activeDon: 1,
  });
  const momo = e.findCardInZone("south", "character", "ST28-004");
  const heat = e.findCardInZone("south", "character", "ST10-011");
  e.asSouth().attachDon(momo, 1);
  e.asSouth().activateMain(momo);
  e.asSouth().acceptOptional();
  const decision = e.pendingDecision("effectCostReturnDon", "south");
  // Saved-state validation contract: preserve the prompt while its resource pool changes.
  const saved = structuredClone(e.getState());
  saved.cards[heat]!.attachedDon -= 1;
  saved.players.south.restedDon += 1;
  let restored = OnePieceTestEngine.fromState(saved);
  const before = restored.getView("south").players.south;
  const failure = restored.expectFailure({
    type: "resolvePrompt",
    seat: "south",
    promptId: decision.id,
    selectedIds: [`attached-don:${heat}:1`, `attached-don:${momo}:0`],
  });
  restored = OnePieceTestEngine.fromState(failure.state);
  expect(restored.getView("south").players.south).toEqual(before);
  restored.resolveDecision(
    "effectCostReturnDon",
    { selectedIds: [`attached-don:${heat}:0`, `attached-don:${momo}:0`] },
    "south",
  );
  expect(restored.getView("south").players.south.restedDon).toBe(before.restedDon + 2);
  expect(restored.getView("south").players.south.donDeckCount).toBe(before.donDeckCount);
});
