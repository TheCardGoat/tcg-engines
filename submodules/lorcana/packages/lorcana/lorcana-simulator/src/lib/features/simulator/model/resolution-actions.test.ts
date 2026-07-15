import { describe, expect, it, mock } from "bun:test";

import { buildResolutionActionViews } from "@/features/simulator/model/resolution-actions.js";
import type { PendingEffectsPopoverItem } from "@/features/simulator/context/game-context.svelte.js";

const labels = {
  acceptEffect: "Accept effect",
  arrangeCards: "Arrange cards",
  declineEffect: "Decline effect",
  resolveEffect: "Resolve effect",
  resolveTriggeredAbility: "Resolve triggered ability",
};

function createItem(overrides: Partial<PendingEffectsPopoverItem>): PendingEffectsPopoverItem {
  return {
    id: "item",
    kind: "pending",
    title: "Maleficent - Sorceress",
    subtitle: "Pending resolution",
    detail: "Resolve this effect.",
    badge: "Pending",
    card: null,
    ...overrides,
  };
}

describe("buildResolutionActionViews", () => {
  it("builds a bag resolution action from an actionable bag item", () => {
    const onResolve = mock(() => {});

    const actions = buildResolutionActionViews({
      items: [
        createItem({
          id: "bag:1",
          kind: "bag",
          title: "Julieta Madrigal",
          canResolve: true,
          onResolve,
        }),
      ],
      labels,
    });

    expect(actions).toHaveLength(1);
    expect(actions[0]).toMatchObject({
      label: "Resolve triggered ability",
      detail: "Julieta Madrigal",
      emphasis: true,
    });
    actions[0]?.onClick();
    expect(onResolve).toHaveBeenCalledTimes(1);
  });

  it("builds direct accept and decline actions for optional bag items", () => {
    const onAccept = mock(() => {});
    const onReject = mock(() => {});

    const actions = buildResolutionActionViews({
      items: [
        createItem({
          id: "bag:optional",
          kind: "bag",
          title: "Doc - Bold Knight",
          canAccept: true,
          canReject: true,
          onAccept,
          onReject,
        }),
      ],
      labels,
    });

    expect(actions).toHaveLength(2);
    expect(actions[0]).toMatchObject({
      label: "Accept effect",
      detail: "Doc - Bold Knight",
      emphasis: true,
    });
    expect(actions[1]).toMatchObject({
      label: "Decline effect",
      detail: "Doc - Bold Knight",
    });

    actions[0]?.onClick();
    actions[1]?.onClick();
    expect(onAccept).toHaveBeenCalledTimes(1);
    expect(onReject).toHaveBeenCalledTimes(1);
  });

  it("builds accept and decline actions for an active optional effect", () => {
    const onAccept = mock(() => {});
    const onReject = mock(() => {});

    const actions = buildResolutionActionViews({
      items: [
        createItem({
          id: "pending:optional",
          isActive: true,
          canAccept: true,
          canReject: true,
          onAccept,
          onReject,
        }),
      ],
      labels,
    });

    expect(actions).toHaveLength(2);
    expect(actions[0]).toMatchObject({
      label: "Accept effect",
      detail: "Maleficent - Sorceress",
      emphasis: true,
    });
    expect(actions[1]).toMatchObject({
      label: "Decline effect",
      detail: "Maleficent - Sorceress",
    });
  });

  it("builds a direct resolve action for a simple active pending effect", () => {
    const onResolve = mock(() => {});

    const actions = buildResolutionActionViews({
      items: [
        createItem({
          id: "pending:simple",
          isActive: true,
          canResolve: true,
          onResolve,
        }),
        createItem({
          id: "pending:inactive",
          canResolve: true,
          onResolve,
        }),
      ],
      labels,
    });

    expect(actions.map((action) => action.label)).toEqual(["Resolve effect"]);
    expect(actions[0]?.detail).toBe("Maleficent - Sorceress");
  });

  it("prefers the summary title when a pending effect is instance-bound", () => {
    const onAccept = mock(() => {});

    const actions = buildResolutionActionViews({
      items: [
        createItem({
          id: "pending:instance-bound",
          isActive: true,
          canAccept: true,
          summaryTitle:
            "Resolving Belle - Snowfield Strategist: ICE ARCHERY targeting Belle - Accomplished Mystic.",
          onAccept,
        }),
      ],
      labels,
    });

    expect(actions).toHaveLength(1);
    expect(actions[0]?.detail).toBe(
      "Resolving Belle - Snowfield Strategist: ICE ARCHERY targeting Belle - Accomplished Mystic.",
    );
  });
});
