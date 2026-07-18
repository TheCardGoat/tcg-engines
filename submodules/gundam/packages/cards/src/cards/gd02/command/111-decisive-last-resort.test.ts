import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02DecisiveLastResort111 } from "./111-decisive-last-resort.ts";

function purpleTrash(count: number) {
  return Array.from({ length: count }, (_, index) =>
    createMockUnit({ name: `Purple Unit ${index + 1}`, color: "purple" }),
  );
}

describe("Decisive Last Resort (GD02-111)", () => {
  it("【Burst】 damages the chosen enemy Unit at Lv.3 or lower", () => {
    const attacker = createMockUnit({ level: 4, hp: 5 });
    const eligible = createMockUnit({ level: 3, hp: 5 });
    const engine = GundamTestEngine.create(
      { shieldArea: [gd02DecisiveLastResort111] },
      { play: [attacker, eligible] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [attackerId, eligibleId] = p2.getCardsInZone("battleArea");

    expectSuccess(p2.enterBattle(attackerId!, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    const burstChoice = p1.getBoardView().pendingChoice;
    if (burstChoice?.kind !== "optional") {
      throw new Error("Expected Decisive Last Resort's visible Burst choice");
    }
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [burstChoice.directiveIndex]: true } }));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") throw new Error("Expected an eligible enemy choice");
    expect(choice.legalTargetIds).toEqual([eligibleId]);
    expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));

    expect(p2.getDamage(eligibleId!)).toBe(2);
    expect(p2.getDamage(attackerId!)).toBe(0);
  });

  it("【Main】 exiles six chosen purple Units from trash before destroying an enemy Unit", () => {
    const trashCards = purpleTrash(6);
    const wrongColor = createMockUnit({ name: "Blue Unit", color: "blue" });
    const enemy = createMockUnit({ hp: 8 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02DecisiveLastResort111],
        trash: [...trashCards, wrongColor],
        resourceArea: activeResources(6),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const trashIds = p1.getCardsInZone("trash");
    const purpleIds = trashIds.slice(0, 6);
    const wrongColorId = trashIds[6]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(commandId));
    const exileChoice = p1.getBoardView().pendingChoice;
    if (exileChoice?.kind !== "targetSelection") {
      throw new Error("Expected a visible six-card purple trash choice");
    }
    expect(exileChoice.legalTargetIds).toEqual(purpleIds);
    expect(exileChoice.legalTargetIds).not.toContain(wrongColorId);
    expectSuccess(p1.resolveEffect({ targets: purpleIds }));

    for (const purpleId of purpleIds) {
      expect(p1.getCardZone(purpleId)).toBe("removalArea");
    }
    expect(p1.getCardZone(wrongColorId)).toBe(`trash:${PLAYER_ONE}`);
    const destroyChoice = p1.getBoardView().pendingChoice;
    if (destroyChoice?.kind !== "targetSelection") {
      throw new Error("Expected a visible enemy Unit destruction choice");
    }
    expect(destroyChoice.legalTargetIds).toEqual([enemyId]);
    expect(p1.getCardZone(commandId)).toBe("removalArea");
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.getCardZone(enemyId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("cannot be played with fewer than six purple Unit cards in trash", () => {
    const engine = GundamTestEngine.create(
      {
        hand: [gd02DecisiveLastResort111],
        trash: purpleTrash(5),
        resourceArea: activeResources(5),
      },
      { play: [createMockUnit()] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(gd02DecisiveLastResort111), "NO_LEGAL_TARGETS");
  });

  it("cannot exile six cards when there is no enemy Unit to destroy", () => {
    const trashCards = purpleTrash(6);
    const engine = GundamTestEngine.create({
      hand: [gd02DecisiveLastResort111],
      trash: trashCards,
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const trashIds = p1.getCardsInZone("trash");

    expectFailure(p1.playCommand(gd02DecisiveLastResort111), "PRECONDITION_FAILED");

    expect(p1.getCardZone(gd02DecisiveLastResort111)).toBe(`hand:${PLAYER_ONE}`);
    for (const trashId of trashIds) {
      expect(p1.getCardZone(trashId)).toBe(`trash:${PLAYER_ONE}`);
    }
  });

  it("cannot be played during a legally reached Action step", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02DecisiveLastResort111],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());

    expectFailure(p1.playCommand(gd02DecisiveLastResort111), "WRONG_TIMING");
  });

  it("enforces both its printed Lv.5 and active Resource cost 4", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02DecisiveLastResort111],
      resourceArea: activeResources(4),
    });
    expectFailure(
      lowLevel.asPlayer(PLAYER_ONE).playCommand(gd02DecisiveLastResort111),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
    expect(lowLevel.asPlayer(PLAYER_ONE).getCardZone(gd02DecisiveLastResort111)).toBe(
      `hand:${PLAYER_ONE}`,
    );

    const setup = createMockCommand({
      level: 0,
      cost: 2,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02DecisiveLastResort111],
      trash: purpleTrash(6),
      resourceArea: activeResources(5),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);
    expectSuccess(p1.playCommand(setup));
    expectFailure(p1.playCommand(gd02DecisiveLastResort111), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02DecisiveLastResort111)).toBe(`hand:${PLAYER_ONE}`);
  });
});
