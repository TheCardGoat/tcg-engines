import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, eb01Fourtricks025, op01Kanjuro038 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-038 Kanjuro", () => {
  test("when K.O.'d, lets the opponent choose one card from its controller's hand to trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01Kanjuro038, rested: true, playedOnTurn: 0 }],
        hand: [eb01Doma005, eb01Fourtricks025],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const kanjuroId = engine.findCardInZone("south", "character", op01Kanjuro038);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const discardedId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.declareAttack(attackerId, kanjuroId, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    const choice = engine.pendingDecision("effectTrashFromHandSelection", "north").steps[0];
    expect(choice?.kind).toBe("selectEntity");
    if (choice?.kind !== "selectEntity") throw new Error("Expected opponent hand-discard choice.");
    expect(choice.candidates.map((candidate) => candidate.label)).toEqual(["Card 1", "Card 2"]);
    expect(choice.candidates.every((candidate) => candidate.ref.kind === "option")).toBe(true);
    expect(choice.candidates.every((candidate) => candidate.publicInfo === undefined)).toBe(true);
    expect(choice.candidates.map((candidate) => candidate.ref.id)).not.toContain(discardedId);
    const discardToken = choice.candidates[0]!.ref.id;
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [discardToken] },
      "north",
    );

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardedId);
    expect(view.prompts).toHaveLength(0);
  });
});
