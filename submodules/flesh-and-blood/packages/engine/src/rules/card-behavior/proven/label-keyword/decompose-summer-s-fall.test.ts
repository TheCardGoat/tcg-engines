/**
 * ROS040 Summer's Fall — Earth Attack with the Decompose label (CR 8.4.14).
 *
 * Printed:
 *   When this attacks, you may banish 2 Earth cards and an action card from
 *   your graveyard. If you do, put up to 1 target aura on the bottom of its
 *   owner's deck.
 *
 * Reasoning:
 * 1. Decompose is a two-group optional cost (2 Earth + 1 Action = 3 cards in
 *    distinct groups). The previous shape used a single `banish` with an
 *    `and: [Earth, {}, Action]` filter + count 2, which can only match cards
 *    that are simultaneously Earth AND Action (i.e. nothing) — so the cost
 *    could never be paid and the aura-bottom effect never fired.
 * 2. Rewired to an `optional` over a `sequence` of two banish steps: first
 *    banish 2 Earth, then banish 1 Action — matching CR 8.4.14's two groups.
 *
 * Status: ✅ cost restructured to two-group sequence (2 Earth + 1 Action).
 */
import { describe, expect, it } from "vite-plus/test";
import { summerSFallYellow } from "../../../../../../cards/src/cards/actions/summer-s-fall.ts";

/** Triggered abilities now carry their payoff under `resolution.effect`. */
const resolutionEffect = (
  ability: NonNullable<typeof summerSFallYellow.base.abilities>[number] | undefined,
) =>
  ability && ability.kind === "static" && ability.staticKind === "triggered"
    ? (ability.resolution as { kind: string; effect?: unknown }).effect
    : undefined;

describe("ROS040 Summer's Fall — Decompose (CR 8.4.14)", () => {
  it("decompose cost is a two-group sequence: 2 Earth then 1 Action", () => {
    const ability = summerSFallYellow.base.abilities?.[0];
    expect(ability?.label).toMatchObject({ name: "decompose" });
    // `optional` wrapping a `sequence` of two banish steps, then the payoff.
    const optional = resolutionEffect(ability) as
      | {
          type: string;
          effect?: unknown;
          then?: unknown;
        }
      | undefined;
    expect(optional).toBeDefined();
    if (!optional) return;
    expect(optional.type).toBe("optional");
    const sequence = optional.effect as {
      type: string;
      steps?: readonly { type: string; target?: { count?: number; filter?: unknown } }[];
    };
    expect(sequence.type).toBe("sequence");
    expect(sequence.steps).toHaveLength(2);
    // Step 1: 2 Earth cards from graveyard.
    expect(sequence.steps?.[0]?.type).toBe("banish");
    expect(sequence.steps?.[0]?.target?.count).toBe(2);
    expect(sequence.steps?.[0]?.target?.filter).toMatchObject({
      typeBox: { supertypes: ["Earth"] },
    });
    // Step 2: 1 Action card from graveyard.
    expect(sequence.steps?.[1]?.type).toBe("banish");
    expect(sequence.steps?.[1]?.target?.count).toBe(1);
    expect(sequence.steps?.[1]?.target?.filter).toMatchObject({
      typeBox: { types: ["Action"] },
    });
    // Payoff still wired through `then`.
    expect(optional.then).toBeDefined();
  });

  it("no longer carries the malformed Earth-AND-Action single-banish cost", () => {
    // The old shape combined Earth + Action under one `and:` filter, which is
    // structurally impossible to satisfy. Confirm it is gone.
    const ability = summerSFallYellow.base.abilities?.[0];
    const optional = resolutionEffect(ability) as
      | {
          effect?: { type: string; target?: { filter?: { and?: unknown } } };
        }
      | undefined;
    const inner = optional?.effect;
    // The cost is now a sequence, not a single banish with an `and` filter.
    expect(inner?.type).toBe("sequence");
    expect(inner?.target?.filter?.and).toBeUndefined();
  });
});
