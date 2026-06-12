import { createMockPilot, createMockResource, createMockUnit } from "@tcg/gundam-engine";
import type { CardEffect, PilotCard } from "@tcg/gundam-types";

import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";

/**
 * 【When Paired】 trigger fixture — viewer has a pilot whose own
 * `effects` list carries a "【When Paired】 Draw 1" triggered effect,
 * plus a pairable friendly Unit on the board. Mirrors the pilot-resident
 * trigger routing in
 * `packages/engine/src/gundam/moves/core/pilot-trigger-routing.test.ts:
 * "fires a pilot's own 【When Paired】 trigger when the pilot is paired"`.
 *
 * Per rule 3-3-9-1, effects above the pilot's card name belong to the
 * pilot card — so the trigger fires on the pairing event regardless of
 * whether the unit is a Link Unit. (Contrast with 【When Linked】
 * triggers, which are gated on `isLink`.)
 */
function makePilotWithWhenPaired(): PilotCard {
  const whenPairedDraw: CardEffect = {
    type: "triggered",
    activation: { timing: ["whenPaired"] },
    directives: [{ action: { action: "draw", count: 1 } }],
    sourceText: "【When Paired】 Draw 1.",
  };
  return createMockPilot({
    name: "Amuro Ray",
    cost: 1,
    level: 1,
    apBonus: 1,
    hpBonus: 1,
    // The mock factories use `Partial<T>`; `effects` isn't in the
    // minimal default but the underlying `PilotCard` type accepts it.
    effects: [whenPairedDraw],
  } as unknown as Parameters<typeof createMockPilot>[0]);
}

export function loadWhenPairedTriggerDemo(): DevRuntime {
  return createDevRuntime({
    skipToMainPhase: true,
    p1: {
      hand: [makePilotWithWhenPaired()],
      battleArea: [
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
