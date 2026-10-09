import { describe, expect, it } from "bun:test";
import type { CardInstanceId, PlayerId } from "#core";
import { createLorcanaGameLogEntry } from "../types/log-messages";
import type { ProjectedLogEntry } from "../core/runtime/match-runtime.types";
import { privateField } from "../core/runtime/private-field";
import { buildMoveLog } from "./move-log-factory";

const playerOneId = "player_one" as PlayerId;
const playerTwoId = "player_two" as PlayerId;
const sourceCardId = "source-card" as CardInstanceId;
const targetCardId = "target-card" as CardInstanceId;
const firstDrawnCardId = "drawn-card-1" as CardInstanceId;
const secondDrawnCardId = "drawn-card-2" as CardInstanceId;

function projectedEntry(
  key: Parameters<typeof createLorcanaGameLogEntry>[0],
  values: Parameters<typeof createLorcanaGameLogEntry>[1],
): ProjectedLogEntry {
  return {
    category: "action",
    visibility: { mode: "PUBLIC" },
    typedEntry: createLorcanaGameLogEntry(key, values, { mode: "PUBLIC" }, "action"),
  };
}

describe("buildMoveLog", () => {
  it("preserves a no-target reason beside an action play without duplicating a primary cancellation", () => {
    const values = { playerId: playerTwoId, sourceCardId, cause: "no-valid-targets" as const };
    const cancellation = projectedEntry("lorcana.effect.cancelled", values);
    const played = buildMoveLog(
      [
        projectedEntry("lorcana.move.playCard", { playerId: playerTwoId, cardId: sourceCardId }),
        cancellation,
      ],
      "playCard",
      playerTwoId,
      123,
    );
    expect(played?.public).toContainEqual({ key: "lorcana.effect.cancelled", values });
    expect(played?.public).toHaveLength(2);
    const primary = buildMoveLog([cancellation], "resolveEffect", playerTwoId, 123);
    expect(primary?.public).toEqual([{ key: "lorcana.effect.cancelled", values }]);
  });
  it("keeps a temporary lore modifier beside its resolved trigger", () => {
    const values = { sourceId: sourceCardId, targetId: targetCardId, modifier: 1 };
    const log = buildMoveLog(
      [
        projectedEntry("lorcana.outcome.loreModifiedThisTurn", values),
        projectedEntry("lorcana.effect.resolve.targetSelection", {
          sourceCardId,
          targets: [targetCardId],
        }),
      ],
      "resolveBag",
      playerTwoId,
      123,
    );
    expect(log?.public).toContainEqual({ key: "lorcana.outcome.loreModifiedThisTurn", values });
    expect(log?.public).toHaveLength(2);
  });
  it("preserves the next-start Ready restriction beside its chosen target", () => {
    const values = { sourceId: sourceCardId, targetId: targetCardId };
    const log = buildMoveLog(
      [
        projectedEntry("lorcana.outcome.nextStartReadyBlocked", values),
        projectedEntry("lorcana.effect.resolve.targetSelection", {
          sourceCardId,
          targets: [targetCardId],
        }),
      ],
      "resolveBag",
      playerTwoId,
      123,
    );
    expect(log?.public).toContainEqual({ key: "lorcana.outcome.nextStartReadyBlocked", values });
    expect(log?.public).toHaveLength(2);
  });
  it("keeps strength and singing restriction outcomes beside a target resolution", () => {
    const log = buildMoveLog(
      [
        projectedEntry("lorcana.outcome.strengthModified", {
          sourceId: sourceCardId,
          targetId: targetCardId,
          modifier: -1,
        }),
        projectedEntry("lorcana.outcome.singingBlockedUntilNextStart", {
          sourceId: sourceCardId,
          targetId: targetCardId,
          playerId: playerTwoId,
        }),
        projectedEntry("lorcana.effect.resolve.targetSelection", {
          sourceCardId,
          targets: [targetCardId],
        }),
      ],
      "resolveEffect",
      playerTwoId,
      123,
    );
    expect(log?.public).toContainEqual({
      key: "lorcana.outcome.strengthModified",
      values: { sourceId: sourceCardId, targetId: targetCardId, modifier: -1 },
    });
    expect(log?.public).toContainEqual({
      key: "lorcana.outcome.singingBlockedUntilNextStart",
      values: { sourceId: sourceCardId, targetId: targetCardId, playerId: playerTwoId },
    });
    expect(log?.public).toHaveLength(3);
  });

  it("names characters and destinations moved by an accepted effect", () => {
    const log = buildMoveLog(
      [
        projectedEntry("lorcana.effect.resolve.optionalSelection.accepted", {
          playerId: playerTwoId,
          sourceCardId,
        }),
      ],
      "resolveEffect",
      playerTwoId,
      123,
      {
        cardsMovedToZone: [
          { cardId: sourceCardId, zone: `location:${targetCardId}` },
          { cardId: firstDrawnCardId, zone: `location:${targetCardId}` },
          { cardId: secondDrawnCardId, zone: "play" },
        ],
      },
    );
    expect(
      log?.public.filter((message) => message.key === "lorcana.move.moveCharacterToLocation"),
    ).toEqual([
      {
        key: "lorcana.move.moveCharacterToLocation",
        values: { playerId: playerTwoId, characterId: sourceCardId, locationId: targetCardId },
      },
      {
        key: "lorcana.move.moveCharacterToLocation",
        values: { playerId: playerTwoId, characterId: firstDrawnCardId, locationId: targetCardId },
      },
    ]);
  });

  it("does not duplicate the log for a normal location move", () => {
    const log = buildMoveLog(
      [
        projectedEntry("lorcana.move.moveCharacterToLocation", {
          playerId: playerOneId,
          characterId: sourceCardId,
          locationId: targetCardId,
        }),
      ],
      "moveCharacterToLocation",
      playerOneId,
      123,
      {
        cardsMovedToZone: [{ cardId: sourceCardId, zone: `location:${targetCardId}` }],
        inkDropsChanged: [{ playerId: playerOneId, amount: 1, operation: "remove" }],
      },
    );
    expect(
      log?.public.filter((message) => message.key === "lorcana.move.moveCharacterToLocation"),
    ).toHaveLength(1);
    expect(log?.public).toContainEqual({
      key: "lorcana.outcome.inkDropsRemoved",
      values: { playerId: playerOneId, amount: 1 },
    });
  });

  it("reports private ink entry publicly without exposing its card identity", () => {
    const log = buildMoveLog(
      [
        projectedEntry("lorcana.bag.resolve.completed.named", {
          playerId: playerOneId,
          sourceId: sourceCardId,
          abilityName: "Improve the View",
        }),
      ],
      "resolveBag",
      playerOneId,
      123,
      {
        cardsInked: [{ cardId: privateField(firstDrawnCardId, [playerTwoId]), exerted: true }],
      },
    );
    expect(JSON.stringify(log?.public)).not.toContain(firstDrawnCardId);
    expect(log?.privateByPlayerId?.[playerTwoId]).toContainEqual({
      key: "lorcana.outcome.cardInkedExerted",
      values: { playerId: playerOneId, cardId: firstDrawnCardId },
    });
    expect(log?.public).toContainEqual({
      key: "lorcana.outcome.privateCardInkedExerted",
      values: { playerId: playerTwoId },
    });
  });

  it("keeps blind ink identities out of every log, including public bag targets", () => {
    const log = buildMoveLog(
      [
        projectedEntry("lorcana.bag.resolve.completed.named", {
          playerId: playerOneId,
          sourceId: sourceCardId,
          abilityName: "Blind Ink",
          targets: [firstDrawnCardId],
        }),
      ],
      "resolveBag",
      playerOneId,
      123,
      {
        cardsInked: [
          { playerId: playerTwoId, cardId: privateField(firstDrawnCardId, []), exerted: true },
        ],
      },
    );
    expect(JSON.stringify(log?.public)).not.toContain(firstDrawnCardId);
    expect(JSON.stringify(log?.privateByPlayerId ?? {})).not.toContain(firstDrawnCardId);
    expect(log?.public).toContainEqual({
      key: "lorcana.outcome.privateCardInkedExerted",
      values: { playerId: playerTwoId },
    });
  });

  it("keeps both publicly revealed tied winners beside the reveal resolution", () => {
    const winners = [
      { playerId: playerOneId, targetPlayerId: playerOneId, revealedCardId: firstDrawnCardId },
      { playerId: playerOneId, targetPlayerId: playerTwoId, revealedCardId: secondDrawnCardId },
    ];
    const moveLog = buildMoveLog(
      [
        projectedEntry("lorcana.bag.resolve.completed.named", {
          playerId: playerOneId,
          sourceId: sourceCardId,
          abilityName: "LUCKY BREAK",
        }),
        ...winners.map((values) => projectedEntry("lorcana.outcome.revealedCardToHand", values)),
      ],
      "resolveBag",
      playerOneId,
      123,
    );
    for (const values of winners) {
      expect(moveLog?.public).toContainEqual({ key: "lorcana.outcome.revealedCardToHand", values });
    }
  });
  it("keeps next-player location lore beside the current player's pass", () => {
    const locationGain: ProjectedLogEntry = {
      category: "rules",
      visibility: { mode: "PUBLIC" },
      typedEntry: createLorcanaGameLogEntry(
        "lorcana.outcome.locationLoreGained",
        { playerId: playerTwoId, amount: 6, locationCount: 2 },
        { mode: "PUBLIC" },
        "rules",
      ),
    };
    const moveLog = buildMoveLog(
      [projectedEntry("lorcana.move.passTurn", { playerId: playerOneId }), locationGain],
      "passTurn",
      playerOneId,
      123,
    );
    expect(moveLog?.public).toContainEqual({
      key: "lorcana.outcome.locationLoreGained",
      values: { playerId: playerTwoId, amount: 6, locationCount: 2 },
    });
    expect(
      moveLog?.public.filter((message) => message.key === "lorcana.outcome.locationLoreGained"),
    ).toHaveLength(1);
  });

  it("keeps both keyword grants beside a chosen-target resolution", () => {
    const grants = ["Rush", "Evasive"].map((keyword) =>
      projectedEntry("lorcana.outcome.keywordGranted", {
        sourceId: sourceCardId,
        targetId: targetCardId,
        keyword,
      }),
    );
    const moveLog = buildMoveLog(
      [
        ...grants,
        projectedEntry("lorcana.bag.resolve.completed", {
          playerId: playerOneId,
          sourceId: sourceCardId,
        }),
      ],
      "resolveBag",
      playerOneId,
      123,
    );
    expect(moveLog?.public).toContainEqual({
      key: "lorcana.bag.resolve.completed",
      values: { playerId: playerOneId, sourceId: sourceCardId },
    });
    for (const keyword of ["Rush", "Evasive"]) {
      expect(moveLog?.public).toContainEqual({
        key: "lorcana.outcome.keywordGranted",
        values: { sourceId: sourceCardId, targetId: targetCardId, keyword },
      });
    }
    expect(
      moveLog?.public.filter((message) => message.key === "lorcana.outcome.keywordGranted"),
    ).toHaveLength(2);
  });

  it("keeps a selected hand-card reveal public beside the resolution and private draw", () => {
    const moveLog = buildMoveLog(
      [
        projectedEntry("lorcana.bag.resolve.completed", { playerId: playerOneId, sourceCardId }),
        projectedEntry("lorcana.outcome.revealedCard", {
          playerId: playerOneId,
          revealedCardId: targetCardId,
        }),
      ],
      "resolveBag",
      playerOneId,
      123,
      {
        cardsDrawn: [
          {
            playerId: playerOneId,
            amount: 1,
            detail: privateField([firstDrawnCardId], [playerOneId]),
          },
        ],
      },
    );
    expect(moveLog?.public).toContainEqual({
      key: "lorcana.outcome.revealedCard",
      values: { playerId: playerOneId, revealedCardId: targetCardId },
    });
    expect(moveLog?.public).not.toContainEqual({
      key: "lorcana.private.cardsDrawn.detail",
      values: { playerId: playerOneId, cardIds: [firstDrawnCardId] },
    });
  });

  it("attributes cards-drawn outcomes to each drawing player", () => {
    const moveLog = buildMoveLog(
      [
        projectedEntry("lorcana.effect.resolve.optionalSelection.accepted", {
          playerId: playerOneId,
          sourceCardId,
        }),
      ],
      "resolveEffect",
      playerOneId,
      123,
      {
        cardsDrawn: [
          {
            playerId: playerTwoId,
            amount: 2,
            detail: privateField([firstDrawnCardId, secondDrawnCardId], [playerTwoId]),
          },
        ],
      },
    );

    expect(moveLog?.public).toContainEqual({
      key: "lorcana.outcome.cardsDrawn",
      values: { playerId: playerTwoId, amount: 2 },
    });
    expect(moveLog?.privateByPlayerId?.[playerTwoId]).toContainEqual({
      key: "lorcana.private.cardsDrawn.detail",
      values: {
        playerId: playerTwoId,
        cardIds: [firstDrawnCardId, secondDrawnCardId],
      },
    });
  });

  it("keeps banish outcomes when effect-damage messages are skipped", () => {
    const moveLog = buildMoveLog(
      [
        projectedEntry("lorcana.move.challenge", {
          playerId: playerOneId,
          attackerId: sourceCardId,
          defenderId: targetCardId,
        }),
      ],
      "challenge",
      playerOneId,
      123,
      {
        cardsBanished: [targetCardId],
        damageDealt: [
          {
            kind: "combat",
            sourceId: sourceCardId,
            targetId: targetCardId,
            amount: 2,
          },
        ],
      },
    );

    expect(moveLog?.public).toContainEqual({
      key: "lorcana.outcome.cardBanished",
      values: { playerId: playerOneId, cardId: targetCardId },
    });
  });

  it("preserves the reveal top card auto-bottom message key", () => {
    const moveLog = buildMoveLog(
      [
        projectedEntry("lorcana.effect.resolve.revealTopCard.autoBottom", {
          playerId: playerOneId,
          sourceCardId,
          targetPlayerId: playerTwoId,
          revealedCardId: targetCardId,
        }),
      ],
      "resolveEffect",
      playerOneId,
      123,
    );

    expect(moveLog?.public[0]?.key).toBe("lorcana.effect.resolve.revealTopCard.autoBottom");
  });

  it("keeps the play-from-discard message key on a play-card log", () => {
    const moveLog = buildMoveLog(
      [
        projectedEntry("lorcana.move.playCard.fromDiscard", {
          playerId: playerOneId,
          cardId: sourceCardId,
        }),
      ],
      "playCard",
      playerOneId,
      123,
    );

    expect(moveLog?.public[0]).toEqual({
      key: "lorcana.move.playCard.fromDiscard",
      values: { playerId: playerOneId, cardId: sourceCardId },
    });
  });

  it("groups inkwell exert outcomes by player without exposing card ids", () => {
    const firstInkCardId = "ink-card-1" as CardInstanceId;
    const secondInkCardId = "ink-card-2" as CardInstanceId;
    const moveLog = buildMoveLog(
      [
        projectedEntry("lorcana.bag.resolve.completed.named", {
          playerId: playerOneId,
          sourceId: sourceCardId,
          abilityName: "FEARSOME GLARE",
        }),
      ],
      "resolveBag",
      playerOneId,
      123,
      {
        inkwellCardsExerted: [{ playerId: playerOneId, amount: 2 }],
        cardsExerted: [targetCardId],
      },
    );

    expect(moveLog?.public).toContainEqual({
      key: "lorcana.outcome.inkwellCardsExerted",
      values: { playerId: playerOneId, amount: 2 },
    });
    expect(moveLog?.public).not.toContainEqual({
      key: "lorcana.outcome.cardExerted",
      values: { playerId: playerOneId, cardId: firstInkCardId },
    });
    expect(moveLog?.public).not.toContainEqual({
      key: "lorcana.outcome.cardExerted",
      values: { playerId: playerOneId, cardId: secondInkCardId },
    });
  });

  it("keeps secondary reveal details and all lore consequences on a play-card log", () => {
    const moveLog = buildMoveLog(
      [
        projectedEntry("lorcana.move.playCard", {
          playerId: playerOneId,
          cardId: sourceCardId,
        }),
        projectedEntry("lorcana.effect.resolve.revealTopCard.autoBottom", {
          playerId: playerOneId,
          targetPlayerId: playerOneId,
          revealedCardId: targetCardId,
        }),
      ],
      "playCard",
      playerOneId,
      123,
      {
        loreChanges: [
          { playerId: playerTwoId, amount: 1, operation: "remove" },
          { playerId: playerOneId, amount: 1, operation: "add" },
        ],
      },
    );

    expect(moveLog?.public).toEqual([
      {
        key: "lorcana.move.playCard",
        values: { playerId: playerOneId, cardId: sourceCardId },
      },
      {
        key: "lorcana.effect.resolve.revealTopCard.autoBottom",
        values: {
          playerId: playerOneId,
          targetPlayerId: playerOneId,
          revealedCardId: targetCardId,
        },
      },
      {
        key: "lorcana.outcome.loreLost",
        values: { playerId: playerTwoId, amount: 1 },
      },
      {
        key: "lorcana.outcome.loreGained",
        values: { playerId: playerOneId, amount: 1 },
      },
    ]);
  });

  it("prefers secondary auto-bottom reveal details over the generic reveal on a play-card log", () => {
    const moveLog = buildMoveLog(
      [
        projectedEntry("lorcana.move.playCard", {
          playerId: playerOneId,
          cardId: sourceCardId,
        }),
        projectedEntry("lorcana.effect.resolve.revealTopCard", {
          playerId: playerOneId,
          targetPlayerId: playerOneId,
          revealedCardId: targetCardId,
        }),
        projectedEntry("lorcana.effect.resolve.revealTopCard.autoBottom", {
          playerId: playerOneId,
          targetPlayerId: playerOneId,
          revealedCardId: targetCardId,
        }),
      ],
      "playCard",
      playerOneId,
      123,
    );

    expect(moveLog?.public).toEqual([
      {
        key: "lorcana.move.playCard",
        values: { playerId: playerOneId, cardId: sourceCardId },
      },
      {
        key: "lorcana.effect.resolve.revealTopCard.autoBottom",
        values: {
          playerId: playerOneId,
          targetPlayerId: playerOneId,
          revealedCardId: targetCardId,
        },
      },
    ]);
  });

  it("uses the projected cancellation cause", () => {
    const moveLog = buildMoveLog(
      [
        projectedEntry("lorcana.effect.cancelled", {
          playerId: playerOneId,
          sourceCardId,
          cause: "condition-not-met",
        }),
      ],
      "resolveEffect",
      playerOneId,
      123,
    );

    expect(moveLog?.public[0]).toEqual({
      key: "lorcana.effect.cancelled",
      values: {
        playerId: playerOneId,
        sourceCardId,
        cause: "condition-not-met",
      },
    });
  });
});

describe("deferred challenge damage logs", () => {
  it("omits zero damage and preserves the positive return after a trigger", () => {
    const log = buildMoveLog(
      [
        projectedEntry("lorcana.bag.resolve.completed", {
          playerId: playerTwoId,
          sourceId: targetCardId,
        }),
      ],
      "resolveBag",
      playerTwoId,
      123,
      {
        damageDealt: [
          { kind: "combat", sourceId: sourceCardId, targetId: targetCardId, amount: 0 },
          { kind: "combat", sourceId: targetCardId, targetId: sourceCardId, amount: 2 },
        ],
      },
    );
    expect(log?.public.filter((message) => message.key === "lorcana.outcome.combatDamage")).toEqual(
      [],
    );
    expect(log?.public).toContainEqual({
      key: "lorcana.outcome.effectDamage",
      values: { playerId: playerTwoId, sourceId: targetCardId, targetId: sourceCardId, amount: 2 },
    });
  });
});

it("publishes fully prevented damage beside the played card", () => {
  const values = { playerId: playerOneId, targetId: targetCardId, amount: 2 };
  const log = buildMoveLog(
    [
      projectedEntry("lorcana.move.playCard", { playerId: playerOneId, cardId: sourceCardId }),
      projectedEntry("lorcana.outcome.damagePrevented", values),
    ],
    "playCard",
    playerOneId,
    123,
  );
  expect(log?.public).toContainEqual({ key: "lorcana.outcome.damagePrevented", values });
  expect(log?.public).toHaveLength(2);
});

it("publishes entry counters with their source without calling them dealt damage", () => {
  const values = {
    playerId: playerOneId,
    sourceId: sourceCardId,
    targetId: targetCardId,
    amount: 1,
  };
  const log = buildMoveLog(
    [
      projectedEntry("lorcana.move.playCard", { playerId: playerOneId, cardId: targetCardId }),
      projectedEntry("lorcana.outcome.entryDamage", values),
    ],
    "playCard",
    playerOneId,
    123,
  );
  expect(log?.public).toContainEqual({ key: "lorcana.outcome.entryDamage", values });
  expect(log?.public).toHaveLength(2);
});

it("shows entry damage before the resulting banishment", () => {
  const values = {
    playerId: playerTwoId,
    sourceId: sourceCardId,
    targetId: targetCardId,
    amount: 1,
  };
  const log = buildMoveLog(
    [
      projectedEntry("lorcana.move.playCard", { playerId: playerOneId, cardId: targetCardId }),
      projectedEntry("lorcana.outcome.entryDamage", values),
    ],
    "playCard",
    playerOneId,
    123,
    { cardsBanished: [targetCardId] },
  );
  expect(log?.public.map((message) => message.key)).toEqual([
    "lorcana.move.playCard",
    "lorcana.outcome.entryDamage",
    "lorcana.outcome.cardBanished",
  ]);
});

it("does not invent damage when neither challenge side deals damage", () => {
  const log = buildMoveLog(
    [
      projectedEntry("lorcana.move.challenge", {
        playerId: playerOneId,
        attackerId: sourceCardId,
        defenderId: targetCardId,
      }),
    ],
    "challenge",
    playerOneId,
    123,
    {
      damageDealt: [
        { kind: "combat", sourceId: sourceCardId, targetId: targetCardId, amount: 0 },
        { kind: "combat", sourceId: targetCardId, targetId: sourceCardId, amount: 0 },
      ],
    },
  );
  expect(log?.public.map((message) => message.key)).toEqual(["lorcana.move.challenge"]);
});

it("publishes put damage without describing it as dealt damage", () => {
  const log = buildMoveLog(
    [projectedEntry("lorcana.move.playCard", { playerId: playerOneId, cardId: sourceCardId })],
    "playCard",
    playerOneId,
    123,
    { damageDealt: [{ kind: "put", sourceId: sourceCardId, targetId: targetCardId, amount: 1 }] },
  );
  expect(log?.public).toContainEqual({
    key: "lorcana.outcome.damagePut",
    values: { playerId: playerOneId, sourceId: sourceCardId, targetId: targetCardId, amount: 1 },
  });
  expect(log?.public.some((message) => message.key === "lorcana.outcome.effectDamage")).toBe(false);
});
