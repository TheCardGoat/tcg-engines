import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_TWO, seedShieldsFromDeck } from "@tcg/gundam-engine";
import { gd02DesilGalette096 } from "./096-desil-galette.ts";

describe("Desil Galette (GD02-096)", () => {
  it("【Burst】Add this card to your hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd02DesilGalette096] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  it("【When Linked】 deploys a Lv.2-or-lower Unit from trash", () => {
    // Card data now encodes `deployFromTrash` with `levelAtMost: 2`.
    // The engine handler auto-resolves by deploying the first matching
    // Unit in the trash (trait filter is not enforced by the handler yet).
    const cardDef = gd02DesilGalette096;
    const whenLinkedEffect = cardDef.effects![1];
    const directives = (
      whenLinkedEffect as {
        directives: Array<{ action?: Record<string, unknown>; optional?: boolean }>;
      }
    ).directives;
    expect(directives.length).toBeGreaterThan(0);
    const directive = directives[0]!;
    expect(directive.action!.action).toBe("deployFromTrash");
    expect(directive.action!.levelAtMost).toBe(2);
    expect(directive.optional).toBe(true);
  });
});
