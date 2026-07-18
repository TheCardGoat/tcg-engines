import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op06LilyCarnation015,
  op06MonkeyDLuffy013,
  op06Uta001,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-001 Uta", () => {
  test("filters its FILM hand cost, maps the power target, and adds rested DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op06Uta001,
        hand: [op06LilyCarnation015, op06MonkeyDLuffy013, eb01Doma005],
      },
      { character: [eb01Doma005, eb01Fourtricks025] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const firstFilmId = engine.findCardInZone("south", "hand", op06LilyCarnation015);
    const secondFilmId = engine.findCardInZone("south", "hand", op06MonkeyDLuffy013);
    const excludedPaymentId = engine.findCardInZone("south", "hand", eb01Doma005);
    const targetId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Uta's filtered FILM cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual([
      firstFilmId,
      secondFilmId,
    ]);
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedPaymentId);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [firstFilmId] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Uta's power target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toHaveLength(2);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      3000,
    );
    expect(view.players.south.restedDon).toBe(1);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore - 1);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
