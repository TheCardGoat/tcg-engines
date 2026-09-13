import { describe, expect, it } from "vitest";
import type { FabCardLayout, FabPairedCardFace } from "@tcg/flesh-and-blood-types";
import { fabObjectInstanceId } from "./identity.ts";
import {
  deriveFabHostBySubcardId,
  planFabHostDeparture,
  planFabTransformTopology,
  validateFabHostedCardTopology,
  type FabHostedCardTopology,
} from "./hosted-cards.ts";

const id = fabObjectInstanceId;
const all = new Set(["evo", "base", "material", "prior-evo", "other"]);

describe("hosted-card topology", () => {
  it("models an Invocation as one explicit physical flip pair", () => {
    const pairedFace = (faceId: FabPairedCardFace["faceId"], name: string): FabPairedCardFace => ({
      faceId,
      name,
      typeText: "Illusionist Action - Invocation",
      types: ["Illusionist", "Action", "Invocation"],
      traits: [],
      text: "",
      keywords: [],
      abilities: [],
    });
    const layout = {
      kind: "flip",
      family: "invocation",
      front: pairedFace("UPR017:face:front", "Invoke Yendurai"),
      back: pairedFace("UPR017:face:back", "Yendurai"),
    } satisfies FabCardLayout;
    expect(layout.front.faceId).toBe("UPR017:face:front");
    expect(layout.back.faceId).toBe("UPR017:face:back");
  });

  it("derives the reverse lookup from one ordered authority", () => {
    const topology: FabHostedCardTopology = { evo: [id("base"), id("material")] };
    expect(deriveFabHostBySubcardId(topology)).toEqual({ base: "evo", material: "evo" });
    expect(() => deriveFabHostBySubcardId({ evo: [id("base")], other: [id("base")] })).toThrowError(
      "hosted by both",
    );
  });

  it("rejects missing, top-level, duplicate, empty, and cyclic sub-card state", () => {
    const context = { objectIds: all, topLevelObjectIds: new Set(["evo", "other"]) };
    expect(() => validateFabHostedCardTopology({ evo: [] }, context)).toThrowError("empty host");
    expect(() => validateFabHostedCardTopology({ missing: [id("base")] }, context)).toThrowError(
      "missing host",
    );
    expect(() => validateFabHostedCardTopology({ evo: [id("missing")] }, context)).toThrowError(
      "missing sub-card",
    );
    expect(() => validateFabHostedCardTopology({ evo: [id("other")] }, context)).toThrowError(
      "top-level container",
    );
    expect(() =>
      validateFabHostedCardTopology(
        { evo: [id("base")], other: [id("base")] },
        { objectIds: all, topLevelObjectIds: new Set(["evo", "other"]) },
      ),
    ).toThrowError("hosted by both");
    expect(() =>
      validateFabHostedCardTopology(
        { evo: [id("base")], base: [id("evo")] },
        { objectIds: all, topLevelObjectIds: new Set(["other"]) },
      ),
    ).toThrowError("cycle");
  });

  it("atomically flattens nested source trees under the destination in source order", () => {
    const result = planFabTransformTopology({
      topology: { "prior-evo": [id("base"), id("material")] },
      context: {
        objectIds: all,
        topLevelObjectIds: new Set(["evo", "prior-evo", "other"]),
      },
      sourceIds: [id("prior-evo"), id("other")],
      destination: { kind: "resolving-card", hostId: id("evo") },
    });
    expect(result.newSubcardIds).toEqual(["prior-evo", "other"]);
    expect(result.topology).toEqual({
      evo: ["prior-evo", "base", "material", "other"],
    });
  });

  it("fails a multi-source transform as a whole when any source is invalid", () => {
    const topology = { "prior-evo": [id("base")] } satisfies FabHostedCardTopology;
    expect(() =>
      planFabTransformTopology({
        topology,
        context: { objectIds: all, topLevelObjectIds: new Set(["evo", "prior-evo"]) },
        sourceIds: [id("prior-evo"), id("material")],
        destination: { kind: "existing-permanent", hostId: id("evo") },
      }),
    ).toThrowError("source material is not a top-level");
    expect(topology).toEqual({ "prior-evo": ["base"] });
  });

  it("preserves the tree for a same-object move and clears all descendants when the host ceases", () => {
    const topology = {
      evo: [id("prior-evo"), id("other")],
      "prior-evo": [id("base"), id("material")],
    } satisfies FabHostedCardTopology;
    const context = { objectIds: all, topLevelObjectIds: new Set(["evo"]) };
    expect(
      planFabHostDeparture({ topology, context, hostId: id("evo"), hostRemainsSameObject: true }),
    ).toEqual({ kind: "preserve", topology });
    expect(
      planFabHostDeparture({ topology, context, hostId: id("evo"), hostRemainsSameObject: false }),
    ).toEqual({
      kind: "clear",
      topology: {},
      clearSubcardIds: ["prior-evo", "base", "material", "other"],
    });
  });
});
