import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { sigilOfSolaceRed } from "../instants/sigil-of-solace.ts";
import { consignToCosmosShockYellow } from "./consign-to-cosmos-shock.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Consign to Cosmos // Shock (SEA259) AAA", () => {
  it("fails closed when played without the required split-side declaration", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [consignToCosmosShockYellow], deck: 6 },
      { hero: dash, deck: 6 },
      manual,
    );
    const Bravo = game.as(bravo);

    const result = Bravo.expectFailure({
      move: "begin-play",
      payload: {
        instanceId: Bravo.cardIn("hand", consignToCosmosShockYellow).instanceId,
      },
    });

    expect(result.errorCode).toBe("unsupported_play_declaration");
  });

  it("plays Shock as an instant, deals 1 arcane damage to its declared target, and spends no action point", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [consignToCosmosShockYellow], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      manual,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(consignToCosmosShockYellow, {
      playMethod: { kind: "face", face: "right" },
      targetInstanceId: Dash.ref(dash).instanceId,
    });
    game.passBoth();

    expect(Dash.life()).toBe(19);
    expect(Bravo.actionPoints()).toBe(1);
  });

  it("uses arcane damage dealt this turn as Consign's X and banishes that many legal cards", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [consignToCosmosShockYellow, consignToCosmosShockYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, graveyard: [sigilOfSolaceRed], deck: 6 },
      manual,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(Bravo.cardsIn("hand", consignToCosmosShockYellow)[0]!, {
      playMethod: { kind: "face", face: "right" },
      targetInstanceId: Dash.ref(dash).instanceId,
    });
    game.passBoth();
    Bravo.play(Bravo.cardsIn("hand", consignToCosmosShockYellow)[0]!, {
      playMethod: { kind: "face", face: "left" },
    });
    game.advanceToDecision(Bravo, "entity-target");
    Bravo.chooseTargets(Dash.cardIn("graveyard", sigilOfSolaceRed));
    game.passBoth();

    expect(Dash.zone("banished")).toContain(sigilOfSolaceRed.canonicalId);
    expect(Bravo.actionPoints()).toBe(0);
  });

  it("melds by resolving Shock against its declared target, then Consign with the newly established X", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [consignToCosmosShockYellow], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, graveyard: [sigilOfSolaceRed], deck: 6 },
      manual,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(consignToCosmosShockYellow, {
      playMethod: { kind: "meld" },
      targetInstanceId: Dash.ref(dash).instanceId,
    });
    game.passBoth();
    expect(Dash.life()).toBe(19);
    // Only one legal Consign card (the GY Sigil); CR 1.8.6c auto-binds X=1.
    game.passBoth();

    expect(Dash.zone("banished")).toContain(sigilOfSolaceRed.canonicalId);
    expect(Bravo.actionPoints()).toBe(0);
  });
});
