import { describe, expect, it } from "bun:test";
import type { CardInstanceId } from "#core";
import type { PropertyModificationEffect } from "@tcg/lorcana-types";
import type { PlayCardExecutionContext } from "../types";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../../testing/unit-harness";
import { resolvePropertyModificationEffect } from "../property-modification-effect";

const TGT = "tgt" as CardInstanceId;

function readClassifications(
  ctx: PlayCardExecutionContext,
  id: CardInstanceId,
): Record<string, unknown> | undefined {
  const card = ctx.cards.get(id);
  const meta = card?.meta as { temporaryClassifications?: Record<string, unknown> } | undefined;
  return meta?.temporaryClassifications;
}

describe("property-modification", () => {
  it("records a temporary classification grant on the chosen target", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": [TGT] },
      definitions: { tgt: { id: "tgt", cardType: "character" } },
    });
    const effect = {
      type: "property-modification",
      property: "classification",
      operation: "add",
      value: "Princess",
      duration: "next-turn",
      target: { selector: "chosen", cardType: "character" },
    } as unknown as PropertyModificationEffect;

    resolvePropertyModificationEffect(
      ctx,
      createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
      effect,
      { targets: [TGT] },
    );

    const classifications = readClassifications(ctx, TGT);
    expect(classifications).toBeDefined();
    expect(Object.keys(classifications ?? {})).toContain("Princess");
  });

  it("is a no-op for unsupported property/operation combinations", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": [TGT] },
      definitions: { tgt: { id: "tgt", cardType: "character" } },
    });
    const effect = {
      type: "property-modification",
      property: "name",
      operation: "add",
      value: "Ariel",
      duration: "next-turn",
      target: { selector: "chosen", cardType: "character" },
    } as unknown as PropertyModificationEffect;

    resolvePropertyModificationEffect(
      ctx,
      createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
      effect,
      { targets: [TGT] },
    );

    expect(readClassifications(ctx, TGT)).toBeUndefined();
  });
});
