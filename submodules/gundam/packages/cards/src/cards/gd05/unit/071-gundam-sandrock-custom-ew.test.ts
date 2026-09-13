import { describe, expect, it } from "vite-plus/test";
import {
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd05GundamSandrockCustomEw071 } from "./071-gundam-sandrock-custom-ew.ts";

describe("Gundam Sandrock Custom (EW) (GD05-071)", () => {
  /** @behavioral-proof complete: Attack timing, another friendly G Team/Preventer gate, enemy choice, exact AP reduction, false branch, and this-turn expiry are public. */
  it("【Attack】 with another G Team Unit gives AP-2 only to the chosen enemy Unit", () => {
    const companion = createMockUnit({ traits: ["g team"] });
    const chosen = createMockUnit({ ap: 5 });
    const unchosen = createMockUnit({ ap: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd05GundamSandrockCustomEw071, companion] },
      { play: [chosen, unchosen] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const [chosenId, unchosenId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.enterBattle(sourceId, "direct"));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([chosenId, unchosenId]),
    });
    expectSuccess(p1.resolveEffect({ targets: [chosenId!] }));

    expect(p2.getVisibleCard(chosenId!)?.effectiveAp).toBe(3);
    expect(p2.getVisibleCard(unchosenId!)?.effectiveAp).toBe(5);
  });

  it("does not offer an AP reduction target without another G Team or Preventer Unit", () => {
    const enemy = createMockUnit({ ap: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd05GundamSandrockCustomEw071] },
      { play: [enemy], shieldArea: [createMockUnit({ name: "Enemy shield" })] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(sourceId, "direct"));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });

  it("removes the AP reduction at the end of the attacking player's turn", () => {
    const companion = createMockUnit({ traits: ["preventer"] });
    const chosen = createMockUnit({ ap: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd05GundamSandrockCustomEw071, companion], deck: 5 },
      {
        play: [chosen],
        shieldArea: [
          createMockUnit({ name: "First enemy shield" }),
          createMockUnit({ name: "Second enemy shield" }),
        ],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const chosenId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(sourceId, "direct"));
    expectSuccess(p1.resolveEffect({ targets: [chosenId] }));
    expect(p2.getVisibleCard(chosenId)?.effectiveAp).toBe(3);
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    passTurnThroughPublicMoves(engine, PLAYER_ONE);

    expect(p2.getVisibleCard(chosenId)?.effectiveAp).toBe(5);
  });
});
