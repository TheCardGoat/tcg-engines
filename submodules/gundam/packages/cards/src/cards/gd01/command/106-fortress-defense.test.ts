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
import { gd01FortressDefense106 } from "./106-fortress-defense.ts";

describe("Fortress Defense (GD01-106)", () => {
  it("【Main】 deploys two visible active Zaku II tokens with their printed stats", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01FortressDefense106],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(commandId));

    const tokens = p1.getCardsInZone("battleArea");
    expect(tokens).toHaveLength(2);
    for (const tokenId of tokens) {
      expect(p1.getVisibleCard(tokenId)).toMatchObject({
        effectiveAp: 1,
        effectiveHp: 1,
        exhausted: false,
      });
    }
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("cannot be played in a legally reached Action step", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01FortressDefense106],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());

    expectFailure(p1.playCommand(gd01FortressDefense106), "WRONG_TIMING");
  });

  it("plays as Dozle Zabi, applies AP+1/HP+0, and forms a Link through his printed name", () => {
    const host = createMockUnit({
      level: 0,
      cost: 0,
      ap: 2,
      hp: 3,
      linkCondition: "[Dozle Zabi]",
    });
    const engine = GundamTestEngine.create(
      {
        hand: [host, gd01FortressDefense106],
        resourceArea: activeResources(5),
      },
      { shieldArea: [createMockUnit({ name: "Shield" })] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [hostId, commandId] = p1.getHand();

    expectSuccess(p1.deployUnit(hostId!));
    expectSuccess(p1.playCommandAsPilot(commandId!, hostId!));

    expect(p1.getPilotId(hostId!)).toBe(commandId);
    expect(p1.getCardZone(commandId!)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getVisibleCard(hostId!)?.effectiveAp).toBe(3);
    expect(p1.getVisibleCard(hostId!)?.effectiveHp).toBe(3);
    expectSuccess(p1.enterBattle(hostId!, "direct"));
  });

  it("cannot be played below its printed Lv.5 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01FortressDefense106],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(gd01FortressDefense106), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(p1.getCardZone(gd01FortressDefense106)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
  });

  it("cannot pay its printed cost after a legal setup leaves only 1 active Resource", () => {
    const setup = createMockCommand({
      name: "Resource Setup",
      level: 0,
      cost: 4,
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [],
          sourceText: "【Main】Do nothing.",
        },
      ],
    });
    const engine = GundamTestEngine.create({
      hand: [setup, gd01FortressDefense106],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [setupId, commandId] = p1.getHand();

    expectSuccess(p1.playCommand(setupId!));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(1);
    expectFailure(p1.playCommand(commandId!), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(commandId!)).toBe(`hand:${PLAYER_ONE}`);
  });
});
