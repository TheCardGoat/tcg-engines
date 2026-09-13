import { describe, expect, it } from "vitest";
import {
  FabTestEngine,
  expectFabPlayer,
  expectFabUnplayable,
  fabToken,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { sigilOfSolaceRed } from "../instants/sigil-of-solace.ts";
import { oscilioScionOfTheThirdAge } from "./oscilio-scion-of-the-third-age.ts";

describe("Oscilio, Scion of the Third Age (OMN095) AAA", () => {
  it("destroys Lightning Flow, discards an instant, creates Ponder, and grants play permission", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilioScionOfTheThirdAge,
        arena: [fabToken("lightning-flow")],
        hand: [sigilOfSolaceRed],
        resourcePoints: 1,
        life: 18,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Oscilio = game.as(oscilioScionOfTheThirdAge);
    expectFabPlayer(Oscilio).toHaveLife(18);
    Oscilio.activate(oscilioScionOfTheThirdAge);
    // Singleton Lightning Flow cost and singleton hand discard are determined
    // (CR 1.8.6c). Do not `.target()` them.
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expect(Oscilio.zone("arena")).not.toContain("token:lightning-flow");
    expect(Oscilio.zone("arena")).toContain("token:ponder");
    game.helpers.passPriorityTo(Oscilio);
    Oscilio.play(sigilOfSolaceRed, { from: "graveyard" });
    game.passBoth();
    expect(Oscilio.life()).toBe(21);
  });

  it("rejects activation without Lightning Flow", () => {
    const game = FabTestEngine.start(
      { hero: oscilioScionOfTheThirdAge, hand: [sigilOfSolaceRed], resourcePoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
    );
    expectFabUnplayable(
      () => game.as(oscilioScionOfTheThirdAge).activate(oscilioScionOfTheThirdAge),
      /destroy cost is unavailable/i,
    );
  });

  it("reverses the activation when a required declared cost object ceases to be legal", () => {
    const lightningFlow = fabToken("lightning-flow");
    const game = FabTestEngine.start(
      {
        hero: oscilioScionOfTheThirdAge,
        arena: [lightningFlow, lightningFlow],
        hand: [sigilOfSolaceRed],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Oscilio = game.as(oscilioScionOfTheThirdAge);

    Oscilio.activate(oscilioScionOfTheThirdAge);
    game.advanceToDecision(Oscilio, "entity-target");
    const staleFlow = Oscilio.cardsIn("arena", lightningFlow)[0]!;
    game.moveObject(staleFlow.instanceId, Oscilio.id, "graveyard");
    expectFabUnplayable(
      () => Oscilio.chooseTargets(staleFlow),
      /required_cost_unpayable|no longer|unavailable|rejected/i,
    );
    expect(Oscilio.zone("arena")).toContain("token:lightning-flow");
    expectFabPlayer(Oscilio).toHaveResourceCount(1);
    expectWait(game).notToHaveDecision();
    expectWait(game).notToHaveDecision();
    expect(game.waitState().kind).toBe("priority");
  });
});
