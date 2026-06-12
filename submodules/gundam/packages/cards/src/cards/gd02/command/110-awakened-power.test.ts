import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  expectSuccess,
  activeResources,
  createMockUnit,
  expectCardInTrash,
} from "@tcg/gundam-engine";
import { gd02AwakenedPower110 } from "./110-awakened-power.ts";

describe("Awakened Power (GD02-110)", () => {
  it("【Main】 deploys a Lv.5-or-lower Unit from the trash", () => {
    const trashUnit = createMockUnit({ ap: 3, hp: 3, level: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd02AwakenedPower110],
      resourceArea: activeResources(6),
      trash: [trashUnit],
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [trashUnitId] = p1.getCardsInZone("trash");
    const cmdId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(gd02AwakenedPower110));

    // The unit should have been deployed from trash to battleArea
    expect(p1.getCardsInZone("battleArea")).toContain(trashUnitId);
    // Command goes to trash
    expectCardInTrash(engine, cmdId, p1.playerId);
  });

  it("does not deploy a Unit above Lv.5 from the trash", () => {
    const trashUnit = createMockUnit({ ap: 5, hp: 5, level: 7 });
    const engine = GundamTestEngine.create({
      hand: [gd02AwakenedPower110],
      resourceArea: activeResources(6),
      trash: [trashUnit],
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [trashUnitId] = p1.getCardsInZone("trash");

    expectSuccess(p1.playCommand(gd02AwakenedPower110));

    // The Lv.7 unit stays in trash — not deployed
    expect(p1.getCardsInZone("trash")).toContain(trashUnitId);
    expect(p1.getCardsInZone("battleArea")).not.toContain(trashUnitId);
  });
});
