import { describe, expect, it } from "vite-plus/test";

import type { GameCardData } from "../types.ts";
import { toSimulatorEntity } from "./to-simulator-entity.ts";

describe("toSimulatorEntity", () => {
  it("keeps fallback ids unique when duplicate cards provide a positional suffix", () => {
    const card: GameCardData = {
      name: "Duplicate Resource",
      cardNumber: "ST01-001",
      cardType: "resource",
    };

    const first = toSimulatorEntity(card, { zoneId: "resourceArea:player_one", entityIdSuffix: 0 });
    const second = toSimulatorEntity(card, {
      zoneId: "resourceArea:player_one",
      entityIdSuffix: 1,
    });

    expect(first.id).toBe("resourceArea:player_one:ST01-001:0");
    expect(second.id).toBe("resourceArea:player_one:ST01-001:1");
  });

  it("redacts card-specific DOM attributes for hidden cards", () => {
    const hiddenCard: GameCardData = {
      id: "engine-instance-ST01-999",
      name: "Secret Unit",
      cardNumber: "ST01-999",
      cardType: "unit",
      faceDown: true,
    };

    const entity = toSimulatorEntity(hiddenCard, {
      zoneId: "deck:player_two",
      entityIdSuffix: "top",
    });

    expect(entity.id).toBe("deck:player_two:hidden-card:top");
    expect(entity.title).toBe("Hidden card");
    expect(entity.face).toBe("hidden");
    expect(entity.dataAttributes).toEqual({
      "data-card-id": "deck:player_two:hidden-card:top",
      "data-entity-id": "deck:player_two:hidden-card:top",
      "data-sim-entity-id": "deck:player_two:hidden-card:top",
      "data-sim-zone-id": "deck:player_two",
    });
  });
});
