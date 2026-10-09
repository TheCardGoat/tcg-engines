import { describe, expect, test } from "vite-plus/test";
import { eb01ConquererOfThreeWorldsRagnaraku039, eb01Doma005 } from "@tcg/op-cards";
import { op14eb04GeckoMoriaOp14104104 } from "../../../../../cards/src/cards/characters/op14-104-gecko-moria.ts";
import { op15Oars080 } from "../../../../../cards/src/cards/characters/op15-080-oars.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-080 Oars", () => {
  test("counts a Leader named Gecko Moria at 10000 power and excludes a second Oars", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP14-080", character: [op15Oars080], hand: [op15Oars080], activeDon: 9 },
      {},
    );
    engine.attachDon(engine.leader("south"), 5);
    expect(engine.getView("south").players.south.characters[0]?.power).toBe(7000);
    engine.playCard(op15Oars080);
    expect(
      engine
        .getView("south")
        .players.south.characters.filter(Boolean)
        .map((card) => card?.power),
    ).toEqual([0, 0]);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("gains +7000 power beside a 10000-power Gecko Moria", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Oars080, op14eb04GeckoMoriaOp14104104] },
      {},
    );

    const powers = engine
      .getView("south")
      .players.south.characters.flatMap((card) => (card ? [card.power] : []));
    expect(powers).toEqual([7000, 10000]);
  });

  test("[On K.O.] pays three trash cards to replay itself from trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op15Oars080],
        trash: [eb01Doma005, eb01Doma005, eb01Doma005],
        activeDon: 6,
      },
      { hand: [eb01ConquererOfThreeWorldsRagnaraku039], activeDon: 5, restedDon: 1 },
    );
    const oarsId = engine.findCardInZone("south", "character", op15Oars080);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.endTurn("south");
    engine.playCard(eb01ConquererOfThreeWorldsRagnaraku039, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [oarsId] }, "north");

    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostReturnTrashToDeck", "south").steps[0];
    if (cost?.kind !== "payCost") throw new Error("Expected the trash payment.");
    const trashIds = cost.candidates.map((candidate) => candidate.ref.id).slice(0, 3);
    engine.resolveDecision("effectCostReturnTrashToDeck", { selectedIds: trashIds }, "south");

    const south = engine.getView("south").players.south;
    expect(south.characters.some((card) => card?.instanceId === oarsId)).toBe(true);
    expect(south.deckCount).toBe(deckBefore + 3);
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP15-080", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP15-080",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declines On K.O. replay with three payable trash cards available", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op15Oars080, rested: true }],
        trash: [eb01Doma005, eb01Doma005, eb01Doma005],
      },
      { character: ["OP16-003"] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const id = engine.findCardInZone("south", "character", op15Oars080);
    const before = engine.getView("south").players.south.deckCount;
    engine.asNorth().attack("OP16-003", id);
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const view = engine.getView("south");
    expect(view.players.south.trash.map((c) => c.instanceId)).toContain(id);
    expect(view.players.south.trash).toHaveLength(4);
    expect(view.players.south.deckCount).toBe(before);
    expect(view.prompts).toHaveLength(0);
  });
  test("FAQ: selecting Oars itself among the three bottom cards prevents its replay", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op15Oars080, rested: true }],
        trash: [eb01Doma005, eb01Doma005, eb01Doma005],
      },
      { character: ["OP16-003"] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const id = engine.findCardInZone("south", "character", op15Oars080);
    const before = engine.getView("south").players.south.deckCount;
    engine.asNorth().attack("OP16-003", id);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const choice = engine.pendingDecision("effectCostReturnTrashToDeck", "south").steps[0];
    if (choice?.kind !== "payCost") throw new Error("Expected trash payment");
    expect(choice.candidates.map((c) => c.ref.id)).toContain(id);
    const other = choice.candidates
      .map((c) => c.ref.id)
      .filter((x) => x !== id)
      .slice(0, 2);
    engine.resolveDecision("effectCostReturnTrashToDeck", { selectedIds: [id, ...other] }, "south");
    const view = engine.getView("south");
    expect(view.players.south.characters.filter(Boolean)).toHaveLength(0);
    expect(view.players.south.trash.map((c) => c.instanceId)).not.toContain(id);
    expect(view.players.south.deckCount).toBe(before + 3);
    expect(view.prompts).toHaveLength(0);
  });
});
