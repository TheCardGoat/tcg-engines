import { describe, expect, test } from "vite-plus/test";
import {
  eb01Fourtricks025,
  op01Usopp004,
  op03Usopp041,
  op03UsoppSPirateCrew042,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-042 Usopp's Pirate Crew", () => {
  test("returns only a blue Usopp from trash to hand", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op03UsoppSPirateCrew042],
      trash: [op03Usopp041, op01Usopp004, eb01Fourtricks025],
      activeDon: op03UsoppSPirateCrew042.cost,
    });
    const blueUsoppId = engine.findCardInZone("south", "trash", op03Usopp041);
    const redUsoppId = engine.findCardInZone("south", "trash", op01Usopp004);
    const blueNonUsoppId = engine.findCardInZone("south", "trash", eb01Fourtricks025);

    engine.playCard(op03UsoppSPirateCrew042, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Pirate Crew's trash target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(blueUsoppId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(redUsoppId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(blueNonUsoppId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [blueUsoppId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(blueUsoppId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([redUsoppId, blueNonUsoppId]),
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline the up-to-one return without moving an eligible Usopp", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op03UsoppSPirateCrew042],
      trash: [op03Usopp041],
      activeDon: op03UsoppSPirateCrew042.cost,
    });
    const blueUsoppId = engine.findCardInZone("south", "trash", op03Usopp041);

    engine.playCard(op03UsoppSPirateCrew042, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Pirate Crew's trash target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(blueUsoppId);
    expect(view.players.south.hand.map((card) => card.instanceId)).not.toContain(blueUsoppId);
    expect(view.prompts).toHaveLength(0);
  });
});
