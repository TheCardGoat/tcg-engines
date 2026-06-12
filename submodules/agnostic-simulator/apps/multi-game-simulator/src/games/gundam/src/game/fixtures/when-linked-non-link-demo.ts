import { createMockPilot, createMockResource, createMockUnit } from "@tcg/gundam-engine";
import type { CardEffect, PilotCard } from "@tcg/gundam-types";

import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";

/**
 * 【When Linked】 gating fixture — a pilot with a `whenLinked` trigger
 * plus a Unit with NO `linkCondition`. Mirrors
 * `packages/engine/src/gundam/moves/core/pilot-trigger-routing.test.ts:
 * "fires a pilot's own 【When Linked】 trigger only on a link pairing"`
 * (the negative half). Per rule 3-2-6-2, `isLink` evaluates false for
 * a unit without a `linkCondition`, so the trigger must NOT fire on
 * the pairing.
 *
 * This is the mirror image of `when-paired-trigger-demo`: both
 * fixtures seat a pilot + unit on the same shape, but the pilot's
 * trigger timing is different (`whenPaired` vs `whenLinked`) and the
 * pairing is non-link here. The observable contrast is whether the
 * draw fires: hand goes 1 → 1 when it does, 1 → 0 when it doesn't.
 */
function makePilotWithWhenLinked(): PilotCard {
  const whenLinkedDraw: CardEffect = {
    type: "triggered",
    activation: { timing: ["whenLinked"] },
    directives: [{ action: { action: "draw", count: 1 } }],
    sourceText: "【When Linked】 Draw 1.",
  };
  return createMockPilot({
    name: "Amuro Ray",
    cost: 1,
    level: 1,
    apBonus: 1,
    hpBonus: 1,
    effects: [whenLinkedDraw],
  } as unknown as Parameters<typeof createMockPilot>[0]);
}

export function loadWhenLinkedNonLinkDemo(): DevRuntime {
  return createDevRuntime({
    skipToMainPhase: true,
    p1: {
      hand: [makePilotWithWhenLinked()],
      battleArea: [
        // No `linkCondition` — pairing this with ANY pilot is a
        // non-link pair, so 【When Linked】 must NOT fire.
        createMockUnit({ cost: 2, level: 2, ap: 2, hp: 4, color: "white", name: "Guncannon" }),
      ],
      resourceArea: [createMockResource(), createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      deck: 30,
      resourceDeck: 10,
    },
  });
}
