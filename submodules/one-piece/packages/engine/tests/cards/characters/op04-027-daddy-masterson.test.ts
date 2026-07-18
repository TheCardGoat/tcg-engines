import { describe, expect, test } from "vite-plus/test";
import { op04DaddyMasterson027 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-027 Daddy Masterson", () => {
  test("sets itself active at end of turn with one attached DON!!", () => {
    const engine = OnePieceTestEngine.create({
      character: [{ card: op04DaddyMasterson027, attachedDon: 1, rested: true }],
    });
    const daddyId = engine.findCardInZone("south", "character", op04DaddyMasterson027);

    engine.endTurn("south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === daddyId)?.rested).toBe(
      false,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("remains rested without an attached DON!!", () => {
    const engine = OnePieceTestEngine.create({
      character: [{ card: op04DaddyMasterson027, rested: true }],
    });
    const daddyId = engine.findCardInZone("south", "character", op04DaddyMasterson027);

    engine.endTurn("south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === daddyId)?.rested).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
