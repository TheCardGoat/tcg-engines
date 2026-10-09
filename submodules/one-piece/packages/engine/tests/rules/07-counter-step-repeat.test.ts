import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

test("7-1-3-1: Counter, recover, reuse and pass remain separate saved decisions", () => {
  let e = OnePieceTestEngine.create(
    { leaderCardId: "ST01-001", character: [{ cardId: "EB01-018", playedOnTurn: 0 }] },
    {
      leaderCardId: "ST01-001",
      hand: ["OP02-098", "OP11-097", "EB01-005"],
      trash: Array(8).fill("EB01-005"),
      activeDon: 1,
    },
    { firstPlayer: "north", activeSeat: "south" },
  );
  const counter = e.findCardInZone("north", "hand", "OP02-098"),
    event = e.findCardInZone("north", "hand", "OP11-097"),
    spare = e.findCardInZone("north", "hand", "EB01-005");
  const life = e.getView("north").players.north.lifeCount;
  e.asSouth().attack(e.findCardInZone("south", "character", "EB01-018"), e.leader("north"));
  const first = e.pendingDecision("battleCounter", "north");
  const invalid = e.expectFailure({
    type: "resolvePrompt",
    seat: "north",
    promptId: first.id,
    selectedIds: [counter, event],
  });
  e = OnePieceTestEngine.fromState(invalid.state);
  e.asNorth().chooseCounter(counter);
  e.asNorth().chooseCounter(event);
  e.asNorth().chooseTargets(e.leader("north"));
  e.asNorth().chooseTargets(counter);
  e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
  const repeated = e.pendingDecision("battleCounter", "north");
  e.expectFailure({
    type: "resolvePrompt",
    seat: "south",
    promptId: repeated.id,
    selectedIds: [counter],
  });
  e.asNorth().chooseCounter(counter);
  expect(e.getView("north").players.north.hand.map((c) => c.instanceId)).toEqual([spare]);
  expect(e.pendingDecision("battleCounter", "north").steps[0]).toMatchObject({ min: 0, max: 1 });
  e.asNorth().chooseCounter();
  expect(e.getView("north").players.north.lifeCount).toBe(life);
  expect(e.getView("north").prompts).toHaveLength(0);
});

test("a Counter Event can draw a new Character Counter before damage", () => {
  const e = OnePieceTestEngine.create(
    { leaderCardId: "ST01-001", character: [{ cardId: "EB01-018", playedOnTurn: 0 }] },
    { leaderCardId: "ST01-001", hand: ["ST03-017"], deck: ["OP02-098", "EB01-005"], activeDon: 2 },
    { firstPlayer: "north", activeSeat: "south" },
  );
  e.asSouth().attack(e.findCardInZone("south", "character", "EB01-018"), e.leader("north"));
  e.asNorth().chooseCounter("ST03-017");
  e.asNorth().chooseTargets(e.leader("north"));
  const drawn = e.findCardInZone("north", "hand", "OP02-098");
  expect(e.pendingDecision("battleCounter", "north").steps[0]).toMatchObject({ max: 1 });
  e.asNorth().chooseCounter(drawn);
  expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(drawn);
  expect(e.getView("north").prompts).toHaveLength(0);
});

test("Counter Event affordability and payment use its current hand cost", () => {
  const e = OnePieceTestEngine.create(
    { leaderCardId: "ST01-001", character: ["OP01-067"], hand: ["ST03-017"], activeDon: 2 },
    { leaderCardId: "ST01-001" },
    { firstPlayer: "south", activeSeat: "south" },
  );
  e.asSouth().attachDon(e.findCardInZone("south", "character", "OP01-067"), 1);
  e.asSouth().endTurn();
  const life = e.getView("south").players.south.lifeCount;
  e.asNorth().attack(e.leader("north"), e.leader("south"));
  e.asSouth().chooseCounter("ST03-017");
  e.asSouth().chooseTargets(e.leader("south"));
  expect(e.getView("south").players.south).toMatchObject({ activeDon: 0, restedDon: 1 });
  if (e.getView("south").prompts.length) e.asSouth().chooseCounter();
  expect(e.getView("south").players.south.lifeCount).toBe(life);
});
