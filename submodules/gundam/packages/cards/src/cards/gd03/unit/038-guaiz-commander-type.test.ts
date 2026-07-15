import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03ReccoaSShadow104 } from "../command/104-reccoa-s-shadow.ts";
import { gd03HumanKarma113 } from "../command/113-human-karma.ts";
import { gd03GuaizCommanderType038 } from "./038-guaiz-commander-type.ts";

describe("GuAIZ (Commander Type) (GD03-038)", () => {
  it("Support 1 rests GuAIZ and gives another friendly Unit AP+1", () => {
    const zaftAlly = createMockUnit({ traits: ["zaft"], ap: 2, hp: 5 });
    const engine = GundamTestEngine.create({ play: [gd03GuaizCommanderType038, zaftAlly] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [guaizId, zaftAllyId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.useSupport(guaizId!, zaftAllyId!));

    expect(p1.isExhausted(guaizId!)).toBe(true);
    expect(p1.getVisibleCard(zaftAllyId!)?.effectiveAp).toBe(3);
  });

  it("offers a visible ZAFT target choice when a friendly effect rests GuAIZ on its controller's turn", () => {
    const zaftAlly = createMockUnit({ traits: ["zaft"], ap: 2, hp: 5 });
    const enemy = createMockUnit({ level: 4, hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03HumanKarma113],
        play: [gd03GuaizCommanderType038, zaftAlly],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [guaizId, zaftAllyId] = p1.getCardsInZone("battleArea");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd03HumanKarma113, { targets: [guaizId!] }));
    const ordering = p1.getBoardView().pendingChoice;
    if (ordering?.kind !== "ordering") throw new Error("Expected triggered-effect ordering");
    const guaizEffect = ordering.candidates.find((candidate) => candidate.sourceCardId === guaizId);
    if (!guaizEffect) throw new Error("Expected GuAIZ's rest trigger in the ordering choice");
    expectSuccess(p1.resolveEffect({ pendingEffectId: guaizEffect.effectId }));

    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([guaizId, zaftAllyId]),
    });
    expectSuccess(p1.resolveEffect({ targets: [zaftAllyId!] }));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [enemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p1.isExhausted(guaizId!)).toBe(true);
    expect(p1.getVisibleCard(zaftAllyId!)?.effectiveAp).toBe(4);
    expect(p2.getDamage(enemyId)).toBe(3);
  });

  it("does not offer the AP+2 choice when an enemy effect rests GuAIZ on the opponent's turn", () => {
    const zaftAlly = createMockUnit({ traits: ["zaft"], ap: 2, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd03GuaizCommanderType038, zaftAlly] },
      { hand: [gd03ReccoaSShadow104], resourceArea: activeResources(3) },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [guaizId, zaftAllyId] = p1.getCardsInZone("battleArea");

    expectSuccess(p2.playCommand(gd03ReccoaSShadow104, { targets: [guaizId!] }));

    expect(p1.isExhausted(guaizId!)).toBe(true);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getVisibleCard(zaftAllyId!)?.effectiveAp).toBe(2);
  });
});
