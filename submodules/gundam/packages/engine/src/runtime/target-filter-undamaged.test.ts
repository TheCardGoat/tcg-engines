import { describe, it, expect } from "vite-plus/test";
import type { PlayerId } from "../types/branded.ts";
import {
  GundamTestEngine,
  PLAYER_ONE,
  buildTargetResolutionContext,
  createMockUnit,
} from "../index.ts";
import { evaluateTargetFilter } from "./target-dsl.ts";

describe("TargetFilter.state undamaged", () => {
  it("matches units with no damage counters and excludes damaged units", () => {
    const damaged = createMockUnit({ hp: 4 });
    const undamaged = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create({ play: [damaged, undamaged] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [damagedId, undamagedId] = p1.getCardsInZone("battleArea");
    engine.getG().damage[damagedId!] = 1;

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const ctx = buildTargetResolutionContext(engine.getG(), PLAYER_ONE, framework);
    const cards = framework.zones
      .getCards({ zone: "battleArea", playerId: PLAYER_ONE as PlayerId })
      .map((id) => framework.cards.get(id))
      .filter((card): card is NonNullable<typeof card> => card !== undefined);

    const matched = evaluateTargetFilter(
      { owner: "friendly", cardType: "unit", state: "undamaged" },
      cards,
      ctx,
    );

    expect(matched).toContain(undamagedId);
    expect(matched).not.toContain(damagedId);
  });
});
