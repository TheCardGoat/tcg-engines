import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { coldSnapBlue } from "../actions/cold-snap.ts";
import { corruptedCorpse } from "../actions/corrupted-corpse.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { dash } from "../heroes/dash.ts";
import { shatteringGrasp } from "./shattering-grasp.ts";

describe("Shattering Grasp (PEN228) AAA", () => {
  it("happy: destroying the grasp shatters the frozen ally and goes again", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [coldSnapBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        arms: [shatteringGrasp],
        arena: [corruptedCorpse],
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Blaze = game.as(blazeFiremind);

    // Cold Snap: Dash cannot pay {r}, so the ally freezes until Blaze's next turn.
    Blaze.play(coldSnapBlue, { target: Dash.id });
    game.advanceToDecision(Dash, "boolean");
    Dash.decline();
    game.untilIdle();
    expectFabCard(Dash, corruptedCorpse).toBeFrozen();
    Blaze.endTurn();
    Dash.activate(shatteringGrasp);
    Dash.target(corruptedCorpse);
    game.untilIdle();

    expectFabCard(Dash, shatteringGrasp).toBeIn("graveyard");
    // Incarnate replaces dying with ceasing to exist, so the ally is in no zone.
    expect(Dash.zone("arena")).not.toContain(corruptedCorpse.canonicalId);
    expect(Dash.zone("graveyard")).not.toContain(corruptedCorpse.canonicalId);
    expectFabPlayer(Dash).toHaveAP(1);
  });

  it("boundary: with no frozen ally the shatter has no legal target", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [],
        arms: [shatteringGrasp],
        arena: [corruptedCorpse],
        actionPoints: 1,
        deck: 6,
      },
      { hero: blazeFiremind, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    // No frozen ally: the destroy-self activation reverses at quote time.
    expectFabUnplayable(() => Dash.activate(shatteringGrasp), /unavailable/);

    expectFabCard(Dash, shatteringGrasp).toBeIn("arms");
    expectFabPlayer(Dash).toHaveAP(1);
  });
});
