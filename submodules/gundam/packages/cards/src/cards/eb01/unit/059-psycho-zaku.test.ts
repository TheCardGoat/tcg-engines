import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockPilot,
  createMockResource,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { eb01DarylLorenz070 } from "../pilot/070-daryl-lorenz.ts";
import { eb01PsychoZaku059 } from "./059-psycho-zaku.ts";

describe("Psycho Zaku (EB01-059)", () => {
  it("【During Link】【Attack】 lets each player set one of their own Resources active", () => {
    const engine = GundamTestEngine.create(
      {
        hand: [eb01DarylLorenz070],
        play: [eb01PsychoZaku059],
        resourceArea: [...activeResources(4), { card: createMockResource(), exhausted: true }],
      },
      {
        play: [{ card: createMockUnit(), exhausted: true }],
        resourceArea: [{ card: createMockResource(), exhausted: true }],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const zakuId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const p1ResourceId = p1.getCardsInZone("resourceArea")[4]!;
    const p2ResourceId = p2.getCardsInZone("resourceArea")[0]!;

    expectSuccess(p1.assignPilot(eb01DarylLorenz070, zakuId));
    expectSuccess(p1.enterBattle(zakuId, defenderId));

    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([p1ResourceId]),
    });
    expectSuccess(p1.resolveEffect({ targets: [p1ResourceId] }));
    expect(p1.isExhausted(p1ResourceId)).toBe(false);
    expect(p2.isExhausted(p2ResourceId)).toBe(true);

    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [p2ResourceId],
    });
    expectSuccess(p2.resolveEffect({ targets: [p2ResourceId] }));
    expect(p2.isExhausted(p2ResourceId)).toBe(false);
  });

  it("does not ready Resources when paired with a Pilot that does not satisfy its Link Condition", () => {
    const unrelatedPilot = createMockPilot({ name: "Other Pilot", level: 0, cost: 0 });
    const engine = GundamTestEngine.create(
      {
        hand: [unrelatedPilot],
        play: [eb01PsychoZaku059],
        resourceArea: [...activeResources(4), { card: createMockResource(), exhausted: true }],
      },
      {
        play: [{ card: createMockUnit(), exhausted: true }],
        resourceArea: [{ card: createMockResource(), exhausted: true }],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const zakuId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const p1ResourceId = p1.getCardsInZone("resourceArea")[4]!;
    const p2ResourceId = p2.getCardsInZone("resourceArea")[0]!;

    expectSuccess(p1.assignPilot(unrelatedPilot, zakuId));
    expectSuccess(p1.enterBattle(zakuId, defenderId));

    expect(p1.isExhausted(p1ResourceId)).toBe(true);
    expect(p2.isExhausted(p2ResourceId)).toBe(true);
  });

  it("does not trigger a second time after Psycho Zaku is readied in the same turn", () => {
    const readyCommand = createMockCommand({
      name: "Ready Psycho Zaku",
      level: 0,
      cost: 0,
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [
            {
              action: {
                action: "setActive",
                target: { owner: "friendly", cardType: "unit", state: "rested", count: 1 },
              },
            },
          ],
          sourceText: "【Main】Choose 1 rested friendly Unit. Set it as active.",
        },
      ],
    });
    const engine = GundamTestEngine.create(
      {
        hand: [eb01DarylLorenz070, readyCommand],
        play: [eb01PsychoZaku059],
        resourceArea: [
          ...activeResources(4),
          { card: createMockResource(), exhausted: true },
          { card: createMockResource(), exhausted: true },
        ],
      },
      {
        play: [
          { card: createMockUnit(), exhausted: true },
          { card: createMockUnit(), exhausted: true },
        ],
        resourceArea: [
          { card: createMockResource(), exhausted: true },
          { card: createMockResource(), exhausted: true },
        ],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const zakuId = p1.getCardsInZone("battleArea")[0]!;
    const [firstDefenderId, secondDefenderId] = p2.getCardsInZone("battleArea");
    const [, , , , firstP1ResourceId, secondP1ResourceId] = p1.getCardsInZone("resourceArea");
    const [firstP2ResourceId, secondP2ResourceId] = p2.getCardsInZone("resourceArea");
    const readyCommandId = p1.getHand()[1]!;

    expectSuccess(p1.assignPilot(eb01DarylLorenz070, zakuId));
    expectSuccess(p1.enterBattle(zakuId, firstDefenderId!));
    expectSuccess(p1.resolveEffect({ targets: [firstP1ResourceId!] }));
    expectSuccess(p2.resolveEffect({ targets: [firstP2ResourceId!] }));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expectSuccess(p1.playCommand(readyCommandId, { targets: [zakuId] }));
    expectSuccess(p1.enterBattle(zakuId, secondDefenderId!));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.isExhausted(secondP1ResourceId!)).toBe(true);
    expect(p2.isExhausted(secondP2ResourceId!)).toBe(true);
  });
});
