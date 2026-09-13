import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { spectralShield } from "../tokens/spectral-shield.ts";
import { sigilOfSilphidaeBlue } from "./sigil-of-silphidae.ts";

describe("Sigil of Silphidae (PEN099) AAA", () => {
  it("happy: entering may banish another GY aura to deal 1 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [sigilOfSilphidaeBlue],
        graveyard: [spectralShield],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.play(sigilOfSilphidaeBlue);
    game.advanceToDecision(Viserai, "entity-target");
    Viserai.targetRequired(Dash);
    game.advanceToDecision(Viserai, "boolean");
    Viserai.accept();
    game.untilIdle({ entityTargets: "minimum" });

    expectFabCard(Viserai, sigilOfSilphidaeBlue).toBeIn("arena");
    expectFabCard(Viserai, spectralShield).toBeIn("banished");
    expectFabPlayer(Dash).toHaveLife(19);
  });

  it("boundary: declining the enter banish deals no arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [sigilOfSilphidaeBlue],
        graveyard: [spectralShield],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.play(sigilOfSilphidaeBlue);
    game.advanceToDecision(Viserai, "entity-target");
    Viserai.targetRequired(Dash);
    game.advanceToDecision(Viserai, "boolean");
    Viserai.decline();
    game.untilIdle();

    expectFabCard(Viserai, sigilOfSilphidaeBlue).toBeIn("arena");
    expectFabCard(Viserai, spectralShield).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("timing: at the beginning of your action phase this is destroyed", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [sigilOfSilphidaeBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.play(sigilOfSilphidaeBlue);
    game.advanceToDecision(Viserai, "entity-target");
    Viserai.targetRequired(Dash);
    game.untilIdle({ optionals: "decline" });
    Viserai.endTurn();
    game.helpers.resolveUntilIdle();
    Dash.endTurn();
    game.advanceToDecision(Viserai, "entity-target");
    Viserai.targetRequired(Dash);
    game.helpers.resolveUntilIdle({ optionals: "decline" });

    expectFabCard(Viserai, sigilOfSilphidaeBlue).toBeIn("graveyard");
  });
});
