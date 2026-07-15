import { describe, expect, it } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCommand,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "../../../index.ts";

const alternateDeploy: CardEffect = {
  type: "substitution",
  activation: {},
  directives: [
    {
      optional: true,
      action: {
        action: "deployCostSubstitution",
        level: 0,
        cost: 0,
        destroyTarget: {
          owner: "friendly",
          zone: "battleArea",
          cardType: "unit",
          count: 1,
          isLinkUnit: true,
          attributeFilters: [
            { attribute: "name", comparison: "includes", value: "Unicorn Mode" },
            { attribute: "level", comparison: "eq", value: 5 },
          ],
        },
      },
    },
  ],
  sourceText:
    'When playing this card, you may destroy a Lv.5 Link Unit with "Unicorn Mode" in its name. If you do, play this at Lv.0 and cost 0.',
};

const restOnDeploy: CardEffect = {
  type: "triggered",
  activation: { timing: ["deploy"] },
  directives: [
    {
      action: {
        action: "rest",
        target: { owner: "opponent", zone: "battleArea", cardType: "unit", count: 1 },
      },
    },
  ],
  sourceText: "【Deploy】Choose 1 enemy Unit. Rest it.",
};

const preventFriendlyDestruction: CardEffect = {
  type: "command",
  activation: { timing: ["main"] },
  directives: [
    {
      action: {
        action: "preventDestroy",
        target: { owner: "friendly", zone: "battleArea", cardType: "unit", count: "all" },
        duration: "thisTurn",
      },
    },
  ],
  sourceText: "During this turn, friendly Units can't be destroyed by effects.",
};

describe("deployUnit cost substitution", () => {
  it("publishes the alternate cost and destroys the chosen Link Unit before deploying for free", () => {
    const host = createMockUnit({
      name: "Unicorn Gundam (Unicorn Mode)",
      level: 5,
      linkCondition: "[Banagher Links]",
    });
    const pilot = createMockPilot({ name: "Banagher Links", level: 0, cost: 0 });
    const upgrade = createMockUnit({
      name: "Unicorn Gundam (Destroy Mode)",
      level: 7,
      cost: 6,
      effects: [alternateDeploy],
    });
    const engine = GundamTestEngine.create({ play: [host], hand: [pilot, upgrade] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const [pilotId, upgradeId] = p1.getHand();

    expectSuccess(p1.assignPilot(pilotId!, hostId));
    expect(p1.getMoveProcedure("deployUnit", { cardId: upgradeId })).toEqual([
      {
        kind: "selectMode",
        modes: [
          {
            id: "alternate",
            label:
              'When playing this card, you may destroy a Lv.5 Link Unit with "Unicorn Mode" in its name. If you do, play this at Lv.0 and cost 0.',
          },
        ],
      },
    ]);
    expect(p1.getMoveProcedure("deployUnit", { cardId: upgradeId, mode: "alternate" })).toEqual([
      {
        kind: "selectTarget",
        role: "cost",
        candidateIds: [hostId],
        minTargets: 1,
        maxTargets: 1,
      },
    ]);

    expectSuccess(p1.deployUnit(upgradeId!, { mode: "alternate", targets: [hostId] }));

    expect(p1.getCardZone(upgradeId!)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getCardZone(hostId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardZone(pilotId!)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getResourceCount()).toBe(0);
  });

  it("keeps a separate Deploy target interactive after the player pays the alternate cost", () => {
    const host = createMockUnit({
      name: "Unicorn Gundam (Unicorn Mode)",
      level: 5,
      linkCondition: "[Banagher Links]",
    });
    const pilot = createMockPilot({ name: "Banagher Links", level: 0, cost: 0 });
    const upgrade = createMockUnit({
      name: "Interactive Upgrade",
      level: 7,
      cost: 6,
      effects: [alternateDeploy, restOnDeploy],
    });
    const enemy = createMockUnit({ name: "Chosen Enemy", ap: 2, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [host], hand: [pilot, upgrade] },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const [pilotId, upgradeId] = p1.getHand();
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilotId!, hostId));
    expectSuccess(p1.deployUnit(upgradeId!, { mode: "alternate", targets: [hostId] }));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [enemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.isExhausted(enemyId)).toBe(true);
    expect(p1.getCardZone(upgradeId!)).toBe(`battleArea:${PLAYER_ONE}`);
  });

  it("does not offer a protected Unit as an alternate cost that cannot be paid", () => {
    const host = createMockUnit({
      name: "Unicorn Gundam (Unicorn Mode)",
      level: 5,
      linkCondition: "[Banagher Links]",
    });
    const pilot = createMockPilot({ name: "Banagher Links", level: 0, cost: 0 });
    const protection = createMockCommand({
      name: "Protection",
      level: 0,
      cost: 0,
      effects: [preventFriendlyDestruction],
    });
    const upgrade = createMockUnit({
      name: "Protected Upgrade",
      level: 7,
      cost: 6,
      effects: [alternateDeploy],
    });
    const engine = GundamTestEngine.create({
      play: [host],
      hand: [pilot, protection, upgrade],
      deck: 2,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const [pilotId, protectionId, upgradeId] = p1.getHand();

    expectSuccess(p1.assignPilot(pilotId!, hostId));
    expectSuccess(p1.playCommand(protectionId!));

    expect(p1.getMoveProcedure("deployUnit", { cardId: upgradeId })).toEqual([]);
    expect(p1.getMoveProcedure("deployUnit", { cardId: upgradeId, mode: "alternate" })).toEqual([
      {
        kind: "selectTarget",
        role: "cost",
        candidateIds: [],
        minTargets: 1,
        maxTargets: 1,
      },
    ]);
    expect(p1.deployUnit(upgradeId!, { mode: "alternate", targets: [hostId] })).toMatchObject({
      success: false,
      errorCode: "WRONG_TARGET_COUNT",
    });

    expect(p1.getCardZone(hostId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getCardZone(upgradeId!)).toBe(`hand:${PLAYER_ONE}`);
  });
});
