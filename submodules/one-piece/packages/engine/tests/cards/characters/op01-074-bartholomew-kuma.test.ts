import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01BartholomewKuma074,
  op01Pacifista075,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-074 Bartholomew Kuma", () => {
  test("blocks publicly, then plays only a cost-4-or-less Pacifista from hand when K.O.'d", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01BartholomewKuma074, playedOnTurn: 0 }],
        hand: [op01Pacifista075, eb01Doma005],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const kumaId = engine.findCardInZone("south", "character", op01BartholomewKuma074);
    const pacifistaId = engine.findCardInZone("south", "hand", op01Pacifista075);
    const excludedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Kuma's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(kumaId);
    engine.resolveDecision("battleBlocker", { selectedIds: [kumaId] }, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Kuma's Pacifista play.");
    expect(play.min).toBe(0);
    expect(play.max).toBe(1);
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([pacifistaId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [pacifistaId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(kumaId);
    expect(view.players.south.characters.some((card) => card?.instanceId === pacifistaId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
