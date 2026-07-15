import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02AgeDevice103 } from "./103-age-device.ts";
describe("AGE Device (GD02-103)", () => {
  it("【Burst】Choose 1 (Asuno Family) Pilot card from your trash. Add it to your hand.", () => {
    const asunoPilot = createMockPilot({ traits: ["Asuno Family"] });
    const attacker = createMockUnit({ ap: 2, hp: 5 });
    const engine = GundamTestEngine.create(
      { shieldArea: [gd02AgeDevice103], trash: [asunoPilot] },
      { play: [attacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [shieldId] = p1.getCardsInZone("shieldArea");
    const [pilotId] = p1.getCardsInZone("trash");
    const [attackerId] = p2.getCardsInZone("battleArea");
    const handBefore = p1.getHand().length;

    expectSuccess(p2.enterBattle(attackerId!, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expect(p1.getBoardView().pendingChoice?.kind).toBe("optional");
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));
    expect(p1.getBoardView().pendingChoice?.kind).toBe("targetSelection");
    expectSuccess(p1.resolveEffect({ targets: [pilotId!] }));

    expect(p1.getHand()).toContain(pilotId);
    expect(p1.getHand().length).toBe(handBefore + 1);
    expect(p1.getCardZone(shieldId!)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("【Main】places an EX Resource when an (AGE System) Unit is in play", () => {
    const ageSystemUnit = createMockUnit({ ap: 2, hp: 3, traits: ["age system"] });
    const engine = GundamTestEngine.create({
      hand: [gd02AgeDevice103],
      resourceArea: activeResources(4),
      play: [ageSystemUnit],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const cmdId = p1.getHand()[0]!;
    const existingResources = new Set(p1.getCardsInZone("resourceArea"));

    expectSuccess(p1.playCommand(gd02AgeDevice103));

    const exResourceId = p1
      .getCardsInZone("resourceArea")
      .find((cardId) => !existingResources.has(cardId));
    expect(exResourceId).toBeDefined();
    expect(p1.isExhausted(exResourceId!)).toBe(false);
    expect(p1.getCardZone(cmdId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("【Main】without an (AGE System) Unit: effect fires but no resource is placed; card lands in trash", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02AgeDevice103],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const cmdId = p1.getHand()[0]!;
    const resourcesBefore = p1.getCardsInZone("resourceArea").length;

    expectSuccess(p1.playCommand(gd02AgeDevice103));

    // Conditional thenDirectives skipped — no resource placed, card goes
    // to trash per 3-4-4.
    expect(p1.getCardsInZone("resourceArea").length).toBe(resourcesBefore);
    expect(p1.getCardsInZone("trash")).toContain(cmdId);
  });
});
