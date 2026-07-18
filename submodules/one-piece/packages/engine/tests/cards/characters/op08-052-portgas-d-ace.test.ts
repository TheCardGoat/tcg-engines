import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op03SpeedJil006,
  op08EdwardWeevil042,
  op08PortgasDAce052,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-052 Portgas.D.Ace", () => {
  test("reveals and plays a cost-4 Whitebeard Pirates Character from the deck top", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op08PortgasDAce052],
      deck: [op03SpeedJil006, eb01Doma005],
      activeDon: op08PortgasDAce052.cost,
    });
    const speedJilId = engine.findCardInZone("south", "deck", op03SpeedJil006);

    engine.playCard(op08PortgasDAce052, "south");
    const play = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(play).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (play?.kind !== "selectEntity") throw new Error("Expected Ace's revealed-card choice.");
    expect(play.candidates.find((candidate) => candidate.ref.id === speedJilId)?.legal).toBe(true);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [speedJilId] }, "south");

    expect(
      engine.getView("south").players.south.characters.map((card) => card?.instanceId),
    ).toContain(speedJilId);
    engine.resolveDecision("effectSearchRemainderPosition", { optionId: "bottom" }, "south");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("cannot play an ineligible revealed Character and chooses top or bottom for it", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op08PortgasDAce052],
      deck: [op08EdwardWeevil042, eb01Doma005],
      activeDon: op08PortgasDAce052.cost,
    });
    const revealedId = engine.findCardInZone("south", "deck", op08EdwardWeevil042);

    engine.playCard(op08PortgasDAce052, "south");
    const play = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Ace's revealed-card choice.");
    expect(play.candidates.find((candidate) => candidate.ref.id === revealedId)?.legal).toBe(false);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");

    const position = engine.pendingDecision("effectSearchRemainderPosition", "south").steps[0];
    expect(position).toMatchObject({ kind: "chooseOption" });
    engine.resolveDecision("effectSearchRemainderPosition", { optionId: "bottom" }, "south");
    expect(engine.getState().players.south.deck.at(-1)).toBe(revealedId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
