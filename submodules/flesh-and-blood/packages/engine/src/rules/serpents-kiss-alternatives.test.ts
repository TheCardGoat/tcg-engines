import { describe, expect, it } from "vitest";
import { homageToAncestorsBlue } from "../../../cards/src/cards/instants/homage-to-ancestors.ts";
import { serpentSKissBlue } from "../../../cards/src/cards/actions/serpent-s-kiss.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, sigilOfSolaceRed } from "./fixtures.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;
const FANG_STRIKE = "token:fang-strike";
const SLITHER = "token:slither";

function createdMysticReactions(game: FabTestEngine): readonly string[] {
  return game
    .committedEvents()
    .filter((event) => event.name === "create")
    .flatMap((event) =>
      event.data.object.canonicalId === FANG_STRIKE || event.data.object.canonicalId === SLITHER
        ? [event.data.object.canonicalId]
        : [],
    );
}

function opponentSetup() {
  return {
    hero: dash,
    hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
    arsenal: [sigilOfSolaceRed],
    deck: 6,
  };
}

describe("Serpent's Kiss alternatives", () => {
  it("AAA false branch: before transcend, its controller chooses exactly one reaction", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [serpentSKissBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        deck: 6,
      },
      opponentSetup(),
      manual,
    );
    const Bravo = game.as(bravo);

    expect(game.getState().players[Bravo.id]!.history.turn.transcended).toBe(false);
    // Use the public play move so the on-attack choice remains visible rather
    // than asking the convenience attack-to-defend flow to auto-answer it.
    Bravo.play(serpentSKissBlue);
    game.passBoth();
    game.passBoth();

    const choice = Bravo.expectDecision("effect-resolution");
    expect(choice.continuation).toMatchObject({ kind: "effect-resolution" });
    game.answerDecision(Bravo.id, { kind: "effect-resolution", optionId: "option-1" });

    expect(Bravo.zone("hand")).toContain(SLITHER);
    expect(Bravo.zone("hand")).not.toContain(FANG_STRIKE);
    expect(createdMysticReactions(game)).toEqual([SLITHER]);
  });

  it("AAA true branch: after a real transcend, it creates one Fang Strike and one Slither", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [nimblismBlue, homageToAncestorsBlue, serpentSKissBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        deck: 6,
      },
      opponentSetup(),
      manual,
    );
    const Bravo = game.as(bravo);

    // The prior blue makes Homage's transcend condition true. Resolve both
    // cards through production play/priority before attacking with Serpent's Kiss.
    Bravo.play(nimblismBlue);
    game.passBoth();
    Bravo.play(homageToAncestorsBlue);
    game.passBoth();
    expect(game.getState().players[Bravo.id]!.history.turn.transcended).toBe(true);

    Bravo.attackWith(serpentSKissBlue);
    game.passBoth();

    expect(game.getState().decision).toBeNull();
    expect(Bravo.zone("hand").filter((id) => id === FANG_STRIKE)).toHaveLength(1);
    expect(Bravo.zone("hand").filter((id) => id === SLITHER)).toHaveLength(1);
    expect(createdMysticReactions(game)).toEqual([FANG_STRIKE, SLITHER]);
  });
});
