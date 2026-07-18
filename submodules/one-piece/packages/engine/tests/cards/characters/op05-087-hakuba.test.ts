import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op05Hakuba087 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-087 Hakuba", () => {
  test("with DON!! x1, K.O.s another own Character to reduce an opposing Character for the turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op05Hakuba087, attachedDon: 1, playedOnTurn: 0 },
          eb01Doma005,
          eb01Fourtricks025,
        ],
      },
      { character: [eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const hakubaId = engine.findCardInZone("south", "character", op05Hakuba087);
    const firstPaymentId = engine.findCardInZone("south", "character", eb01Doma005);
    const secondPaymentId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(hakubaId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostKoCharacter", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Hakuba's Character K.O. cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual([
      firstPaymentId,
      secondPaymentId,
    ]);
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(hakubaId);
    engine.resolveDecision("effectCostKoCharacter", { selectedIds: [firstPaymentId] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity")
      throw new Error("Expected Hakuba's cost-reduction target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(firstPaymentId);
    expect(view.players.south.characters.some((card) => card?.instanceId === secondPaymentId)).toBe(
      true,
    );
    expect(view.players.north.characters[0]?.cost).toBe(0);
  });

  test("without a given DON!!, does not offer the optional K.O. payment", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op05Hakuba087, playedOnTurn: 0 }, eb01Doma005] },
      { character: [eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const hakubaId = engine.findCardInZone("south", "character", op05Hakuba087);

    engine.declareAttack(hakubaId, engine.leader("north"), "south");

    expect(() => engine.pendingDecision("effectOptional", "south")).toThrow();
    expect(engine.getView("south").players.north.characters[0]?.cost).toBe(5);
  });
});
