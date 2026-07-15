import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03MikhailKaminsky090 } from "../pilot/090-mikhail-kaminsky.ts";
import { gd03HyGogg024 } from "./024-hy-gogg.ts";

describe("Hy-Gogg (GD03-024)", () => {
  it("【When Linked】 deploys a rested Hy-Gogg token when another Cyclops Team Unit is in play", () => {
    const ally = createMockUnit({ traits: ["cyclops team"] });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03MikhailKaminsky090],
        play: [gd03HyGogg024, ally],
        resourceArea: activeResources(4),
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hyGoggId = p1.getCardsInZone("battleArea")[0]!;
    const before = new Set(p1.getCardsInZone("battleArea"));

    expectSuccess(p1.assignPilot(gd03MikhailKaminsky090, hyGoggId));

    const newIds = p1.getCardsInZone("battleArea").filter((id) => !before.has(id));
    const pilotId = p1.getPilotId(hyGoggId);
    const tokenId = newIds.find((id) => id !== pilotId);
    expect(tokenId).toBeDefined();
    expect(p1.getVisibleCard(tokenId!)).toMatchObject({
      effectiveAp: 2,
      effectiveHp: 1,
      exhausted: true,
    });
  });

  it("does not deploy a token without another Cyclops Team Unit", () => {
    const engine = GundamTestEngine.create({
      hand: [gd03MikhailKaminsky090],
      play: [gd03HyGogg024],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hyGoggId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd03MikhailKaminsky090, hyGoggId));

    expect(p1.getCardsInZone("battleArea")).toHaveLength(2);
  });
});
