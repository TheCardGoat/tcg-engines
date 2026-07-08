import { describe, expect, test } from "vite-plus/test";
import {
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
});
