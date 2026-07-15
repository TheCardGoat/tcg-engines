import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCommand,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02GrazeRitterGroundType083 } from "./083-graze-ritter-ground-type.ts";

describe("Graze Ritter (Ground Type) (GD02-083)", () => {
  it("【Destroyed】 on the opponent's turn sets a friendly (Gjallarhorn) Unit as active", () => {
    // Graze Ritter (AP 3, HP 2) is destroyed by an AP-2 attacker on
    // p1's turn. The Destroyed trigger checks "opponent's turn" (true
    // from p2's perspective) and sets a friendly Gjallarhorn active.
    // We seed an exhausted ally so the setActive flip is observable.
    const attacker = createMockUnit({ ap: 2, hp: 5 });
    const destroyCommand = createMockCommand({
      level: 0,
      cost: 0,
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [
            {
              action: {
                action: "destroy",
                target: { owner: "opponent", cardType: "unit", count: 1 },
              },
            },
          ],
          sourceText: "【Main】Destroy 1 enemy Unit.",
        },
      ],
    });
    const friendlyGjallarhorn = createMockUnit({
      ap: 1,
      hp: 5,
      traits: ["Gjallarhorn"],
    } as unknown as Parameters<typeof createMockUnit>[0]);
    const engine = GundamTestEngine.create(
      { hand: [destroyCommand], play: [attacker] },
      {
        play: [
          { card: gd02GrazeRitterGroundType083, exhausted: true },
          { card: friendlyGjallarhorn, exhausted: true },
        ],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const [grazeId, allyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.playCommand(commandId, { targets: [grazeId!] }));

    const choice = p2.getBoardView().pendingChoice;
    expect(choice?.kind).toBe("targetSelection");
    if (choice?.kind !== "targetSelection") return;
    expect(choice.legalTargetIds).toEqual([allyId]);
    expectSuccess(p2.resolveEffect({ targets: [allyId] }));

    // Graze Ritter destroyed (AP 2 vs HP 2).
    expect(p2.getCardZone(grazeId!)).toBe(`trash:${PLAYER_TWO}`);
    // Destroyed trigger (on opponent's turn) sets the ally active.
    expect(p2.isExhausted(allyId!)).toBe(false);
  });
});
