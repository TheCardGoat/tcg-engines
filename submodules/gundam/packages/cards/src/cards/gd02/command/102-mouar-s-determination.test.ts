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
import { gd02MouarSDetermination102 } from "./102-mouar-s-determination.ts";

describe("Mouar's Determination (GD02-102)", () => {
  it("【Main】 gives the chosen friendly Titans Unit AP+2 for the turn", () => {
    const titans = createMockUnit({ ap: 2, traits: ["titans"] });
    const other = createMockUnit({ ap: 3, traits: ["aeug"] });
    const enemyTitans = createMockUnit({ ap: 4, traits: ["titans"] });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02MouarSDetermination102],
        play: [titans, other],
        resourceArea: activeResources(2),
      },
      { play: [enemyTitans] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [titansId, otherId] = p1.getCardsInZone("battleArea");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(commandId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected a visible friendly Titans Unit choice");
    }
    expect(choice.legalTargetIds).toEqual([titansId]);
    expect(choice.legalTargetIds).not.toEqual(expect.arrayContaining([otherId, enemyId]));
    expectSuccess(p1.resolveEffect({ targets: [titansId!] }));

    expect(p1.getVisibleCard(titansId!)?.effectiveAp).toBe(4);
    expect(p1.getVisibleCard(otherId!)?.effectiveAp).toBe(3);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("can give AP during a legally reached Action step", () => {
    const titans = createMockUnit({ ap: 2, traits: ["titans"] });
    const engine = GundamTestEngine.create({
      hand: [gd02MouarSDetermination102],
      play: [titans],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const titansId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.playCommand(gd02MouarSDetermination102));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") throw new Error("Expected a Titans Unit choice");
    expectSuccess(p1.resolveEffect({ targets: [titansId] }));

    expect(p1.getVisibleCard(titansId)?.effectiveAp).toBe(4);
  });

  it("can be paired as Mouar Pharaoh instead of activating the Command", () => {
    const host = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd02MouarSDetermination102],
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
      hand: [gd02MouarSDetermination102],
      resourceArea: activeResources(1),
    });
    expectFailure(
      lowLevel.asPlayer(PLAYER_ONE).playCommand(gd02MouarSDetermination102),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
    expect(lowLevel.asPlayer(PLAYER_ONE).getCardZone(gd02MouarSDetermination102)).toBe(
      `hand:${PLAYER_ONE}`,
    );

    const setup = createMockCommand({
      level: 0,
      cost: 2,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const titans = createMockUnit({ traits: ["titans"] });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02MouarSDetermination102],
      play: [titans],
      resourceArea: activeResources(2),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);
    expectSuccess(p1.playCommand(setup));
    expectFailure(p1.playCommand(gd02MouarSDetermination102), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02MouarSDetermination102)).toBe(`hand:${PLAYER_ONE}`);
  });
});
