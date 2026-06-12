import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  createMockUnit,
  enqueueOwnCardTriggers,
  expectSuccess,
} from "@tcg/gundam-engine";
import type { PlayerId } from "@tcg/gundam-engine";
import { gd03HyGogg024 } from "./024-hy-gogg.ts";

describe("Hy-Gogg (GD03-024)", () => {
  it("【When Linked】 deploys a rested Hy-Gogg token when another Cyclops Team Unit is in play", () => {
    const pilot = createMockPilot({ traits: ["cyclops team"] });
    const ally = createMockUnit({ traits: ["cyclops team"] });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd03HyGogg024, ally],
        resourceArea: activeResources(3),
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hyGoggId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, hyGoggId));
    const pilotId = p1
      .getCardsInZone("battleArea")
      .find((id) => id !== hyGoggId && id !== p1.getCardsInZone("battleArea")[1]);
    engine.getRuntime().runTestMutation(PLAYER_ONE as PlayerId, ({ G, framework }) => {
      enqueueOwnCardTriggers(
        G,
        { type: "pilotPaired", pilotId, unitId: hyGoggId, playerId: PLAYER_ONE, isLink: true },
        hyGoggId,
        PLAYER_ONE,
        framework,
      );
    });

    const tokenId = p1.getCardsInZone("battleArea").at(-1)!;
    const token = engine.getRuntime().getFrameworkReadAPI().cards.getDefinition(tokenId);
    expect(token?.name).toBe("Hy-Gogg");
    expect(engine.getG().exhausted[tokenId]).toBe(true);
  });
});
