import { describe, expect, it } from "vitest";

import { FabTestEngine, fabToken } from "../index.ts";
import { dash, heartOfFyendal, nimblismBlue, pummelRed, sigilOfSolaceRed } from "./fixtures.ts";
import { oscilio } from "../../../cards/src/cards/heroes/oscilio.ts";
import { cloudCoverRed } from "../../../cards/src/cards/instants/cloud-cover.ts";
import { brutalAssaultRed } from "../../../cards/src/cards/actions/brutal-assault.ts";
import { whisperOfTheOracleBlue } from "../../../cards/src/cards/actions/whisper-of-the-oracle.ts";
import { flashBoltRed } from "../../../cards/src/cards/instants/flash-bolt.ts";
import { vynnset } from "../../../cards/src/cards/heroes/vynnset.ts";
import { seepingShadowsRed } from "../../../cards/src/cards/actions/seeping-shadows.ts";
import { snatchRed } from "../../../cards/src/cards/actions/snatch.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Cloud Cover fixed prevention", () => {
  it("AAA prevents exactly 3 physical, consumes once, then leaves arcane damage untouched", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [cloudCoverRed, nimblismBlue, pummelRed, sigilOfSolaceRed],
        arsenal: [heartOfFyendal],
        deck: 8,
      },
      {
        hero: dash,
        actionPoints: 2,
        resourcePoints: 2,
        hand: [brutalAssaultRed, whisperOfTheOracleBlue, flashBoltRed, nimblismBlue],
        deck: 8,
      },
      manual,
    );
    const Oscilio = game.as(oscilio);
    const Attacker = game.as(dash);
    Oscilio.must.endTurn();
    Attacker.must.playAttack(brutalAssaultRed, { pitch: [whisperOfTheOracleBlue] });
    game.advanceCombatTo("attack");
    game.helpers.passPriorityTo(Oscilio);
    Oscilio.must.play(cloudCoverRed);
    game.passBoth();
    game.advanceCombatTo("defend");
    Oscilio.must.defend();
    game.helpers.resolveRestOfCombat();

    expect(Oscilio.life()).toBe(15);
    expect(
      game
        .committedEvents()
        .filter(
          (event) =>
            event.name === "prevent" && event.source?.canonicalId === cloudCoverRed.canonicalId,
        ),
    ).toHaveLength(1);

    Attacker.must.play(flashBoltRed, { target: Oscilio.id, pitch: [nimblismBlue] });
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expect(Oscilio.life()).toBe(12);
    expect(
      game
        .committedEvents()
        .filter(
          (event) =>
            event.name === "prevent" && event.source?.canonicalId === cloudCoverRed.canonicalId,
        ),
    ).toHaveLength(1);
  });

  it("AAA does not reduce unpreventable damage", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [seepingShadowsRed, snatchRed, nimblismBlue, sigilOfSolaceRed],
        arsenal: [heartOfFyendal],
        arena: [fabToken("runechant")],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 8,
      },
      {
        hero: oscilio,
        hand: [cloudCoverRed, nimblismBlue, pummelRed, sigilOfSolaceRed],
        arsenal: [heartOfFyendal],
        deck: 8,
      },
      manual,
    );
    const Vynnset = game.as(vynnset);
    const Oscilio = game.as(oscilio);
    Vynnset.must.play(seepingShadowsRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, ordering: "listed" });
    game.helpers.passPriorityTo(Oscilio);
    Oscilio.must.play(cloudCoverRed);
    game.passBoth();
    Vynnset.must.playAttack(snatchRed);
    game.helpers.resolveRestOfCombat();

    expect(Oscilio.life()).toBe(12);
    expect(
      game
        .committedEvents()
        .filter(
          (event) =>
            event.name === "prevent" && event.source?.canonicalId === cloudCoverRed.canonicalId,
        ),
    ).toHaveLength(0);
  });
});
