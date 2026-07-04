import { expect } from "vite-plus/test";
import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { CyberpunkTestEngine, P1 } from "../testing/index.ts";

export function expectLegendCanBeCalled(card: LegendCardDefinition): void {
  const engine = CyberpunkTestEngine.createWithFixture({
    legendArea: [{ card, faceDown: true }],
    eddies: 1,
  });

  engine.callLegend(card, { as: P1 });

  expect(engine.getCard(card, "legendArea", P1).meta.faceDown).toBe(false);
  expect(engine.getEddies(P1)).toBe(0);
}
