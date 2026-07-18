import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op14eb04IsshoEb04022022,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB04-022 Issho", () => {
  test("with an opponent holding six cards, trashes two cards and returns two opponent hand cards to deck bottom", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04IsshoEb04022022, eb01Doma005, eb01Fourtricks025],
        activeDon: op14eb04IsshoEb04022022.cost,
      },
      {
        hand: [
          eb01Doma005,
          eb01Fourtricks025,
          eb01MountainGod018,
          eb01Doma005,
          eb01Fourtricks025,
          eb01MountainGod018,
        ],
      },
    );
    const firstDiscardId = engine.findCardInZone("south", "hand", eb01Doma005);
    const secondDiscardId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const opponentHandIds = [...engine.getState().players.north.hand];

    engine.playCard(op14eb04IsshoEb04022022, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity")
      throw new Error("Expected Issho's opponent hand selection.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(opponentHandIds);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [opponentHandIds[0]!, opponentHandIds[1]!] },
      "north",
    );

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstDiscardId, secondDiscardId]),
    );
    expect(view.players.north.hand).toHaveLength(4);
    expect(engine.getState().players.north.deck.slice(-2)).toEqual([
      opponentHandIds[0],
      opponentHandIds[1],
    ]);
    for (const viewer of ["south", "north", "spectator"] as const) {
      const movementLogs = engine
        .getView(viewer)
        .logs.filter((entry) => entry.message.includes("places a card from their hand"));
      expect(movementLogs).toHaveLength(2);
      expect(movementLogs.every((entry) => entry.sourceInstanceId === null)).toBe(true);
      expect(movementLogs.every((entry) => entry.targetIds.length === 0)).toBe(true);
      expect(movementLogs.map((entry) => entry.message).join(" ")).not.toContain(eb01Doma005.name);
      expect(movementLogs.map((entry) => entry.message).join(" ")).not.toContain(
        eb01Fourtricks025.name,
      );
      expect(movementLogs.map((entry) => entry.message).join(" ")).not.toContain("Order:");
    }
    expect(engine.getView("spectator").players.north.deckTop).toMatchObject({
      hidden: true,
      instanceId: null,
    });
    expect(view.prompts).toHaveLength(0);
  });

  test("may pay the hand cost before the six-card opponent-hand condition fails", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04IsshoEb04022022, eb01Doma005, eb01Fourtricks025],
        activeDon: op14eb04IsshoEb04022022.cost,
      },
      {
        hand: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005, eb01Fourtricks025],
      },
    );
    const opponentHandIds = [...engine.getState().players.north.hand];

    engine.playCard(op14eb04IsshoEb04022022, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash).toHaveLength(2);
    expect(engine.getState().players.north.hand).toEqual(opponentHandIds);
    expect(view.prompts).toHaveLength(0);
  });

  test("with DON!! attached, trashes one card on attack to give an opposing Character +2000 for the turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op14eb04IsshoEb04022022, attachedDon: 1, playedOnTurn: 0 }],
        hand: [eb01Fourtricks025],
      },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const isshoId = engine.findCardInZone("south", "character", op14eb04IsshoEb04022022);
    const discardId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    const targetPower = engine
      .getView("south")
      .players.north.characters.find((card) => card?.instanceId === targetId)?.power;

    engine.declareAttack(isshoId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      discardId,
    );
    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe((targetPower ?? 0) + 2000);
  });
});
