/**
 * Spec → tests: ../specs/11-rules-management.md (fluent API)
 */

import { describe, expect, it } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockPilot,
  createMockUnit,
  expectCard,
  expectPlayer,
  expectWinnerIs,
  resolveBattle,
} from "../../index.ts";
import { st01Gundam001 } from "../../../../../cards/src/cards/st01/unit/001-gundam.ts";
import { st01WhiteBase015 } from "../../../../../cards/src/cards/st01/base/015-white-base.ts";
import { st01AsticassiaSchoolOfTechnologyEarthHouse016 } from "../../../../../cards/src/cards/st01/base/016-asticassia-school-of-technology-earth-house.ts";

function millSelf(count: number): CardEffect {
  return {
    type: "activated",
    activation: { timing: ["activate:main"] },
    directives: [{ action: { action: "millDeck", count, owner: "self" } }],
    sourceText: `Mill ${count}.`,
  };
}

const drawOnDestroyed: CardEffect = {
  type: "triggered",
  activation: { timing: ["destroyed"] },
  directives: [{ action: { action: "draw", count: 2 } }],
  sourceText: "【Destroyed】Draw 2.",
};

describe("Section 11 — Rules Management (specs/11-rules-management.md)", () => {
  it("11-2-1-1: empty shield area + battle damage defeats the player", () => {
    const engine = GundamTestEngine.create({ play: [st01Gundam001] }, { deck: 5 });
    resolveBattle(engine, st01Gundam001, "direct");
    expectWinnerIs(engine, PLAYER_ONE);
  });

  it("11-2-1-2: empty deck defeats the player", () => {
    const miller = createMockUnit({ effects: [millSelf(3)] });
    const engine = GundamTestEngine.create({ play: [miller], deck: 1 }, { deck: 5 });
    const p1 = engine.asPlayer(PLAYER_ONE);
    p1.must.activateAbility(miller, 0);
    expectWinnerIs(engine, PLAYER_TWO);
  });

  it("11-3-1 / 5-5-2: Unit with damage ≥ HP is destroyed", () => {
    const defender = createMockUnit({ ap: 0, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [st01Gundam001] },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p2 = engine.asPlayer(PLAYER_TWO);
    resolveBattle(engine, st01Gundam001, defender);
    expectCard(p2, defender).toBeIn("trash");
  });

  it("11-3-1-1 / 4-6-4-2: Shields are destroyed by 1 damage without spilling to the player", () => {
    const engine = GundamTestEngine.create(
      { play: [st01Gundam001] },
      { shieldArea: [createMockUnit({ name: "Shield fodder" })] },
    );
    resolveBattle(engine, st01Gundam001, "direct");
    expectPlayer(engine.asPlayer(PLAYER_TWO)).toHaveShieldCount(0).toHaveZoneCount("trash", 1);
    expectWinnerIs(engine, undefined);
  });

  it("11-4-1 / 11-4-2 / 11-4-2-1: battle-area excess is not destruction", () => {
    const six = Array.from({ length: 6 }, (_, i) =>
      createMockUnit({
        name: `U${i}`,
        cardNumber: `EXC-${i}`,
        level: 1,
        cost: 0,
        effects: i === 0 ? [drawOnDestroyed] : [],
      }),
    );
    const seventh = createMockUnit({
      name: "Incoming",
      cardNumber: "EXC-7",
      level: 1,
      cost: 1,
    });
    const engine = GundamTestEngine.create({
      play: six,
      hand: [seventh],
      resourceArea: activeResources(3),
      deck: 8,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const doomed = six[0]!;
    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
    p1.must.deployUnit(seventh);
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected battle-area excess choice");
    }
    p1.must.resolveTargets(doomed);
    expectCard(p1, doomed).toBeIn("trash");
    // Not destroyed → Destroyed draw does not fire
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore);
    expectPlayer(p1).toHaveZoneCount("battleArea", 6);
  });

  it("11-4-2 / 3-3-6: excess trash of a paired Unit also moves its Pilot", () => {
    const pilot = createMockPilot({
      name: "Fodder Pilot",
      level: 1,
      cost: 0,
      apBonus: 0,
      hpBonus: 0,
      effects: [],
    });
    const six = Array.from({ length: 6 }, (_, i) =>
      createMockUnit({
        name: `U${i}`,
        cardNumber: `PAIR-EXC-${i}`,
        level: 1,
        cost: 0,
      }),
    );
    const seventh = createMockUnit({
      name: "Incoming",
      cardNumber: "PAIR-EXC-7",
      level: 1,
      cost: 1,
    });
    const engine = GundamTestEngine.create({
      play: six,
      hand: [pilot, seventh],
      resourceArea: activeResources(4),
      deck: 8,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const host = six[0]!;
    p1.must.assignPilot(pilot, host);
    const pilotId = p1.getPilotId(p1.unit(host).instanceId)!;
    p1.must.deployUnit(seventh);
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected battle-area excess choice");
    }
    p1.must.resolveTargets(host);
    expectCard(p1, host).toBeIn("trash");
    expect(p1.getCardZone(pilotId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getPilotId(p1.unit(seventh).instanceId)).toBeUndefined();
    expectPlayer(p1).toHaveZoneCount("battleArea", 6);
  });

  it("11-4-2-2: dual token deploy protects both new Units from the excess trash choice", () => {
    const five = Array.from({ length: 5 }, (_, i) =>
      createMockUnit({
        name: `Existing ${i}`,
        cardNumber: `TOK-EXC-${i}`,
        level: 1,
        cost: 0,
      }),
    );
    const dualToken = createMockCommand({
      level: 0,
      cost: 0,
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [
            {
              action: {
                action: "deployToken",
                count: 2,
                token: {
                  name: "Token Unit",
                  traits: ["earth federation"],
                  ap: 1,
                  hp: 1,
                  deployState: "active",
                },
              },
            },
          ],
          sourceText: "【Main】Deploy 2 token Units.",
        },
      ],
    });
    const engine = GundamTestEngine.create({
      play: five,
      hand: [dualToken],
      resourceArea: activeResources(2),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const existingIds = new Set(p1.getCardsInZone("battleArea"));
    p1.must.playCommand(dualToken);

    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected battle-area excess choice after dual token deploy");
    }
    // Only pre-existing Units are legal; both tokens must be protected.
    expect(choice.legalTargetIds.every((id) => existingIds.has(id))).toBe(true);
    expect(choice.legalTargetIds).toHaveLength(5);
    const doomed = five[0]!;
    p1.must.resolveTargets(doomed);
    expectCard(p1, doomed).toBeIn("trash");
    // 5 - 1 existing + 2 tokens = 6
    expectPlayer(p1).toHaveZoneCount("battleArea", 6);
  });

  it("11-4-2-2: two separate deployToken directives merge protected ids for excess trash", () => {
    // Start at the limit so each count:1 directive enqueues excess; the second
    // call merges protected ids (batched count:2 never hits that path).
    const six = Array.from({ length: 6 }, (_, i) =>
      createMockUnit({
        name: `Merge Existing ${i}`,
        cardNumber: `TOK-MRG-${i}`,
        level: 1,
        cost: 0,
      }),
    );
    const tokenSpec = {
      name: "Merge Token",
      traits: ["earth federation"],
      ap: 1,
      hp: 1,
      deployState: "active" as const,
    };
    const dualDirective = createMockCommand({
      level: 0,
      cost: 0,
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [
            { action: { action: "deployToken", count: 1, token: tokenSpec } },
            { action: { action: "deployToken", count: 1, token: tokenSpec } },
          ],
          sourceText: "【Main】Deploy 1 token Unit. Deploy 1 token Unit.",
        },
      ],
    });
    const engine = GundamTestEngine.create({
      play: six,
      hand: [dualDirective],
      resourceArea: activeResources(2),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const existingIds = new Set(p1.getCardsInZone("battleArea"));
    p1.must.playCommand(dualDirective);

    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected battle-area excess choice after dual deployToken directives");
    }
    // Both tokens protected via merge; only the original 6 Units are legal.
    expect(choice.legalTargetIds.every((id) => existingIds.has(id))).toBe(true);
    expect(choice.legalTargetIds).toHaveLength(6);
    // Need to trash 2 (6 existing + 2 tokens − 6 limit).
    expect(choice.maxTargets).toBe(2);
  });

  it("11-4: deploy-from-trash into a full board enqueues excess management", () => {
    const six = Array.from({ length: 6 }, (_, i) =>
      createMockUnit({
        name: `Board ${i}`,
        cardNumber: `TR-EXC-${i}`,
        level: 1,
        cost: 0,
      }),
    );
    const fromTrash = createMockUnit({
      name: "Returned",
      cardNumber: "TR-EXC-RETURN",
      level: 1,
      cost: 0,
    });
    const recruiter = createMockUnit({
      name: "Recruiter",
      cardNumber: "TR-EXC-RECRUIT",
      level: 1,
      cost: 0,
      effects: [
        {
          type: "activated",
          activation: { timing: ["activate:main"] },
          directives: [
            {
              action: {
                action: "deployFromTrash",
                payCost: false,
                target: { owner: "friendly", cardType: "unit", zone: "trash", count: 1 },
              },
            },
          ],
          sourceText: "【Activate･Main】Deploy 1 Unit from your trash.",
        },
      ],
    });
    // 6 on board + recruiter would be 7; use 5 board + recruiter in play + 1 trash
    // so battle area starts at 6 (5 + recruiter).
    const board = six.slice(0, 5);
    const engine = GundamTestEngine.create({
      play: [...board, recruiter],
      trash: [fromTrash],
      resourceArea: activeResources(2),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    expectPlayer(p1).toHaveZoneCount("battleArea", 6);
    p1.must.activateAbility(recruiter, 0, { targets: [fromTrash] });

    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected battle-area excess choice after trash deploy");
    }
    // Newly returned Unit is protected (excludeSource / excludeInstanceIds).
    const returnedId = p1.cardIn("battleArea", fromTrash).instanceId;
    expect(choice.legalTargetIds).not.toContain(returnedId);
    p1.must.resolveTargets(board[0]!);
    expectCard(p1, board[0]!).toBeIn("trash");
    expectPlayer(p1).toHaveZoneCount("battleArea", 6);
  });

  it("11-5-2 / 11-5-2-1: Base section excess requires trashing the existing Base (not destroyed)", () => {
    const engine = GundamTestEngine.create({
      hand: [st01AsticassiaSchoolOfTechnologyEarthHouse016],
      baseSection: [st01WhiteBase015],
      resourceArea: activeResources(6),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    p1.must.deployBase(st01AsticassiaSchoolOfTechnologyEarthHouse016);
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected Base-section excess choice (11-5-2)");
    }
    p1.must.resolveTargets(st01WhiteBase015);
    expectCard(p1, st01WhiteBase015).toBeIn("trash");
    expectPlayer(p1).toHaveZoneCount("baseSection", 1);
  });
});
