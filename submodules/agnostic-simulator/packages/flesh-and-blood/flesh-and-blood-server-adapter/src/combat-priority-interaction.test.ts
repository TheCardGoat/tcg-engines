import { describe, expect, it } from "vitest";
import { buildInteractionSubmissionForActionId } from "@tcg/protocol";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { CATALOG_TEST_DEFINITIONS, catalogIds } from "@tcg/flesh-and-blood-engine/automation";
import { FleshAndBloodServerEngine } from "./server-engine.ts";

describe("FAB combat priority interaction", () => {
  it("projects defense declaration before attacker priority", () => {
    const game = FabTestEngine.create(
      {
        player1: {
          heroCardId: catalogIds.rhinar,
          hand: [catalogIds.snatch],
          deck: 6,
        },
        player2: {
          heroCardId: catalogIds.bravo,
          hand: [],
          deck: 6,
        },
        cardDefinitions: CATALOG_TEST_DEFINITIONS,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(catalogIds.rhinar).attackWith(catalogIds.snatch);
    const engine = new FleshAndBloodServerEngine(game.getRuntime());

    expect(game.getState().priority).toBeNull();
    expect(engine.getActivePlayerId()).toBe("player-2");
    const attackerView = engine.getInteractionView("player-1");
    const defenderView = engine.getInteractionView("player-2");
    expect(attackerView.actions.every((action) => action.intent === "concede")).toBe(true);
    const noBlock = defenderView.actions.find((action) => action.text.key === "Do not defend");
    expect(noBlock).toBeDefined();
    expect(noBlock?.intent).toBe("pass");

    const submission = buildInteractionSubmissionForActionId({
      view: defenderView,
      actionId: noBlock!.id,
    });
    expect(submission).not.toBeNull();
    const result = engine.submitInteraction("player-2", submission!, {
      gameId: "combat-priority-interaction",
      sourceAuthority: "server",
    });

    expect(result.success).toBe(true);
    expect(game.getState().combat).toMatchObject({
      step: "defend",
      defenseDeclarationPending: false,
    });
    expect(game.getState().priority?.holderPlayerId).toBe("player-1");
    expect(engine.getActivePlayerId()).toBe("player-1");
    expect(
      engine.getInteractionView("player-1").actions.some((action) => action.intent === "pass"),
    ).toBe(true);
    expect(
      engine.getInteractionView("player-2").actions.every((action) => action.intent === "concede"),
    ).toBe(true);
  });
});
