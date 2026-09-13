import { describe, expect, it, vi } from "vite-plus/test";
import type { EngineInteractionView } from "@tcg/protocol";
import type { SimulatorCardAction } from "@tcg/simulator-contract";

import type { EngineAdapter } from "../game/adapter.ts";
import type { BoardProjection } from "../game/types.ts";
import {
  isDedicatedUnitAttackTargeting,
  legalAttackTargetIds,
  splitAttackCardAction,
} from "./attack-interactions.ts";
import {
  projectAttackerDirectAttackPresentation,
  projectDirectAttackPresentation,
} from "./containers/direct-attack-presentation.ts";

const baseAction: SimulatorCardAction = {
  id: "enterBattle:attacker",
  sourceEntityId: "attacker",
  label: "Attack",
  detail: "Choose a target.",
  order: 60,
  shortcut: "6",
  activation: "begin-selection",
  commandRef: "enterBattle",
  availability: { kind: "enabled" },
};

describe("Gundam attack action projection", () => {
  it("recognizes only the Unit target draft owned by the dedicated battlefield overlay", () => {
    const targetDraft = {
      active: true,
      actionId: "enterBattle",
      sourceId: "attacker",
      input: { id: "target", kind: "entity-selection" as const },
    };

    expect(isDedicatedUnitAttackTargeting(targetDraft, "attacker")).toBe(true);
    expect(isDedicatedUnitAttackTargeting(targetDraft, null)).toBe(false);
    expect(isDedicatedUnitAttackTargeting(targetDraft, "other-unit")).toBe(false);
    expect(
      isDedicatedUnitAttackTargeting(
        { ...targetDraft, input: { id: "effectTarget", kind: "entity-selection" } },
        "attacker",
      ),
    ).toBe(false);
  });

  it("splits player and Unit attacks while describing the Base damage destination", () => {
    const actions = splitAttackCardAction(
      baseAction,
      ["enemy-unit", "direct"],
      projectDirectAttackPresentation(
        viewWithDefense({ baseName: "White Base", shields: 6 }),
        "p2",
      ),
    );

    expect(actions).toMatchObject([
      {
        label: "Attack player",
        detail: "White Base would receive damage if unblocked.",
        commandRef: "enterBattle:player",
        availability: { kind: "enabled" },
      },
      {
        label: "Attack a Unit",
        detail: "Choose the legal enemy Unit on the battlefield.",
        shortcut: "9",
        commandRef: "enterBattle:unit",
        availability: { kind: "enabled" },
      },
    ]);
  });

  it("describes Shield and unprotected-player destinations", () => {
    const shield = splitAttackCardAction(
      baseAction,
      ["direct"],
      projectDirectAttackPresentation(viewWithDefense({ shields: 1 }), "p2"),
    );
    const player = splitAttackCardAction(
      baseAction,
      ["direct"],
      projectDirectAttackPresentation(viewWithDefense({ shields: 0 }), "p2"),
    );

    expect(shield[0]?.detail).toBe("The top Shield would receive damage if unblocked.");
    expect(player[0]?.detail).toBe("The opposing player would receive battle damage if unblocked.");
    expect(shield[1]?.availability).toMatchObject({
      kind: "disabled",
      reason: "There is no legal enemy Unit this Unit can attack.",
    });
  });

  it("previews Suppression damage to the first two Shields", () => {
    const directPresentation = projectAttackerDirectAttackPresentation(
      projectDirectAttackPresentation(viewWithDefense({ shields: 6 }), "p2"),
      ["Suppression"],
    );
    const actions = splitAttackCardAction(baseAction, ["direct"], directPresentation);

    expect(actions[0]).toMatchObject({
      label: "Attack player",
      detail: "The first 2 Shields would receive damage simultaneously if unblocked.",
      availability: { kind: "enabled" },
    });
  });

  it("keeps singular Shield damage copy for Suppression when only one Shield remains", () => {
    const directPresentation = projectAttackerDirectAttackPresentation(
      projectDirectAttackPresentation(viewWithDefense({ shields: 1 }), "p2"),
      ["Suppression"],
    );

    expect(directPresentation).toMatchObject({
      badgeLabel: "Direct · Shield",
      actionDetail: "The top Shield would receive damage if unblocked.",
      remainingShieldCount: 1,
    });
  });

  it("disables the player path when the engine omits the direct candidate", () => {
    const actions = splitAttackCardAction(
      baseAction,
      ["enemy-unit"],
      projectDirectAttackPresentation(viewWithDefense({ shields: 1 }), "p2"),
    );

    expect(actions[0]?.availability).toMatchObject({
      kind: "disabled",
      reason: "This Unit can't choose the opposing player as its attack target.",
    });
    expect(actions[1]?.availability).toEqual({ kind: "enabled" });
  });

  it("reads candidates from the authoritative per-attacker procedure", () => {
    const describeMove = vi.fn(() => [
      {
        kind: "selectTarget" as const,
        role: "attackTarget",
        candidateIds: ["enemy-unit", "direct"],
        minTargets: 1,
        maxTargets: 1,
      },
    ]);
    const adapter = {
      seedForCard: vi.fn(() => ({ attackerId: "attacker" })),
      describeMove,
    } as unknown as EngineAdapter;

    expect(legalAttackTargetIds(adapter, interactionView("attacker"), "attacker")).toEqual([
      "enemy-unit",
      "direct",
    ]);
    expect(describeMove).toHaveBeenCalledWith("enterBattle", { attackerId: "attacker" });
  });

  it("does not query procedures for a source the interaction view disables", () => {
    const describeMove = vi.fn();
    const adapter = {
      seedForCard: vi.fn(),
      describeMove,
    } as unknown as EngineAdapter;

    expect(legalAttackTargetIds(adapter, interactionView("other-unit"), "attacker")).toEqual([]);
    expect(describeMove).not.toHaveBeenCalled();
  });
});

function interactionView(sourceId: string): EngineInteractionView {
  return {
    protocolVersion: 2,
    gameSlug: "gundam",
    actorId: "p1",
    stateVersion: 1,
    status: "ready",
    actions: [
      {
        id: "enterBattle",
        requestId: "request",
        intent: "attack",
        text: { key: "gundam.move.enterBattle" },
        enabled: true,
        inputs: [
          {
            kind: "entity-selection",
            id: "attackerId",
            text: { key: "gundam.input.attackerId" },
            required: true,
            role: "source",
            entityKinds: ["card"],
            min: 1,
            max: 1,
            ordered: false,
            candidates: [
              {
                entity: { kind: "card", instanceId: sourceId },
                enabled: true,
              },
            ],
          },
        ],
      },
    ],
  } as EngineInteractionView;
}

function viewWithDefense({
  baseName,
  shields,
}: {
  readonly baseName?: string;
  readonly shields: number;
}): BoardProjection {
  return {
    zones: {
      zones: {
        ...(baseName
          ? {
              "baseSection:p2": {
                cards: [{ instanceId: "base", definition: { name: baseName } }],
                count: 1,
              },
            }
          : {}),
        "shieldArea:p2": { cards: [], count: shields },
      },
    },
  } as unknown as BoardProjection;
}
