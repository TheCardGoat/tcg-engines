import { describe, expect, it } from "bun:test";
import type { LorcanaServer } from "@tcg/lorcana-engine";
import { LorcanaServerEngine } from "./lorcana-server-engine";

describe("LorcanaServerEngine static card resources", () => {
  it("shares the complete immutable card map with every viewer", () => {
    const engine = new LorcanaServerEngine({
      getRuntime: () => ({
        getFilteredView: () => ({
          ctx: { zones: { private: { cardIndex: { visible_1: {} } } } },
        }),
      }),
      getCardsMaps: () => ({
        cardInstances: {
          visible_1: "card-visible",
          hidden_sentinel: "SECRET-DEFINITION",
        },
        owners: {
          p1: ["visible_1"],
          p2: ["hidden_sentinel"],
        },
      }),
      getBoard: () => {
        throw new Error("viewer resources must not depend on the dynamic board projection");
      },
    } as unknown as LorcanaServer);

    const completeResources = {
      cardsMaps: {
        cardInstances: {
          visible_1: "card-visible",
          hidden_sentinel: "SECRET-DEFINITION",
        },
        owners: { p1: ["visible_1"], p2: ["hidden_sentinel"] },
      },
    };

    expect(engine.getViewerResources({ role: "player", actorId: "p1" })).toEqual(completeResources);
    expect(engine.getViewerResources({ role: "spectator" })).toEqual(completeResources);
    expect(engine.getViewerResources({ role: "replay" })).toEqual(completeResources);
  });
});
