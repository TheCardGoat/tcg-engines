import { describe, expect, test } from "vite-plus/test";
import { op06TheArkNoah041, op13Higuma013, op13Otama043, op13York094 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-041 The Ark Noah", () => {
  test("plays from Life and automatically rests all opposing Characters on play", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op13Higuma013, playedOnTurn: 0 }, op13Otama043, op13York094],
        activeDon: 3,
      },
      {
        life: [op06TheArkNoah041],
      },
    );
    const attackerId = engine.findCardInZone("south", "character", op13Higuma013);
    const otamaId = engine.findCardInZone("south", "character", op13Otama043);
    const yorkId = engine.findCardInZone("south", "character", op13York094);

    engine.endTurn("south");
    engine.endTurn("north");
    engine.attachDon(attackerId, 3, "south");
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

    const triggerDecision = engine.pendingDecision("lifeTrigger", "north");
    expect(triggerDecision).toMatchObject({
      actorId: "north",
      kind: "confirm",
      submit: { commandType: "resolvePrompt", promptId: triggerDecision.id },
    });
    const activeDonBeforeTrigger = engine.getView("north").players.north.activeDon;

    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.stage?.cardId).toBe(op06TheArkNoah041.id);
    expect(view.players.north.activeDon).toBe(activeDonBeforeTrigger);
    const restedById = new Map(
      view.players.south.characters.flatMap((card) =>
        card ? [[card.instanceId, card.rested] as const] : [],
      ),
    );
    expect([attackerId, otamaId, yorkId].map((instanceId) => restedById.get(instanceId))).toEqual([
      true,
      true,
      true,
    ]);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
