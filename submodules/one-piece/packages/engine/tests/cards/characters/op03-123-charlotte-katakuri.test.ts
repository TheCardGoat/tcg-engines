import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op03CharlotteKatakuri123,
  op03CharlotteLinlin114,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-123 Charlotte Katakuri", () => {
  test("puts an eligible opposing Character at the chosen owner-Life position face-up", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op03CharlotteKatakuri123],
        character: [eb01Doma005],
        activeDon: op03CharlotteKatakuri123.cost,
      },
      { character: [eb01MountainGod018, op03CharlotteLinlin114] },
    );
    const katakuriId = engine.findCardInZone("south", "hand", op03CharlotteKatakuri123);
    const ownId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const tooExpensiveId = engine.findCardInZone("north", "character", op03CharlotteLinlin114);

    engine.playCard(op03CharlotteKatakuri123, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Katakuri's Character choice.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([ownId, katakuriId, opposingId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opposingId] }, "south");

    const position = engine.pendingDecision("effectLifePosition", "south").steps[0];
    expect(position?.kind).toBe("chooseOption");
    if (position?.kind !== "chooseOption") {
      throw new Error("Expected Katakuri's top-or-bottom Life choice.");
    }
    expect(position.options.map((option) => option.id)).toEqual(["top", "bottom"]);
    engine.resolveDecision("effectLifePosition", { optionId: "bottom" }, "south");

    expect(engine.getState().players.north.life.at(-1)).toBe(opposingId);
    expect(engine.getState().cards[opposingId]?.faceUp).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may put its controller's Character into that owner's bottom Life face-up", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op03CharlotteKatakuri123],
      character: [eb01Doma005],
      life: [eb01Fourtricks025],
      activeDon: op03CharlotteKatakuri123.cost,
    });
    const ownId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.playCard(op03CharlotteKatakuri123, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownId] }, "south");
    engine.resolveDecision("effectLifePosition", { optionId: "bottom" }, "south");

    expect(engine.getState().players.south.life.at(-1)).toBe(ownId);
    expect(engine.getState().cards[ownId]?.faceUp).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may choose no Character without opening a Life-position prompt", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op03CharlotteKatakuri123],
        activeDon: op03CharlotteKatakuri123.cost,
      },
      { character: [eb01MountainGod018] },
    );
    const opposingId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op03CharlotteKatakuri123, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(opposingId);
    expect(view.prompts).toHaveLength(0);
  });
});
