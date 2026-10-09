import { describe, expect, test } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  defOf,
  privateField,
  stripPrivateFields,
  type CardInstanceId,
  type CommandResult,
  type GigDieId,
  type GenericActionLog,
  type MoveLog,
  type PlayerId,
} from "@tcg/cyberpunk-engine";
import {
  welcomeToNightCityRetailAdamSmasherEnderOfLegends,
  welcomeToNightCityRetailArasakaEmergencyRadioport,
  welcomeToNightCityRetailDetonate,
  welcomeToNightCityRetailDumDumMaelstromTriggerman,
  welcomeToNightCityRetailJackieWellesMamaSFavorite,
  welcomeToNightCityRetailKiroshiOptics,
  welcomeToNightCityRetailPepeNajarroWorkingDoubles,
  welcomeToNightCityRetailVStreetkid,
  welcomeToNightCityRetailSwordwiseHuscle,
  welcomeToNightCityRetailZetatechFaceplate,
} from "@tcg/cyberpunk-cards";

import type { MoveLogEntry } from "./EngineProvider";
import { DEFAULT_SCENARIO, getScenario } from "./fixtures/scenarios";
import { projectMoveLogEntries } from "./moveLogProjection";

const P1 = "p1" as PlayerId;
const P2 = "p2" as PlayerId;
const ATTACKER_ID = "attacker-1" as CardInstanceId;
const DEFENDER_ID = "defender-1" as CardInstanceId;

describe("projectMoveLogEntries", () => {
  test("shows Dum Dum's automatic target and power result after activation", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        {
          card: welcomeToNightCityRetailSwordwiseHuscle,
          spent: true,
          hasLag: false,
          attachedGears: [welcomeToNightCityRetailKiroshiOptics],
        },
      ],
      legendArea: [
        {
          card: welcomeToNightCityRetailDumDumMaelstromTriggerman,
          faceDown: false,
          spent: false,
        },
      ],
      eddies: 1,
    });
    const result = engine.activateAbility(welcomeToNightCityRetailDumDumMaelstromTriggerman, 2, {
      as: P1,
    });
    const logs: MoveLogEntry[] = result.moveLogs.map((log, index) => ({
      id: index + 1,
      side: "player",
      log,
    }));

    expect(
      projectMoveLogEntries(engine.getState(), logs, "player").map((entry) => entry.message),
    ).toEqual([
      "Dum Dum: Maelstrom Triggerman activated its ability.",
      "Dum Dum: Maelstrom Triggerman gave Swordwise Huscle +1 power.",
    ]);
  });

  test("keeps Pepe's spend, Faceplate, and ATTACK resolution logs in the Attack section", () => {
    const pepe = welcomeToNightCityRetailPepeNajarroWorkingDoubles;
    const faceplate = welcomeToNightCityRetailZetatechFaceplate;
    const radioport = welcomeToNightCityRetailArasakaEmergencyRadioport;
    const jackie = welcomeToNightCityRetailJackieWellesMamaSFavorite;
    const v = welcomeToNightCityRetailVStreetkid;
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailDetonate],
        field: [{ card: pepe, spent: false, hasLag: false, attachedGears: [faceplate, radioport] }],
        legendArea: [
          { card: jackie, faceDown: false, spent: true },
          { card: v, faceDown: false, spent: true },
          { card: welcomeToNightCityRetailAdamSmasherEnderOfLegends, faceDown: true, spent: true },
        ],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 3 },
          { dieType: "d10", faceValue: 4 },
        ],
      },
      undefined,
      { preserveDeckOrder: true },
    );
    engine.judgeSpendCard(jackie, { as: P1 });
    engine.judgeSpendCard(v, { as: P1 });

    const logs: MoveLogEntry[] = [];
    const record = (result: CommandResult) => {
      if (!result.success) throw new Error(`Expected move to succeed: ${result.error}`);
      for (const log of result.moveLogs) {
        logs.push({ id: logs.length + 1, side: "player", log });
      }
    };

    record(engine.attackRival(pepe, { as: P1 }));
    const firstChoice = engine.getPrompt(P1).choice;
    if (firstChoice?.type !== "chooseTrigger") throw new Error("Expected trigger order");
    const faceplateOption = firstChoice.payload.options.find(
      (option) => option.cardName === faceplate.displayName,
    );
    if (!faceplateOption) throw new Error("Expected Faceplate");
    record(
      engine.executeMove("resolveTrigger", { args: { triggerId: faceplateOption.triggerId } }, P1),
    );
    record(engine.resolveAdjustGig(engine.findGigIdByType(P1, "d10"), 3, { as: P1 }));

    const secondChoice = engine.getPrompt(P1).choice;
    if (secondChoice?.type !== "chooseTrigger") throw new Error("Expected remaining triggers");
    const pepeOption = secondChoice.payload.options.find(
      (option) => option.cardName === pepe.displayName,
    );
    if (!pepeOption) throw new Error("Expected Pepe");
    record(engine.executeMove("resolveTrigger", { args: { triggerId: pepeOption.triggerId } }, P1));
    const readyResult = engine.resolveEffectTargetIds(
      [engine.findCardId(jackie, "legendArea", P1), engine.findCardId(v, "legendArea", P1)],
      { as: P1, allowPendingChoice: true, reason: "Radioport remains pending" },
    );
    if (!readyResult) throw new Error("Expected ready result");
    record(readyResult);

    const radioportChoice = engine.getPrompt(P1).choice;
    expect(radioportChoice?.type).toBe("chooseTarget");
    const lookedAt = engine.resolveEffectTarget(welcomeToNightCityRetailAdamSmasherEnderOfLegends, {
      as: P1,
      allowPendingChoice: true,
      reason: "Radioport's optional Call decision follows the look decision",
    });
    record(lookedAt);
    record(
      engine.resolveEffectTarget(welcomeToNightCityRetailAdamSmasherEnderOfLegends, { as: P1 }),
    );

    expect(logs.some((entry) => entry.log.type === "lookAtCards")).toBe(true);
    expect(
      logs.some(
        (entry) => entry.log.type === "action" && entry.log.messageKey === "effect.callLegend.free",
      ),
    ).toBe(true);
    const entries = projectMoveLogEntries(engine.getState(), logs, "player");
    expect(entries.map((entry) => entry.message)).toEqual(
      expect.arrayContaining([
        expect.stringContaining("Pepe Najarro"),
        expect.stringContaining("Zetatech Faceplate"),
      ]),
    );
    expect(entries.map((entry) => [entry.message, entry.section?.id])).toEqual(
      entries.map((entry) => [entry.message, "attack"]),
    );
  });

  test("shows a local concession entry only while the server interaction is pending", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();

    const pending = projectMoveLogEntries(matchState, [], "player", "concede");

    expect(pending).toEqual([
      expect.objectContaining({
        id: "pending-concede",
        seatId: "p1",
        message: "Conceding the game…",
        sourceKey: "cyberpunk.concede.pending",
      }),
    ]);

    matchState.G.gameEnded = true;
    expect(projectMoveLogEntries(matchState, [], "player", "concede")).toEqual([]);
  });

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
          stolenGigs: [
            { dieType: "d4", faceValue: 1 },
            { dieType: "d6", faceValue: 3 },
          ],
        },
      },
    ];

    expect(
      projectMoveLogEntries(matchState, moveLogs, "player").map((entry) => entry.message),
    ).toEqual([
      "Attack: Placide - Voodoo Sentinel spent to attack the rival Gig area.",
      "React: rival passed on Placide - Voodoo Sentinel's attack.",
      "Steal: Placide - Voodoo Sentinel stole 2 Gigs (D4 with value 1; D6 with value 3) at 11 power.",
    ]);
    expect(
      projectMoveLogEntries(matchState, moveLogs, "player").map((entry) => entry.section),
    ).toEqual([
      { id: "attack", label: "Attack", tone: "attack" },
      { id: "react", label: "React", tone: "react" },
      { id: "steal", label: "Steal", tone: "steal" },
    ]);
  });

  test("projects an automatic steal with the die type and face value", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const moveLogs: MoveLogEntry[] = [
      {
        id: 1,
        side: "player",
        log: {
          type: "action",
          messageKey: "move.resolveAttack.direct",
          params: {
            attackerName: "Rogue Amendiares: Queen of the Afterlife",
            attackerPower: 4,
            count: 1,
            stolenGigs: "1 Gig (D4 with value 1)",
          },
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
        },
      },
    ];

    expect(projectMoveLogEntries(matchState, moveLogs, "player")[0]?.message).toBe(
      "Steal: Rogue Amendiares: Queen of the Afterlife stole 1 Gig (D4 with value 1) at 4 power.",
    );
  });

  test("keeps steal-trigger logs in the Steal step until the attack ends", () => {
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
          attackerName: "Maelstrom Goons",
        },
      },
      {
        id: 2,
        side: "player",
        log: {
          type: "resolveStealGigs",
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
          attackerName: "Maelstrom Goons",
          attackerPower: 5,
          stolenCount: 1,
          stolenGigs: [{ dieType: "d12", faceValue: 10 }],
        },
      },
      {
        id: 3,
        side: "player",
        log: {
          type: "action",
          messageKey: "trigger.autoResolved",
          params: {
            cardName: "Maelstrom Goons",
            abilityText: "When this Unit steals a Gig, if it's equipped, a Rival discards 1.",
          },
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
        } satisfies GenericActionLog,
      },
      {
        id: 4,
        side: "opponent",
        log: {
          type: "resolveDiscardFromHand",
          playerId: P2,
          timestamp: 0,
          turnNumber: 1,
          discardedCount: 1,
          discardedCards: [
            {
              cardId: "discarded-card" as CardInstanceId,
              cardName: "Lizzy Wizzy: Delicate Weapon",
            },
          ],
        },
      },
    ];

    expect(
      projectMoveLogEntries(matchState, moveLogs, "player").map((entry) => entry.section?.id),
    ).toEqual(["attack", "steal", "steal", "steal"]);
  });

  test("ends the combat at the steal — plays after it are not reactions", () => {
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
          attackerName: "6th Street Recruits",
        },
      },
      {
        id: 2,
        side: "player",
        log: {
          type: "resolveStealGigs",
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
          attackerName: "6th Street Recruits",
          attackerPower: 8,
          stolenCount: 1,
          stolenGigs: [{ dieType: "d6", faceValue: 2 }],
        },
      },
      {
        id: 3,
        side: "player",
        log: {
          type: "action",
          messageKey: "trigger.autoResolved",
          params: {
            cardName: "6th Street Recruits",
            abilityText: "When a friendly Unit steals a d6, increase a Gig by up to 6.",
          },
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
        } satisfies GenericActionLog,
      },
      {
        id: 4,
        side: "player",
        log: {
          type: "action",
          messageKey: "trigger.targetResolved",
          params: { targetNames: "D12", sourceCardName: "6th Street Recruits" },
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
        } satisfies GenericActionLog,
      },
      {
        id: 5,
        side: "player",
        log: {
          type: "playCard",
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
          cardId: "carnage-1" as CardInstanceId,
          cardName: "Carnage at the Colosseum",
          cost: 3,
        },
      },
      {
        id: 6,
        side: "player",
        log: {
          type: "action",
          messageKey: "trigger.targetResolved",
          params: {
            targetNames: "6th Street Recruits",
            sourceCardName: "Carnage at the Colosseum",
          },
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
        } satisfies GenericActionLog,
      },
    ];

    expect(
      projectMoveLogEntries(matchState, moveLogs, "player").map((entry) => entry.section?.id),
    ).toEqual(["attack", "steal", "steal", "steal", undefined, undefined]);
    expect(
      projectMoveLogEntries(matchState, moveLogs, "player").map((entry) => entry.tags),
    ).toEqual([["combat"], ["combat"], ["move", "combat"], ["move", "combat"], ["move"], ["move"]]);
  });

  test("ends the combat at the steal for action-key plays too", () => {
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
          attackerName: "6th Street Recruits",
        },
      },
      {
        id: 2,
        side: "player",
        log: {
          type: "resolveStealGigs",
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
          attackerName: "6th Street Recruits",
          attackerPower: 8,
          stolenCount: 1,
          stolenGigs: [{ dieType: "d6", faceValue: 2 }],
        },
      },
      {
        id: 3,
        side: "player",
        log: {
          type: "action",
          messageKey: "move.playCard",
          params: { cardName: "Carnage at the Colosseum", cost: 3 },
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
        } satisfies GenericActionLog,
      },
    ];

    expect(
      projectMoveLogEntries(matchState, moveLogs, "player").map((entry) => entry.section?.id),
    ).toEqual(["attack", "steal", undefined]);
  });

  test("ends the combat at the steal for a resolved card-to-play too", () => {
    // resolveCardToPlay is the typed-move sibling of move.playCard (the
    // choice-resolution half of playing a card): it must close the steal
    // context exactly like the action-key path does.
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
          attackerName: "6th Street Recruits",
        },
      },
      {
        id: 2,
        side: "player",
        log: {
          type: "resolveStealGigs",
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
          attackerName: "6th Street Recruits",
          attackerPower: 8,
          stolenCount: 1,
          stolenGigs: [{ dieType: "d6", faceValue: 2 }],
        },
      },
      {
        id: 3,
        side: "player",
        log: {
          type: "resolveCardToPlay",
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
          cardId: "carnage-1" as CardInstanceId,
          cardName: "Carnage at the Colosseum",
        },
      },
    ];

    expect(
      projectMoveLogEntries(matchState, moveLogs, "player").map((entry) => entry.section?.id),
    ).toEqual(["attack", "steal", undefined]);
  });

  test("keeps Panam's optional discard and resulting draw in the declared attack", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const moveLogs: MoveLogEntry[] = [
      {
        id: 1,
        side: "player",
        log: {
          type: "attackRival",
          playerId: P1,
          timestamp: 1,
          turnNumber: 1,
          attackerId: ATTACKER_ID,
          attackerName: "Panam Palmer: Strength Through Family",
        },
      },
      {
        id: 2,
        side: "player",
        log: {
          type: "resolveDiscardFromHand",
          playerId: P1,
          timestamp: 2,
          turnNumber: 1,
          discardedCount: 1,
          discardedCards: [
            { cardId: "discarded-card" as CardInstanceId, cardName: "Rogue Amendiares" },
          ],
        },
      },
      {
        id: 3,
        side: "player",
        log: {
          type: "action",
          messageKey: "effect.draw.resolved",
          params: {
            sourceCardName: "Panam Palmer: Strength Through Family",
            drawnCount: 2,
            drawnCardNames: "Fool on the Hill, MaxTac Squadron",
          },
          playerId: P1,
          timestamp: 3,
          turnNumber: 1,
        } satisfies GenericActionLog,
      },
    ];

    const entries = projectMoveLogEntries(matchState, moveLogs, "player");

    expect(entries.map((entry) => entry.section?.id)).toEqual(["attack", "attack", "attack"]);
    expect(entries.map((entry) => entry.message)).toEqual([
      "Attack: Panam Palmer: Strength Through Family spent to attack the rival Gig area.",
      "Discarded 1 card: Rogue Amendiares.",
      "Panam Palmer: Strength Through Family drew 2 card(s): Fool on the Hill, MaxTac Squadron.",
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
      {
        id: 4,
        side: "opponent",
        log: {
          type: "cardDefeated",
          playerId: P2,
          timestamp: 0,
          turnNumber: 1,
          wasUnit: true,
          cardId: DEFENDER_ID,
          cardName: "Psycho Squad",
        },
      },
      {
        id: 5,
        side: "player",
        log: {
          type: "action",
          messageKey: "move.playCard",
          params: { cardName: "Floor It", cost: 1 },
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
        },
      },
    ];

    const entries = projectMoveLogEntries(matchState, moveLogs, "player");

    expect(entries.map((entry) => entry.section?.id)).toEqual([
      "attack",
      "react",
      "fight",
      "fight",
      undefined,
    ]);
    expect(entries.map((entry) => entry.tags)).toEqual([
      ["combat"],
      ["combat"],
      ["move", "combat"],
      ["move", "combat"],
      ["move"],
    ]);
    expect(entries[2]?.message).toBe("Fight: Modded Kusanagi (11) won against Psycho Squad (6).");
    expect(entries[3]?.message).toBe("Psycho Squad was defeated.");
  });

  test("shows before and after values for Gig changes and swaps", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const logs: MoveLogEntry[] = [
      {
        id: 1,
        side: "player",
        log: {
          type: "gigValueChanged",
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
          dieId: "gig-1" as GigDieId,
          dieType: "d6",
          previousValue: 5,
          newValue: 3,
        },
      },
      {
        id: 2,
        side: "player",
        log: {
          type: "gigsSwapped",
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
          friendlyDieType: "d4",
          friendlyValue: 2,
          rivalDieType: "d8",
          rivalValue: 6,
        },
      },
    ];

    expect(projectMoveLogEntries(matchState, logs, "player").map((entry) => entry.message)).toEqual(
      [
        "Adjusted D6 gig die from 5 to 3.",
        "Swapped friendly D4 Gig (2) with rival D8 Gig (6); friendly Gig value 2 to 6, rival 6 to 2.",
      ],
    );
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

  test("keeps a later public reveal after a private search resolves", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const moveLogs: MoveLogEntry[] = [
      {
        id: 1,
        side: "player",
        log: {
          type: "searchDeck",
          revealedCount: 1,
          revealedCardNames: privateField(["Private Card"], [P1]),
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
          params: { count: 1 },
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
        },
      },
      {
        id: 3,
        side: "player",
        log: {
          type: "action",
          messageKey: "move.resolveSearchDeck",
          params: { count: 0, looked: 1 },
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
        },
      },
      {
        id: 4,
        side: "player",
        log: {
          type: "action",
          messageKey: "move.searchDeck.revealNamed",
          params: { count: 1, revealedCardNames: "Public Card" },
          playerId: P1,
          timestamp: 0,
          turnNumber: 1,
        },
      },
    ];

    const entries = projectMoveLogEntries(matchState, moveLogs, "player");

    expect(entries.map((entry) => entry.message)).toEqual([
      "Revealed the top 1 cards of the deck: Private Card.",
      "Searched the top 1 cards (Private Card) and found 0.",
      "Revealed the top 1 cards of the deck: Public Card.",
    ]);
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

  test("shows search names only to the viewer who saw them after deck cards are masked", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const revealedIds = matchState.G.players[P1]!.zones.deck.slice(0, 3);
    const revealedNames = revealedIds.map((id) => defOf(matchState.G.cardIndex[id]!).displayName);
    const maskedState = structuredClone(matchState);
    for (const id of revealedIds) delete maskedState.G.cardIndex[id];
    const revealLog: MoveLog = {
      type: "searchDeck",
      revealedCount: revealedIds.length,
      revealed: privateField(revealedIds, [P1]),
      revealedCardNames: privateField(revealedNames, [P1]),
      playerId: P1,
      timestamp: 0,
      turnNumber: 1,
    };
    const resolutionLog: MoveLog = {
      type: "action",
      messageKey: "move.resolveSearchDeck",
      params: { count: 0, looked: revealedIds.length },
      playerId: P1,
      timestamp: 0,
      turnNumber: 1,
    };
    const ownerLogs: MoveLogEntry[] = [
      { id: 1, side: "player", log: stripPrivateFields(revealLog, P1) },
      { id: 2, side: "player", log: resolutionLog },
    ];
    const rivalLogs: MoveLogEntry[] = [
      { id: 1, side: "opponent", log: stripPrivateFields(revealLog, P2) },
      { id: 2, side: "opponent", log: resolutionLog },
    ];

    const owner = projectMoveLogEntries(maskedState, ownerLogs, "player");
    const rival = projectMoveLogEntries(maskedState, rivalLogs, "opponent");

    expect(owner[0]?.message).toContain(revealedNames.join(", "));
    expect(owner[0]?.cardRefs?.map((ref) => ref.name)).toEqual(revealedNames);
    expect(owner[1]?.message).toContain(`(${revealedNames.join(", ")})`);
    expect(rival[0]?.message).toBe(`Revealed the top ${revealedIds.length} cards of the deck.`);
    expect(rival[0]?.cardRefs).toBeUndefined();
    expect(rival[1]?.message).toBe(`Searched the top ${revealedIds.length} cards and found 0.`);
  });

  test("uses each search's own names when two searches happen in one turn", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const search = (id: number, names: string[]): MoveLogEntry => ({
      id,
      side: "player",
      log: {
        type: "searchDeck",
        revealedCount: names.length,
        revealedCardNames: privateField(names, [P1]),
        playerId: P1,
        timestamp: 0,
        turnNumber: 1,
      },
    });
    const resolve = (id: number): MoveLogEntry => ({
      id,
      side: "player",
      log: {
        type: "action",
        messageKey: "move.resolveSearchDeck",
        params: { count: 0, looked: 1 },
        playerId: P1,
        timestamp: 0,
        turnNumber: 1,
      },
    });

    const entries = projectMoveLogEntries(
      matchState,
      [search(1, ["First Card"]), resolve(2), search(3, ["Second Card"]), resolve(4)],
      "player",
    );

    expect(entries[1]?.message).toContain("(First Card)");
    expect(entries[3]?.message).toContain("(Second Card)");
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

  test("projects discard logs with discarded card names", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const log: MoveLog = {
      type: "resolveDiscardFromHand",
      discardedCount: 2,
      discardedCards: [
        { cardId: "card-p2-hand-1" as CardInstanceId, cardName: "Mox Inciters" },
        { cardId: "card-p2-hand-2" as CardInstanceId, cardName: "Corpo Security" },
      ],
      playerId: P2,
      timestamp: 0,
      turnNumber: 1,
    };

    const entry = projectMoveLogEntries(
      matchState,
      [{ id: 1, side: "opponent", log }],
      "player",
    )[0];

    expect(entry?.message).toBe("Discarded 2 cards: Mox Inciters, Corpo Security.");
    expect(entry?.cardRefs).toEqual([
      { id: "card-p2-hand-1", name: "Mox Inciters" },
      { id: "card-p2-hand-2", name: "Corpo Security" },
    ]);
    expect(entry?.entityIds).toEqual(["card-p2-hand-1", "card-p2-hand-2"]);
  });

  test("projects bonus discard logs with the discarded card name", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const log: MoveLog = {
      type: "resolveDiscardFromHand",
      discardedCount: 1,
      discardedCards: [{ cardId: "card-p2-hand-1" as CardInstanceId, cardName: "Mox Inciters" }],
      reason: "costMatchedFriendlyGig",
      playerId: P2,
      timestamp: 0,
      turnNumber: 1,
    };

    const entry = projectMoveLogEntries(
      matchState,
      [{ id: 1, side: "opponent", log }],
      "player",
    )[0];

    expect(entry?.message).toBe(
      "Discarded Mox Inciters because the discarded card's cost matched a friendly Gig.",
    );
    expect(entry?.cardRefs).toEqual([{ id: "card-p2-hand-1", name: "Mox Inciters" }]);
  });

  test("projects discard logs without card names as a count fallback", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const log: MoveLog = {
      type: "resolveDiscardFromHand",
      discardedCount: 1,
      playerId: P2,
      timestamp: 0,
      turnNumber: 1,
    };

    expect(
      projectMoveLogEntries(matchState, [{ id: 1, side: "opponent", log }], "player")[0]?.message,
    ).toBe("Discarded 1 card.");
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

  test("renders rules-accurate end-of-game reasons instead of raw engine slugs", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const moveLogs: MoveLogEntry[] = [
      {
        id: 1,
        side: "system",
        log: {
          type: "gameEnded",
          playerId: P1,
          timestamp: 0,
          turnNumber: 15,
          winnerId: P1,
          reason: "overtime_majority",
        },
      },
      {
        id: 2,
        side: "system",
        log: {
          type: "gameEnded",
          playerId: P2,
          timestamp: 1,
          turnNumber: 9,
          winnerId: P2,
          reason: "gig_victory",
        },
      },
      {
        id: 3,
        side: "system",
        log: {
          type: "gameEnded",
          playerId: P1,
          timestamp: 2,
          turnNumber: 4,
          winnerId: P2,
          reason: "deck_out_victory",
        },
      },
      {
        id: 4,
        side: "system",
        log: {
          type: "gameEnded",
          playerId: P2,
          timestamp: 3,
          turnNumber: 6,
          winnerId: P2,
          reason: "concede",
        },
      },
    ];

    expect(
      projectMoveLogEntries(matchState, moveLogs, "player").map((entry) => entry.message),
    ).toEqual([
      "Game over (Overtime: first to 7 Gig dice).",
      "Game over (Gig victory: 7 Gigs).",
      "Game over (Deck out).",
      "Game over (Concession).",
    ]);
  });

  test("renders the persisted overtime-start log for both players", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const moveLogs: MoveLogEntry[] = [
      {
        id: 1,
        side: "system",
        log: {
          type: "action",
          playerId: P2,
          timestamp: 0,
          turnNumber: 14,
          messageKey: "game.overtimeStarted",
          params: {},
        },
      },
    ];

    expect(projectMoveLogEntries(matchState, moveLogs, "player")[0]?.message).toBe(
      "Overtime began. The first player to hold 7 Gigs wins immediately.",
    );
    expect(projectMoveLogEntries(matchState, moveLogs, "opponent")[0]?.message).toBe(
      "Overtime began. The first player to hold 7 Gigs wins immediately.",
    );
  });

  test("attributes concede action logs to You or Rival instead of the raw player id", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const moveLogs: MoveLogEntry[] = [
      {
        id: 1,
        side: "player",
        log: {
          type: "action",
          playerId: P1,
          timestamp: 0,
          turnNumber: 3,
          messageKey: "move.concede",
          params: {},
        },
      },
      {
        id: 2,
        side: "opponent",
        log: {
          type: "action",
          playerId: P2,
          timestamp: 1,
          turnNumber: 4,
          messageKey: "move.concede",
          params: {},
        },
      },
    ];

    expect(
      projectMoveLogEntries(matchState, moveLogs, "player").map((entry) => entry.message),
    ).toEqual(["You conceded the game.", "Rival conceded the game."]);
    expect(
      projectMoveLogEntries(matchState, moveLogs, "opponent").map((entry) => entry.message),
    ).toEqual(["Rival conceded the game.", "You conceded the game."]);
  });

  test("renders both empty-Fixer turn warnings for both players", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const moveLogs: MoveLogEntry[] = (
      ["game.overtimeFirstEmptyTurn", "game.overtimeFinalTurn"] as const
    ).map((messageKey, index): MoveLogEntry => ({
      id: index + 1,
      side: "system",
      log: {
        type: "action",
        playerId: P1,
        timestamp: index,
        turnNumber: 13 + index,
        messageKey,
        params: {},
      },
    }));

    const expected = [
      "Both Fixer areas began empty. Overtime begins after one more turn that starts this way.",
      "Both Fixer areas began empty for a second turn. Overtime begins when this turn ends.",
    ];
    expect(
      projectMoveLogEntries(matchState, moveLogs, "player").map((entry) => entry.message),
    ).toEqual(expected);
    expect(
      projectMoveLogEntries(matchState, moveLogs, "opponent").map((entry) => entry.message),
    ).toEqual(expected);
  });
});
