import { describe, expect, test } from "vite-plus/test";
import {
  defOf,
  privateField,
  type CardInstanceId,
  type MoveLog,
  type PlayerId,
} from "@tcg/cyberpunk-engine";

import type { MoveLogEntry } from "./EngineProvider";
import { DEFAULT_SCENARIO, getScenario } from "./fixtures/scenarios";
import { projectMoveLogEntries } from "./moveLogProjection";

const P1 = "p1" as PlayerId;
const P2 = "p2" as PlayerId;
const ATTACKER_ID = "attacker-1" as CardInstanceId;
const DEFENDER_ID = "defender-1" as CardInstanceId;

describe("projectMoveLogEntries", () => {
  test("projects setup mulligan logs without exposing drawn card instance ids", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const drawn = [
      "ci_869943942",
      "ci_172446419",
      "ci_336613612",
      "ci_907302128",
      "ci_444827020",
      "ci_263062651",
    ] as CardInstanceId[];
    const moveLogs: MoveLogEntry[] = [
      {
        id: 1,
        side: "opponent",
        log: {
          type: "keepHand",
          playerId: P2,
          timestamp: 1783699897205,
          turnNumber: 1,
        },
      },
      {
        id: 2,
        side: "player",
        log: {
          type: "mulligan",
          playerId: P1,
          timestamp: 1783699903237,
          turnNumber: 1,
          drawnCount: 6,
          drawn: privateField(drawn, [P1]),
        },
      },
      {
        id: 3,
        side: "player",
        log: {
          type: "phaseChanged",
          playerId: P1,
          timestamp: 1783699903237,
          turnNumber: 1,
          fromPhase: "setup",
          toPhase: "start",
        },
      },
    ];

    const entries = projectMoveLogEntries(matchState, moveLogs, "player");

    expect(entries.map((entry) => entry.message)).toEqual([
      "Kept opening hand.",
      "Took a mulligan and drew 6 cards.",
      "Setup complete; start phase begins.",
    ]);
    expect(entries[1]?.message).not.toContain("ci_");
  });

  test("groups historical logs by their emitted turn and projected phase", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    matchState.G.turnMetadata.turnNumber = 3;
    matchState.G.gamePhase = "main";
    const moveLogs: MoveLogEntry[] = [
      {
        id: 1,
        side: "opponent",
        log: {
          type: "mulligan",
          playerId: P2,
          timestamp: 0,
          turnNumber: 1,
          drawnCount: 6,
        },
      },
      {
        id: 2,
        side: "system",
        log: {
          type: "phaseChanged",
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
          fromPhase: "setup",
          toPhase: "start",
        },
      },
      {
        id: 3,
        side: "player",
        log: {
          type: "gainGig",
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
          dieId: "gig-1",
          dieType: "D6",
          faceValue: 5,
        } as unknown as MoveLog,
      },
      {
        id: 4,
        side: "player",
        log: {
          type: "passPhase",
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
          fromPhase: "main",
          toPhase: "start",
        },
      },
      {
        id: 5,
        side: "system",
        log: {
          type: "turnEnded",
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
        },
      },
      {
        id: 6,
        side: "system",
        log: {
          type: "turnStarted",
          playerId: P2,
          timestamp: 0,
          turnNumber: 2,
        },
      },
      {
        id: 7,
        side: "opponent",
        log: {
          type: "gainGig",
          playerId: P2,
          timestamp: 0,
          turnNumber: 2,
          dieId: "gig-2",
          dieType: "D12",
          faceValue: 1,
        } as unknown as MoveLog,
      },
      {
        id: 8,
        side: "system",
        log: {
          type: "turnStarted",
          playerId: P1,
          timestamp: 0,
          turnNumber: 3,
        },
      },
    ];

    const entries = projectMoveLogEntries(matchState, moveLogs, "player");

    expect(entries.map((entry) => entry.turn)).toEqual([1, 1, 1, 1, 1, 2, 2, 3]);
    expect(entries.map((entry) => entry.phase)).toEqual([
      "setup",
      "start",
      "start",
      "main",
      "start",
      "start",
      "start",
      "start",
    ]);
  });

  test("projects attached gear action logs with both card name references", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const log: MoveLog = {
      type: "action",
      messageKey: "move.playCard.gear",
      params: {
        cardName: "Sandevistan",
        cost: 3,
        attachedToName: "Placide - Voodoo Sentinel",
      },
      playerId: P1,
      timestamp: 0,
      turnNumber: 1,
    } as unknown as MoveLog;
    const moveLogs: MoveLogEntry[] = [{ id: 1, side: "player", log }];

    expect(projectMoveLogEntries(matchState, moveLogs, "player")[0]?.cardRefs).toEqual([
      { name: "Sandevistan" },
      { name: "Placide - Voodoo Sentinel" },
    ]);
  });

  test("projects combat action log attacker names as card references", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const log: MoveLog = {
      type: "action",
      messageKey: "move.attackRival",
      params: {
        attackerName: "Placide - Voodoo Sentinel",
      },
      playerId: P1,
      timestamp: 0,
      turnNumber: 1,
    } as unknown as MoveLog;
    const moveLogs: MoveLogEntry[] = [{ id: 1, side: "player", log }];

    expect(projectMoveLogEntries(matchState, moveLogs, "player")[0]?.cardRefs).toEqual([
      { name: "Placide - Voodoo Sentinel" },
    ]);
  });

  test("projects trash-from-deck and selected target action logs with card names", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const moveLogs: MoveLogEntry[] = [
      {
        id: 1,
        side: "player",
        log: {
          type: "action",
          messageKey: "effect.trashFromDeck.resolved",
          params: {
            sourceCardName: "V — StreetKid",
            trashedCount: 3,
            trashedCardNames: privateField("Swordwise Huscle, Floor It, Secondhand Bombus", [P1]),
          },
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
        } as unknown as MoveLog,
      },
      {
        id: 2,
        side: "player",
        log: {
          type: "action",
          messageKey: "trigger.targetResolved",
          params: {
            sourceCardName: "V — StreetKid",
            targetNames: "Afterparty at Lizzie's",
          },
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
        } as unknown as MoveLog,
      },
    ];

    const entries = projectMoveLogEntries(matchState, moveLogs, "player");

    expect(entries[0]?.message).toBe(
      "V — StreetKid trashed 3 card(s) from the top of the deck: Swordwise Huscle, Floor It, Secondhand Bombus.",
    );
    expect(entries[0]?.cardRefs).toEqual([
      { name: "V — StreetKid" },
      { name: "Swordwise Huscle" },
      { name: "Floor It" },
      { name: "Secondhand Bombus" },
    ]);
    expect(entries[1]?.message).toBe("Selected Afterparty at Lizzie's for V — StreetKid.");
    expect(entries[1]?.cardRefs).toEqual([
      { name: "V — StreetKid" },
      { name: "Afterparty at Lizzie's" },
    ]);
  });

  test("describes same-phase pass logs as completed phase passes", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const moveLogs: MoveLogEntry[] = [
      {
        id: 1,
        side: "player",
        log: {
          type: "passPhase",
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
          fromPhase: "main",
          toPhase: "main",
        } as unknown as MoveLog,
      },
      {
        id: 2,
        side: "system",
        log: {
          type: "turnEnded",
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
        },
      },
    ];

    expect(
      projectMoveLogEntries(matchState, moveLogs, "player").map((entry) => entry.message),
    ).toEqual(["Passed main phase.", "Turn 1 ended."]);
  });

  test("projects combat logs with rule-step wording", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const moveLogs: MoveLogEntry[] = [
      {
        id: 1,
        side: "player",
        log: {
          type: "attackRival",
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
          attackerId: ATTACKER_ID,
          attackerName: "Placide - Voodoo Sentinel",
        },
      },
      {
        id: 2,
        side: "opponent",
        log: {
          type: "reactPass",
          playerId: P2,
          timestamp: 0,
          turnNumber: 1,
          attackerId: ATTACKER_ID,
          attackerName: "Placide - Voodoo Sentinel",
        },
      },
      {
        id: 3,
        side: "player",
        log: {
          type: "resolveStealGigs",
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
          attackerName: "Placide - Voodoo Sentinel",
          attackerPower: 11,
          stolenCount: 2,
        },
      },
    ];

    expect(
      projectMoveLogEntries(matchState, moveLogs, "player").map((entry) => entry.message),
    ).toEqual([
      "Attack: Placide - Voodoo Sentinel spent to attack the rival Gig area.",
      "React: rival passed on Placide - Voodoo Sentinel's attack.",
      "Steal: Placide - Voodoo Sentinel stole 2 Gigs at 11 power.",
    ]);
    expect(
      projectMoveLogEntries(matchState, moveLogs, "player").map((entry) => entry.section),
    ).toEqual([
      { id: "attack", label: "Attack", tone: "attack" },
      { id: "react", label: "React", tone: "react" },
      { id: "steal", label: "Steal", tone: "steal" },
    ]);
  });

  test("projects combat log types and fight action logs into rule sections", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const moveLogs: MoveLogEntry[] = [
      {
        id: 1,
        side: "player",
        log: {
          type: "attackUnit",
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
          attackerId: ATTACKER_ID,
          defenderId: DEFENDER_ID,
          attackerName: "Modded Kusanagi",
          defenderName: "Psycho Squad",
        },
      },
      {
        id: 2,
        side: "opponent",
        log: {
          type: "useBlocker",
          playerId: P2,
          timestamp: 0,
          turnNumber: 1,
          blockerId: DEFENDER_ID,
          attackerId: ATTACKER_ID,
          blockerName: "Psycho Squad",
          attackerName: "Modded Kusanagi",
        },
      },
      {
        id: 3,
        side: "player",
        log: {
          type: "action",
          messageKey: "move.resolveAttack.fight.attackerWins",
          params: {
            attackerName: "Modded Kusanagi",
            defenderName: "Psycho Squad",
            attackerPower: 11,
            defenderPower: 6,
          },
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
        } as unknown as MoveLog,
      },
    ];

    const entries = projectMoveLogEntries(matchState, moveLogs, "player");

    expect(entries.map((entry) => entry.section?.id)).toEqual(["attack", "react", "fight"]);
    expect(entries.map((entry) => entry.tags)).toEqual([
      ["combat"],
      ["combat"],
      ["move", "combat"],
    ]);
    expect(entries[2]?.message).toBe("Fight: Modded Kusanagi (11) defeated Psycho Squad (6).");
  });

  test("groups QUICK program play and resolution in the React section", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const moveLogs: MoveLogEntry[] = [
      {
        id: 1,
        side: "player",
        log: {
          type: "attackUnit",
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
          attackerId: ATTACKER_ID,
          defenderId: DEFENDER_ID,
          attackerName: "Modded Kusanagi",
          defenderName: "Psycho Squad",
        },
      },
      {
        id: 2,
        side: "opponent",
        log: {
          type: "action",
          messageKey: "move.playCard",
          params: { cardName: "Reboot Optics", cost: 2 },
          playerId: P2,
          timestamp: 0,
          turnNumber: 1,
        } as unknown as MoveLog,
      },
      {
        id: 3,
        side: "opponent",
        log: {
          type: "action",
          messageKey: "trigger.autoResolved",
          params: {
            cardName: "Reboot Optics",
            abilityText:
              "The next time a rival Unit fights this turn, it doesn't defeat the opposing friendly Unit.",
          },
          playerId: P2,
          timestamp: 0,
          turnNumber: 1,
        } as unknown as MoveLog,
      },
    ];

    expect(
      projectMoveLogEntries(matchState, moveLogs, "player").map((entry) => entry.section?.id),
    ).toEqual(["attack", "react", "react"]);
  });

  test("projects array and private action log name params as card references", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const log: MoveLog = {
      type: "action",
      messageKey: "effect.target.selected",
      params: {
        sourceCardName: "Cyberpsychosis",
        targetNames: privateField(["Goro Takemura - Losing His Way", "Corpo Security"], [P1]),
      },
      playerId: P1,
      timestamp: 0,
      turnNumber: 1,
    } as unknown as MoveLog;
    const moveLogs: MoveLogEntry[] = [{ id: 1, side: "player", log }];

    expect(projectMoveLogEntries(matchState, moveLogs, "player")[0]?.cardRefs).toEqual([
      { name: "Cyberpsychosis" },
      { name: "Goro Takemura - Losing His Way" },
      { name: "Corpo Security" },
    ]);
  });

  test("projects named reveal action logs as card references", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const log: MoveLog = {
      type: "action",
      messageKey: "move.searchDeck.revealNamed",
      params: {
        count: 2,
        revealedCardNames: "Sketchy Ripper, Industrial Assembly",
      },
      playerId: P1,
      timestamp: 0,
      turnNumber: 1,
    } as unknown as MoveLog;
    const moveLogs: MoveLogEntry[] = [{ id: 1, side: "player", log }];

    const entry = projectMoveLogEntries(matchState, moveLogs, "player")[0];

    expect(entry?.message).toBe(
      "Revealed the top 2 cards of the deck: Sketchy Ripper, Industrial Assembly.",
    );
    expect(entry?.cardRefs).toEqual([{ name: "Sketchy Ripper" }, { name: "Industrial Assembly" }]);
  });

  test("projects visible search-deck logs with revealed card names", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const revealedIds = matchState.G.players[P1]!.zones.deck.slice(0, 3);
    const revealedNames = revealedIds.map((id) => defOf(matchState.G.cardIndex[id]!).displayName);
    const log: MoveLog = {
      type: "searchDeck",
      revealedCount: revealedIds.length,
      revealed: privateField(revealedIds, [P1]),
      playerId: P1,
      timestamp: 0,
      turnNumber: 1,
    };

    const entry = projectMoveLogEntries(matchState, [{ id: 1, side: "player", log }], "player")[0];

    expect(entry?.message).toBe(
      `Revealed the top ${revealedIds.length} cards of the deck: ${revealedNames.join(", ")}.`,
    );
    expect(entry?.entityIds).toEqual(revealedIds);
    expect(entry?.cardRefs).toEqual(
      revealedIds.map((id, index) => ({ id, name: revealedNames[index] })),
    );
  });

  test("keeps hidden search-deck logs count-only", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const log: MoveLog = {
      type: "searchDeck",
      revealedCount: 3,
      playerId: P2,
      timestamp: 0,
      turnNumber: 1,
    };

    const entry = projectMoveLogEntries(
      matchState,
      [{ id: 1, side: "opponent", log }],
      "player",
    )[0];

    expect(entry?.message).toBe("Revealed the top 3 cards of the deck.");
    expect(entry?.entityIds).toBeUndefined();
    expect(entry?.cardRefs).toBeUndefined();
  });

  test("deduplicates generic search reveal action logs when structured reveal is present", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const revealedIds = matchState.G.players[P1]!.zones.deck.slice(0, 3);
    const revealedNames = revealedIds.map((id) => defOf(matchState.G.cardIndex[id]!).displayName);
    const moveLogs: MoveLogEntry[] = [
      {
        id: 1,
        side: "player",
        log: {
          type: "searchDeck",
          revealedCount: revealedIds.length,
          revealed: privateField(revealedIds, [P1]),
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
        },
      },
      {
        id: 2,
        side: "player",
        log: {
          type: "action",
          messageKey: "move.searchDeck.reveal",
          params: { count: revealedIds.length },
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
        } as unknown as MoveLog,
      },
    ];

    const entries = projectMoveLogEntries(matchState, moveLogs, "player");

    expect(entries).toHaveLength(1);
    expect(entries[0]?.message).toBe(
      `Revealed the top ${revealedIds.length} cards of the deck: ${revealedNames.join(", ")}.`,
    );
    expect(entries[0]?.cardRefs).toEqual(
      revealedIds.map((id, index) => ({ id, name: revealedNames[index] })),
    );
  });

  test("includes revealed card names on count-only search resolution logs", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const revealedIds = matchState.G.players[P1]!.zones.deck.slice(0, 3);
    const revealedNames = revealedIds.map((id) => defOf(matchState.G.cardIndex[id]!).displayName);
    const moveLogs: MoveLogEntry[] = [
      {
        id: 1,
        side: "player",
        log: {
          type: "searchDeck",
          revealedCount: revealedIds.length,
          revealed: privateField(revealedIds, [P1]),
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
        },
      },
      {
        id: 2,
        side: "player",
        log: {
          type: "action",
          messageKey: "move.resolveSearchDeck",
          params: { count: 0, looked: revealedIds.length },
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
        } as unknown as MoveLog,
      },
    ];

    const entries = projectMoveLogEntries(matchState, moveLogs, "player");

    expect(entries[1]?.message).toBe(
      `Searched the top ${revealedIds.length} cards (${revealedNames.join(", ")}) and found 0.`,
    );
  });

  test("uses named search resolution logs when searched cards move to hand", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const moveLogs: MoveLogEntry[] = [
      {
        id: 1,
        side: "player",
        log: {
          type: "action",
          messageKey: "move.resolveSearchDeck",
          params: { count: 1, looked: 3 },
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
        } as unknown as MoveLog,
      },
      {
        id: 2,
        side: "player",
        log: {
          type: "action",
          messageKey: "move.resolveSearchDeckNamed",
          params: {
            count: 1,
            looked: 3,
            destination: "hand",
            selectedCardNames: "Overwatch - Panam's Gift",
            remainderCount: 2,
          },
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
        } as unknown as MoveLog,
      },
    ];

    const entries = projectMoveLogEntries(matchState, moveLogs, "player");

    expect(entries).toHaveLength(1);
    expect(entries[0]?.message).toBe(
      "Searched the top 3 cards and added Overwatch - Panam's Gift to hand. Bottom-decked 2.",
    );
    expect(entries[0]?.cardRefs).toEqual([{ name: "Overwatch - Panam's Gift" }]);
  });

  test("projects named auto-search resolution logs as card references", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const log: MoveLog = {
      type: "action",
      messageKey: "move.resolveSearchDeckNamed",
      params: {
        count: 2,
        looked: 4,
        destination: "hand",
        selectedCardNames: "Swordwise Huscle, Floor It",
        remainderCount: 2,
      },
      playerId: P1,
      timestamp: 0,
      turnNumber: 1,
    } as unknown as MoveLog;
    const moveLogs: MoveLogEntry[] = [{ id: 1, side: "player", log }];

    const entry = projectMoveLogEntries(matchState, moveLogs, "player")[0];

    expect(entry?.message).toBe(
      "Searched the top 4 cards and added Swordwise Huscle, Floor It to hand. Bottom-decked 2.",
    );
    expect(entry?.cardRefs).toEqual([{ name: "Swordwise Huscle" }, { name: "Floor It" }]);
  });

  test("projects look-at-card logs instead of falling back to unknown moves", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const legendId = matchState.G.players[P1]?.zones.legendArea[0];
    expect(legendId).toBeDefined();
    const legend = matchState.G.cardIndex[String(legendId)];
    expect(legend).toBeDefined();
    const log: MoveLog = {
      type: "lookAtCards",
      sourceCardId: "kiroshi-optics-1" as CardInstanceId,
      ownerId: P1,
      zone: "legendArea",
      cardIds: privateField([legendId as CardInstanceId], [P1]),
      playerId: P1,
      timestamp: 0,
      turnNumber: 1,
    };
    const moveLogs: MoveLogEntry[] = [{ id: 1, side: "player", log }];

    const entry = projectMoveLogEntries(matchState, moveLogs, "player")[0];

    expect(entry?.message).toBe("Looked at 1 card in legend area.");
    expect(entry?.entityIds).toEqual([legendId]);
    expect(entry?.cardRefs).toEqual([{ id: legendId, name: defOf(legend!).displayName }]);
  });

  test("projects private drawn card names only when visible", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const visibleLog: MoveLog = {
      type: "action",
      messageKey: "effect.draw.resolved",
      params: {
        sourceCardName: "Fool on the Hill",
        drawnCount: 2,
        drawnCardNames: "Riding Nomad, Sketchy Ripper",
      },
      playerId: P1,
      timestamp: 0,
      turnNumber: 1,
    } as unknown as MoveLog;
    const hiddenLog: MoveLog = {
      type: "action",
      messageKey: "effect.draw.resolved",
      params: {
        sourceCardName: "Fool on the Hill",
        drawnCount: 2,
      },
      playerId: P1,
      timestamp: 0,
      turnNumber: 1,
    } as unknown as MoveLog;

    expect(
      projectMoveLogEntries(matchState, [{ id: 1, side: "player", log: visibleLog }], "player")[0],
    ).toMatchObject({
      message: "Fool on the Hill drew 2 card(s): Riding Nomad, Sketchy Ripper.",
      cardRefs: [
        { name: "Fool on the Hill" },
        { name: "Riding Nomad" },
        { name: "Sketchy Ripper" },
      ],
    });
    expect(
      projectMoveLogEntries(matchState, [{ id: 2, side: "player", log: hiddenLog }], "opponent")[0]
        ?.message,
    ).toBe("Fool on the Hill drew 2 card(s).");
  });

  test("projects deck-sale action logs with sold top-card name when visible", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const visibleLog: MoveLog = {
      type: "action",
      messageKey: "effect.sellFromDeck.resolved",
      params: {
        sourceCardName: "Bootleg Black Sapphire Show",
        soldCount: 1,
        soldCardNames: "Corpo Security",
      },
      playerId: P1,
      timestamp: 0,
      turnNumber: 1,
    } as unknown as MoveLog;
    const hiddenLog: MoveLog = {
      type: "action",
      messageKey: "effect.sellFromDeck.resolved",
      params: {
        sourceCardName: "Bootleg Black Sapphire Show",
        soldCount: 1,
      },
      playerId: P1,
      timestamp: 0,
      turnNumber: 1,
    } as unknown as MoveLog;

    expect(
      projectMoveLogEntries(matchState, [{ id: 1, side: "player", log: visibleLog }], "player")[0],
    ).toMatchObject({
      message: "Bootleg Black Sapphire Show sold Corpo Security from the top of the deck.",
      cardRefs: [{ name: "Bootleg Black Sapphire Show" }, { name: "Corpo Security" }],
    });
    expect(
      projectMoveLogEntries(matchState, [{ id: 2, side: "player", log: hiddenLog }], "opponent")[0]
        ?.message,
    ).toBe("Bootleg Black Sapphire Show sold the top card of the deck.");
  });

  test("projects discard action logs with discarded card and cost", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const log: MoveLog = {
      type: "action",
      messageKey: "effect.discard.resolved",
      params: {
        sourceCardName: "Overwatch — Panam's Gift",
        discardedCardName: "Mox Inciters",
        discardedCost: 3,
      },
      playerId: P1,
      timestamp: 0,
      turnNumber: 1,
    } as unknown as MoveLog;

    expect(
      projectMoveLogEntries(matchState, [{ id: 1, side: "player", log }], "player")[0],
    ).toMatchObject({
      message: "Overwatch — Panam's Gift discarded Mox Inciters (cost 3).",
      cardRefs: [{ name: "Overwatch — Panam's Gift" }, { name: "Mox Inciters" }],
    });
  });

  test("projects bonus discard logs with the matching Gig reason", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const log: MoveLog = {
      type: "resolveDiscardFromHand",
      discardedCount: 1,
      reason: "costMatchedFriendlyGig",
      playerId: P2,
      timestamp: 0,
      turnNumber: 1,
    };

    expect(
      projectMoveLogEntries(matchState, [{ id: 1, side: "opponent", log }], "player")[0]?.message,
    ).toBe("Discarded 1 additional card because the discarded card's cost matched a friendly Gig.");
  });

  test("projects Misty's selected type reveal result as card references", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const log: MoveLog = {
      type: "action",
      messageKey: "trigger.revealTopCardType.hit",
      params: {
        sourceCardName: "Misty Olszewski — Mender of Broken Spirits",
        chosenType: "unit",
        revealedCardName: "Mox Inciters",
        revealedType: "unit",
      },
      playerId: P1,
      timestamp: 0,
      turnNumber: 1,
    } as unknown as MoveLog;
    const moveLogs: MoveLogEntry[] = [{ id: 1, side: "player", log }];

    const entry = projectMoveLogEntries(matchState, moveLogs, "player")[0];

    expect(entry?.message).toBe(
      "Misty Olszewski — Mender of Broken Spirits selected unit, revealed Mox Inciters (unit), and because it matched, added it to hand.",
    );
    expect(entry?.cardRefs).toEqual([
      { name: "Misty Olszewski — Mender of Broken Spirits" },
      { name: "Mox Inciters" },
    ]);
  });

  test("projects retailGearLegendBench attack flow into readable combat sections", () => {
    const matchState = getScenario("retailGearLegendBench").build().getState();
    const moveLogs: MoveLogEntry[] = [
      {
        id: 1,
        side: "player",
        log: {
          type: "attackUnit",
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
          attackerId: ATTACKER_ID,
          defenderId: DEFENDER_ID,
          attackerName: "Modded Kusanagi",
          defenderName: "Psycho Squad",
        },
      },
      {
        id: 2,
        side: "player",
        log: {
          type: "action",
          messageKey: "trigger.autoResolved",
          params: {
            cardName: "Dying Night — V's Pistol",
            abilityText: "ATTACK Decrease a Gig by up to 2.",
          },
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
        } as unknown as MoveLog,
      },
      {
        id: 3,
        side: "player",
        log: {
          type: "action",
          messageKey: "trigger.targetResolved",
          params: {
            targetNames: "D10",
            sourceCardName: "Dying Night — V's Pistol",
          },
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
        } as unknown as MoveLog,
      },
      {
        id: 4,
        side: "player",
        log: {
          type: "action",
          messageKey: "move.resolveAdjustGig",
          params: {
            dieLabel: "D10",
            previousValue: 10,
            value: 9,
          },
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
        } as unknown as MoveLog,
      },
      {
        id: 5,
        side: "opponent",
        log: {
          type: "callLegend",
          cardId: "legend-1" as CardInstanceId,
          legendName: "Panam Palmer — Nomad Cavalry",
          playerId: P2,
          timestamp: 0,
          turnNumber: 1,
        },
      },
      {
        id: 6,
        side: "opponent",
        log: {
          type: "reactPass",
          playerId: P2,
          timestamp: 0,
          turnNumber: 1,
          attackerId: ATTACKER_ID,
          attackerName: "Modded Kusanagi",
        },
      },
      {
        id: 7,
        side: "player",
        log: {
          type: "action",
          messageKey: "move.resolveAttack.fight.attackerWins",
          params: {
            attackerName: "Modded Kusanagi",
            defenderName: "Psycho Squad",
            attackerPower: 11,
            defenderPower: 6,
          },
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
        } as unknown as MoveLog,
      },
    ];

    expect(
      projectMoveLogEntries(matchState, moveLogs, "player").map((entry) => entry.section?.label),
    ).toEqual(["Attack", "Attack", "Attack", "Attack", "React", "React", "Fight"]);
  });

  test("preserves original tag classifications for sectioned combat entries", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const moveLogs: MoveLogEntry[] = [
      {
        id: 1,
        side: "player",
        log: {
          type: "attackRival",
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
          attackerId: ATTACKER_ID,
          attackerName: "Placide - Voodoo Sentinel",
        },
      },
      {
        id: 2,
        side: "opponent",
        log: {
          type: "activateAbility",
          cardId: "quick-ability-1" as CardInstanceId,
          cardName: "Quick Hack",
          playerId: P2,
          timestamp: 0,
          turnNumber: 1,
        } as unknown as MoveLog,
      },
    ];

    const entries = projectMoveLogEntries(matchState, moveLogs, "player");

    expect(entries[1]?.section?.id).toBe("react");
    expect(entries[1]?.tags).toEqual(["ability", "combat"]);
  });

  test("keeps standalone defeated-target triggers out of combat fight sections", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const moveLogs: MoveLogEntry[] = [
      {
        id: 1,
        side: "player",
        log: {
          type: "action",
          messageKey: "trigger.defeatedTarget",
          params: {
            sourceCardName: "Dying Night - V's Pistol",
            targetName: "Psycho Squad",
          },
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
        } as unknown as MoveLog,
      },
    ];

    const entries = projectMoveLogEntries(matchState, moveLogs, "player");

    expect(entries[0]?.section).toBeUndefined();
    expect(entries[0]?.tags).toEqual(["move"]);
  });

  test("projects server player-drop logs with their persisted reason", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const moveLogs: MoveLogEntry[] = [
      {
        id: 1,
        side: "system",
        log: {
          type: "playerDropped",
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
          reason: "Opponent timed out",
        } as unknown as MoveLog,
      },
      {
        id: 2,
        side: "system",
        log: {
          type: "playerDropped",
          playerId: P1,
          timestamp: 1,
          turnNumber: 1,
          reason: "Opponent disconnected",
        } as unknown as MoveLog,
      },
    ];

    expect(
      projectMoveLogEntries(matchState, moveLogs, "player").map((entry) => entry.message),
    ).toEqual(["Opponent timed out and was dropped.", "Opponent disconnected and was dropped."]);
  });
});
