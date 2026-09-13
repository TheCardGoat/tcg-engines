import { describe, expect, it } from "vitest";
import {
  createFabMatchContext,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "@tcg/flesh-and-blood-engine/runtime";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { briar } from "../shared/test-recipients.ts";
import { crackedBaubleYellow } from "../resources/cracked-bauble.ts";
import { sigilOfSolaceRed } from "./sigil-of-solace.ts";
import { fertileGroundYellow } from "./fertile-ground.ts";
import { summerwoodShelterRed } from "./summerwood-shelter.ts";
import { plumeOfEvergrowth } from "../equipment/plume-of-evergrowth.ts";
import { oscilioScionOfTheThirdAge } from "../heroes/oscilio-scion-of-the-third-age.ts";
import { fabToken } from "@tcg/flesh-and-blood-engine/testing";
import { pilferTheTombBlue } from "./pilfer-the-tomb.ts";

function restore(game: FabTestEngine): FabTestEngine {
  const state = game.getState();
  return FabTestEngine.fromState(
    restoreFabMatchSnapshot(
      serializeFabMatchSnapshot(state),
      createFabMatchContext(state.cardDefinitions, state.publicCardIdentities),
    ),
  );
}

describe("Pilfer the Tomb (PEN329) AAA", () => {
  it("happy: choosing both modes banishes an opposing instant and an opposing yellow card", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [pilferTheTombBlue], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        graveyard: [sigilOfSolaceRed, crackedBaubleYellow, brutalAssaultBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.play(pilferTheTombBlue, { modeIndexes: [0, 1] });
    game.passBoth();

    expectFabCard(Dash, sigilOfSolaceRed).toBeBanished();
    expectFabCard(Dash, crackedBaubleYellow).toBeBanished();
    expectFabCard(Dash, brutalAssaultBlue).toBeIn("graveyard");
    expectFabCard(Briar, pilferTheTombBlue).toBeIn("graveyard");
  });

  it("boundary: choosing only the instant mode leaves a yellow non-instant in the graveyard", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [pilferTheTombBlue], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        graveyard: [sigilOfSolaceRed, crackedBaubleYellow, brutalAssaultBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.play(pilferTheTombBlue, { modeIndexes: [0] });
    game.passBoth();

    expectFabCard(Dash, sigilOfSolaceRed).toBeBanished();
    expectFabCard(Dash, crackedBaubleYellow).toBeIn("graveyard");
    expectFabCard(Dash, brutalAssaultBlue).toBeIn("graveyard");
  });

  it("happy: one yellow instant may satisfy both separate target phrases and is banished once", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [pilferTheTombBlue], actionPoints: 1, deck: 6 },
      { hero: dash, graveyard: [fertileGroundYellow], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.play(pilferTheTombBlue, { modeIndexes: [0, 1] });
    game.passBoth();

    expectFabCard(Dash, fertileGroundYellow).toBeBanished();
    expectFabCard(Briar, pilferTheTombBlue).toBeIn("graveyard");
  });

  it("boundary: an impossible selected mode reverses the complete proposed play", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [pilferTheTombBlue, sigilOfSolaceRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, graveyard: [summerwoodShelterRed], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    expectFabUnplayable(
      () => Briar.play(pilferTheTombBlue, { modeIndexes: [0, 1] }),
      /had no legal target/,
    );
    expectFabCard(Briar, pilferTheTombBlue).toBeIn("hand");
    expectFabCard(Dash, summerwoodShelterRed).toBeIn("graveyard");
    expectFabPlayer(Briar).toHaveAP(1).toHaveResourceCount(0);
    expect(game.committedEvents()).toEqual([]);
    if (game.waitState().kind !== "priority") throw new Error("Priority was not restored.");

    Briar.play(sigilOfSolaceRed);
    game.passBoth();
    expectFabCard(Briar, sigilOfSolaceRed).toBeIn("graveyard");
  });

  it("boundary: an empty opposing graveyard reverses a selected required mode", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [pilferTheTombBlue], actionPoints: 1, deck: 6 },
      { hero: dash, graveyard: [], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    expectFabUnplayable(
      () => Briar.play(pilferTheTombBlue, { modeIndexes: [0] }),
      /had no legal target/,
    );
    expectFabCard(Briar, pilferTheTombBlue).toBeIn("hand");
    expectFabPlayer(Briar).toHaveAP(1);
  });

  it("persistence: reversal remains authoritative after restoring at the modal decision", () => {
    const started = FabTestEngine.start(
      { hero: briar, hand: [pilferTheTombBlue], actionPoints: 1, deck: 6 },
      { hero: dash, graveyard: [], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = started.as(briar);
    Briar.exec({
      move: "begin-play",
      payload: { instanceId: Briar.findCardInZone("hand", pilferTheTombBlue) },
    });

    const game = restore(started);
    const RestoredBriar = game.as(briar);
    const decision = RestoredBriar.expectDecision("option");
    expectFabUnplayable(
      () => RestoredBriar.chooseOptions(decision.options[0]!.id),
      /had no legal target/,
    );
    expectFabCard(RestoredBriar, pilferTheTombBlue).toBeIn("hand");
    expectFabPlayer(RestoredBriar).toHaveAP(1);
    if (game.waitState().kind !== "priority") throw new Error("Priority was not restored.");
  });

  it("interaction: an instant target returned to hand stops being legal while the later yellow effect resolves", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [pilferTheTombBlue], deck: 6 },
      {
        hero: dash,
        head: [plumeOfEvergrowth],
        graveyard: [summerwoodShelterRed, crackedBaubleYellow],
        resourcePoints: 3,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.play(pilferTheTombBlue, { modeIndexes: [0, 1] });
    Briar.pass();
    Dash.activate(plumeOfEvergrowth);
    game.passBoth();
    game.passBoth();

    expectFabCard(Dash, summerwoodShelterRed).toBeIn("hand");
    expectFabCard(Dash, crackedBaubleYellow).toBeBanished();
    expectFabCard(Briar, pilferTheTombBlue).toBeIn("graveyard");
  });

  it("identity: a targeted instant that leaves and returns to the graveyard is a new incarnation", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [pilferTheTombBlue], deck: 6 },
      {
        hero: oscilioScionOfTheThirdAge,
        arena: [fabToken("lightning-flow")],
        hand: [sigilOfSolaceRed],
        resourcePoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Oscilio = game.as(oscilioScionOfTheThirdAge);

    game.helpers.passPriorityTo(Oscilio);
    Oscilio.activate(oscilioScionOfTheThirdAge);
    const oscilioPick = game.pendingDecision();
    if (oscilioPick?.kind === "entity-target" && oscilioPick.actorId === Oscilio.id) {
      Oscilio.chooseTargets(Oscilio.cardIn("hand", sigilOfSolaceRed));
    }
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    game.helpers.passPriorityTo(Briar);

    Briar.play(pilferTheTombBlue, { modeIndexes: [0] });
    Briar.pass();
    Oscilio.play(sigilOfSolaceRed, { from: "graveyard" });
    game.passBoth();
    const restored = restore(game);
    restored.passBoth();

    expectFabCard(restored.as(oscilioScionOfTheThirdAge), sigilOfSolaceRed).toBeIn("graveyard");
    expectFabCard(restored.as(briar), pilferTheTombBlue).toBeIn("graveyard");
  });
});
