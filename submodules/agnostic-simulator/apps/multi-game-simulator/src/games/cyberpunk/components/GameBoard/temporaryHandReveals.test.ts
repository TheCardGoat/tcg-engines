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

  it("clears reveals at the owner's turn end", () => {
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

    expect([...revealed]).toEqual([]);
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

  it("clears reveals when the next turn starts", () => {
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

    expect([...revealed]).toEqual([]);
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

  it("clears reveals from turn-ended move logs when engine events have no turn boundary", () => {
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

    expect([...revealed]).toEqual([]);
  });

  it("clears reveals when a hidden hand card is discarded", () => {
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

    expect([...revealed]).toEqual([]);
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
