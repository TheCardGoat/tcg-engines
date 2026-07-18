import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb02Sanji054 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-054 Sanji", () => {
  test("draws two and maps the hand trash at two Life, then blocks a public attack", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb02Sanji054, eb01Doma005],
        deck: [eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
        life: [eb01Doma005, eb01Fourtricks025],
        activeDon: 5,
      },
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        deck: [eb01Doma005, eb01Doma005],
      },
      { firstPlayer: "south", activeSeat: "south" },
    );
    const discardedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const firstDrawId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    const secondDrawId = engine.findCardInZone("south", "deck", eb01MountainGod018);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(eb02Sanji054, "south");
    const sanjiId = engine.findCardInZone("south", "character", eb02Sanji054);
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(trash?.kind).toBe("selectEntity");
    if (trash?.kind !== "selectEntity") throw new Error("Expected Sanji's hand trash choice.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([discardedId, firstDrawId, secondDrawId]),
    );
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardedId] }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstDrawId, secondDrawId]),
    );

    engine.endTurn("south");
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Sanji's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toEqual(["skip", sanjiId]);
    engine.resolveDecision("battleBlocker", { selectedIds: [sanjiId] }, "south");

    const counter = engine.getView("south").decisions.flatMap((decision) => decision.steps)[0];
    if (counter?.kind === "selectEntity") {
      engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    }

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([discardedId, sanjiId]),
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
