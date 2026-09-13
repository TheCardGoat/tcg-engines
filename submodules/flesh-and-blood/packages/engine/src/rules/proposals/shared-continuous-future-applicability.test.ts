/**
 * continuousFutureApplicability — the count latch for "your/its NEXT attack"
 * riders (sharpen swords, Cut N' Carve, Sharp Incline, Indefensibly Honed).
 *
 * A missing appliesTo.count under `attacksOf` must stay unbounded
 * ({type:"all"} → Infinity), while an explicit `count: 1` must produce a
 * single-use latch that the per-application decrement can exhaust. The card
 * level cannot currently prove exhaustion behaviorally — every Sword in the
 * catalog is Once-per-Turn — so this primitive contract is pinned here.
 */
import { describe, expect, it } from "vitest";

import type { FabEffect } from "@tcg/flesh-and-blood-types";

import { continuousFutureApplicability } from "./shared.ts";

describe("continuousFutureApplicability count latch", () => {
  const grantRider = (appliesTo: NonNullable<FabEffect["appliesTo"]>): FabEffect => ({
    type: "grant-property",
    property: { kind: "keyword", keyword: { name: "dominate" } },
    target: { selector: "self" },
    duration: "this-turn",
    appliesTo,
  });

  it("an explicit count of 1 yields an exhaustible one-shot latch", () => {
    const future = continuousFutureApplicability(
      grantRider({
        attacksOf: true,
        count: 1,
        next: { typeBox: { types: ["Weapon"] } },
        events: ["attack"],
      }),
    );
    expect(future).not.toBeNull();
    expect(future!.count).toBe(1);
    expect(future!.events).toEqual(["attack"]);
  });

  it("a missing count under attacksOf stays deliberately unbounded", () => {
    const future = continuousFutureApplicability(
      grantRider({ attacksOf: true, next: { typeBox: { types: ["Weapon"] } } }),
    );
    expect(future).not.toBeNull();
    expect(future!.count).toBe(Number.POSITIVE_INFINITY);
  });
});
