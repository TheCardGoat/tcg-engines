// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vite-plus/test";
import { cleanup, render } from "@testing-library/react";

import { gd01DuelGundam054, gd01MQuve092, gd01SaylaMass087 } from "@tcg/gundam-cards";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";

import { CardFace } from "../ui/card/CardFace.tsx";
import { mapZone, toGameCardData } from "./mappers.ts";

describe("GD01 numeric keywords in the simulator", () => {
  afterEach(cleanup);

  it("shows Breach 3 after Duel Gundam legally reaches 5 AP", () => {
    const zaftPilot = createMockPilot({
      traits: ["zaft"],
      apBonus: 2,
      hpBonus: 0,
      level: 1,
      cost: 1,
    });
    const engine = GundamTestEngine.create({
      hand: [gd01DuelGundam054, zaftPilot],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd01DuelGundam054));
    const duelId = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(zaftPilot, duelId));

    const { getByLabelText } = renderVisibleCard(engine, duelId);
    expect(getByLabelText("BREACH 3").textContent).toContain("BREACH 3");
  });

  it("shows Repair 1 after Sayla Mass is legally paired with a blue Unit", () => {
    const blueUnit = createMockUnit({ color: "blue", level: 1, cost: 1, ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [blueUnit, gd01SaylaMass087],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(blueUnit));
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(gd01SaylaMass087, unitId));

    const { getByLabelText } = renderVisibleCard(engine, unitId);
    expect(getByLabelText("REPAIR 1").textContent).toContain("REPAIR 1");
  });

  it("shows Breach 1 after M'Quve is legally paired with a Zeon Unit", () => {
    const zeonUnit = createMockUnit({
      traits: ["zeon"],
      level: 1,
      cost: 1,
      ap: 2,
      hp: 4,
    });
    const engine = GundamTestEngine.create({
      hand: [zeonUnit, gd01MQuve092],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(zeonUnit));
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(gd01MQuve092, unitId));

    const { getByLabelText } = renderVisibleCard(engine, unitId);
    expect(getByLabelText("BREACH 1").textContent).toContain("BREACH 1");
  });
});

function renderVisibleCard(engine: GundamTestEngine, cardId: string) {
  const view = engine.asPlayer(PLAYER_ONE).getView();
  const card = mapZone(view, "battleArea", PLAYER_ONE).find(
    (candidate) => candidate.instanceId === cardId,
  );
  if (!card) throw new Error(`Expected ${cardId} in the player-visible battle area`);

  const projectedCard = toGameCardData(view, card);
  return render(<CardFace card={projectedCard} width={587} height={819} />);
}
