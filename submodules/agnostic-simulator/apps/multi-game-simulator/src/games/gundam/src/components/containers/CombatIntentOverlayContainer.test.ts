import { describe, expect, test } from "vite-plus/test";

import type { BoardProjection } from "../../game/types.ts";
import { projectGundamCombatIntent } from "./CombatIntentOverlayContainer.tsx";

describe("projectGundamCombatIntent", () => {
  test("projects a direct attack to the defending player", () => {
    const intent = projectGundamCombatIntent(viewWithCombat({ target: "direct" }));

    expect(intent).toMatchObject({
      attackerEntityId: "attacker",
      declaredTarget: { kind: "player", id: "p2" },
      currentTarget: { kind: "player", id: "p2" },
      phase: "declared",
      attackKind: "direct",
    });
    expect(intent?.ariaLabel).toContain("Attacker attacks the opposing player");
  });

  test("identifies a Base as the direct-attack damage destination", () => {
    const intent = projectGundamCombatIntent(
      viewWithCombat({ target: "direct", baseName: "Colony Base", shields: 6 }),
    );

    expect(intent).toMatchObject({
      declaredTarget: { kind: "player", id: "p2" },
      declaredTargetLabel: "Direct · Base",
    });
    expect(intent?.ariaLabel).toContain("Colony Base would receive damage if unblocked");
  });

  test("identifies the top Shield when no Base can absorb the direct attack", () => {
    const intent = projectGundamCombatIntent(viewWithCombat({ target: "direct", shields: 6 }));

    expect(intent).toMatchObject({
      declaredTarget: { kind: "player", id: "p2" },
      declaredTargetLabel: "Direct · Shield",
    });
    expect(intent?.ariaLabel).toContain("top Shield would receive damage if unblocked");
  });

  test("keeps the original Unit and projects a blocker as the current target", () => {
    const intent = projectGundamCombatIntent(
      viewWithCombat({ target: "original", blockerId: "blocker", stage: "action-step" }),
    );

    expect(intent).toMatchObject({
      declaredTarget: { kind: "entity", id: "original" },
      currentTarget: { kind: "entity", id: "blocker" },
      phase: "redirected",
      attackKind: "fight",
      declaredTargetLabel: "Protected · Original",
      currentTargetLabel: "Attacks blocker",
    });
    expect(intent?.ariaLabel).toContain("Blocker blocks");
  });

  test("keeps a blocked direct attack anchored to the defending player", () => {
    const intent = projectGundamCombatIntent(
      viewWithCombat({ target: "direct", blockerId: "blocker", stage: "action-step" }),
    );

    expect(intent).toMatchObject({
      declaredTarget: { kind: "player", id: "p2" },
      currentTarget: { kind: "entity", id: "blocker" },
      phase: "redirected",
      attackKind: "direct",
      declaredTargetLabel: "Direct attack blocked",
      currentTargetLabel: "Attacks blocker",
    });
  });

  test("clears the relationship when projected combat ends", () => {
    const view = viewWithCombat({ target: "original" });
    (view.G as { turnMetadata: { pendingCombat?: unknown } }).turnMetadata.pendingCombat =
      undefined;
    expect(projectGundamCombatIntent(view)).toBeNull();
  });
});

function viewWithCombat(
  overrides: Partial<{
    target: string;
    blockerId: string;
    stage: string;
    baseName: string;
    shields: number;
  }>,
): BoardProjection {
  return {
    G: {
      turnMetadata: {
        pendingCombat: {
          stage: overrides.stage ?? "block-step",
          attackerId: "attacker",
          attackerPlayerId: "p1",
          target: overrides.target ?? "original",
          ...(overrides.blockerId ? { blockerId: overrides.blockerId } : {}),
        },
      },
    },
    players: [{ playerId: "p1" }, { playerId: "p2" }],
    zones: {
      zones: {
        "battleArea:p1": {
          cards: [card("attacker", "Attacker")],
        },
        "battleArea:p2": {
          cards: [card("original", "Original"), card("blocker", "Blocker")],
        },
        ...(overrides.baseName
          ? {
              "baseSection:p2": {
                cards: [card("base", overrides.baseName)],
                count: 1,
              },
            }
          : {}),
        "shieldArea:p2": {
          cards: [],
          count: overrides.shields ?? 0,
        },
      },
    },
  } as unknown as BoardProjection;
}

function card(instanceId: string, name: string) {
  return { instanceId, definition: { name } };
}
