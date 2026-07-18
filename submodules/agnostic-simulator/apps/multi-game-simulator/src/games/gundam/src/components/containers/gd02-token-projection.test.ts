import { describe, expect, it } from "vite-plus/test";

import { gd02DaughtressWeapon043 } from "@tcg/gundam-cards";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";

import { toSimulatorEntity } from "../ui/card/to-simulator-entity.ts";
import { applyLiveStateUpdate, createLiveMatchViewerEngine } from "../../engine/live/liveState.ts";
import { mapZone, toGameCardData } from "./mappers.ts";

describe("GD02 token cards in the simulator projection", () => {
  it("hydrates T-012 Daughtress after a live update and a cold join", () => {
    const newUneAlly = createMockUnit({ traits: ["new une"] });
    const serverEngine = GundamTestEngine.create({
      hand: [gd02DaughtressWeapon043],
      play: [newUneAlly],
      resourceArea: activeResources(2),
    });
    const live = createLiveMatchViewerEngine(serializedState(serverEngine));

    expectSuccess(serverEngine.asPlayer(PLAYER_ONE).deployUnit(gd02DaughtressWeapon043));
    const tokenState = serializedState(serverEngine);
    applyLiveStateUpdate(live.runtime, live.staticResources, tokenState);
    const joinedAfterDeployment = createLiveMatchViewerEngine(tokenState);

    for (const runtime of [live.runtime, joinedAfterDeployment.runtime]) {
      const view = runtime.getFilteredView({ role: "player", playerId: PLAYER_ONE });
      const visibleCards = mapZone(view, "battleArea", PLAYER_ONE).map((card) =>
        toGameCardData(view, card),
      );
      const daughtress = visibleCards.find((card) => card.cardNumber === "T-012");

      expect(daughtress).toMatchObject({
        name: "Daughtress",
        ap: 0,
        hp: 1,
        traits: ["new une"],
      });

      const entity = toSimulatorEntity(daughtress!, {
        zoneId: `battleArea:${PLAYER_ONE}`,
      });
      expect(entity.title).toBe("Daughtress");
      expect(entity.face).toBe("public");
      expect(entity.imageUrl).toBe("https://r2.tcg.online/public/gundam/cards/t/T-012.webp");
      expect(entity.stats).toEqual(
        expect.arrayContaining([
          { label: "AP", value: "0" },
          { label: "HP", value: "1" },
        ]),
      );
    }
  });
});

function serializedState(engine: GundamTestEngine): Record<string, unknown> {
  return structuredClone(engine.getState()) as unknown as Record<string, unknown>;
}
