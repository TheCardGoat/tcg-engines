import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "../../testing";

const uninkableHandCard = createMockCharacter({
  id: "uninkable-hand-card",
  name: "Uninkable Card",
  cost: 2,
  inkable: false,
});

// Optional triggered ability whose discard step requires an inkable card — with
// no inkable card in hand, accepting the optional cannot produce a legal
// resolution, so the trigger is suppressed at trigger-fire time.
const filteredDiscardSource = createMockCharacter({
  id: "filtered-discard-source",
  name: "Filtered Discarder",
  cost: 3,
  abilities: [
    {
      id: "filtered-discard",
      name: "FILTERED DISCARD",
      type: "triggered",
      text: "FILTERED DISCARD At the end of your turn, you may discard a card with {I} to draw a card.",
      trigger: { event: "end-turn", on: "YOU", timing: "at" },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "discard",
              amount: 1,
              chosen: true,
              from: "hand",
              target: "CONTROLLER",
              filters: [{ type: "attribute", attribute: "inkwell", value: true }],
            },
          ],
        },
      },
    },
  ],
});

describe("suppressed triggered ability logging", () => {
  it("logs a skip entry when a triggered optional is suppressed for no valid targets", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: filteredDiscardSource, isDrying: false }],
      hand: [uninkableHandCard],
      deck: 2,
    });

    try {
      expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      // The optional was suppressed at trigger-fire — no prompt is created.
      expect(engine.asPlayerOne().getBagCount()).toBe(0);

      const passEntry = engine
        .asServer()
        .getMoveLogHistory()
        .find((log) => log.moveType === "passTurn");
      expect(passEntry?.public).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            key: "lorcana.outcome.triggeredAbilitySkipped",
            values: expect.objectContaining({
              abilityName: "FILTERED DISCARD",
            }),
          }),
        ]),
      );
    } finally {
      engine.dispose();
    }
  });

  it("does not log a skip entry when the optional is offered normally", () => {
    const inkableHandCard = createMockCharacter({
      id: "inkable-hand-card",
      name: "Inkable Card",
      cost: 2,
      inkable: true,
    });

    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: filteredDiscardSource, isDrying: false }],
      hand: [inkableHandCard],
      deck: 2,
    });

    try {
      expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      // The optional is offered to the player instead of being suppressed.
      expect(engine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

      const passEntry = engine
        .asServer()
        .getMoveLogHistory()
        .find((log) => log.moveType === "passTurn");
      const skipEntries = (passEntry?.public ?? []).filter(
        (message) => message.key === "lorcana.outcome.triggeredAbilitySkipped",
      );
      expect(skipEntries).toHaveLength(0);
    } finally {
      engine.dispose();
    }
  });
});
