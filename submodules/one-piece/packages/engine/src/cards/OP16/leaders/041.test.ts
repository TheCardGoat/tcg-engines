import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-041", () => {
  test("when an {Impel Down} Character is removed, plays a [Prisoner of Impel Down] from hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP16-041",
        character: [{ cardId: "OP16-072", rested: true }],
        hand: ["OP16-042"],
        activeDon: 5,
      },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const hannyabalId = engine.findCardInZone("south", "character", "OP16-072");

    engine.attachDon(engine.leader("south"), 1, "south");
    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", "OP16-072");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected the play choice.");
    const prisonerId = play.candidates[0]!.ref.id;
    engine.resolveDecision("effectPlaySelection", { selectedIds: [prisonerId] }, "south");

    expect(engine.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(
      hannyabalId,
    );
    expect(engine.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(
      prisonerId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test.each([
    { name: "no attached DON!!", removedCard: "OP16-072", attach: false },
    { name: "a non-Impel Down Character", removedCard: "EB01-005", attach: true },
  ])("does not react to $name", ({ removedCard, attach }) => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP16-041",
        character: [{ cardId: removedCard, rested: true }],
        hand: ["OP16-042"],
        activeDon: 1,
      },
      { character: ["OP16-003"] },
    );
    if (attach) engine.attachDon(engine.leader("south"), 1, "south");
    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", removedCard);
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    expect(engine.getView("south").players.south.trash.map((card) => card.cardId)).toContain(
      removedCard,
    );
    expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toContain(
      "OP16-042",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("does not react when the opponent's Impel Down Character is removed", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP16-041",
        hand: ["OP16-042"],
        character: [{ cardId: "EB01-018", playedOnTurn: 0 }],
        activeDon: 1,
      },
      { character: [{ cardId: "OP16-072", rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.attachDon(engine.leader("south"), 1, "south");
    engine.asSouth().attack("EB01-018", "OP16-072");
    expect(engine.getView("south").players.north.trash.map((card) => card.cardId)).toContain(
      "OP16-072",
    );
    expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toContain(
      "OP16-042",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining the first removal leaves a later removal available that turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP16-041",
        character: [
          { cardId: "OP16-072", rested: true },
          { cardId: "OP16-072", rested: true },
        ],
        hand: ["OP16-042"],
        activeDon: 1,
      },
      { character: ["OP16-003", "EB01-018"] },
    );
    engine.attachDon(engine.leader("south"), 1, "south");
    const removedIds = engine
      .getView("south")
      .players.south.characters.flatMap((card) => (card ? [card.instanceId] : []));
    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", removedIds[0]!);
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toContain(
      "OP16-042",
    );
    engine.asNorth().attack("EB01-018", removedIds[1]!);
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const prisonerId = engine.findCardInZone("south", "hand", "OP16-042");
    engine.resolveDecision("effectPlaySelection", { selectedIds: [prisonerId] }, "south");
    expect(
      engine.getView("south").players.south.characters.map((card) => card?.instanceId),
    ).toContain(prisonerId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("the Leader battles and deals damage normally", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP16-041", activeDon: 5 },
      { activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.asSouth().attack(engine.leader("south"), engine.asNorth().leader());

    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("rule trash to replace a full Character field does not trigger Buggy (FAQ)", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "OP16-041",
        character: ["OP16-072", ...Array.from({ length: 4 }, () => "EB01-005")],
        hand: ["EB01-005", "OP16-042"],
        activeDon: 2,
      },
      {},
    );
    const removed = e.findCardInZone("south", "character", "OP16-072");
    e.asSouth().attachDon(e.leader("south"), 1);
    e.asSouth().play("EB01-005");
    e.resolveDecision("playCharacterReplacement", { selectedIds: [removed] }, "south");
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(removed);
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["OP16-042"]);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("its own Slave Arrow return cost triggers Buggy after the Counter resolves (FAQ)", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "OP16-041",
        character: ["OP16-072"],
        hand: ["OP07-056", "OP16-042"],
        activeDon: 3,
      },
      { character: [{ cardId: "EB01-018", playedOnTurn: 0 }], hand: [] },
    );
    e.asSouth().attachDon(e.leader("south"), 1);
    e.endTurn("south");
    e.asNorth().attack(e.findCardInZone("north", "character", "EB01-018"), e.leader("south"));
    e.resolveDecision(
      "battleCounter",
      { selectedIds: [e.findCardInZone("south", "hand", "OP07-056")] },
      "south",
    );
    e.asSouth().acceptOptional();
    e.resolveDecision("effectTargetSelection", { selectedIds: [e.leader("south")] }, "south");
    e.asSouth().acceptOptional();
    e.resolveDecision(
      "effectPlaySelection",
      { selectedIds: [e.findCardInZone("south", "hand", "OP16-042")] },
      "south",
    );
    e.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    expect(e.getView("south").players.south.hand.some((c) => c.cardId === "OP16-072")).toBe(true);
    expect(e.getView("south").players.south.characters.some((c) => c?.cardId === "OP16-042")).toBe(
      true,
    );
  });
});
