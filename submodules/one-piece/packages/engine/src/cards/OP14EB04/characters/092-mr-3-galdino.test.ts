import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01MsAllSunday079,
  op12UrsaShock096,
  op14eb04CrocodileOp14079079,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Mr3Galdino092 } from "../../../../../cards/src/cards/OP14EB04/characters/092-mr-3-galdino.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-092 Mr.3(Galdino)", () => {
  test("on the opponent's turn returns exactly three ordered trash cards to replace only its first effect K.O.", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op14eb04Mr3Galdino092],
        trash: [
          eb01Doma005,
          eb01Fourtricks025,
          eb01MountainGod018,
          op01MsAllSunday079,
          eb01Doma005,
          eb01Fourtricks025,
          eb01MountainGod018,
        ],
      },
      {
        hand: [op12UrsaShock096, op12UrsaShock096],
        activeDon: op12UrsaShock096.cost * 2,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const mr3Id = engine.findCardInZone("south", "character", op14eb04Mr3Galdino092);
    const trashIds = engine.getView("south").players.south.trash.map((card) => card.instanceId);

    engine.playCard(op12UrsaShock096, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [mr3Id] }, "north");
    expect(engine.pendingDecision("effectKoReplacement", "south").actorId).toBe("south");
    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");

    const order = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (order?.kind !== "selectEntity") throw new Error("Expected Mr.3's ordered trash payment.");
    expect(order).toMatchObject({ min: 3, max: 3 });
    expect(order.candidates.map((candidate) => candidate.ref.id)).toEqual(trashIds);
    const returnedOrder = [trashIds[2]!, trashIds[0]!, trashIds[1]!];
    engine.resolveDecision("effectTargetSelection", { selectedIds: returnedOrder }, "south");
    const submittedOrder = engine.pendingDecision("effectReturnToDeckOwnerOrder", "south").steps[0];
    if (submittedOrder?.kind !== "orderItems") {
      throw new Error("Expected Mr.3's selected cards to be ordered for the deck.");
    }
    expect(submittedOrder.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining(returnedOrder),
    );
    engine.resolveDecision("effectReturnToDeckOwnerOrder", { selectedIds: returnedOrder }, "south");

    let view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(mr3Id);
    for (const returnedId of returnedOrder) {
      expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(returnedId);
    }
    expect(engine.getState().players.south.deck.slice(-3)).toEqual(returnedOrder);

    engine.playCard(op12UrsaShock096, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [mr3Id] }, "north");
    view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(mr3Id);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline its battle K.O. replacement", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op14eb04Mr3Galdino092, rested: true }],
        trash: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const mr3Id = engine.findCardInZone("south", "character", op14eb04Mr3Galdino092);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, mr3Id, "north");
    engine.resolveDecision("battleKoReplacement", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(mr3Id);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not replace its own-turn K.O. by its Leader's cost", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op14eb04CrocodileOp14079079,
        character: [op14eb04Mr3Galdino092],
        trash: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      },
      { character: [eb01Doma005] },
    );
    const mr3Id = engine.findCardInZone("south", "character", op14eb04Mr3Galdino092);

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    engine.resolveDecision("effectActionChoice", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(mr3Id);
    expect(view.prompts).toHaveLength(0);
  });
});
