import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb02TrafalgarLaw045,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-045 Trafalgar Law", () => {
  test("orders its optional trash cost, maps both choices, and gives discard control to the opponent", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb02TrafalgarLaw045],
        trash: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        deck: [eb01Doma005],
        activeDon: 5,
      },
      {
        hand: [eb01Doma005, eb01Doma005, eb01Fourtricks025, eb01Fourtricks025, eb01MountainGod018],
      },
    );
    const firstCostId = engine.findCardInZone("south", "trash", eb01Doma005);
    const secondCostId = engine.findCardInZone("south", "trash", eb01Fourtricks025);
    const retainedTrashId = engine.findCardInZone("south", "trash", eb01MountainGod018);

    engine.playCard(eb02TrafalgarLaw045, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostReturnTrashToDeck", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Law's ordered two-card trash cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual([
      firstCostId,
      secondCostId,
      retainedTrashId,
    ]);
    engine.resolveDecision(
      "effectCostReturnTrashToDeck",
      { selectedIds: [secondCostId, firstCostId] },
      "south",
    );

    const choice = engine.pendingDecision("effectActionChoice", "south").steps[0];
    expect(choice?.kind).toBe("chooseOption");
    if (choice?.kind !== "chooseOption") throw new Error("Expected Law's printed choice.");
    expect(choice.options.map((option) => option.label)).toEqual(["draw", "trashFromHand"]);
    engine.resolveDecision("effectActionChoice", { optionId: "1" }, "south");

    const discard = engine.pendingDecision("effectTrashFromHandSelection", "north").steps[0];
    expect(discard?.kind).toBe("selectEntity");
    if (discard?.kind !== "selectEntity") {
      throw new Error("Expected Law's opponent to choose their discarded card.");
    }
    expect(discard.candidates).toHaveLength(5);
    const discardedId = discard.candidates[0]!.ref.id;
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardedId] }, "north");

    expect(engine.getState().players.south.deck.slice(-2)).toEqual([secondCostId, firstCostId]);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toEqual([
      retainedTrashId,
    ]);
    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toContain(
      discardedId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("skips the chosen discard below five opposing hand cards, then acts as a Blocker", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb02TrafalgarLaw045],
        trash: [eb01Doma005, eb01Fourtricks025],
        deck: [eb01Doma005],
        activeDon: 5,
      },
      {
        hand: [eb01Doma005, eb01Doma005, eb01Fourtricks025, eb01Fourtricks025],
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      { firstPlayer: "south", activeSeat: "south" },
    );
    const costIds = [
      engine.findCardInZone("south", "trash", eb01Doma005),
      engine.findCardInZone("south", "trash", eb01Fourtricks025),
    ];
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(eb02TrafalgarLaw045, "south");
    const lawId = engine.findCardInZone("south", "character", eb02TrafalgarLaw045);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnTrashToDeck", { selectedIds: costIds }, "south");
    engine.resolveDecision("effectActionChoice", { optionId: "1" }, "south");

    expect(engine.getView("north").players.north.handCount).toBe(4);
    expect(engine.getView("north").prompts).toHaveLength(0);

    engine.endTurn("south");
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Law's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toEqual(["skip", lawId]);
    engine.resolveDecision("battleBlocker", { selectedIds: [lawId] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      lawId,
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
