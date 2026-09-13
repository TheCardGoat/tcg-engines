import { describe, expect, it } from "vitest";

import { absorbInAetherRed } from "../../../cards/src/cards/defense-reactions/absorb-in-aether.ts";
import { dash } from "../../../cards/src/cards/heroes/dash.ts";
import { cinderingForesightRed } from "../../../cards/src/cards/actions/cindering-foresight.ts";
import { forebodingBoltBlue } from "../../../cards/src/cards/actions/foreboding-bolt.ts";
import { blazeFiremind } from "../../../cards/src/cards/heroes/blaze-firemind.ts";
import { nucleusAetherboltRed } from "../../../cards/src/cards/actions/nucleus-aetherbolt.ts";
import { fateForeseenRed } from "../../../cards/src/cards/defense-reactions/fate-foreseen.ts";
import { snatchRed } from "../../../cards/src/cards/actions/snatch.ts";
import { sigilOfSolaceRed } from "../../../cards/src/cards/instants/sigil-of-solace.ts";
import { whisperOfTheOracleBlue } from "../../../cards/src/cards/actions/whisper-of-the-oracle.ts";
import {
  createFabMatchContext,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "../index.ts";
import { expectFabCard, expectFabPlayer, FabTestEngine } from "../testing/index.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

function answerBlazeActivation(game: FabTestEngine, targetInstanceId: string): void {
  for (let safety = 0; safety < 16; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "numeric") {
      game.answerDecision(decision.actorId, { kind: "numeric", value: 3 });
      continue;
    }
    if (decision?.kind === "entity-target") {
      game.answerDecision(decision.actorId, {
        kind: "entity-target",
        instanceIds: [targetInstanceId],
      });
      continue;
    }
    if (game.getState().rulesStack.length === 0) return;
    game.passBoth();
  }
  throw new Error("Blaze activation did not settle through public decisions.");
}

describe("Absorb in Aether", () => {
  it("AAA arms from arsenal, restores, then combines once with Cindering on the next arcane card", () => {
    let game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [
          nucleusAetherboltRed,
          cinderingForesightRed,
          forebodingBoltBlue,
          whisperOfTheOracleBlue,
        ],
        arsenal: [absorbInAetherRed],
        deck: 8,
      },
      {
        hero: dash,
        hand: [snatchRed, sigilOfSolaceRed, sigilOfSolaceRed, fateForeseenRed],
        deck: 8,
      },
      manual,
    );
    let Blaze = game.as(blazeFiremind);
    let Defender = game.as(dash);
    Blaze.must.endTurn();
    Defender.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    game.helpers.passPriorityTo(Blaze);
    Blaze.play(absorbInAetherRed, {
      from: "arsenal",
      pitch: [forebodingBoltBlue],
    });
    Blaze.must.play(cinderingForesightRed);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    const armed = game.getState();
    game = FabTestEngine.fromState(
      restoreFabMatchSnapshot(
        serializeFabMatchSnapshot(armed),
        createFabMatchContext(armed.cardDefinitions, armed.publicCardIdentities),
      ),
    );
    Blaze = game.as(blazeFiremind);
    Defender = game.as(dash);

    Defender.must.play(Defender.cardsIn("hand", sigilOfSolaceRed)[0]!);
    Defender.pass();
    const nucleus = Blaze.cardIn("hand", nucleusAetherboltRed);
    Blaze.must.activate(blazeFiremind);
    answerBlazeActivation(game, nucleus.instanceId);
    Defender.must.play(Defender.cardsIn("hand", sigilOfSolaceRed)[0]!);
    Defender.pass();
    Blaze.play(nucleusAetherboltRed, {
      from: "banished",
      targetInstanceId: Defender.getState().players[Defender.id]!.heroCardId!,
    });
    game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });

    expectFabPlayer(Defender).toHaveLife(20);
    expect(
      game
        .committedEvents()
        .filter((event) => event.name === "deal-damage")
        .map((event) => ({ amount: event.data.amount, target: event.data.target })),
    ).toContainEqual({ amount: 6, target: { kind: "hero", playerId: Defender.id } });
    expectFabCard(Blaze, absorbInAetherRed).toBeIn("graveyard");
    expectFabCard(Blaze, cinderingForesightRed).toBeIn("graveyard");
    expect(Blaze.zone("arsenal")).toEqual([]);
    expect(Blaze.zone("pitch")).toContain(forebodingBoltBlue.canonicalId);
    expect(game.getState().replacementEffects).toEqual([]);
  });
});
