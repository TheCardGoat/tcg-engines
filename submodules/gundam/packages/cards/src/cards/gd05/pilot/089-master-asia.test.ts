import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04NeoZeong033 } from "../../gd04/unit/033-neo-zeong.ts";
import { gd05DragonGundam035 } from "../unit/035-dragon-gundam.ts";
import { gd05MasterAsia089 } from "./089-master-asia.ts";
import { gd05DomonKasshu097 } from "./097-domon-kasshu.ts";

function mfTrash() {
  return [
    createMockUnit({ name: "MF One", traits: ["mf"] }),
    createMockUnit({ name: "MF Two", traits: ["mf"] }),
    createMockCommand({ name: "MF Three", traits: ["mf"] }),
  ];
}

function specialMoveCommand(pilotName?: string) {
  return createMockCommand({
    name: "Special Move",
    pilotName,
    traits: ["special move"],
    level: 0,
    cost: 0,
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [{ action: { action: "draw", count: 1 } }],
        sourceText: "【Main】Draw 1.",
      },
    ],
  });
}

function returnFriendlyUnitCommand() {
  return createMockCommand({
    name: "Return Friendly Unit",
    level: 0,
    cost: 0,
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [
          {
            action: {
              action: "returnToHand",
              target: { owner: "friendly", cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: "【Main】Choose 1 friendly Unit. Return it to its owner's hand.",
      },
    ],
  });
}

describe("Master Asia (GD05-089)", () => {
  /** @behavioral-proof complete: both Burst decisions, Pilot-as-Unit identity lifecycle, and every linked Attack gate are public. */
  describe("【Burst】Add this card to your hand. If there are 3 or more (MF) cards in your trash, you may deploy it as an (AP3・HP3) Unit instead. (Don't treat it as a Pilot.)", () => {
    function revealBurst({ enoughMf = true }: { enoughMf?: boolean } = {}) {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const host = createMockUnit({ name: "Pilot Host" });
      const returnCommand = returnFriendlyUnitCommand();
      const engine = GundamTestEngine.create(
        { play: [attacker], deck: 5 },
        {
          hand: [returnCommand],
          play: [host],
          shieldArea: [gd05MasterAsia089],
          trash: enoughMf ? mfTrash() : mfTrash().slice(0, 2),
          resourceArea: activeResources(6),
          deck: 5,
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected visible Burst choice");

      return { engine, p2, burst, hostId: p2.getCardsInZone("battleArea")[0]!, returnCommand };
    }

    it("may deploy itself as an AP3/HP3 Unit when three MF cards are in trash", () => {
      const { p2, burst } = revealBurst();
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));
      const deployChoice = p2.getBoardView().pendingChoice;
      if (deployChoice?.kind !== "optional") {
        throw new Error("Expected the optional Pilot-as-Unit deployment");
      }

      expectSuccess(p2.resolveEffect({ optionalAnswers: { [deployChoice.directiveIndex]: true } }));

      expect(p2.getCardZone(burst.sourceCardId)).toBe(`battleArea:${PLAYER_TWO}`);
      expect(p2.getVisibleCard(burst.sourceCardId)).toMatchObject({
        effectiveAp: 3,
        effectiveHp: 3,
      });
    });

    it("is already a Unit when its deployment notifies linked Neo Zeong", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 8 });
      const fullFrontal = createMockPilot({
        name: "Full Frontal",
        level: 1,
        cost: 1,
        apBonus: 0,
        hpBonus: 0,
      });
      const engine = GundamTestEngine.create(
        { play: [attacker], deck: 5 },
        {
          hand: [fullFrontal],
          play: [gd04NeoZeong033],
          shieldArea: [gd05MasterAsia089],
          trash: mfTrash(),
          resourceArea: activeResources(6),
          deck: 5,
        },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const neoZeongId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.assignPilot(fullFrontal, neoZeongId));
      expectSuccess(p2.passPhase());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected Master Asia's Burst choice");
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));
      const deployChoice = p2.getBoardView().pendingChoice;
      if (deployChoice?.kind !== "optional") {
        throw new Error("Expected the optional Pilot-as-Unit deployment");
      }
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [deployChoice.directiveIndex]: true } }));

      expect(p2.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        controllerId: PLAYER_TWO,
        sourceCardId: neoZeongId,
        legalTargetIds: [attackerId],
      });
      expectSuccess(p2.resolveEffect({ targets: [attackerId] }));
      expect(p1.getDamage(attackerId)).toBe(3);
    });

    it("may keep Master Asia in hand instead of deploying it as a Unit", () => {
      const { p2, burst } = revealBurst();
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));
      const deployChoice = p2.getBoardView().pendingChoice;
      if (deployChoice?.kind !== "optional") {
        throw new Error("Expected the optional Pilot-as-Unit deployment");
      }

      expectSuccess(
        p2.resolveEffect({ optionalAnswers: { [deployChoice.directiveIndex]: false } }),
      );

      expect(p2.getCardZone(burst.sourceCardId)).toBe(`hand:${PLAYER_TWO}`);
    });

    it("only adds itself to hand when fewer than three MF cards are in trash", () => {
      const { p2, burst } = revealBurst({ enoughMf: false });

      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));

      expect(p2.getCardZone(burst.sourceCardId)).toBe(`hand:${PLAYER_TWO}`);
      expect(p2.getBoardView().pendingChoice).toBeUndefined();
    });

    it("puts itself in trash when the controller declines Burst", () => {
      const { p2, burst } = revealBurst();

      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: false } }));

      expect(p2.getCardZone(burst.sourceCardId)).toBe(`trash:${PLAYER_TWO}`);
    });

    it("becomes a Pilot again after the deployed Unit leaves the battle area", () => {
      const { engine, p2, burst, hostId, returnCommand } = revealBurst();
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));
      const deployChoice = p2.getBoardView().pendingChoice;
      if (deployChoice?.kind !== "optional") {
        throw new Error("Expected the optional Pilot-as-Unit deployment");
      }
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [deployChoice.directiveIndex]: true } }));
      engine.endTurn();

      expectSuccess(
        p2.playCommand(returnCommand, {
          targets: [burst.sourceCardId],
        }),
      );
      expectSuccess(p2.assignPilot(burst.sourceCardId, hostId));

      expect(p2.getPilotId(hostId)).toBe(burst.sourceCardId);
    });
  });

  describe("【During Link】【Attack】If you have activated a (Special Move) Command card's 【Main】/【Action】 during this turn, choose 1 enemy Unit. Deal 2 damage to it.", () => {
    function attackSetup({ linked = true, specialMove = true } = {}) {
      const host = createMockUnit({
        name: "Master Asia Host",
        hp: 8,
        linkCondition: linked ? "[Master Asia]" : "[Other Pilot]",
      });
      const defender = createMockUnit({ name: "Defender", hp: 8 });
      const command = specialMove
        ? specialMoveCommand()
        : createMockCommand({
            name: "Ordinary Command",
            level: 0,
            cost: 0,
            effects: [
              {
                type: "command",
                activation: { timing: ["main"] },
                directives: [{ action: { action: "draw", count: 1 } }],
                sourceText: "【Main】Draw 1.",
              },
            ],
          });
      const engine = GundamTestEngine.create(
        {
          hand: [gd05MasterAsia089, command],
          play: [host],
          resourceArea: activeResources(6),
          deck: 5,
        },
        { play: [{ card: defender, exhausted: true }], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(command));
      expectSuccess(p1.assignPilot(gd05MasterAsia089, hostId));
      expectSuccess(p1.enterBattle(hostId, defenderId));

      return { p1, p2, defenderId };
    }

    it("deals 2 damage after a Special Move Command was activated that turn", () => {
      const { p1, p2, defenderId } = attackSetup();
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [defenderId],
      });

      expectSuccess(p1.resolveEffect({ targets: [defenderId] }));

      expect(p2.getDamage(defenderId)).toBe(2);
    });

    it("does not trigger after a non-Special Move Command", () => {
      const { p1, p2, defenderId } = attackSetup({ specialMove: false });

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getDamage(defenderId)).toBe(0);
    });

    it("does not trigger while Master Asia is paired but not linked", () => {
      const { p1, p2, defenderId } = attackSetup({ linked: false });

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getDamage(defenderId)).toBe(0);
    });

    it("recognizes a Special Move Main activated indirectly by Dragon Gundam", () => {
      const masterHost = createMockUnit({
        name: "Master Asia Host",
        hp: 8,
        linkCondition: "[Master Asia]",
      });
      const pairedCommand = specialMoveCommand("Sai Saici");
      const firstDefender = createMockUnit({ name: "First Defender", hp: 10 });
      const secondDefender = createMockUnit({ name: "Second Defender", hp: 10 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd05MasterAsia089, pairedCommand],
          play: [gd05DragonGundam035, masterHost],
          resourceArea: activeResources(8),
          deck: 5,
        },
        {
          play: [
            { card: firstDefender, exhausted: true },
            { card: secondDefender, exhausted: true },
          ],
          deck: 5,
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [dragonId, masterHostId] = p1.getCardsInZone("battleArea");
      const [firstDefenderId, secondDefenderId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.playCommandAsPilot(pairedCommand, dragonId!));
      expectSuccess(p1.assignPilot(gd05MasterAsia089, masterHostId!));
      expectSuccess(p1.enterBattle(dragonId!, firstDefenderId!));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p1.enterBattle(masterHostId!, secondDefenderId!));

      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: p1.getPilotId(masterHostId!),
        legalTargetIds: [firstDefenderId, secondDefenderId],
      });
      expectSuccess(p1.resolveEffect({ targets: [secondDefenderId!] }));
      expect(p2.getDamage(secondDefenderId!)).toBe(2);
    });

    it("does not count an indirect Special Move Main that has no legal required target", () => {
      const masterHost = createMockUnit({
        name: "Master Asia Host",
        hp: 8,
        linkCondition: "[Master Asia]",
      });
      const invalidSpecialMove = createMockCommand({
        name: "Base-only Special Move",
        pilotName: "Sai Saici",
        traits: ["special move"],
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
                  target: { owner: "opponent", cardType: "base", count: 1 },
                },
              },
            ],
            sourceText: "【Main】Choose 1 enemy Base. Rest it.",
          },
        ],
      });
      const firstDefender = createMockUnit({ name: "First Defender", hp: 10 });
      const secondDefender = createMockUnit({ name: "Second Defender", hp: 10 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd05MasterAsia089, invalidSpecialMove],
          play: [gd05DragonGundam035, masterHost],
          resourceArea: activeResources(8),
          deck: 5,
        },
        {
          play: [
            { card: firstDefender, exhausted: true },
            { card: secondDefender, exhausted: true },
          ],
          deck: 5,
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [dragonId, masterHostId] = p1.getCardsInZone("battleArea");
      const [firstDefenderId, secondDefenderId] = p2.getCardsInZone("battleArea");
      const commandId = p1.getHand()[1]!;

      expectSuccess(p1.playCommandAsPilot(commandId, dragonId!));
      expectSuccess(p1.assignPilot(gd05MasterAsia089, masterHostId!));
      expectSuccess(p1.enterBattle(dragonId!, firstDefenderId!));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expect(p1.getPilotId(dragonId!)).toBe(commandId);

      expectSuccess(p1.enterBattle(masterHostId!, secondDefenderId!));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getDamage(firstDefenderId!)).toBe(4);
      expect(p2.getDamage(secondDefenderId!)).toBe(0);
    });

    it("recognizes a Special Move Main activated from Domon Kasshu's discarded card", () => {
      const domonHost = createMockUnit({ name: "Domon Host", hp: 8 });
      const masterHost = createMockUnit({
        name: "Master Asia Host",
        hp: 8,
        linkCondition: "[Master Asia]",
      });
      const discardedCommand = specialMoveCommand();
      const firstDefender = createMockUnit({ name: "First Defender", hp: 10 });
      const secondDefender = createMockUnit({ name: "Second Defender", hp: 10 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd05DomonKasshu097, gd05MasterAsia089, discardedCommand],
          play: [domonHost, masterHost],
          resourceArea: activeResources(8),
          deck: 5,
        },
        {
          play: [
            { card: firstDefender, exhausted: true },
            { card: secondDefender, exhausted: true },
          ],
          deck: 5,
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [domonHostId, masterHostId] = p1.getCardsInZone("battleArea");
      const [firstDefenderId, secondDefenderId] = p2.getCardsInZone("battleArea");
      const discardedCommandId = p1.getHand()[2]!;

      expectSuccess(p1.assignPilot(gd05DomonKasshu097, domonHostId!));
      expectSuccess(p1.resolveEffect({ targets: [discardedCommandId!] }));
      const activateDiscarded = p1.getBoardView().pendingChoice;
      if (activateDiscarded?.kind !== "optional") {
        throw new Error("Expected Domon's optional discarded-command activation");
      }
      expectSuccess(
        p1.resolveEffect({
          optionalAnswers: { [activateDiscarded.directiveIndex]: true },
        }),
      );
      expectSuccess(p1.assignPilot(gd05MasterAsia089, masterHostId!));
      expectSuccess(p1.enterBattle(masterHostId!, secondDefenderId!));

      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: p1.getPilotId(masterHostId!),
        legalTargetIds: [firstDefenderId, secondDefenderId],
      });
      expectSuccess(p1.resolveEffect({ targets: [secondDefenderId!] }));
      expect(p2.getDamage(firstDefenderId!)).toBe(0);
      expect(p2.getDamage(secondDefenderId!)).toBe(2);
    });
  });
});
