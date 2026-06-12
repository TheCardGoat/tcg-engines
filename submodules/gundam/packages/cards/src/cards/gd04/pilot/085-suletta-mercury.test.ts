import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockResource,
  expectSuccess,
  isCardExhausted,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd04IndiscriminateViolence106 } from "../command/106-indiscriminate-violence.ts";
import { gd04GundamAerialRebuild024 } from "../unit/024-gundam-aerial-rebuild.ts";
import { gd04SulettaMercury085 } from "./085-suletta-mercury.ts";

describe("Suletta Mercury (GD04-085)", () => {
  it("【Burst】adds this card to hand", () => {
    const engine = GundamTestEngine.create({ deck: [gd04SulettaMercury085] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.asPlayer(PLAYER_ONE).getHand()).toContain(shieldId);
  });

  it("during link places a rested EX Resource after spending the last EX Resource on an Academy Command", () => {
    const resources = [
      ...activeResources(1),
      ...activeResources(3).map((entry) => ({ ...entry, exhausted: true })),
      { card: createMockResource({ name: "EX Resource" }), exhausted: false },
    ];
    const engine = GundamTestEngine.create({
      hand: [gd04SulettaMercury085, gd04IndiscriminateViolence106],
      play: [gd04GundamAerialRebuild024],
      resourceArea: resources,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const exResourceId = p1.getCardsInZone("resourceArea").at(-1)!;
    engine.markAsToken(exResourceId);

    expectSuccess(p1.assignPilot(gd04SulettaMercury085, hostId));
    expectSuccess(p1.playCommand(gd04IndiscriminateViolence106, { targets: [hostId] }));

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const exResourceIds = p1
      .getCardsInZone("resourceArea")
      .filter((id) => framework.cards.getDefinition(id)?.name === "EX Resource");
    expect(exResourceIds).toHaveLength(1);
    expect(isCardExhausted(engine, exResourceIds[0]!)).toBe(true);
  });

  it("does not place an EX Resource if another EX Resource remains", () => {
    const resources = [
      ...activeResources(1),
      ...activeResources(3).map((entry) => ({ ...entry, exhausted: true })),
      { card: createMockResource({ name: "EX Resource" }), exhausted: false },
      { card: createMockResource({ name: "EX Resource" }), exhausted: false },
    ];
    const engine = GundamTestEngine.create({
      hand: [gd04SulettaMercury085, gd04IndiscriminateViolence106],
      play: [gd04GundamAerialRebuild024],
      resourceArea: resources,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    for (const resourceId of p1.getCardsInZone("resourceArea").slice(-2)) {
      engine.markAsToken(resourceId);
    }

    expectSuccess(p1.assignPilot(gd04SulettaMercury085, hostId));
    expectSuccess(p1.playCommand(gd04IndiscriminateViolence106, { targets: [hostId] }));

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const exResourceIds = p1
      .getCardsInZone("resourceArea")
      .filter((id) => framework.cards.getDefinition(id)?.name === "EX Resource");
    expect(exResourceIds).toHaveLength(1);
    expect(isCardExhausted(engine, exResourceIds[0]!)).toBe(false);
  });
});
