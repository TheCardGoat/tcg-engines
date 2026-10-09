import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

test.each([
  [1, 1],
  [2, 1],
  [1, 0],
])("Galdino gives independently chosen rested DON %s/%s", (a, b) => {
  let e = OnePieceTestEngine.create({
    character: ["ST30-014", "ST02-006", "ST02-006"],
    restedDon: a + b,
    activeDon: 3,
  });
  const source = e.findCardInZone("south", "character", "ST30-014");
  const ids = e
    .getView("south")
    .players.south.characters.slice(1, 3)
    .map((c) => c!.instanceId!);
  e.asSouth().activateMain(source);
  e.asSouth().acceptOptional();
  e.asSouth().chooseTargets(...ids);
  e.resolveDecision("effectGiveDonEachCount", { optionId: String(a) }, "south");
  e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
  e.resolveDecision("effectGiveDonEachCount", { optionId: String(b) }, "south");
  expect(
    e
      .getView("south")
      .players.south.characters.slice(1, 3)
      .map((c) => c?.attachedDon),
  ).toEqual([a, b]);
  expect(e.getView("south").players.south.restedDon).toBe(0);
  expect(e.getView("south").players.south.activeDon).toBe(3);
});

test("Rosinante self-trash replacement returns attached DON to rested cost area", () => {
  const e = OnePieceTestEngine.create(
    {
      character: [
        { cardId: "ST02-006", rested: true },
        { cardId: "OP05-030", attachedDon: 2 },
      ],
    },
    { character: [{ cardId: "ST15-002", playedOnTurn: 0 }] },
    { activeSeat: "north", firstPlayer: "south" },
  );
  const target = e.findCardInZone("south", "character", "ST02-006");
  e.asNorth().attack(e.findCardInZone("north", "character", "ST15-002"), target);
  e.asSouth().chooseBlocker();
  e.resolveDecision("battleKoReplacement", { optionId: "yes" }, "south");
  expect(e.getView("south").players.south.characters[0]?.instanceId).toBe(target);
  expect(e.getView("south").players.south.restedDon).toBe(2);
  expect(
    e.getView("south").players.south.trash.find((c) => c.cardId === "OP05-030")?.attachedDon,
  ).toBe(0);
});

test("Galdino allocations reject invalid values and changed pools without partial movement", () => {
  const e = OnePieceTestEngine.create({
    character: ["ST30-014", "ST02-006", "ST02-006"],
    restedDon: 3,
  });
  const source = e.findCardInZone("south", "character", "ST30-014");
  const ids = e
    .getView("south")
    .players.south.characters.slice(1, 3)
    .map((c) => c!.instanceId!);
  e.asSouth().activateMain(source);
  e.asSouth().acceptOptional();
  e.asSouth().chooseTargets(...ids);
  e.resolveDecision("effectGiveDonEachCount", { optionId: "2" }, "south");
  expect(e.getView("south").players.south.characters[1]?.attachedDon).toBe(0);
  const decision = e.pendingDecision("effectGiveDonEachCount", "south");
  for (const optionId of ["2", "-1", "1.5", "01"]) {
    const result = e.expectFailure({
      type: "resolvePrompt",
      seat: "south",
      promptId: decision.id,
      optionId,
    });
    expect(result.state.players.south.restedDon).toBe(3);
    expect(ids.map((id) => result.state.cards[id]!.attachedDon)).toEqual([0, 0]);
  }
  const saved = structuredClone(e.getState());
  saved.players.south.restedDon = 1;
  const restored = OnePieceTestEngine.fromState(saved);
  const failed = restored.expectFailure({
    type: "resolvePrompt",
    seat: "south",
    promptId: decision.id,
    optionId: "0",
  });
  expect(failed.state.players.south.restedDon).toBe(1);
  expect(ids.map((id) => failed.state.cards[id]!.attachedDon)).toEqual([0, 0]);
  const moved = structuredClone(e.getState());
  moved.cards[ids[0]!]!.zoneChangeCounter++;
  const stale = OnePieceTestEngine.fromState(moved).expectFailure({
    type: "resolvePrompt",
    seat: "south",
    promptId: decision.id,
    optionId: "1",
  });
  expect(ids.map((id) => stale.state.cards[id]!.attachedDon)).toEqual([0, 0]);
  e.resolveDecision("effectGiveDonEachCount", { optionId: "1" }, "south");
  expect(
    e
      .getView("south")
      .players.south.characters.slice(1, 3)
      .map((c) => c?.attachedDon),
  ).toEqual([2, 1]);
});

test("Galdino emits a separate Garp reaction for each DON after all allocations finish", () => {
  const e = OnePieceTestEngine.create(
    { leaderCardId: "OP02-002", character: ["ST30-014", "ST02-006", "ST02-006"], restedDon: 2 },
    { character: ["OP01-067"] },
  );
  const ids = e
    .getView("south")
    .players.south.characters.slice(1, 3)
    .map((c) => c!.instanceId!);
  e.asSouth().activateMain(e.findCardInZone("south", "character", "ST30-014"));
  e.asSouth().acceptOptional();
  e.asSouth().chooseTargets(...ids);
  e.resolveDecision("effectGiveDonEachCount", { optionId: "1" }, "south");
  expect(e.getView("south").prompts).toHaveLength(1);
  e.resolveDecision("effectGiveDonEachCount", { optionId: "1" }, "south");
  const order = e.pendingDecision("readyEffectOrder", "south").steps[0];
  if (order?.kind !== "chooseOption") throw Error("Garp order");
  expect(order.options).toHaveLength(2);
  e.resolveDecision("readyEffectOrder", { optionId: order.options[0]!.id }, "south");
  const target = e.findCardInZone("north", "character", "OP01-067");
  e.asSouth().chooseTargets(target);
  e.asSouth().chooseTargets(target);
  expect(e.getView("north").players.north.characters[0]?.cost).toBe(5);
});
