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
import { gd01StrategicArms108 } from "../../gd01/command/108-strategic-arms.ts";
import { gd02ItSNameIsRyuseiGo114 } from "./114-it-s-name-is-ryusei-go.ts";

function damagedFriendlyFixture() {
  const damaged = createMockUnit({
    ap: 2,
    hp: 6,
    keywordEffects: [{ keyword: "Blocker" }],
  });
  const undamaged = createMockUnit({ ap: 3, hp: 6 });
  const engine = GundamTestEngine.create({
    hand: [gd01StrategicArms108, gd02ItSNameIsRyuseiGo114],
    play: [damaged, undamaged],
    resourceArea: activeResources(8),
  });
  const p1 = engine.asPlayer(PLAYER_ONE);
  const [damagedId, undamagedId] = p1.getCardsInZone("battleArea");
  expectSuccess(p1.playCommand(gd01StrategicArms108));
  expect(p1.getDamage(damagedId!)).toBe(2);
  return { engine, p1, damagedId: damagedId!, undamagedId: undamagedId! };
}

describe("It's Name is Ryusei-Go (GD02-114)", () => {
  it("【Main】 gives the chosen damaged friendly Unit AP+2 for the turn", () => {
    const { p1, damagedId, undamagedId } = damagedFriendlyFixture();
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(commandId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected a visible damaged friendly Unit choice");
    }
    expect(choice.legalTargetIds).toEqual([damagedId]);
    expect(choice.legalTargetIds).not.toContain(undamagedId);
    expectSuccess(p1.resolveEffect({ targets: [damagedId] }));

    expect(p1.getVisibleCard(damagedId)?.effectiveAp).toBe(4);
    expect(p1.getVisibleCard(undamagedId)?.effectiveAp).toBe(3);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("can give AP during a legally reached Action step", () => {
    const { engine, p1, damagedId } = damagedFriendlyFixture();
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.playCommand(gd02ItSNameIsRyuseiGo114));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") throw new Error("Expected a damaged Unit choice");
    expectSuccess(p1.resolveEffect({ targets: [damagedId] }));

    expect(p1.getVisibleCard(damagedId)?.effectiveAp).toBe(4);
  });

  it("cannot be played without a damaged friendly Unit", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02ItSNameIsRyuseiGo114],
      play: [createMockUnit({ hp: 5 })],
      resourceArea: activeResources(2),
    });

    expectFailure(
      engine.asPlayer(PLAYER_ONE).playCommand(gd02ItSNameIsRyuseiGo114),
      "NO_LEGAL_TARGETS",
    );
  });

  it("can be paired as Norba Shino instead of activating the Command", () => {
    const host = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd02ItSNameIsRyuseiGo114],
      play: [host],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommandAsPilot(commandId, hostId));

    expect(p1.getPilotId(hostId)).toBe(commandId);
    expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 3, effectiveHp: 4 });
  });

  it("enforces its printed Lv.2 and active Resource cost 1", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02ItSNameIsRyuseiGo114],
      resourceArea: activeResources(1),
    });
    expectFailure(
      lowLevel.asPlayer(PLAYER_ONE).playCommand(gd02ItSNameIsRyuseiGo114),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
    expect(lowLevel.asPlayer(PLAYER_ONE).getCardZone(gd02ItSNameIsRyuseiGo114)).toBe(
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
      hand: [setup, gd02ItSNameIsRyuseiGo114],
      resourceArea: activeResources(2),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);
    expectSuccess(p1.playCommand(setup));
    expectFailure(p1.playCommand(gd02ItSNameIsRyuseiGo114), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02ItSNameIsRyuseiGo114)).toBe(`hand:${PLAYER_ONE}`);
  });
});
