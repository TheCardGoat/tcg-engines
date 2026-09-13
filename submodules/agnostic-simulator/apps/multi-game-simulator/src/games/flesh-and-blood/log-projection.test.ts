import { describe, expect, it } from "vitest";

import type { FabMoveLog, FabMoveLogMessage } from "@tcg/flesh-and-blood-engine/simulator";
import {
  FAB_LOG_ACTOR_VALUE_KEYS,
  FAB_LOG_KEYS,
  FAB_LOG_KEY_CATEGORIES,
  FAB_LOG_TRANSLATION_VALUE_KEYS,
  fabLogActorSlotUsage,
  type FabLogCategory,
  type FabLogKey,
} from "@tcg/flesh-and-blood-engine/log";

import { projectFabLogEntries, renderFabMoveLogMessage } from "./log-projection";

const VIEWER = "fab-p1";
const OPPONENT = "fab-p2";
const TIMESTAMP = 1_700_000_000_000;
let commandOrdinal = 0;

function message(
  key: string,
  values?: Record<string, string | number | boolean | null>,
  defaultMessage = `${key} (default)`,
  objectRefs?: FabMoveLogMessage["objectRefs"],
  activityRef?: FabMoveLogMessage["activityRef"],
  combatRole?: FabMoveLogMessage["combatRole"],
): FabMoveLogMessage {
  return {
    key,
    ...(values ? { values } : {}),
    defaultMessage,
    ...(objectRefs ? { objectRefs } : {}),
    ...(activityRef ? { activityRef } : {}),
    ...(combatRole ? { combatRole } : {}),
  };
}

function moveLog(partial: Partial<FabMoveLog> = {}): FabMoveLog {
  return {
    commandId: `test-command-${++commandOrdinal}`,
    moveType: "answer-decision",
    playerId: VIEWER,
    timestamp: TIMESTAMP,
    sequence: 0,
    turnNumber: 1,
    public: [],
    ...partial,
  };
}

describe("projectFabLogEntries", () => {
  it("renders the affected card, concrete name it gained, and source", () => {
    const [entry] = projectFabLogEntries(
      [
        moveLog({
          public: [
            message("flesh-and-blood.gain-name", {
              cardName: "Become The Bottle",
              gainedName: "Crouching Tiger",
              sourceName: "Become The Bottle",
            }),
          ],
        }),
      ],
      { viewerId: VIEWER },
    );

    expect(entry).toMatchObject({
      message: "Become The Bottle gained the name Crouching Tiger from Become The Bottle.",
      tags: ["system"],
      cardRefs: [
        { name: "Become The Bottle" },
        { name: "Crouching Tiger" },
        { name: "Become The Bottle" },
      ],
    });
  });

  it("renders typed values through the registry with the default viewer label", () => {
    const [entry] = projectFabLogEntries(
      [
        moveLog({
          public: [message("flesh-and-blood.play", { actorId: VIEWER, cardName: "Snatch" })],
        }),
      ],
      { viewerId: VIEWER },
    );

    expect(entry).toMatchObject({
      id: "fab-log-1-0-0",
      turn: 1,
      seatId: "player",
      timestamp: new Date(TIMESTAMP).toISOString(),
      message: "You played Snatch.",
      tags: ["move"],
      cardRefs: [{ name: "Snatch" }],
    });
    expect(entry?.section).toBeUndefined();
  });

  it("preserves exact card identity for preview and current-board location", () => {
    const [entry] = projectFabLogEntries(
      [
        moveLog({
          public: [
            message(
              "flesh-and-blood.play",
              { actorId: VIEWER, cardName: "Snatch" },
              "You played Snatch.",
              {
                cardName: {
                  instanceId: "snatch-instance",
                  canonicalId: "snatch-definition",
                },
              },
            ),
          ],
        }),
      ],
      { viewerId: VIEWER },
    );

    expect(entry).toMatchObject({
      entityIds: ["snatch-instance"],
      cardRefs: [
        {
          name: "Snatch",
          entityId: "snatch-instance",
          definitionId: "snatch-definition",
        },
      ],
    });
  });

  it("projects a concise collapsed Clash comparison with both revealed cards", () => {
    const entries = projectFabLogEntries(
      [
        moveLog({
          sequence: 8,
          public: [
            message(
              "flesh-and-blood.clash.outcome",
              {
                firstPlayerId: VIEWER,
                firstCardName: "Snatch",
                firstPowerLabel: "4 power",
                secondPlayerId: OPPONENT,
                secondCardName: "Snatch",
                secondPowerLabel: "4 power",
              },
              "Both players revealed Snatch.",
              {
                firstCardName: {
                  instanceId: "first-snatch",
                  canonicalId: "snatch-definition",
                },
                secondCardName: {
                  instanceId: "second-snatch",
                  canonicalId: "snatch-definition",
                },
              },
            ),
            message("flesh-and-blood.clash.tie", {
              firstPowerLabel: "4 power",
              secondPowerLabel: "4 power",
            }),
          ],
        }),
      ],
      { viewerId: VIEWER, seatIds: [VIEWER, OPPONENT] },
    );

    expect(entries).toHaveLength(2);
    expect(entries[0]).toMatchObject({
      entityIds: ["first-snatch", "second-snatch"],
      cardRefs: [
        {
          name: "Snatch",
          entityId: "first-snatch",
          definitionId: "snatch-definition",
        },
        {
          name: "Snatch",
          entityId: "second-snatch",
          definitionId: "snatch-definition",
        },
      ],
      section: {
        label: "Clash",
        tone: "comparison",
        collapsedByDefault: true,
        summary: "No winner · Snatch 4 power vs Snatch 4 power",
        cardRefs: [
          {
            name: "Snatch",
            entityId: "first-snatch",
            definitionId: "snatch-definition",
          },
          {
            name: "Snatch",
            entityId: "second-snatch",
            definitionId: "snatch-definition",
          },
        ],
      },
    });
    expect(entries[1]?.section).toBe(entries[0]?.section);
  });

  it("names the winning player and the card that won the Clash", () => {
    const entries = projectFabLogEntries(
      [
        moveLog({
          public: [
            message("flesh-and-blood.clash.outcome", {
              firstPlayerId: VIEWER,
              firstCardName: "Snatch",
              firstPowerLabel: "4 power",
              secondPlayerId: OPPONENT,
              secondCardName: "Alpha Rampage",
              secondPowerLabel: "9 power",
            }),
            message("flesh-and-blood.clash.win", {
              winnerId: OPPONENT,
              winnerPowerLabel: "9 power",
              loserPowerLabel: "4 power",
            }),
          ],
        }),
      ],
      { viewerId: VIEWER, seatIds: [VIEWER, OPPONENT] },
    );

    expect(entries[0]?.section).toMatchObject({
      label: "Clash",
      summary: "Opponent won · Alpha Rampage 9 power vs Snatch 4 power",
    });
    expect(entries[1]?.section).toBe(entries[0]?.section);
  });

  it("groups adjacent semantic automation facts without parsing English copy", () => {
    const entries = projectFabLogEntries(
      [
        moveLog({
          public: [
            message("flesh-and-blood.priority-automation.auto-pass", { actorId: VIEWER }),
            message("flesh-and-blood.priority-automation.auto-pass", { actorId: OPPONENT }),
          ],
        }),
      ],
      { viewerId: VIEWER, seatIds: [VIEWER, OPPONENT] },
    );

    expect(entries).toHaveLength(2);
    expect(entries[0]).toMatchObject({
      importance: "routine",
      section: {
        label: "Routine",
        tone: "routine",
        collapsedByDefault: true,
        summary: "2 automatic priority passes",
      },
    });
    expect(entries[1]?.section).toBe(entries[0]?.section);
  });

  it("labels every known seat through a supplied actor resolver without touching card names", () => {
    const actorLabel = (actorId: string) =>
      actorId === VIEWER ? "You" : actorId === OPPONENT ? "Practice bot" : undefined;
    const [entry] = projectFabLogEntries(
      [
        moveLog({
          playerId: OPPONENT,
          public: [message("flesh-and-blood.play", { actorId: OPPONENT, cardName: "Snatch" })],
        }),
      ],
      { viewerId: VIEWER, actorLabel },
    );

    expect(entry?.message).toBe("Practice bot played Snatch.");
    expect(entry?.seatId).toBe("opponent");
  });

  it("collapses one player's adjacent same-route zone moves into one history line", () => {
    const actorLabel = (actorId: string) =>
      actorId === OPPONENT ? "Practice bot" : actorId === VIEWER ? "You" : undefined;
    const entries = projectFabLogEntries(
      [
        moveLog({
          playerId: OPPONENT,
          timestamp: TIMESTAMP,
          sequence: 4,
          public: [
            message("flesh-and-blood.move-zone", {
              playerId: OPPONENT,
              cardName: "Bare Fangs",
              from: "combat-chain",
              to: "graveyard",
            }),
            message("flesh-and-blood.put-into-graveyard", { cardName: "Bare Fangs" }),
            message("flesh-and-blood.move-zone", {
              playerId: OPPONENT,
              cardName: "Unexpected Backhand",
              from: "combat-chain",
              to: "graveyard",
            }),
            message("flesh-and-blood.put-into-graveyard", {
              cardName: "Unexpected Backhand",
            }),
            message("flesh-and-blood.move-zone", {
              playerId: OPPONENT,
              cardName: "Thick Hide Hunter",
              from: "combat-chain",
              to: "graveyard",
            }),
            message("flesh-and-blood.put-into-graveyard", {
              cardName: "Thick Hide Hunter",
            }),
          ],
        }),
      ],
      { viewerId: VIEWER, actorLabel },
    );

    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      message:
        "Practice bot moved Bare Fangs, Unexpected Backhand, and Thick Hide Hunter from combat chain to the graveyard.",
      cardRefs: [
        { name: "Bare Fangs" },
        { name: "Unexpected Backhand" },
        { name: "Thick Hide Hunter" },
      ],
    });
  });

  it("does not collapse same-route moves from different commands", () => {
    const entries = projectFabLogEntries(
      [
        moveLog({
          timestamp: TIMESTAMP,
          sequence: 1,
          public: [
            message("flesh-and-blood.move-zone", {
              playerId: VIEWER,
              cardName: "Snatch",
              from: "combat-chain",
              to: "graveyard",
            }),
          ],
        }),
        moveLog({
          timestamp: TIMESTAMP + 1,
          sequence: 0,
          public: [
            message("flesh-and-blood.move-zone", {
              playerId: VIEWER,
              cardName: "Nimblism",
              from: "combat-chain",
              to: "graveyard",
            }),
          ],
        }),
      ],
      { viewerId: VIEWER },
    );

    expect(entries.map((entry) => entry.message)).toEqual([
      "You moved Snatch from combat-chain to graveyard.",
      "You moved Nimblism from combat-chain to graveyard.",
    ]);
  });

  it("labels a values-only seat reference through caller-provided seat ids", () => {
    // The opponent never moves and receives no appendix in this corpus, so
    // the corpus-derived seat set cannot see them; only a caller that owns
    // the match knows both engine seat ids.
    const log = moveLog({
      public: [
        message("flesh-and-blood.protect", { playerId: VIEWER, protectedPlayerId: OPPONENT }),
      ],
    });
    // A hero target is a values-only seat reference on the combat surface:
    // the section header must share the message line's labeling.
    const combat = moveLog({
      public: [
        message("flesh-and-blood.attack", {
          actorId: VIEWER,
          cardName: "Snatch",
          targetName: OPPONENT,
        }),
      ],
    });

    const [unseeded] = projectFabLogEntries([log], { viewerId: VIEWER });
    expect(unseeded?.message).toBe(`You protected ${OPPONENT}.`);
    const [unseededAttack] = projectFabLogEntries([combat], { viewerId: VIEWER });
    expect(unseededAttack?.message).toBe(`You attacked ${OPPONENT} with Snatch.`);
    expect(unseededAttack?.section?.label).toBe(`Snatch → ${OPPONENT}`);

    const [seeded] = projectFabLogEntries([log], {
      viewerId: VIEWER,
      seatIds: [VIEWER, OPPONENT],
    });
    expect(seeded?.message).toBe("You protected Opponent.");
    const [seededAttack] = projectFabLogEntries([combat], {
      viewerId: VIEWER,
      seatIds: [VIEWER, OPPONENT],
    });
    expect(seededAttack?.message).toBe("You attacked Opponent with Snatch.");
    expect(seededAttack?.section?.label).toBe("Snatch → Opponent");
  });

  it("folds rules bookkeeping into the panel's system tag", () => {
    const [entry] = projectFabLogEntries(
      [
        moveLog({
          public: [message("flesh-and-blood.cost-life", { playerId: VIEWER, life: 2 })],
        }),
      ],
      { viewerId: VIEWER },
    );

    expect(entry?.tags).toEqual(["system"]);
    expect(entry?.message).toBe("You paid 2 life.");
  });

  it("tracks the running phase from phase.start values", () => {
    const entries = projectFabLogEntries(
      [
        moveLog({
          public: [
            message("flesh-and-blood.phase.start", { turnPlayerId: VIEWER, phase: "action" }),
            message("flesh-and-blood.play", { actorId: VIEWER, cardName: "Snatch" }),
          ],
        }),
      ],
      { viewerId: VIEWER },
    );

    expect(entries.map((entry) => entry.phase)).toEqual(["action", "action"]);
    expect(entries[0]?.message).toBe("You began the action phase.");
  });

  it("groups one combat chain into a labeled section with a close summary and opens a new one after close", () => {
    const entries = projectFabLogEntries(
      [
        moveLog({
          public: [
            message("flesh-and-blood.attack", {
              actorId: VIEWER,
              cardName: "Romping Chair",
              targetName: "Bravo",
            }),
            message("flesh-and-blood.combat.hit", {
              cardName: "Romping Chair",
              targetName: OPPONENT,
              damage: 4,
            }),
            message("flesh-and-blood.attack", {
              actorId: VIEWER,
              cardName: "Trench of Sunken Fortunes",
              targetName: "Bravo",
            }),
            message("flesh-and-blood.combat.miss", {
              cardName: "Trench of Sunken Fortunes",
              targetName: "Bravo",
            }),
            message("flesh-and-blood.combat.chain-close"),
          ],
        }),
        moveLog({
          turnNumber: 2,
          public: [message("flesh-and-blood.play", { actorId: VIEWER, cardName: "Snatch" })],
        }),
        moveLog({
          turnNumber: 2,
          public: [
            message("flesh-and-blood.attack", {
              actorId: VIEWER,
              cardName: "Trench of Sunken Fortunes",
              targetName: "Bravo",
            }),
          ],
        }),
      ],
      { viewerId: VIEWER, initialPhase: "action" },
    );

    const chain = entries.slice(0, 5);
    for (const entry of chain) {
      // Summaries stamp onto the shared section object at chain-close, so the
      // collapsed one-liner is reachable from every member row.
      expect(entry.section).toEqual({
        id: "fab-combat-1-1",
        label: "Romping Chair → Bravo",
        tone: "fight",
        summary: "4 damage · missed",
      });
      expect(entry.turn).toBe(1);
    }
    // The chain-close line joins its section, then the section closes.
    expect(entries[4]?.message).toBe("The combat chain closed.");
    expect(entries[5]?.section).toBeUndefined();
    expect(entries[5]?.turn).toBe(2);
    // A chain still open at the end of the corpus is the latest group: it
    // renders expanded and carries no summary.
    expect(entries[6]?.section).toEqual({
      id: "fab-combat-2-2",
      label: "Trench of Sunken Fortunes → Bravo",
      tone: "fight",
    });
  });

  it("resolves seat-id attack targets into labeled chain targets", () => {
    // Hero targets carry the engine seat id as `targetName`; the chain label
    // must surface the actor label ("Opponent"), never the raw id, while
    // display-name targets keep passing through untouched.
    const entries = projectFabLogEntries(
      [
        moveLog({
          public: [
            message("flesh-and-blood.attack", {
              actorId: VIEWER,
              cardName: "Romping Chair",
              targetName: OPPONENT,
            }),
            message("flesh-and-blood.combat.hit", {
              cardName: "Romping Chair",
              targetName: OPPONENT,
              damage: 4,
            }),
            message("flesh-and-blood.combat.chain-close"),
          ],
        }),
      ],
      { viewerId: VIEWER, seatIds: [VIEWER, OPPONENT] },
    );

    expect(entries[0]?.section?.label).toBe("Romping Chair → Opponent");
    expect(entries[0]?.section?.summary).toBe("4 damage");
  });

  it("summarizes combat outcome and every game-native card role in a collapsed chain", () => {
    const entries = projectFabLogEntries(
      [
        moveLog({
          public: [
            message(
              "flesh-and-blood.attack",
              { actorId: VIEWER, cardName: "Snatch", targetName: OPPONENT },
              undefined,
              undefined,
              undefined,
              "attack",
            ),
            message(
              "flesh-and-blood.defend",
              { actorId: OPPONENT, cardName: "Wounding Blow" },
              undefined,
              undefined,
              undefined,
              "block",
            ),
            message(
              "flesh-and-blood.play",
              { actorId: VIEWER, cardName: "Pummel" },
              undefined,
              undefined,
              undefined,
              "attack-reaction",
            ),
            message(
              "flesh-and-blood.play",
              { actorId: OPPONENT, cardName: "Sink Below" },
              undefined,
              undefined,
              undefined,
              "defense-reaction",
            ),
            message("flesh-and-blood.combat.miss", {
              cardName: "Snatch",
              targetName: OPPONENT,
              result: "blocked",
            }),
            message("flesh-and-blood.combat.chain-close"),
          ],
        }),
      ],
      { viewerId: VIEWER, seatIds: [VIEWER, OPPONENT] },
    );

    const section = entries[0]?.section;
    expect(section?.summary).toBe(
      "blocked · Attack: Snatch · Block: Wounding Blow · Attack reaction: Pummel · Defense reaction: Sink Below",
    );
    expect(entries.every((entry) => entry.section === section)).toBe(true);
  });

  it("renders possessive actor slots with ownership grammar instead of subject labels", () => {
    const entries = projectFabLogEntries(
      [
        moveLog({
          public: [
            message("flesh-and-blood.enter-arena", { playerId: VIEWER, cardName: "Snatch" }),
          ],
        }),
        moveLog({
          playerId: OPPONENT,
          public: [
            message("flesh-and-blood.enter-arena", {
              playerId: OPPONENT,
              cardName: "Romping Chair",
            }),
            message("flesh-and-blood.beat-chest", {
              actorId: OPPONENT,
              chestOwner: VIEWER,
              cardNames: "Heart of Fyendal",
            }),
          ],
        }),
      ],
      { viewerId: VIEWER },
    );

    expect(entries.map((entry) => entry.message)).toEqual([
      "Your Snatch entered the arena.",
      "Opponent's Romping Chair entered the arena.",
      "Opponent beat your chest and discarded Heart of Fyendal.",
    ]);
  });

  it("merges only the viewer's private appendix in canonical composition order", () => {
    const log = moveLog({
      public: [message("flesh-and-blood.draw.cards", { playerId: VIEWER, count: 2 })],
      privateByPlayerId: {
        [VIEWER]: [
          message("flesh-and-blood.draw.private", {
            playerId: VIEWER,
            cardNames: "Nimblism, Snatch",
          }),
        ],
        [OPPONENT]: [
          message("flesh-and-blood.draw.private", {
            playerId: OPPONENT,
            cardNames: "Spinning Hook",
          }),
        ],
      },
    });

    const viewerEntries = projectFabLogEntries([log], { viewerId: VIEWER });
    expect(viewerEntries.map((entry) => entry.message)).toEqual([
      "You drew 2 cards.",
      "You drew: Nimblism, Snatch.",
    ]);
    expect(JSON.stringify(viewerEntries)).not.toContain("Spinning Hook");

    const publicEntries = projectFabLogEntries([log], {
      viewerId: VIEWER,
      includePrivate: false,
    });
    expect(publicEntries.map((entry) => entry.message)).toEqual(["You drew 2 cards."]);
  });

  it("keeps a viewer appendix but suppresses opponent public rows when suppressing non-viewer logs", () => {
    const opponentLog = moveLog({
      playerId: OPPONENT,
      public: [message("flesh-and-blood.draw.cards", { playerId: OPPONENT, count: 3 })],
      privateByPlayerId: {
        [VIEWER]: [message("flesh-and-blood.decision.awaiting", { actorId: VIEWER })],
      },
    });
    const viewerLog = moveLog({
      public: [message("flesh-and-blood.play", { actorId: VIEWER, cardName: "Snatch" })],
    });

    const entries = projectFabLogEntries([opponentLog, viewerLog], {
      viewerId: VIEWER,
      suppressNonViewerPublic: true,
    });
    expect(entries.map((entry) => entry.message)).toEqual([
      "A decision awaits You.",
      "You played Snatch.",
    ]);
    expect(JSON.stringify(entries)).not.toContain("Opponent drew 3 cards.");

    const defaultEntries = projectFabLogEntries([opponentLog, viewerLog], { viewerId: VIEWER });
    expect(defaultEntries.map((entry) => entry.message)).toEqual([
      "Opponent drew 3 cards.",
      "A decision awaits You.",
      "You played Snatch.",
    ]);
  });

  it("keeps same-turn practice ordering human-before-bot with plausible epochs", () => {
    // The practice page stamps the human's command and the bot's automated
    // command with wall-clock execution contexts, so activity history keeps
    // play order (human row first) and renders real times.
    const humanAt = 1_700_000_040_000;
    const botAt = 1_700_000_040_040;
    const entries = projectFabLogEntries(
      [
        moveLog({
          sequence: 0,
          timestamp: humanAt,
          public: [message("flesh-and-blood.play", { actorId: VIEWER, cardName: "Snatch" })],
        }),
        moveLog({
          playerId: OPPONENT,
          moveType: "pass",
          sequence: 1,
          timestamp: botAt,
          public: [message("flesh-and-blood.command.pass", { actorId: OPPONENT })],
        }),
      ],
      { viewerId: VIEWER },
    );

    expect(entries.map((entry) => entry.message)).toEqual([
      "You played Snatch.",
      "Opponent passed priority.",
    ]);
    for (const entry of entries) {
      expect(new Date(entry.timestamp).getFullYear()).toBeGreaterThanOrEqual(2023);
    }

    // The pre-fix bot corpus carried the stateID counter as its timestamp,
    // which rendered as a 1970 epoch — the wall-clock execution context is
    // what restores the ordering and epoch guarantees above.
    const [legacy] = projectFabLogEntries(
      [
        moveLog({
          playerId: OPPONENT,
          moveType: "pass",
          sequence: 1,
          timestamp: 2,
          public: [message("flesh-and-blood.command.pass", { actorId: OPPONENT })],
        }),
      ],
      { viewerId: VIEWER },
    );
    expect(legacy?.timestamp).toBe("1970-01-01T00:00:00.002Z");
  });

  it("falls back to the self-describing defaultMessage for keys outside the registry", () => {
    const [entry] = projectFabLogEntries(
      [moveLog({ public: [message("flesh-and-blood.legacy", {}, "Legacy line.")] })],
      { viewerId: VIEWER },
    );

    expect(entry?.message).toBe("Legacy line.");
    expect(entry?.tags).toEqual(["system"]);
  });

  it("keeps a second attack in the open chain section instead of opening a new one", () => {
    const entries = projectFabLogEntries(
      [
        moveLog({
          public: [
            message("flesh-and-blood.attack", {
              actorId: VIEWER,
              cardName: "Romping Chair",
              targetName: "Bravo",
            }),
            message("flesh-and-blood.combat.hit", {
              cardName: "Romping Chair",
              targetName: OPPONENT,
              damage: 4,
            }),
            message("flesh-and-blood.attack", {
              actorId: VIEWER,
              cardName: "Trench of Sunken Fortunes",
              targetName: "Bravo",
            }),
            message("flesh-and-blood.combat.chain-close", {}),
          ],
        }),
      ],
      { viewerId: VIEWER },
    );

    expect(entries.every((entry) => entry.section?.id === "fab-combat-1-1")).toBe(true);
  });

  it("wraps multi-line effect resolutions into a section labeled by the source card", () => {
    const entries = projectFabLogEntries(
      [
        moveLog({
          sequence: 3,
          public: [
            message("flesh-and-blood.ability.triggered", { cardName: "Lunar Mirage" }),
            message("flesh-and-blood.draw.cards", { playerId: VIEWER, count: 1 }),
            message("flesh-and-blood.go-again", { cardName: "Lunar Mirage" }),
          ],
        }),
      ],
      { viewerId: VIEWER },
    );

    expect(entries.map((entry) => entry.section?.id)).toEqual([
      "fab-effect-1-3",
      "fab-effect-1-3",
      "fab-effect-1-3",
    ]);
    // Rules bookkeeping rides along inside the section but never opens one.
    expect(entries[2]?.tags).toEqual(["system"]);
    expect(entries[0]?.section).toEqual({
      id: "fab-effect-1-3",
      label: "Lunar Mirage",
      tone: "effect",
      summary: "Lunar Mirage · 3 events",
    });
  });

  it("keeps a command receipt and resumed effect around a nested clash in one activity", () => {
    const sourceRef = {
      cardName: { instanceId: "clash-lab-instance", canonicalId: "clash-lab-definition" },
    };
    const entries = projectFabLogEntries(
      [
        moveLog({
          commandId: "play-clash-sequence-lab",
          sequence: 0,
          public: [
            message(
              "flesh-and-blood.play",
              { actorId: VIEWER, cardName: "Clash Sequence Lab" },
              undefined,
              sourceRef,
            ),
          ],
        }),
        moveLog({
          commandId: "resolve-clash-sequence-lab",
          sequence: 1,
          public: [
            message("flesh-and-blood.ability.triggered", { cardName: "Clash Sequence Lab" }),
            message("flesh-and-blood.clash.outcome", {
              firstPlayerId: VIEWER,
              firstCardName: "Alpha Rampage",
              firstPowerLabel: "9 power",
              secondPlayerId: OPPONENT,
              secondCardName: "Snatch",
              secondPowerLabel: "4 power",
            }),
            message("flesh-and-blood.clash.win", {
              winnerId: VIEWER,
              winnerPowerLabel: "9 power",
              loserPowerLabel: "4 power",
            }),
            message(
              "flesh-and-blood.move-zone",
              {
                playerId: VIEWER,
                cardName: "Clash Sequence Lab",
                from: "stack",
                to: "graveyard",
              },
              undefined,
              sourceRef,
            ),
          ],
        }),
      ],
      { viewerId: VIEWER, seatIds: [VIEWER, OPPONENT] },
    );

    const parent = entries[0]?.section;
    expect(parent).toMatchObject({
      label: "Clash Sequence Lab",
      tone: "effect",
      summary: "You won · Alpha Rampage 9 power vs Snatch 4 power",
      cardRefs: [
        {
          name: "Clash Sequence Lab",
          entityId: "clash-lab-instance",
          definitionId: "clash-lab-definition",
        },
      ],
    });
    expect(entries[1]?.section?.id).toBe(parent?.id);
    expect(entries[2]?.section).toMatchObject({
      label: "Clash",
      tone: "comparison",
      parent: { id: parent?.id },
      summary: "You won · Alpha Rampage 9 power vs Snatch 4 power",
    });
    expect(entries[3]?.section?.parent?.id).toBe(parent?.id);
    expect(entries[4]?.section?.id).toBe(parent?.id);
  });

  it("projects responding layers as one ordered stack even when one pass resolves all of them", () => {
    const windowId = "layer-bottom";
    const layerNames = ["First Instant", "Second Instant", "Third Instant"] as const;
    const layerIds = ["layer-bottom", "layer-middle", "layer-top"] as const;
    const references = layerNames.map((_, index) => ({
      cardName: {
        instanceId: `instant-${index + 1}`,
        canonicalId: `instant-definition-${index + 1}`,
      },
    }));
    const playLogs = layerNames.map((cardName, index) => {
      const playerId = index % 2 === 0 ? VIEWER : OPPONENT;
      return moveLog({
        commandId: `play-instant-${index + 1}`,
        playerId,
        sequence: index,
        public: [
          message(
            "flesh-and-blood.play",
            { actorId: playerId, cardName },
            undefined,
            references[index],
            {
              kind: "stack-layer-opened",
              stackWindowId: windowId,
              layerId: layerIds[index]!,
              controllerId: playerId,
              sourceInstanceId: references[index]!.cardName.instanceId,
              respondsToLayerId: index === 0 ? null : layerIds[index - 1]!,
              stackOrdinal: index + 1,
            },
          ),
        ],
      });
    });
    const resolvingMessages: FabMoveLogMessage[] = [];
    for (let index = layerNames.length - 1; index >= 0; index -= 1) {
      const activityRef = {
        kind: "stack-layer-event" as const,
        layerId: layerIds[index]!,
        controllerId: index % 2 === 0 ? VIEWER : OPPONENT,
        sourceInstanceId: references[index]!.cardName.instanceId,
      };
      resolvingMessages.push(
        message(
          "flesh-and-blood.clash.outcome",
          {
            firstPlayerId: VIEWER,
            firstCardName: "Alpha Rampage",
            firstPowerLabel: `${7 + index} power`,
            secondPlayerId: OPPONENT,
            secondCardName: "Snatch",
            secondPowerLabel: "4 power",
          },
          undefined,
          undefined,
          activityRef,
        ),
        message(
          "flesh-and-blood.clash.win",
          {
            winnerId: VIEWER,
            winnerPowerLabel: `${7 + index} power`,
            loserPowerLabel: "4 power",
          },
          undefined,
          undefined,
          activityRef,
        ),
        message(
          "flesh-and-blood.move-zone",
          {
            playerId: VIEWER,
            cardName: layerNames[index]!,
            from: "stack",
            to: "graveyard",
          },
          undefined,
          references[index],
          activityRef,
        ),
      );
    }
    resolvingMessages.push(
      message(
        "flesh-and-blood.priority-automation.auto-pass",
        { actorId: VIEWER },
        undefined,
        undefined,
        { kind: "stack-window-event", stackWindowId: windowId },
      ),
      message(
        "flesh-and-blood.priority-automation.auto-pass",
        { actorId: OPPONENT },
        undefined,
        undefined,
        { kind: "stack-window-event", stackWindowId: windowId },
      ),
    );

    const entries = projectFabLogEntries(
      [
        ...playLogs,
        moveLog({
          commandId: "pass-resolves-three-layers",
          sequence: 3,
          public: resolvingMessages,
        }),
      ],
      { viewerId: VIEWER, seatIds: [VIEWER, OPPONENT] },
    );

    const stack = entries[0]?.section?.parent;
    expect(stack).toMatchObject({
      label: "Stack · 3 layers",
      tone: "stack",
      meta: "Resolved",
      summary: "3 layers resolved",
    });
    const layerSections = entries.slice(0, 3).map((entry) => entry.section);
    expect(layerSections.map((section) => section?.label)).toEqual([
      "Layer 1 · First Instant",
      "Layer 2 · Second Instant",
      "Layer 3 · Third Instant",
    ]);
    expect(layerSections.map((section) => section?.meta)).toEqual([
      "Resolves last",
      "Response",
      "Response · resolves first",
    ]);
    expect(layerSections.map((section) => section?.actorSeatId)).toEqual([
      "player",
      "opponent",
      "player",
    ]);
    expect(layerSections.every((section) => section?.parent === stack)).toBe(true);
    expect(layerSections.every((section) => section?.collapsedByDefault)).toBe(true);

    const priorityEntries = entries.filter((entry) => entry.section?.label === "Priority");
    expect(priorityEntries).toHaveLength(2);
    expect(priorityEntries[0]?.section).toMatchObject({
      parent: stack,
      collapsedByDefault: true,
      summary: "2 automatic priority passes",
    });
    expect(entries.find((entry) => entry.message.includes("9 power"))?.section?.parent?.label).toBe(
      "Layer 3 · Third Instant",
    );
  });

  it("groups card, activated, and triggered layers in the same stack window", () => {
    const opened = (
      key: string,
      cardName: string,
      instanceId: string,
      layerId: string,
      stackOrdinal: number,
    ) =>
      moveLog({
        commandId: `open-${layerId}`,
        sequence: stackOrdinal,
        public: [
          message(
            key,
            key === "flesh-and-blood.ability.layer" ? { cardName } : { actorId: VIEWER, cardName },
            undefined,
            { cardName: { instanceId, canonicalId: `${instanceId}-definition` } },
            {
              kind: "stack-layer-opened",
              stackWindowId: "layer-card",
              layerId,
              controllerId: VIEWER,
              sourceInstanceId: instanceId,
              respondsToLayerId:
                stackOrdinal === 1 ? null : stackOrdinal === 2 ? "layer-card" : "layer-2",
              stackOrdinal,
            },
          ),
        ],
      });

    const entries = projectFabLogEntries(
      [
        opened("flesh-and-blood.play", "Snatch", "snatch", "layer-card", 1),
        opened("flesh-and-blood.activate", "Edge of Autumn", "edge", "layer-2", 2),
        opened("flesh-and-blood.ability.layer", "Stonewall Impasse", "stonewall", "layer-3", 3),
      ],
      { viewerId: VIEWER, seatIds: [VIEWER, OPPONENT] },
    );

    expect(entries.map((entry) => entry.section?.label)).toEqual([
      "Layer 1 · Snatch",
      "Layer 2 · Edge of Autumn",
      "Layer 3 · Stonewall Impasse",
    ]);
    expect(entries.map((entry) => entry.section?.parent?.label)).toEqual([
      "Stack · 3 layers",
      "Stack · 3 layers",
      "Stack · 3 layers",
    ]);
  });

  it("keeps separate activity sections when the same card instance is played again", () => {
    const cardRef = {
      cardName: { instanceId: "replayed-snatch", canonicalId: "snatch-definition" },
    };
    const play = (commandId: string, layerId: string, sequence: number) =>
      moveLog({
        commandId,
        sequence,
        public: [
          message(
            "flesh-and-blood.play",
            { actorId: VIEWER, cardName: "Snatch" },
            undefined,
            cardRef,
            {
              kind: "stack-layer-opened",
              stackWindowId: layerId,
              layerId,
              controllerId: VIEWER,
              sourceInstanceId: cardRef.cardName.instanceId,
              respondsToLayerId: null,
              stackOrdinal: 1,
            },
          ),
        ],
      });

    const entries = projectFabLogEntries(
      [play("first-play", "layer-first", 1), play("second-play", "layer-second", 2)],
      { viewerId: VIEWER },
    );

    expect(entries).toHaveLength(2);
    expect(entries[0]?.section?.id).not.toBe(entries[1]?.section?.id);
    expect(entries.map((entry) => entry.section?.label)).toEqual(["Snatch", "Snatch"]);
    expect(entries.every((entry) => entry.section?.parent === undefined)).toBe(true);
  });

  it("falls back to the acting seat label when a resolution names no card", () => {
    const [entry] = projectFabLogEntries(
      [
        moveLog({
          playerId: OPPONENT,
          public: [
            message("flesh-and-blood.draw.cards", { playerId: OPPONENT, count: 2 }),
            message("flesh-and-blood.search", { playerId: OPPONENT }),
          ],
        }),
      ],
      {
        viewerId: VIEWER,
        actorLabel: (actorId) =>
          actorId === VIEWER ? "You" : actorId === OPPONENT ? "Practice bot" : undefined,
      },
    );

    expect(entry?.section).toEqual({
      id: "fab-effect-1-0",
      label: "Practice bot",
      tone: "effect",
      summary: "Practice bot · 2 events",
    });
  });

  it("never opens an effect section for system bookkeeping or single lines", () => {
    const entries = projectFabLogEntries(
      [
        moveLog({
          public: [
            message("flesh-and-blood.phase.start", { turnPlayerId: VIEWER, phase: "action" }),
            message("flesh-and-blood.play", { actorId: VIEWER, cardName: "Snatch" }),
          ],
        }),
        moveLog({
          public: [
            message("flesh-and-blood.gain-life", { playerId: VIEWER, amount: 2 }),
            message("flesh-and-blood.go-again", { cardName: "Snatch" }),
          ],
        }),
      ],
      { viewerId: VIEWER },
    );

    expect(entries.every((entry) => entry.section === undefined)).toBe(true);
  });

  it("keeps non-combat lines outside an open combat chain unsectioned", () => {
    const entries = projectFabLogEntries(
      [
        moveLog({
          public: [
            message("flesh-and-blood.attack", {
              actorId: VIEWER,
              cardName: "Romping Chair",
              targetName: "Bravo",
            }),
          ],
        }),
        moveLog({
          public: [
            message("flesh-and-blood.ability.triggered", { cardName: "Lunar Mirage" }),
            message("flesh-and-blood.draw.cards", { playerId: VIEWER, count: 1 }),
          ],
        }),
      ],
      { viewerId: VIEWER },
    );

    expect(entries[0]?.section?.id).toBe("fab-combat-1-1");
    expect(entries[1]?.section).toBeUndefined();
    expect(entries[2]?.section).toBeUndefined();
  });

  it("composes chain summaries from hit counts, damage, and miss results", () => {
    const entries = projectFabLogEntries(
      [
        moveLog({
          public: [
            message("flesh-and-blood.attack", {
              actorId: VIEWER,
              cardName: "Romping Chair",
              targetName: "Bravo",
            }),
            message("flesh-and-blood.combat.hit", {
              cardName: "Romping Chair",
              targetName: "Bravo",
              damage: 4,
            }),
            message("flesh-and-blood.combat.hit", {
              cardName: "Trench of Sunken Fortunes",
              targetName: "Bravo",
              damage: 3,
            }),
            message("flesh-and-blood.combat.miss", {
              cardName: "Spring Bounce",
              targetName: "Bravo",
              result: "blocked",
            }),
            message("flesh-and-blood.combat.chain-close"),
          ],
        }),
      ],
      { viewerId: VIEWER },
    );

    expect(entries[0]?.section?.summary).toBe("7 damage · blocked");
  });

  it("derives entry ids from log coordinates so trimming the corpus never remounts rows", () => {
    const tail = moveLog({
      turnNumber: 2,
      sequence: 1,
      public: [
        message("flesh-and-blood.play", { actorId: VIEWER, cardName: "Snatch" }),
        message("flesh-and-blood.draw.cards", { playerId: VIEWER, count: 1 }),
      ],
    });
    const alone = projectFabLogEntries([tail], { viewerId: VIEWER });
    const withPrefix = projectFabLogEntries(
      [
        moveLog({
          public: [message("flesh-and-blood.play", { actorId: VIEWER, cardName: "Nimblism" })],
        }),
        tail,
      ],
      { viewerId: VIEWER },
    );

    expect(alone.map((entry) => entry.id)).toEqual(["fab-log-2-1-0", "fab-log-2-1-1"]);
    expect(withPrefix.slice(-alone.length).map((entry) => entry.id)).toEqual(
      alone.map((entry) => entry.id),
    );
  });
});

describe("renderFabMoveLogMessage", () => {
  it("interpolates actor labels through values, not by editing rendered text", () => {
    const rendered = renderFabMoveLogMessage(
      message("flesh-and-blood.move-zone", {
        playerId: VIEWER,
        cardName: "Nimblism",
        from: "hand",
        to: "deck",
      }),
      (actorId) => (actorId === VIEWER ? "You" : undefined),
    );

    expect(rendered).toBe("You moved Nimblism from hand to deck.");
  });

  it("never sends card-name values through the actor resolver", () => {
    const rendered = renderFabMoveLogMessage(
      message("flesh-and-blood.gain-name", {
        cardName: "Become The Bottle",
        gainedName: "Crouching Tiger",
        sourceName: "Become The Bottle",
      }),
      () => "Opponent seat",
    );

    expect(rendered).toBe(
      "Become The Bottle gained the name Crouching Tiger from Become The Bottle.",
    );
  });

  it("passes the slot usage through to supplied actor resolvers", () => {
    const rendered = renderFabMoveLogMessage(
      message("flesh-and-blood.leave-arena", { playerId: OPPONENT, cardName: "Snatch" }),
      (actorId, usage) =>
        actorId === OPPONENT
          ? usage === "possessive"
            ? "Practice bot's"
            : "Practice bot"
          : undefined,
    );

    expect(rendered).toBe("Practice bot's Snatch left the arena.");
  });

  it("never sends card names or rules values through actor labeling", () => {
    const rendered = renderFabMoveLogMessage(
      message("flesh-and-blood.gain-keyword", {
        cardName: "Retrace the Past",
        keyword: "go again",
      }),
      () => "Opponent seat",
    );

    expect(rendered).toBe("Retrace the Past gained go again.");
  });

  it("treats null wire values as empty interpolations", () => {
    const rendered = renderFabMoveLogMessage(
      message("flesh-and-blood.move-zone", {
        playerId: VIEWER,
        cardName: null,
        from: "hand",
        to: "deck",
      }),
    );

    // No actor resolver is supplied, so the actor id stays raw; the null
    // cardName still interpolates as an empty string rather than "null".
    expect(rendered).toBe("fab-p1 moved  from hand to deck.");
  });
});

describe("projectFabLogEntries dual-viewer vocabulary audit", () => {
  /** Value keys that interpolate seat ids — owned by the engine log tables. */
  const SEAT_VALUE_KEYS: ReadonlySet<string> = FAB_LOG_ACTOR_VALUE_KEYS;

  /** Keys whose facts are appendix-only by contract (owner-scoped detail). */
  const PRIVATE_APPENDIX_KEYS: ReadonlySet<string> = new Set([
    "flesh-and-blood.draw.private",
    "flesh-and-blood.look.private",
    "flesh-and-blood.opt.private",
    "flesh-and-blood.search.found",
    "flesh-and-blood.decision.private",
  ]);

  const EXPECTED_TAGS_BY_CATEGORY: Readonly<Record<FabLogCategory, readonly string[]>> = {
    action: ["move"],
    combat: ["combat"],
    ability: ["ability"],
    rules: ["system"],
    system: ["system"],
  };

  const readerActorLabel = (
    actorId: string,
    usage: "subject" | "possessive" | "possessive-lower",
  ): string | undefined => {
    if (actorId === VIEWER) {
      return usage === "possessive" ? "Rival's" : usage === "possessive-lower" ? "their" : "Rival";
    }
    if (actorId === OPPONENT) {
      return usage === "possessive" ? "Your" : usage === "possessive-lower" ? "your" : "You";
    }
    return undefined;
  };

  /** Canary-bearing sample values; seat keys carry the given seat id. */
  function sampleValuesFor(key: FabLogKey, seatId: string, scope: string): Record<string, string> {
    const values: Record<string, string> = {};
    for (const name of FAB_LOG_TRANSLATION_VALUE_KEYS[key]) {
      values[name] = SEAT_VALUE_KEYS.has(name) ? seatId : `${scope} ${name}`;
    }
    return values;
  }

  it("projects every registered key for its private owner and redacts it for public readers", () => {
    expect(FAB_LOG_KEYS.length).toBeGreaterThanOrEqual(95);
    const problems: string[] = [];

    for (const key of FAB_LOG_KEYS) {
      const valueKeys = [...FAB_LOG_TRANSLATION_VALUE_KEYS[key]];
      const seatValueKeys = valueKeys.filter((name) => SEAT_VALUE_KEYS.has(name));
      const isPrivate = PRIVATE_APPENDIX_KEYS.has(key);
      const ownerValues = sampleValuesFor(key, VIEWER, `Owner-only ${key}`);
      // Public keys ride the public array only; private keys ride each
      // viewer's own appendix with their own detail, mirroring the wire.
      const log: FabMoveLog = isPrivate
        ? {
            ...moveLog(),
            public: [],
            privateByPlayerId: {
              [VIEWER]: [message(key, ownerValues, "REGISTRY-MISS")],
              [OPPONENT]: [
                message(key, sampleValuesFor(key, OPPONENT, `Reader-only ${key}`), "REGISTRY-MISS"),
              ],
            },
          }
        : { ...moveLog(), public: [message(key, ownerValues, "REGISTRY-MISS")] };

      if (key === "flesh-and-blood.turn.started") {
        // Deliberately suppressed by the projection — the panel's turn headers
        // already announce every turn — but the template must still render.
        const rendered = renderFabMoveLogMessage(message(key, { turnNumber: 2 }, "REGISTRY-MISS"));
        if (rendered === "REGISTRY-MISS" || rendered.includes("{")) {
          problems.push(`${key}: suppressed row failed to render "${rendered}"`);
        }
        if (projectFabLogEntries([log], { viewerId: VIEWER }).length !== 0) {
          problems.push(`${key}: turn announcement was not suppressed`);
        }
        continue;
      }

      const ownerEntries = projectFabLogEntries([log], { viewerId: VIEWER });
      const readerEntries = projectFabLogEntries([log], {
        viewerId: OPPONENT,
        actorLabel: readerActorLabel,
      });
      const ownerNoPrivate = projectFabLogEntries([log], {
        viewerId: VIEWER,
        includePrivate: false,
      });

      if (ownerEntries.length !== 1) {
        problems.push(`${key}: owner projected ${ownerEntries.length} entries`);
        continue;
      }
      if (readerEntries.length !== 1) {
        problems.push(`${key}: reader projected ${readerEntries.length} entries`);
        continue;
      }
      if (ownerNoPrivate.length !== (isPrivate ? 0 : 1)) {
        problems.push(`${key}: includePrivate=false projected ${ownerNoPrivate.length} entries`);
      }

      const ownerMessage = ownerEntries[0]?.message ?? "";
      const readerMessage = readerEntries[0]?.message ?? "";
      for (const [label, rendered] of [
        ["owner", ownerMessage],
        ["reader", readerMessage],
      ] as const) {
        if (rendered === "REGISTRY-MISS") {
          problems.push(`${key}: ${label} fell back to defaultMessage`);
        }
        if (rendered.includes("{") || rendered.includes("}")) {
          problems.push(`${key}: ${label} left placeholder braces "${rendered}"`);
        }
        if (rendered.includes(VIEWER) || rendered.includes(OPPONENT)) {
          problems.push(`${key}: ${label} kept a raw seat id "${rendered}"`);
        }
      }

      // Owner and reader labels must use the morphology declared for each
      // actor slot: subject, possessive, or lower-case possessive.
      for (const seatValueKey of seatValueKeys) {
        const usage = fabLogActorSlotUsage(key, seatValueKey);
        const ownerLabel =
          usage === "possessive" ? "Your" : usage === "possessive-lower" ? "your" : "You";
        if (!ownerMessage.includes(ownerLabel)) {
          problems.push(`${key}: owner line missing "${ownerLabel}" label "${ownerMessage}"`);
        }
      }
      for (const [name, value] of Object.entries(ownerValues)) {
        if (SEAT_VALUE_KEYS.has(name)) continue;
        if (!ownerMessage.includes(value)) {
          problems.push(`${key}: owner line missing canary "${value}"`);
        }
        if (isPrivate) continue;
        if (!readerMessage.includes(value)) {
          problems.push(`${key}: reader line missing public canary "${value}"`);
        }
      }

      // Reader view uses the corresponding rival form and never claims the
      // public fact's subject as the viewer's own seat.
      if (!isPrivate) {
        for (const seatValueKey of seatValueKeys) {
          const usage = fabLogActorSlotUsage(key, seatValueKey);
          const readerLabel =
            usage === "possessive" ? "Rival's" : usage === "possessive-lower" ? "their" : "Rival";
          if (!readerMessage.includes(readerLabel)) {
            problems.push(`${key}: reader line missing "${readerLabel}" label "${readerMessage}"`);
          }
        }
        if (/\bYou\b/.test(readerMessage)) {
          problems.push(`${key}: reader line claimed the rival seat "${readerMessage}"`);
        }
      }
      if (isPrivate) {
        if (!readerMessage.includes("Reader-only")) {
          problems.push(`${key}: reader did not get its own appendix "${readerMessage}"`);
        }
        if (readerMessage.includes("Owner-only")) {
          problems.push(`${key}: reader saw the owner's appendix "${readerMessage}"`);
        }
        if (ownerMessage.includes("Reader-only")) {
          problems.push(`${key}: owner saw the reader's appendix "${ownerMessage}"`);
        }
      }

      const category = FAB_LOG_KEY_CATEGORIES[key];
      const expectedTags = EXPECTED_TAGS_BY_CATEGORY[category];
      if (expectedTags === undefined) {
        problems.push(`${key}: unclassified key`);
      } else if (JSON.stringify(ownerEntries[0]?.tags) !== JSON.stringify(expectedTags)) {
        problems.push(
          `${key}: tags ${JSON.stringify(ownerEntries[0]?.tags)} do not match category ${category}`,
        );
      }
    }

    expect(problems).toEqual([]);
  });

  it("never renders another seat's appendix for any private-family key", () => {
    const problems: string[] = [];
    for (const key of PRIVATE_APPENDIX_KEYS) {
      const log: FabMoveLog = {
        ...moveLog({ playerId: OPPONENT }),
        public: [message("flesh-and-blood.draw", { playerId: OPPONENT })],
        privateByPlayerId: {
          [OPPONENT]: [message(key, { playerId: OPPONENT, cardNames: "Secret Card" })],
        },
      };
      const spectator = projectFabLogEntries([log], { viewerId: VIEWER });
      if (JSON.stringify(spectator).includes("Secret Card")) {
        problems.push(`${key}: leaked into a non-owner projection`);
      }
      if (spectator.length !== 1) {
        problems.push(`${key}: spectator projection kept ${spectator.length} entries`);
      }
    }
    expect(problems).toEqual([]);
  });
});

describe("redundancy marker filtering", () => {
  it("drops turn.started announcements that duplicate the panel's turn headers", () => {
    const entries = projectFabLogEntries(
      [
        moveLog({ public: [message("flesh-and-blood.turn.started", { turnNumber: 2 })] }),
        moveLog({
          sequence: 1,
          public: [message("flesh-and-blood.play", { actorId: VIEWER, cardName: "Snatch" })],
        }),
      ],
      { viewerId: VIEWER },
    );

    expect(entries).toHaveLength(1);
    expect(entries[0]?.message).toBe("You played Snatch.");
  });

  it("drops a begin-play marker once the same turn's completed play line lands", () => {
    const entries = projectFabLogEntries(
      [
        moveLog({
          moveType: "begin-play",
          public: [message("flesh-and-blood.command.begin-play", { actorId: VIEWER })],
        }),
        moveLog({
          sequence: 1,
          public: [message("flesh-and-blood.play", { actorId: VIEWER, cardName: "Snatch" })],
        }),
      ],
      { viewerId: VIEWER },
    );

    expect(entries).toHaveLength(1);
    expect(entries[0]?.message).toBe("You played Snatch.");
  });

  it("keeps an orphaned begin-play marker whose play never landed", () => {
    // e.g. an undo removed the completing entry: the intent marker is the
    // only witness and stays visible.
    const entries = projectFabLogEntries(
      [moveLog({ public: [message("flesh-and-blood.command.begin-play", { actorId: VIEWER })] })],
      { viewerId: VIEWER },
    );

    expect(entries).toHaveLength(1);
    expect(entries[0]?.message).toBe("You began playing a card.");
  });

  it("keeps a begin-play marker when the completed play lands in a later turn", () => {
    const entries = projectFabLogEntries(
      [
        moveLog({
          turnNumber: 1,
          public: [message("flesh-and-blood.command.begin-play", { actorId: VIEWER })],
        }),
        moveLog({
          turnNumber: 2,
          sequence: 1,
          public: [message("flesh-and-blood.play", { actorId: VIEWER, cardName: "Snatch" })],
        }),
      ],
      { viewerId: VIEWER },
    );

    expect(entries.map((entry) => entry.message)).toEqual([
      "You began playing a card.",
      "You played Snatch.",
    ]);
  });
});
