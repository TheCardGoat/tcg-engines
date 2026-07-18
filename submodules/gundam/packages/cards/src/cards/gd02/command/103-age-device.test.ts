import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02AgeDevice103 } from "./103-age-device.ts";

describe("AGE Device (GD02-103)", () => {
  it("【Burst】 lets the owner choose an Asuno Family Pilot from trash", () => {
    const attacker = createMockUnit({ ap: 1, hp: 5 });
    const eligible = createMockPilot({ traits: ["asuno family"] });
    const other = createMockPilot({ traits: ["newtype"] });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd02AgeDevice103], trash: [eligible, other] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const [eligibleId, otherId] = p2.getCardsInZone("trash");

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    const burstChoice = p2.getBoardView().pendingChoice;
    if (burstChoice?.kind !== "optional") {
      throw new Error("Expected AGE Device's visible Burst choice");
    }
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burstChoice.directiveIndex]: true } }));
    const choice = p2.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected a visible Asuno Family Pilot choice");
    }
    expect(choice.legalTargetIds).toEqual([eligibleId]);
    expect(choice.legalTargetIds).not.toContain(otherId);
    expectSuccess(p2.resolveEffect({ targets: [eligibleId!] }));

    expect(p2.getCardZone(eligibleId!)).toBe(`hand:${PLAYER_TWO}`);
    expect(p2.getCardZone(gd02AgeDevice103)).toBe(`trash:${PLAYER_TWO}`);
  });

  it("【Main】 places an active EX Resource with an AGE System Unit in play", () => {
    const ageSystem = createMockUnit({ traits: ["age system"] });
    const engine = GundamTestEngine.create({
      hand: [gd02AgeDevice103],
      play: [ageSystem],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const commandId = p1.getHand()[0]!;
    const resourcesBefore = p1.getCardsInZone("resourceArea");

    expectSuccess(p1.playCommand(commandId));

    const resources = p1.getCardsInZone("resourceArea");
    expect(resources).toHaveLength(5);
    const exResourceId = resources.find((id) => !resourcesBefore.includes(id));
    expect(exResourceId).toBeDefined();
    expect(p1.isExhausted(exResourceId!)).toBe(false);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("does not place an EX Resource without an AGE System Unit", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02AgeDevice103],
      play: [createMockUnit({ traits: ["earth federation"] })],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.playCommand(gd02AgeDevice103));

    expect(p1.getCardsInZone("resourceArea")).toHaveLength(4);
    expect(p1.getCardZone(gd02AgeDevice103)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("cannot be played during a legally reached Action step", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02AgeDevice103],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());

    expectFailure(p1.playCommand(gd02AgeDevice103), "WRONG_TIMING");
  });

  it("enforces both its printed Lv.4 and active Resource cost 2", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02AgeDevice103],
      resourceArea: activeResources(3),
    });
    expectFailure(
      lowLevel.asPlayer(PLAYER_ONE).playCommand(gd02AgeDevice103),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
    expect(lowLevel.asPlayer(PLAYER_ONE).getCardZone(gd02AgeDevice103)).toBe(`hand:${PLAYER_ONE}`);

    const setup = createMockCommand({
      level: 0,
      cost: 3,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02AgeDevice103],
      play: [createMockUnit({ traits: ["age system"] })],
      resourceArea: activeResources(4),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);
    expectSuccess(p1.playCommand(setup));
    expectFailure(p1.playCommand(gd02AgeDevice103), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02AgeDevice103)).toBe(`hand:${PLAYER_ONE}`);
  });
});
