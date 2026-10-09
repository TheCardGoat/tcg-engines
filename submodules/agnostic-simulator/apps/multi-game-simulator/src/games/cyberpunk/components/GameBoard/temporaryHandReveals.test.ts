import { describe, expect, it } from "vitest";

import { computeTemporaryRevealedHandCardIds } from "./temporaryHandReveals";

describe("computeTemporaryRevealedHandCardIds", () => {
  it("keeps a card moved from trash to hand revealed", () => {
    const revealed = computeTemporaryRevealedHandCardIds(
      [
        {
          events: [
            {
              type: "cardMoved",
              cardId: "card-1",
              fromZone: "trash",
              toZone: "hand",
              playerId: "p2",
            },
          ],
        },
      ],
      "p2",
      ["card-1"],
    );

    expect([...revealed]).toEqual(["card-1"]);
  });

  it("keeps a card moved from field to hand revealed", () => {
    const revealed = computeTemporaryRevealedHandCardIds(
      [
        {
          events: [
            {
              type: "cardMoved",
              cardId: "card-1",
              fromZone: "field",
              toZone: "hand",
              playerId: "p2",
            },
          ],
        },
      ],
      "p2",
      ["card-1"],
    );

    expect([...revealed]).toEqual(["card-1"]);
  });

  it("does not reveal cards drawn from deck to hand", () => {
    const revealed = computeTemporaryRevealedHandCardIds(
      [
        {
          events: [
            {
              type: "cardMoved",
              cardId: "card-1",
              fromZone: "deck",
              toZone: "hand",
              playerId: "p2",
            },
          ],
        },
      ],
      "p2",
      ["card-1"],
    );

    expect([...revealed]).toEqual([]);
  });

  it("keeps the reveal through its owner's turn end", () => {
    const revealed = computeTemporaryRevealedHandCardIds(
      [
        {
          events: [
            {
              type: "cardMoved",
              cardId: "card-1",
              fromZone: "trash",
              toZone: "hand",
              playerId: "p2",
            },
            { type: "turnEnded", playerId: "p2", turnNumber: 3 },
          ],
        },
      ],
      "p2",
      ["card-1"],
    );

    expect([...revealed]).toEqual(["card-1"]);
  });

  it("keeps reveals through another player's turn end", () => {
    const revealed = computeTemporaryRevealedHandCardIds(
      [
        {
          events: [
            {
              type: "cardMoved",
              cardId: "card-1",
              fromZone: "trash",
              toZone: "hand",
              playerId: "p2",
            },
            { type: "turnEnded", playerId: "p1", turnNumber: 3 },
          ],
        },
      ],
      "p2",
      ["card-1"],
    );

    expect([...revealed]).toEqual(["card-1"]);
  });

  it("clears a temporary reveal when its owner plays their next card", () => {
    const revealed = computeTemporaryRevealedHandCardIds(
      [
        {
          events: [
            {
              type: "cardMoved",
              cardId: "recovered-gear",
              fromZone: "trash",
              toZone: "hand",
              playerId: "p2",
            },
            { type: "cardPlayed", cardId: "next-card", playerId: "p2" },
          ],
        },
      ],
      "p2",
      ["recovered-gear"],
    );

    expect([...revealed]).toEqual([]);
  });

  it("keeps the reveal when the other player plays a card", () => {
    const revealed = computeTemporaryRevealedHandCardIds(
      [
        {
          events: [
            {
              type: "cardMoved",
              cardId: "recovered-gear",
              fromZone: "trash",
              toZone: "hand",
              playerId: "p2",
            },
            { type: "cardPlayed", cardId: "opponent-card", playerId: "p1" },
          ],
        },
      ],
      "p2",
      ["recovered-gear"],
    );

    expect([...revealed]).toEqual(["recovered-gear"]);
  });

  it("keeps the reveal when the next turn starts", () => {
    const revealed = computeTemporaryRevealedHandCardIds(
      [
        {
          events: [
            {
              type: "cardMoved",
              cardId: "card-1",
              fromZone: "trash",
              toZone: "hand",
              playerId: "p2",
            },
            { type: "turnStarted", playerId: "p1", turnNumber: 4 },
          ],
        },
      ],
      "p2",
      ["card-1"],
    );

    expect([...revealed]).toEqual(["card-1"]);
  });

  it("keeps cards moved from public zones after a new turn starts revealed", () => {
    const revealed = computeTemporaryRevealedHandCardIds(
      [
        {
          events: [
            { type: "turnStarted", playerId: "p2", turnNumber: 4 },
            {
              type: "cardMoved",
              cardId: "card-1",
              fromZone: "trash",
              toZone: "hand",
              playerId: "p2",
            },
          ],
        },
      ],
      "p2",
      ["card-1"],
    );

    expect([...revealed]).toEqual(["card-1"]);
  });

  it("keeps reveals through turn-ended move logs when events have no turn boundary", () => {
    const revealed = computeTemporaryRevealedHandCardIds(
      [
        {
          events: [
            {
              type: "cardMoved",
              cardId: "card-1",
              fromZone: "trash",
              toZone: "hand",
              playerId: "p2",
            },
          ],
        },
        {
          events: [],
          moveLogs: [{ type: "turnEnded", playerId: "p2", turnNumber: 3 }],
        },
      ],
      "p2",
      ["card-1"],
    );

    expect([...revealed]).toEqual(["card-1"]);
  });

  it("keeps reveals when another hidden hand card is discarded", () => {
    const revealed = computeTemporaryRevealedHandCardIds(
      [
        {
          events: [
            {
              type: "cardMoved",
              cardId: "card-1",
              fromZone: "trash",
              toZone: "hand",
              playerId: "p2",
            },
            {
              type: "cardMoved",
              cardId: "hidden-card",
              fromZone: "hand",
              toZone: "trash",
              playerId: "p2",
            },
          ],
        },
      ],
      "p2",
      ["card-1"],
    );

    expect([...revealed]).toEqual(["card-1"]);
  });

  it("drops revealed cards that are no longer in hand", () => {
    const revealed = computeTemporaryRevealedHandCardIds(
      [
        {
          events: [
            {
              type: "cardMoved",
              cardId: "card-1",
              fromZone: "trash",
              toZone: "hand",
              playerId: "p2",
            },
          ],
        },
      ],
      "p2",
      [],
    );

    expect([...revealed]).toEqual([]);
  });
});
