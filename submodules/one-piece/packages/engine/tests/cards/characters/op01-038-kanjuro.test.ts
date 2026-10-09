import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, eb01Fourtricks025, op01Kanjuro038 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-038 Kanjuro", () => {
  test("with DON!! attached, K.O.s only a rested opposing Character costing 2 or less when attacking", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op01Kanjuro038, attachedDon: 1 }] },
      {
        character: [
          { cardId: "ST01-002", rested: true },
          eb01Doma005,
          { card: eb01Fourtricks025, rested: true },
        ],
      },
    );
    const kanjuro = engine.findCardInZone("south", "character", op01Kanjuro038);
    const legal = engine.findCardInZone("north", "character", "ST01-002");
    const active = engine.findCardInZone("north", "character", eb01Doma005);
    const tooExpensive = engine.findCardInZone("north", "character", eb01Fourtricks025);
    engine.declareAttack(kanjuro, engine.leader("north"), "south");
    const choice = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (choice?.kind !== "selectEntity") throw new Error("Expected Kanjuro's K.O. choice.");
    expect(choice.candidates.map((candidate) => candidate.ref.id)).toEqual([legal]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [legal] }, "south");
    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(legal);
    expect(view.players.north.characters.filter(Boolean).map((card) => card?.instanceId)).toEqual([
      active,
      tooExpensive,
    ]);
    expect(view.prompts).toHaveLength(0);
  });

  test("without attached DON!! an attack does not offer the rested-Character K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op01Kanjuro038] },
      { character: [{ card: eb01Doma005, rested: true }] },
    );
    const target = engine.findCardInZone("north", "character", eb01Doma005);
    engine.declareAttack(
      engine.findCardInZone("south", "character", op01Kanjuro038),
      engine.leader("north"),
      "south",
    );
    expect(
      engine.getView("south").players.north.characters.some((card) => card?.instanceId === target),
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

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
    // The candidate order is deliberately randomized for the opposing chooser;
    // resolve the opaque token for the target card from the prompt mapping.
    const prompt = engine
      .getState()
      .promptQueue.find(
        (candidate) =>
          candidate.status === "pending" &&
          candidate.resolutionContext?.intent === "effectTrashFromHandSelection",
      );
    if (prompt?.resolutionContext?.intent !== "effectTrashFromHandSelection") {
      throw new Error("Expected a concealed trash-from-hand prompt.");
    }
    const discardToken = Object.entries(prompt.resolutionContext.opaqueCandidateIds ?? {}).find(
      ([, candidateId]) => candidateId === discardedId,
    )?.[0];
    if (!discardToken) {
      throw new Error("Expected the concealed hand card to have an opaque prompt token.");
    }
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
