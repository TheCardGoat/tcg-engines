import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../shared/test-recipients.ts";
import { fryRed } from "./fry.ts";
import { everbloomLifeBlue } from "./everbloom-life.ts";

describe("Everbloom // Life (SEA258) AAA", () => {
  it("happy: Life face gains 1{h} as an instant and spends no action point", () => {
    const game = FabTestEngine.start(
      { hero: briar, life: 20, hand: [everbloomLifeBlue], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(everbloomLifeBlue, { playMethod: { kind: "face", face: "right" } });
    game.passBoth();

    expectFabPlayer(Briar).toHaveLife(21);
    expectFabPlayer(Briar).toHaveAP(1);
    expectFabCard(Briar, everbloomLifeBlue).toBeIn("graveyard");
  });

  it("boundary: Life face does not recycle an action from a graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        life: 20,
        hand: [everbloomLifeBlue],
        graveyard: [fryRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(everbloomLifeBlue, { playMethod: { kind: "face", face: "right" } });
    game.passBoth();

    expectFabCard(Briar, fryRed).toBeIn("graveyard");
    expectFabPlayer(Briar).toHaveLife(21);
  });

  it("happy: Everbloom recycles an action whose cost is less than {h} gained this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        life: 20,
        hand: [everbloomLifeBlue, everbloomLifeBlue],
        graveyard: [fryRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(everbloomLifeBlue, { playMethod: { kind: "face", face: "right" } });
    game.passBoth();
    expectFabPlayer(Briar).toHaveLife(21);

    Briar.play(everbloomLifeBlue, { playMethod: { kind: "face", face: "left" } });
    game.advanceToDecision(Briar, "entity-target");
    Briar.chooseTargets(fryRed);
    game.passBoth();

    expect(Briar.zone("deck")).toContain(fryRed.canonicalId);
    expect(Briar.zone("graveyard")).toContain(everbloomLifeBlue.canonicalId);
  });

  it("boundary: Everbloom is a no-op when no {h} has been gained this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        life: 20,
        hand: [everbloomLifeBlue],
        graveyard: [fryRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(everbloomLifeBlue, { playMethod: { kind: "face", face: "left" } });
    game.helpers.resolveUntilIdle();

    expectFabCard(Briar, fryRed).toBeIn("graveyard");
    expectFabCard(Briar, everbloomLifeBlue).toBeIn("graveyard");
  });
});
