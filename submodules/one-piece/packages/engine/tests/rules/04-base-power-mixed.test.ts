import { getCard } from "@tcg/op-cards";
import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

test("Linlin's own-turn setting coexists with opposing Fuza and Holly settings", () => {
  const linlin = getCard("OP17-112");
  const daifuku = getCard("OP17-107");
  const fuza = getCard("OP15-070");
  const holly = getCard("OP15-071");
  const engine = OnePieceTestEngine.create(
    { leaderCardId: "ST07-001", character: [linlin], hand: [daifuku], activeDon: 4 },
    { leaderCardId: "ST04-001", character: [fuza, holly] },
  );
  engine.asSouth().play(daifuku);
  const daifukuId = engine.findCardInZone("south", "character", daifuku);
  engine.asSouth().attachDon(daifukuId, 1);
  const ownTurn = engine.getView("south");
  expect(ownTurn.players.south.characters.find((c) => c?.instanceId === daifukuId)?.power).toBe(
    9000,
  );
  expect(ownTurn.players.north.characters.filter(Boolean).map((c) => c?.power)).toEqual([
    6000, 6000,
  ]);
  expect(ownTurn.prompts).toHaveLength(0);
  engine.asSouth().endTurn();
  const nextTurn = engine.getView("south");
  expect(nextTurn.players.south.characters.find((c) => c?.instanceId === daifukuId)).toMatchObject({
    power: 4000,
    attachedDon: 1,
  });
  expect(nextTurn.players.north.characters.filter(Boolean).map((c) => c?.power)).toEqual([
    4000, 4000,
  ]);
  expect(nextTurn.prompts).toHaveLength(0);
});

test("Vista copies Luffy's live Leader base setting across turn changes", () => {
  const luffy = getCard("OP15-092");
  const vista = getCard("OP14-053");
  let engine = OnePieceTestEngine.create(
    { leaderCardId: "OP04-039", character: [luffy], hand: [vista], activeDon: 3, trash: 30 },
    { leaderCardId: "ST04-001" },
  );
  engine.asSouth().play(vista);
  const vistaId = engine.findCardInZone("south", "character", vista);
  const luffyId = engine.findCardInZone("south", "character", luffy);
  expect(
    engine.getView("south").players.south.characters.find((c) => c?.instanceId === vistaId)?.power,
  ).toBe(4000);
  engine.asSouth().endTurn();
  engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
  const opponentTurn = engine.getView("south");
  expect(opponentTurn.players.south.leader.power).toBe(7000);
  expect(opponentTurn.players.south.characters.find((c) => c?.instanceId === vistaId)?.power).toBe(
    7000,
  );
  expect(opponentTurn.players.south.characters.find((c) => c?.instanceId === luffyId)?.power).toBe(
    10000,
  );
  expect(opponentTurn.prompts).toHaveLength(0);
  engine.asNorth().endTurn();
  const ownTurn = engine.getView("south");
  expect(ownTurn.players.south.leader.power).toBe(5000);
  expect(ownTurn.players.south.characters.find((c) => c?.instanceId === vistaId)?.power).toBe(4000);
  expect(ownTurn.players.south.characters.find((c) => c?.instanceId === luffyId)?.power).toBe(
    10000,
  );
  expect(ownTurn.prompts).toHaveLength(0);
});

test("Ju Peter and Linlin set independent eligible Characters without an order prompt", () => {
  const juPeter = getCard("OP13-084");
  const linlin = getCard("OP17-112");
  const daifuku = getCard("OP17-107");
  const engine = OnePieceTestEngine.create(
    {
      leaderCardId: "OP03-077",
      character: [juPeter, linlin],
      hand: [daifuku],
      activeDon: 3,
      trash: 10,
    },
    { leaderCardId: "ST04-001" },
  );
  engine.asSouth().play(daifuku);
  const juPeterId = engine.findCardInZone("south", "character", juPeter);
  const daifukuId = engine.findCardInZone("south", "character", daifuku);
  const ownTurn = engine.getView("south");
  expect(ownTurn.players.south.characters.find((c) => c?.instanceId === juPeterId)?.power).toBe(
    7000,
  );
  expect(ownTurn.players.south.characters.find((c) => c?.instanceId === daifukuId)?.power).toBe(
    8000,
  );
  expect(ownTurn.prompts).toHaveLength(0);
  engine.asSouth().endTurn();
  const opponentTurn = engine.getView("south");
  expect(
    opponentTurn.players.south.characters.find((c) => c?.instanceId === juPeterId)?.power,
  ).toBe(5000);
  expect(
    opponentTurn.players.south.characters.find((c) => c?.instanceId === daifukuId)?.power,
  ).toBe(4000);
  expect(opponentTurn.prompts).toHaveLength(0);
});
