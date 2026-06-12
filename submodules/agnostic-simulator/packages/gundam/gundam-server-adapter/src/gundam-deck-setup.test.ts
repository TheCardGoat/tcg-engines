import { describe, expect, it } from "vite-plus/test";
import { splitDeckByType } from "./gundam-deck-setup.js";

describe("Gundam deck setup", () => {
  it("splits resource definitions by native Gundam card type", () => {
    const cardsMaps = {
      cardInstances: {
        p1_unit_1: "GD01-001",
        p1_resource_1: "RP-003",
        p1_unknown_1: "missing-card",
      },
      owners: {
        p1: ["p1_unit_1", "p1_resource_1", "p1_unknown_1"],
      },
    };
    const catalog = {
      get(definitionId: string) {
        if (definitionId === "GD01-001") return { type: "unit" };
        if (definitionId === "RP-003") return { type: "resource" };
        return undefined;
      },
    };

    expect(splitDeckByType(cardsMaps.owners.p1, cardsMaps, catalog)).toEqual({
      deck: ["GD01-001", "missing-card"],
      resourceDeck: ["RP-003"],
    });
  });
});
