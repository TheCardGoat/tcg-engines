import { describe, it } from "vitest";
import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectFabPlayer,
  expectFabCard,
  expectFabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { arakni } from "../heroes/arakni.ts";
import { dash } from "../heroes/dash.ts";
import { spiderSBite } from "../weapons/spider-s-bite.ts";
import { anothos } from "../weapons/anothos.ts";
import { deadlySpinneretRed } from "./deadly-spinneret.ts";
describe("Deadly Spinneret preview behavior", () => {
  it("discards itself to fill both empty weapon zones", () => {
    const game = FabTestEngine.start(
      { hero: arakni, hand: [deadlySpinneretRed], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(arakni).activate(deadlySpinneretRed);
    game.untilIdle();
    expectFabCard(game.as(arakni), deadlySpinneretRed).toBeIn("graveyard");
    expectFabToken(game, "graphene-chelicera").toHaveCount(2);
    expectFabPlayer(game.as(arakni)).toHaveAP(1);
  });
  it("fills only the empty seat beside an existing dagger", () => {
    const game = FabTestEngine.start(
      { hero: arakni, hand: [deadlySpinneretRed], weapon1: [spiderSBite], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(arakni).activate(deadlySpinneretRed);
    game.untilIdle();
    expectFabToken(game, "graphene-chelicera").toHaveCount(1).toBeIn("weapon2");
    expectFabCard(game.as(arakni), spiderSBite).toBeIn("weapon1");
  });
  it("creates no token when a two-handed weapon occupies both seats", () => {
    const game = FabTestEngine.start(
      { hero: arakni, hand: [deadlySpinneretRed], weapon1: [anothos], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(arakni).activate(deadlySpinneretRed);
    game.untilIdle();
    expectFabToken(game, "graphene-chelicera").toHaveCount(0);
    expectFabCard(game.as(arakni), anothos).toBeIn("weapon1");
  });
});
