// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";
import { waitFor } from "@testing-library/react";

import { renderSimulator } from "../../test/renderSimulator.tsx";
import { findCardsById } from "../../test/queries.ts";
import { createDevRuntime, DEV_PLAYER_ONE } from "../../game/dev-runtime.ts";
import {
  realResourceCards,
  st01Gundam001,
  st01Guntank004,
} from "../../game/fixtures/real-cards.ts";

/**
 * End-to-end coverage for the damage badge. The code path has existed
 * since the original CardFace rewrite, but we've never had a test that
 * landed a survivor with damage and asserted the badge is painted —
 * regressions in the `G.damage` plumbing (keyed by `data-card-id`) would
 * otherwise only surface in manual QA.
 *
 * The visual state uses two production Units with different damage values so
 * QA can compare the badge across card frames and counter widths.
 */
describe("Damage badge · integration", () => {
  it("renders the damage badge on a unit that survived an attack", async () => {
    const { dev } = renderSimulator(() =>
      createDevRuntime({
        skipToMainPhase: true,
        p1: {
          battleArea: [
            { card: st01Guntank004, damage: 2 },
            { card: st01Gundam001, damage: 1 },
          ],
          resourceArea: realResourceCards(4),
          deck: 30,
          resourceDeck: 10,
        },
        p2: { deck: 30, resourceDeck: 10 },
      }),
    );

    const battleIds =
      dev.runtime.getState().ctx.zones.private.zoneCards[`battleArea:${DEV_PLAYER_ONE}`] ?? [];
    expect(battleIds).toHaveLength(2);
    const [guntankId, gundamId] = battleIds;

    await waitFor(() => {
      const node = findCardsById(guntankId)[0];
      expect(node, "expected Guntank's card face in the DOM").toBeDefined();
      const damageCounter = node!.querySelector("[data-testid='damage-counter-overlay']");
      expect(damageCounter).not.toBeNull();
      expect(damageCounter!.textContent).toBe("DMG2");
      expect(damageCounter!.getAttribute("aria-label")).toBe("This card has taken 2 damage.");
    });

    await waitFor(() => {
      const node = findCardsById(gundamId!)[0];
      const damageCounter = node?.querySelector("[data-testid='damage-counter-overlay']");
      expect(damageCounter?.textContent).toBe("DMG1");
    });
  });
});
