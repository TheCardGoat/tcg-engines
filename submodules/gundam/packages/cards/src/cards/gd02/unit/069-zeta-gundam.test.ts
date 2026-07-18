import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd02ZetaGundam069 } from "./069-zeta-gundam.ts";
import { gd02AspiringPilot120 } from "../command/120-aspiring-pilot.ts";
import { gd02KamilleBidan097 } from "../pilot/097-kamille-bidan.ts";

function restFriendlyBaseCommand() {
  return createMockCommand({
    name: "Rest Friendly Base",
    level: 0,
    cost: 0,
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [
          {
            action: {
              action: "rest",
              target: { owner: "friendly", cardType: "base", state: "active", count: 1 },
            },
          },
        ],
        sourceText: "【Main】Choose 1 active friendly Base. Rest it.",
      },
    ],
  });
}

describe("Zeta Gundam (GD02-069)", () => {
  it("requires its printed Lv.6 and five active Resources to deploy", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02ZetaGundam069],
      resourceArea: activeResources(5),
    });
    const lowP1 = lowLevel.asPlayer(PLAYER_ONE);

    expectFailure(lowP1.deployUnit(gd02ZetaGundam069), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(lowP1.getCardZone(gd02ZetaGundam069)).toBe(`hand:${PLAYER_ONE}`);

    const setup = createMockCommand({
      name: "Exhaust All Resources",
      level: 0,
      cost: 6,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02ZetaGundam069],
      resourceArea: activeResources(6),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);

    expectSuccess(p1.playCommand(setup));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(0);
    expectFailure(p1.deployUnit(gd02ZetaGundam069), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02ZetaGundam069)).toBe(`hand:${PLAYER_ONE}`);
  });

  describe("【During Link】【Activate･Main】【Once per Turn】Choose 1 active friendly Base. Rest it. If you do, set this Unit as active. It can't choose the enemy player as its attack target during this turn.", () => {
    it("publishes the active Base choice, readies linked Zeta, and prevents a direct reattack", () => {
      const firstBase = createMockBase({ name: "First Base" });
      const openingShield = createMockUnit({ name: "Opening Shield" });
      const engine = GundamTestEngine.create(
        {
          hand: [gd02KamilleBidan097],
          play: [gd02ZetaGundam069],
          baseSection: [firstBase],
          resourceArea: activeResources(5),
        },
        { shieldArea: [openingShield] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const zetaId = p1.getCardsInZone("battleArea")[0]!;
      const firstBaseId = p1.getCardsInZone("baseSection")[0]!;

      expectSuccess(p1.assignPilot(gd02KamilleBidan097, zetaId));
      restUnitsByAttackingDirectly(engine, PLAYER_ONE, [zetaId]);
      expectSuccess(p1.activateAbility(zetaId, 0));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [firstBaseId],
      });
      expectSuccess(p1.resolveEffect({ targets: [firstBaseId] }));

      expect(p1.isExhausted(firstBaseId)).toBe(true);
      expect(p1.isExhausted(zetaId)).toBe(false);
      expectFailure(p1.enterBattle(zetaId, "direct"), "CANNOT_TARGET_PLAYER");
      expectFailure(p1.activateAbility(zetaId, 0), "ABILITY_LIMIT_REACHED");
    });

    it("cannot activate while paired with a Pilot that does not meet its Link Condition", () => {
      const base = createMockBase();
      const engine = GundamTestEngine.create({
        hand: [gd02AspiringPilot120],
        play: [gd02ZetaGundam069],
        baseSection: [base],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const zetaId = p1.getCardsInZone("battleArea")[0]!;
      const pilotId = p1.getHand()[0]!;

      expectSuccess(p1.playCommandAsPilot(pilotId, zetaId));

      expectFailure(p1.activateAbility(zetaId, 0), "CONDITIONS_NOT_MET");

      expect(p1.getPilotId(zetaId)).toBe(pilotId);
      expect(p1.isExhausted(base)).toBe(false);
      expect(p1.isExhausted(zetaId)).toBe(false);
    });

    it("cannot activate after a friendly Base was legally rested by a Command", () => {
      const restBase = restFriendlyBaseCommand();
      const base = createMockBase();
      const engine = GundamTestEngine.create({
        hand: [restBase, gd02KamilleBidan097],
        play: [gd02ZetaGundam069],
        baseSection: [base],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const zetaId = p1.getCardsInZone("battleArea")[0]!;
      const baseId = p1.getCardsInZone("baseSection")[0]!;
      const [commandId, pilotId] = p1.getHand();

      expectSuccess(p1.playCommand(commandId!));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [baseId],
      });
      expectSuccess(p1.resolveEffect({ targets: [baseId] }));
      expectSuccess(p1.assignPilot(pilotId!, zetaId));

      expectFailure(p1.activateAbility(zetaId, 0), "NO_LEGAL_TARGETS");

      expect(p1.isExhausted(baseId)).toBe(true);
      expect(p1.isExhausted(zetaId)).toBe(false);
    });

    it("loses its attack restriction and regains its once-per-turn ability next turn", () => {
      const base = createMockBase();
      const firstShield = createMockUnit({ name: "First Shield" });
      const secondShield = createMockUnit({ name: "Second Shield" });
      const engine = GundamTestEngine.create(
        {
          hand: [gd02KamilleBidan097],
          play: [gd02ZetaGundam069],
          baseSection: [base],
          resourceArea: activeResources(5),
          deck: 5,
        },
        { shieldArea: [firstShield, secondShield], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const zetaId = p1.getCardsInZone("battleArea")[0]!;
      const baseId = p1.getCardsInZone("baseSection")[0]!;

      expectSuccess(p1.assignPilot(gd02KamilleBidan097, zetaId));
      restUnitsByAttackingDirectly(engine, PLAYER_ONE, [zetaId]);
      expectSuccess(p1.activateAbility(zetaId, 0));
      expectSuccess(p1.resolveEffect({ targets: [baseId] }));
      expectFailure(p1.enterBattle(zetaId, "direct"), "CANNOT_TARGET_PLAYER");

      passTurnThroughPublicMoves(engine, PLAYER_ONE);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);

      expectSuccess(p1.enterBattle(zetaId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p1.activateAbility(zetaId, 0));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [baseId],
      });
      expectSuccess(p1.resolveEffect({ targets: [baseId] }));

      expect(p1.isExhausted(baseId)).toBe(true);
      expect(p1.isExhausted(zetaId)).toBe(false);
    });

    it("cannot activate after leaving the Main Phase", () => {
      const base = createMockBase();
      const openingShield = createMockUnit({ name: "Opening Shield" });
      const engine = GundamTestEngine.create(
        {
          hand: [gd02KamilleBidan097],
          play: [gd02ZetaGundam069],
          baseSection: [base],
          resourceArea: activeResources(5),
        },
        { shieldArea: [openingShield] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const zetaId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd02KamilleBidan097, zetaId));
      expectSuccess(p1.enterBattle(zetaId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectFailure(p1.activateAbility(zetaId, 0), "WRONG_PHASE");

      expect(p1.isExhausted(base)).toBe(false);
    });
  });
});
