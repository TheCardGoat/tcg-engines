import { describe, expect, test } from "vite-plus/test";
import { op11Hibari010, op13PortgasDAce119 } from "@tcg/op-cards";
import { op13PortgasDRouge014 } from "../../../../../cards/src/cards/OP13/characters/014-portgas-d-rouge.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-014 Portgas.D.Rouge", () => {
  test("Life Trigger gives a chosen Portgas.D.Ace +3000 for the turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op13PortgasDAce119], life: [op13PortgasDRouge014] },
      { character: [{ card: op11Hibari010, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const aceId = engine.findCardInZone("south", "character", op13PortgasDAce119);
    const attackerId = engine.findCardInZone("north", "character", op11Hibari010);
    const basePower = engine
      .getView("south")
      .players.south.characters.find((card) => card?.instanceId === aceId)?.power;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [aceId] }, "south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === aceId)
        ?.power,
    ).toBe((basePower ?? 0) + 3000);
    engine.endTurn("north");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === aceId)
        ?.power,
    ).toBe(basePower);
  });
});
