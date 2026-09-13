/**
 * Steel Soul cycle × Singularity — `transformed-evo-is-hero` (CR 8.1.11b).
 *
 * Printed (all four Steel Soul Evos): "When this transforms from or into an Evo
 * with a different name, [EFFECT]. If that Evo is a hero, instead this triggers
 * twice." The only Evo that is a hero is Teklovossen, the Mechropotent (Demi-
 * Hero Equipment Evo) — reached when Singularity transforms equipped Evos into
 * the Mechropotent, which becomes the controller's hero (CR 8.1.11b).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, deathDealer } from "../../../fixtures.ts";
import { singularityRed } from "../../../../../../cards/src/cards/actions/singularity.ts";
import { evoSteelSoulMemoryBlue } from "../../../../../../cards/src/cards/actions/evo-steel-soul-memory.ts";
import { evoSteelSoulProcessorBlue } from "../../../../../../cards/src/cards/actions/evo-steel-soul-processor.ts";
import { evoSteelSoulControllerBlue } from "../../../../../../cards/src/cards/actions/evo-steel-soul-controller.ts";
import { evoSteelSoulTowerBlue } from "../../../../../../cards/src/cards/actions/evo-steel-soul-tower.ts";
import { teklovossenTheMechropotent } from "../../../../../../cards/src/cards/demi-heroes/teklovossen-the-mechropotent.ts";

const setup = () =>
  FabTestEngine.start(
    {
      hero: dash,
      weapon1: [deathDealer],
      head: [evoSteelSoulMemoryBlue],
      chest: [evoSteelSoulProcessorBlue],
      arms: [evoSteelSoulControllerBlue],
      legs: [evoSteelSoulTowerBlue],
      hand: [singularityRed],
      resourcePoints: 10,
      actionPoints: 1,
      deck: 6,
    },
    { hero: bravo, deck: 6 },
    { autoPassPriority: false },
  );

const drain = (game: ReturnType<typeof FabTestEngine.start>): void =>
  game.helpers.resolveUntilIdle({
    optionalBoolean: false,
    entityTargets: "minimum",
    ordering: "listed",
  });

describe("Steel Soul × Singularity — transformed-evo-is-hero (CR 8.1.11b)", () => {
  it("Singularity materializes the Mechropotent as the controller's hero", () => {
    const game = setup();
    const Dash = game.as(dash);
    const dashId = Dash.id;
    Dash.play(singularityRed);
    drain(game);
    const state = game.getState();
    const heroId = state.containers.zonesByPlayerId[dashId]?.heroZone[0];
    const hero = heroId ? state.objects[heroId] : undefined;
    expect(hero?.canonicalId).toBe(teklovossenTheMechropotent.canonicalId);
  });

  it("EVO029 (Tower) a2 triggers TWICE — gain 2 action points — because the transform partner (Mechropotent) is a hero", () => {
    const game = setup();
    const Dash = game.as(dash);
    Dash.play(singularityRed);
    drain(game);
    // CR 8.5.36a + Release Notes — Bright Lights: each Steel Soul a2 is
    // source-bound and fires only for its OWN transformation, with the
    // partner identity (Teklovossen, an Evo with a different name) filtering
    // the trigger. The Mechropotent is seated as the hero (CR 8.1.11b), so
    // "if that Evo is a hero, instead this triggers twice" puts two triggered
    // layers for Tower: +2 AP. Only Tower grants AP (Memory/Processor/
    // Controller grant intellect/resources/a GY tuck). 1 (start) − 1 (play
    // Singularity) + 2 = 2.
    expect(Dash.actionPoints()).toBe(2);
  });
});
