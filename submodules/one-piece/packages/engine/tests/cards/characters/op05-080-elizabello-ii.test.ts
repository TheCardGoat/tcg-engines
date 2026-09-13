import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op05ElizabelloIi080,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

const twentyOneTrashCards = Array.from({ length: 21 }, (_, index) =>
  index % 3 === 0 ? eb01Doma005 : index % 3 === 1 ? eb01Fourtricks025 : eb01MountainGod018,
);

describe("OP05-080 Elizabello II", () => {
  test("returns twenty chosen trash cards, shuffles, and gains battle power and Double Attack", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op05ElizabelloIi080, playedOnTurn: 0 }],
        trash: twentyOneTrashCards,
      },
      { hand: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const elizabelloId = engine.findCardInZone("south", "character", op05ElizabelloIi080);
    const trashIds = [...engine.getState().players.south.trash];
    const deckBefore = engine.getView("south").players.south.deckCount;
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.declareAttack(elizabelloId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectCostReturnTrashToDeck", "south").steps[0];
    expect(payment?.kind).toBe("payCost");
    if (payment?.kind !== "payCost") throw new Error("Expected Elizabello II's trash cost.");
    expect(payment).toMatchObject({ min: 20, max: 20 });
    expect(payment.candidates.map((candidate) => candidate.ref.id)).toEqual(trashIds);
    engine.resolveDecision(
      "effectCostReturnTrashToDeck",
      { selectedIds: trashIds.slice(0, 20) },
      "south",
    );

    const counter = engine.pendingDecision("battleCounter", "north");
    expect(counter.actorId).toBe("north");
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === elizabelloId)?.power,
    ).toBe(15_000);
    expect(engine.getView("south").players.south).toMatchObject({
      deckCount: deckBefore + 20,
    });
    expect(engine.getView("south").players.south.trash).toHaveLength(1);
    expect(
      engine.getView("south").logs.some((entry) => entry.message.includes("shuffles their deck")),
    ).toBe(true);

    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    const view = engine.getView("south");
    expect(view.players.north.lifeCount).toBe(lifeBefore - 2);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === elizabelloId)?.power,
    ).toBe(5000);
    expect(view.prompts).toHaveLength(0);
  });

  test("cannot pay the attack effect with only nineteen cards in trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op05ElizabelloIi080, playedOnTurn: 0 }],
        trash: twentyOneTrashCards.slice(0, 19),
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const elizabelloId = engine.findCardInZone("south", "character", op05ElizabelloIi080);
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.declareAttack(elizabelloId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.north.lifeCount).toBe(lifeBefore - 1);
    expect(view.players.south.trash).toHaveLength(19);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op05ElizabelloIi080, playedOnTurn: 0 }],
        trash: twentyOneTrashCards,
      },
      { hand: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const elizabelloId = engine.findCardInZone("south", "character", op05ElizabelloIi080);
    engine.declareAttack(elizabelloId, engine.leader("north"), "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
