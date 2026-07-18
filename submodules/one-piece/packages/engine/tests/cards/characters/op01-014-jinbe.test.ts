import { describe, expect, test } from "vite-plus/test";
import { op01Jinbe014, op01Sanji013, op01Shanks120, op01TonyTonyChopper015 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-014 Jinbe", () => {
  test("blocks, then with DON!! attached plays only a red cost-2-or-less Character from hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01Jinbe014, attachedDon: 1, playedOnTurn: 0 }],
        hand: [op01Sanji013, op01TonyTonyChopper015],
      },
      { character: [{ card: op01Shanks120, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const jinbeId = engine.findCardInZone("south", "character", op01Jinbe014);
    const attackerId = engine.findCardInZone("north", "character", op01Shanks120);
    const playableId = engine.findCardInZone("south", "hand", op01Sanji013);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [jinbeId] }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Jinbe's hand-play selection.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([playableId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [playableId] }, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === playableId)).toBe(
      true,
    );
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(jinbeId);
    expect(view.prompts).toHaveLength(0);
  });
});
