import { describe, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { hazeBendingBlue } from "./haze-bending.ts";
import { regurgitatingSlogRed } from "./regurgitating-slog.ts";
import { coalescenceMirageRed } from "./coalescence-mirage.ts";

describe("Coalescence Mirage (EVR144) AAA", () => {
  it("happy: phantasm-destroy puts a cost-0 Illusionist aura from hand into the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [coalescenceMirageRed, hazeBendingBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [regurgitatingSlogRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.playAttack(coalescenceMirageRed);
    game.as(dash).defendWith(regurgitatingSlogRed);
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    expectFabCard(Prism, coalescenceMirageRed).toBeIn("graveyard");
    expectFabCard(Prism, hazeBendingBlue).toBeIn("arena");
  });

  it("boundary: a miss without a 6{p} AAC does not put the aura into the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [coalescenceMirageRed, hazeBendingBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.playAttack(coalescenceMirageRed);
    game.closeCombat({ optionals: "decline" });

    expectFabCard(Prism, hazeBendingBlue).toBeIn("hand");
  });

  it("timing: declining the destroyed optional leaves the aura in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [coalescenceMirageRed, hazeBendingBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [regurgitatingSlogRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.playAttack(coalescenceMirageRed);
    game.as(dash).defendWith(regurgitatingSlogRed);
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Prism, coalescenceMirageRed).toBeIn("graveyard");
    expectFabCard(Prism, hazeBendingBlue).toBeIn("hand");
  });
});
