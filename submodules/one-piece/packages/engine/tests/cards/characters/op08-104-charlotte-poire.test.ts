import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op08CharlottePoire104,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-104 Charlotte Poire", () => {
  test("trashes a physical hand card to play itself from Life, then draws", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        hand: [eb01Doma005],
        deck: [eb01Fourtricks025, eb01Doma005, eb01Doma005, eb01Doma005],
        life: [op08CharlottePoire104],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const poireId = engine.findCardInZone("north", "life", op08CharlottePoire104);
    const costId = engine.findCardInZone("north", "hand", eb01Doma005);
    const drawnId = engine.findCardInZone("north", "deck", eb01Fourtricks025);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(poireId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(costId);
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.prompts).toHaveLength(0);
  });
});
