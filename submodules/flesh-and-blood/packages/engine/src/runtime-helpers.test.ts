import { describe, expect, it } from "vitest";
import { registerFabTestObject } from "./testing/test-fixtures.ts";
import { FabTestEngine } from "./testing/test-engine.ts";
import { objectControllerSeat, targetControllerFromDeclaredTargets } from "./runtime-helpers.ts";
import type { FabTargetMap } from "./rules/targets.ts";

function state() {
  return FabTestEngine.createStateForRulesTest({
    seed: "controller-seat",
    player1Id: "p1",
    player2Id: "p2",
    cardsMaps: { canonicalIdsByInstance: {}, owners: { p1: [], p2: [] } },
  });
}

function register(match: ReturnType<typeof state>, instanceId: string, canonicalId: string) {
  registerFabTestObject(match, instanceId, canonicalId, "p2");
  match.cardDefinitions[canonicalId] = {
    canonicalId,
    slug: canonicalId,
    base: {
      names: [canonicalId],
      activeFaceIds: [`${canonicalId}:face:front`],
      color: null,
      typeBoxes: [{ metatypes: [], supertypes: [], types: ["Action"], subtypes: [] }],
      typeBox: { metatypes: [], supertypes: [], types: ["Action"], subtypes: [] },
      traits: [],
      textBoxIds: [canonicalId],
      numeric: {},
      keywords: [],
      abilities: [],
    },
    layout: { kind: "single" },
  };
}

function declaredWith(instanceId: string, incarnation: number): FabTargetMap {
  return {
    cost: [{ kind: "object", ref: { instanceId, incarnation } }],
  } as unknown as FabTargetMap;
}

describe("objectControllerSeat (control follows the live seat)", () => {
  it("resolves the stealing player's seat for an opponent-owned arena object", () => {
    const match = state();
    register(match, "stolen-aura", "aura-definition");
    // CR 8.5.53/8.5.54 steal: the object physically re-seats into the
    // controller's arena; ownerId stays with the victim.
    match.containers.zonesByPlayerId.p1!.arena = ["stolen-aura"];

    expect(objectControllerSeat(match, "stolen-aura")).toBe("p1");
    expect(targetControllerFromDeclaredTargets(match, declaredWith("stolen-aura", 1))).toBe("p1");
  });

  it("uncontrolled zones fall back to the owner", () => {
    const match = state();
    register(match, "held-card", "held-definition");
    match.containers.zonesByPlayerId.p2!.hand = ["held-card"];

    expect(objectControllerSeat(match, "held-card")).toBe(null);
    expect(targetControllerFromDeclaredTargets(match, declaredWith("held-card", 1))).toBe("p2");
  });
});
