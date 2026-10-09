import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op04Rabiyan113, op05Pagaya109 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-109 Pagaya", () => {
  test("draws two and trashes two when a Trigger activates", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        character: [op05Pagaya109],
        life: [op04Rabiyan113],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        hand: [eb01Doma005, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const firstTrash = engine.pendingDecision("effectTrashFromHandSelection", "north").steps[0];
    expect(firstTrash?.kind).toBe("selectEntity");
    if (firstTrash?.kind !== "selectEntity") throw new Error("Expected Pagaya's hand choice.");
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: firstTrash.candidates.slice(0, 2).map((candidate) => candidate.ref.id) },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.north.hand).toHaveLength(2);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
  test("also observes the opponent's Trigger, but draws and trashes only once that turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          op05Pagaya109,
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
        ],
        hand: [eb01Doma005, eb01Doma005],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
      },
      { life: [op04Rabiyan113, op04Rabiyan113], hand: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackers = engine
      .getView("south")
      .players.south.characters.filter((card) => card?.cardId === eb01MountainGod018.id)
      .map((card) => card!.instanceId);
    engine.asSouth().attack(attackers[0]!, engine.leader("north"));
    engine.asNorth().chooseCounter();
    engine.asNorth().activateLifeTrigger();
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity")
      throw new Error("Expected Pagaya's controller to trash two cards.");
    expect(engine.getView("south").players.south.handCount).toBe(4);
    engine.asSouth().choose(
      "effectTrashFromHandSelection",
      trash.candidates.slice(0, 2).map((candidate) => candidate.ref.id),
    );
    expect(engine.getView("south").players.south).toMatchObject({ handCount: 2, deckCount: 2 });

    engine.asSouth().attack(attackers[1]!, engine.leader("north"));
    engine.asNorth().chooseCounter();
    engine.asNorth().activateLifeTrigger();
    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ handCount: 2, deckCount: 2 });
    expect(view.players.south.trash).toHaveLength(2);
    expect(
      view.players.north.characters.filter((card) => card?.cardId === op04Rabiyan113.id),
    ).toHaveLength(2);
    expect(view.prompts).toHaveLength(0);
  });
});
