import { describe, expect, test } from "vite-plus/test";
import {
  op13GolDRoger003,
  op13PortgasDRouge014,
  op14eb04DraculeMihawkOp14020020,
  op14eb04XDrake016,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP14-020 Dracule Mihawk", () => {
  test("maps the rest cost, DON!! choice, Slash bonus, and Character play restriction", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op14eb04DraculeMihawkOp14020020,
        hand: [op13PortgasDRouge014],
        character: [op14eb04XDrake016],
        restedDon: 3,
      },
      { leaderCardId: op13GolDRoger003 },
    );
    const costId = engine.findCardInZone("south", "character", op14eb04XDrake016);
    const blockedCardId = engine.findCardInZone("south", "hand", op13PortgasDRouge014);

    expect(engine.getView("south").players.south.leader.power).toBe(6000);
    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostRestCards", { selectedIds: [costId] }, "south");
    engine.resolveDecision("effectSetActiveDon", { optionId: "3" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 3, restedDon: 0 });
    expect(view.players.south.characters[0]?.rested).toBe(true);
    expect(
      engine.expectFailure({ type: "playCard", seat: "south", instanceId: blockedCardId }).reason,
    ).toBe("A card effect prevents this card from being played.");
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
