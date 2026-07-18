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
import { gd02AwakenedPower110 } from "./110-awakened-power.ts";

describe("Awakened Power (GD02-110)", () => {
  it("asks for an eligible Unit in trash, pays its cost, and deploys it", () => {
    const eligible = createMockUnit({ name: "Eligible Unit", level: 5, cost: 3 });
    const tooHigh = createMockUnit({ name: "Too High", level: 6, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [gd02AwakenedPower110],
      trash: [eligible, tooHigh],
      resourceArea: activeResources(8),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [eligibleId, tooHighId] = p1.getCardsInZone("trash");
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(commandId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected a visible eligible trash Unit choice");
    }
    expect(choice.legalTargetIds).toEqual([eligibleId]);
    expect(choice.legalTargetIds).not.toContain(tooHighId);
    expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));

    expect(p1.getCardZone(eligibleId!)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getCardZone(tooHighId!)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(5);
  });

  it("cannot be played when no Lv.5-or-lower Unit is in trash", () => {
    const tooHigh = createMockUnit({ level: 6, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [gd02AwakenedPower110],
      trash: [tooHigh],
      resourceArea: activeResources(6),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(gd02AwakenedPower110), "NO_LEGAL_TARGETS");
    expect(p1.getCardZone(tooHigh)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("cannot be played during a legally reached Action step", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02AwakenedPower110],
      resourceArea: activeResources(6),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());

    expectFailure(p1.playCommand(gd02AwakenedPower110), "WRONG_TIMING");
  });

  it("enforces both its printed Lv.6 and active Resource cost 2", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02AwakenedPower110],
      resourceArea: activeResources(5),
    });
    expectFailure(
      lowLevel.asPlayer(PLAYER_ONE).playCommand(gd02AwakenedPower110),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
    expect(lowLevel.asPlayer(PLAYER_ONE).getCardZone(gd02AwakenedPower110)).toBe(
      `hand:${PLAYER_ONE}`,
    );

    const setup = createMockCommand({
      level: 0,
      cost: 5,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02AwakenedPower110],
      trash: [createMockUnit({ level: 5, cost: 0 })],
      resourceArea: activeResources(6),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);
    expectSuccess(p1.playCommand(setup));
    expectFailure(p1.playCommand(gd02AwakenedPower110), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02AwakenedPower110)).toBe(`hand:${PLAYER_ONE}`);
  });
});
