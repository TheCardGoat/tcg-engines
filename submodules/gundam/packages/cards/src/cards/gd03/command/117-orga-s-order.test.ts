import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03OrgaSOrder117 } from "./117-orga-s-order.ts";

describe("Orga's Order (GD03-117)", () => {
  it("deploys one active AP2/HP2 Graze Custom token against 1–4 enemy Units", () => {
    const enemies = [createMockUnit(), createMockUnit()];
    const engine = GundamTestEngine.create(
      { hand: [gd03OrgaSOrder117], resourceArea: activeResources(3) },
      { play: enemies },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.playCommand(gd03OrgaSOrder117));

    const [tokenId] = p1.getCardsInZone("battleArea");
    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(p1.getVisibleCard(tokenId!)).toMatchObject({
      effectiveAp: 2,
      effectiveHp: 2,
      exhausted: false,
    });
    expectFailure(p1.enterBattle(tokenId!, "direct"), "CANNOT_ATTACK");
  });

  it("deploys one active AP4/HP4 Gundam Barbatos token against 5 enemy Units", () => {
    const enemies = Array.from({ length: 5 }, () => createMockUnit());
    const engine = GundamTestEngine.create(
      { hand: [gd03OrgaSOrder117], resourceArea: activeResources(3) },
      { play: enemies },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.playCommand(gd03OrgaSOrder117));

    const [tokenId] = p1.getCardsInZone("battleArea");
    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(p1.getVisibleCard(tokenId!)).toMatchObject({
      effectiveAp: 4,
      effectiveHp: 4,
      exhausted: false,
    });
  });

  it("deploys no token when the opponent has no Units", () => {
    const engine = GundamTestEngine.create({
      hand: [gd03OrgaSOrder117],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.playCommand(gd03OrgaSOrder117));

    expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
  });
});
