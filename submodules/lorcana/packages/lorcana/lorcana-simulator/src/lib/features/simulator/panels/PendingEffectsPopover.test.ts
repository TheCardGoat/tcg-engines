import { describe, expect, it } from "bun:test";
import { render } from "svelte/server";

import PendingEffectsPopover from "@/features/simulator/panels/PendingEffectsPopover.svelte";
import type { PendingEffectsPopoverItem } from "@/features/simulator/context/game-context.svelte.js";

const baseItem: PendingEffectsPopoverItem = {
  id: "pending:1",
  kind: "pending",
  title: "Maleficent - Sorceress",
  summaryTitle: "Maleficent - Sorceress",
  subtitle: "Pending effect",
  detail: "Resolve this effect.",
  badge: "Pending",
  card: null,
  canResolve: true,
  onResolve: () => {},
};

describe("PendingEffectsPopover", () => {
  it("renders the top-right reminder chip even when the panel is collapsed", () => {
    const { body } = render(PendingEffectsPopover, {
      props: {
        items: [baseItem],
        open: false,
      },
    });

    expect(body).toContain("pending-effects-reminder");
    expect(body).toContain("Effects");
    expect(body).toContain(">1<");
    expect(body).not.toContain('id="pending-effects-panel"');
  });

  it("renders the full panel when opened", () => {
    const { body } = render(PendingEffectsPopover, {
      props: {
        items: [
          baseItem,
          {
            ...baseItem,
            id: "bag:1",
            kind: "bag",
            badge: "Bag",
            subtitle: "Triggered ability in bag",
          },
        ],
        open: true,
      },
    });

    expect(body).toContain("pending-effects-reminder");
    expect(body).toContain('id="pending-effects-panel"');
    expect(body).toContain("Pending effects");
    expect(body).toContain("Resolve triggers");
  });
});
