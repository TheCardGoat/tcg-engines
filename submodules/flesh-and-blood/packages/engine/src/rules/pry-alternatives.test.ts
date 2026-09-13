import { describe, expect, it } from "vitest";
import {
  createFabMatchContext,
  FabTestEngine,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "../index.ts";
import { dash, nimblismBlue, sigilOfSolaceRed, snatchRed } from "./fixtures.ts";
import { iyslander } from "../../../cards/src/cards/heroes/iyslander.ts";
import { pryRed } from "../../../cards/src/cards/actions/pry.ts";
import { pryYellow } from "../../../cards/src/cards/actions/pry.ts";
import { pryBlue } from "../../../cards/src/cards/actions/pry.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;
const targetHand = [snatchRed, nimblismBlue, sigilOfSolaceRed, nimblismBlue] as const;

function targetHandRefs(player: ReturnType<ReturnType<typeof FabTestEngine.start>["as"]>) {
  return [
    player.cardIn("hand", snatchRed),
    ...player.cardsIn("hand", nimblismBlue),
    player.cardIn("hand", sigilOfSolaceRed),
  ];
}

describe("Pry alternative reveal counts", () => {
  it.each([
    [pryRed, 3],
    [pryYellow, 2],
    [pryBlue, 1],
  ] as const)(
    "AAA own-turn branch: %s selects exactly %i cards from the declared target hero's hand",
    (card, count) => {
      const game = FabTestEngine.start(
        {
          hero: iyslander,
          hand: [card, nimblismBlue, nimblismBlue, nimblismBlue],
          arsenal: [sigilOfSolaceRed],
          deck: 4,
        },
        {
          hero: dash,
          hand: targetHand,
          arsenal: [sigilOfSolaceRed],
          deck: 4,
        },
        manual,
      );
      const Iyslander = game.as(iyslander);
      const Dash = game.as(dash);
      const dashCards = targetHandRefs(Dash);

      Iyslander.play(card, { target: Dash.id });
      Iyslander.pass();
      Dash.pass();

      const reveal = Dash.expectDecision("entity-target");
      expect(reveal.min).toBe(count);
      expect(reveal.max).toBe(count);
      expect(reveal.candidates.map((candidate) => candidate.instanceId)).toEqual(
        expect.arrayContaining(dashCards.map((cardRef) => cardRef.instanceId)),
      );
      expect(reveal.candidates).toHaveLength(dashCards.length);
      Dash.chooseTargets(...dashCards.slice(0, count));
      Iyslander.expectDecision("boolean");
      Iyslander.chooseBoolean(false);
    },
  );

  it("AAA opponent-turn branch: Iyslander plays Pry blue from arsenal and may choose any revealed card of the declared hero", () => {
    let game = FabTestEngine.start(
      {
        hero: dash,
        hand: targetHand,
        arsenal: [sigilOfSolaceRed],
        deck: 4,
      },
      {
        hero: iyslander,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [pryBlue],
        deck: 4,
      },
      manual,
    );
    let Dash = game.as(dash);
    let Iyslander = game.as(iyslander);
    const dashCards = targetHandRefs(Dash);
    const chosenNimblism = Dash.cardsIn("hand", nimblismBlue)[1]!;

    Dash.pass();
    Iyslander.playFromArsenal(pryBlue, { target: Dash.id });
    Iyslander.pass();
    Dash.pass();

    Iyslander.expectDecision("boolean");
    Iyslander.chooseBoolean(true);

    const beforeRestore = game.getState();
    const snapshot = serializeFabMatchSnapshot(beforeRestore);
    game = FabTestEngine.fromState(
      restoreFabMatchSnapshot(
        snapshot,
        createFabMatchContext(beforeRestore.cardDefinitions, beforeRestore.publicCardIdentities),
      ),
    );
    Dash = game.as(dash);
    Iyslander = game.as(iyslander);

    const chooseRevealed = Iyslander.expectDecision("entity-target");
    expect(chooseRevealed.candidates.map((candidate) => candidate.instanceId)).toEqual(
      expect.arrayContaining(dashCards.map((cardRef) => cardRef.instanceId)),
    );
    expect(chooseRevealed.candidates).toHaveLength(dashCards.length);
    Iyslander.chooseTargets(chosenNimblism);
    game.helpers.resolveUntilIdle();

    expect(Dash.zone("deck")).toContain(nimblismBlue.canonicalId);
  });
});
