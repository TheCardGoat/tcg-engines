import { describe, expect, it } from "vitest";

import { zeroToSixtyRed } from "../../cards/src/cards/actions/zero-to-sixty.ts";
import { grindingGearsBlue } from "../../cards/src/cards/actions/grinding-gears.ts";
import {
  finalizeFabPlayerLog,
  isFabPlayerLog,
  renderFabPlayerLog,
  visibleFabPlayerLogMessages,
  type FabPlayerLogFact,
} from "./player-log.ts";

const BASE_INPUT = {
  commandId: "command-1",
  moveType: "pass",
  actorId: "player-1",
  timestamp: 1_700_000_000_000,
  turnNumber: 1,
  turnPlayerId: "player-1",
  phase: "action",
} as const;

describe("FAB player log finalization", () => {
  it("keeps every declared modal choice in order", () => {
    const log = finalizeFabPlayerLog({
      ...BASE_INPUT,
      facts: [
        {
          kind: "modal-modes-declared",
          actorId: "player-1",
          card: {
            instanceId: "art-of-war-1",
            canonicalId: "G7bRDqbhCJD76fH77Mfm7",
            name: "Art of War",
          },
          modeTexts: ["Attack Actions Gain Power And Defense", "Next Attack Gains Go Again"],
        },
      ],
    });

    expect(
      renderFabPlayerLog(log, {
        viewerId: "player-1",
        actorLabel: () => "You",
      }),
    ).toEqual([
      "You chose 2 modes for Art of War: Attack Actions Gain Power And Defense · Next Attack Gains Go Again",
    ]);
  });

  it("coalesces legacy public and viewer-private facts into one consequence", () => {
    const facts: FabPlayerLogFact[] = [
      {
        kind: "localized-message",
        message: {
          key: "flesh-and-blood.look",
          values: { playerId: "player-1" },
          category: "action",
        },
      },
      {
        kind: "localized-message",
        message: {
          key: "flesh-and-blood.look.private",
          values: { playerId: "player-1", cardName: "Snatch" },
          category: "action",
          visibleTo: ["player-1"],
        },
      },
    ];

    const log = finalizeFabPlayerLog({ ...BASE_INPUT, facts });

    expect(log.entries).toHaveLength(1);
    expect(visibleFabPlayerLogMessages(log, "player-1").map(({ key }) => key)).toEqual([
      "flesh-and-blood.look.private",
    ]);
    expect(visibleFabPlayerLogMessages(log, "player-2").map(({ key }) => key)).toEqual([
      "flesh-and-blood.look",
    ]);
  });

  it("summarizes plural and interleaved draw replacements", () => {
    const twiceReplaced = finalizeFabPlayerLog({
      ...BASE_INPUT,
      facts: [
        { kind: "draw-replaced", playerId: "player-1" },
        { kind: "draw-replaced", playerId: "player-1" },
      ],
    });
    expect(twiceReplaced.entries[0]?.publicMessage).toMatchObject({
      key: "flesh-and-blood.draw.replaced.cards",
      values: { playerId: "player-1", count: 2 },
    });

    const drawnAndReplaced = finalizeFabPlayerLog({
      ...BASE_INPUT,
      facts: [
        { kind: "draw-replaced", playerId: "player-1" },
        {
          kind: "card-drawn",
          playerId: "player-1",
          card: {
            instanceId: "snatch-1",
            canonicalId: "WTR167",
            name: "Snatch",
          },
        },
        { kind: "draw-replaced", playerId: "player-1" },
      ],
    });
    expect(drawnAndReplaced.entries.map(({ publicMessage }) => publicMessage?.key)).toEqual([
      "flesh-and-blood.draw",
      "flesh-and-blood.draw.replaced.cards",
    ]);
  });

  it("suppresses a binding-less raw banish when the same card is named by Boost", () => {
    const banishedRef = {
      instanceId: "boosted-grinding-gears",
      canonicalId: grindingGearsBlue.canonicalId,
    };
    const facts: readonly FabPlayerLogFact[] = [
      {
        kind: "localized-message",
        message: {
          key: "flesh-and-blood.banish",
          values: { playerId: "teklo", cardName: "Grinding Gears" },
          objectRefs: { cardName: banishedRef },
          category: "action",
        },
      },
      {
        kind: "localized-message",
        message: {
          key: "flesh-and-blood.boost.banish",
          values: {
            actorId: "teklo",
            cardName: "Zero To Sixty",
            banishedName: "Grinding Gears",
          },
          objectRefs: {
            cardName: {
              instanceId: "zero-to-sixty",
              canonicalId: zeroToSixtyRed.canonicalId,
            },
            banishedName: banishedRef,
          },
          category: "action",
        },
      },
    ];

    const log = finalizeFabPlayerLog({ ...BASE_INPUT, moveType: "begin-play", facts });

    expect(log.entries.map((entry) => entry.publicMessage?.key)).toEqual([
      "flesh-and-blood.boost.banish",
    ]);
  });

  it("suppresses the clash reveal occurrence instead of an earlier reveal of the same card", () => {
    const revealedCard = { instanceId: "shared-top-card", canonicalId: "WTR167" };
    const facts: readonly FabPlayerLogFact[] = [
      {
        kind: "localized-message",
        message: {
          key: "flesh-and-blood.reveal",
          values: { playerId: "player-1", cardName: "Snatch" },
          objectRefs: { cardName: revealedCard },
          activityRef: {
            kind: "stack-layer-event",
            layerId: "independent-layer",
            controllerId: "player-1",
            sourceInstanceId: "independent-source",
          },
          category: "action",
        },
      },
      {
        kind: "localized-message",
        message: {
          key: "flesh-and-blood.activate",
          values: { actorId: "player-1", cardName: "Independent Marker" },
          category: "action",
        },
      },
      {
        kind: "localized-message",
        message: {
          key: "flesh-and-blood.reveal",
          values: { playerId: "player-1", cardName: "Snatch" },
          objectRefs: { cardName: revealedCard },
          activityRef: {
            kind: "stack-layer-event",
            layerId: "clash-layer",
            controllerId: "player-1",
            sourceInstanceId: "clash-source",
          },
          category: "action",
        },
      },
      {
        kind: "localized-message",
        message: {
          key: "flesh-and-blood.clash.outcome",
          values: {
            firstPlayerId: "player-1",
            firstCardName: "Snatch",
            firstPowerLabel: "4 power",
            secondPlayerId: "player-2",
            secondCardName: "Nimblism",
            secondPowerLabel: "no power",
          },
          objectRefs: {
            firstCardName: revealedCard,
            secondCardName: { instanceId: "other-top-card", canonicalId: "WTR220" },
          },
          activityRef: {
            kind: "stack-layer-event",
            layerId: "clash-layer",
            controllerId: "player-1",
            sourceInstanceId: "clash-source",
          },
          category: "combat",
        },
      },
    ];

    const log = finalizeFabPlayerLog({ ...BASE_INPUT, facts });

    expect(log.entries.map((entry) => entry.publicMessage?.key)).toEqual([
      "flesh-and-blood.reveal",
      "flesh-and-blood.activate",
      "flesh-and-blood.clash.outcome",
    ]);
  });
});

describe("isFabPlayerLog", () => {
  const validLog = finalizeFabPlayerLog({
    ...BASE_INPUT,
    facts: [
      {
        kind: "card-played",
        actorId: "player-1",
        card: { instanceId: "snatch-1", canonicalId: "WTR167", name: "Snatch" },
        from: "hand",
      },
    ],
  });

  it("accepts messages with the exact registered value keys", () => {
    expect(isFabPlayerLog(validLog)).toBe(true);
  });

  it("rejects messages with missing or extra value keys", () => {
    const message = validLog.entries[0]?.publicMessage;
    expect(message).not.toBeNull();
    const withValues = (values: Record<string, unknown>) => ({
      ...validLog,
      entries: [{ ...validLog.entries[0], publicMessage: { ...message, values } }],
    });

    expect(isFabPlayerLog(withValues({ actorId: "player-1" }))).toBe(false);
    expect(
      isFabPlayerLog(withValues({ actorId: "player-1", cardName: "Snatch", leaked: "unexpected" })),
    ).toBe(false);
    expect(
      isFabPlayerLog({
        ...validLog,
        entries: [
          {
            ...validLog.entries[0],
            publicMessage: { ...message, values: undefined },
          },
        ],
      }),
    ).toBe(false);
  });
});
