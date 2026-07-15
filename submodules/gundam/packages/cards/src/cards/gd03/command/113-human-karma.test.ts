import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { gd03HumanKarma113 } from "./113-human-karma.ts";

describe("Human Karma (GD03-113)", () => {
  function setup({
    friendlyLevel = 4,
    enemyLevel = 4,
    friendlyExhausted = false,
    resources = activeResources(3),
  }: {
    friendlyLevel?: number;
    enemyLevel?: number;
    friendlyExhausted?: boolean;
    resources?: ReturnType<typeof activeResources>;
  } = {}) {
    const friendly = createMockUnit({ level: friendlyLevel, hp: 6 });
    const enemy = createMockUnit({ level: enemyLevel, hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03HumanKarma113],
        play: [{ card: friendly, exhausted: friendlyExhausted }],
        resourceArea: resources,
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    return {
      p1,
      p2,
      commandId: p1.getHand()[0]!,
      friendlyId: p1.getCardsInZone("battleArea")[0]!,
      enemyId: p2.getCardsInZone("battleArea")[0]!,
    };
  }

  it("rests an active friendly Unit and deals 3 damage to an equal-level enemy", () => {
    const { p1, p2, commandId, friendlyId, enemyId } = setup();

    expectSuccess(p1.playCommand(commandId, { targets: [friendlyId] }));

    expect(p1.isExhausted(friendlyId)).toBe(true);
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [enemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.getDamage(enemyId)).toBe(3);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("can be played during a public Action Step", () => {
    const { p1, p2, commandId, friendlyId, enemyId } = setup({
      friendlyLevel: 5,
      enemyLevel: 3,
    });

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.playCommand(commandId, { targets: [friendlyId] }));
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p1.isExhausted(friendlyId)).toBe(true);
    expect(p2.getDamage(enemyId)).toBe(3);
  });

  it("does not offer an enemy whose level is higher than the Unit being rested", () => {
    const { p1, p2, commandId, friendlyId, enemyId } = setup({
      friendlyLevel: 3,
      enemyLevel: 4,
    });

    expectSuccess(p1.playCommand(commandId, { targets: [friendlyId] }));

    expect(p1.isExhausted(friendlyId)).toBe(true);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getDamage(enemyId)).toBe(0);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    expectSuccess(p1.passPhase());
  });

  it("requires the chosen friendly Unit to be active", () => {
    const { p1, commandId, friendlyId } = setup({ friendlyExhausted: true });

    expectFailure(p1.playCommand(commandId, { targets: [friendlyId] }), "INVALID_TARGET");
  });

  it("requires 2 active resources", () => {
    const { p1, commandId, friendlyId } = setup({
      resources: [...restedResources(2), ...activeResources(1)],
    });

    expectFailure(p1.playCommand(commandId, { targets: [friendlyId] }), "INSUFFICIENT_RESOURCES");
  });
});
