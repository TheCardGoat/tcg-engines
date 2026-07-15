// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vite-plus/test";
import { cleanup, render } from "@testing-library/react";

import { gd01FortressDefense106, gd01Gundam001, gd01Side7124 } from "@tcg/gundam-cards";
import { GundamTestEngine, PLAYER_ONE, activeResources, expectSuccess } from "@tcg/gundam-engine";

import { CardFace } from "../ui/card/CardFace.tsx";
import { mapZone, toGameCardData } from "./mappers.ts";

describe("GD01 printed card characteristics in the simulator", () => {
  afterEach(cleanup);

  it("announces Unit and Base color plus their printed Space/Earth compatibility", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01Gundam001, gd01Side7124],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd01Gundam001));
    expectSuccess(p1.deployBase(gd01Side7124));

    const unit = renderVisibleCard(engine, "battleArea", gd01Gundam001.cardNumber);
    expect(unit.getByLabelText(/Gundam, unit, blue, .*Space \/ Earth$/)).toBeTruthy();

    const base = renderVisibleCard(engine, "baseSection", gd01Side7124.cardNumber);
    expect(base.getByLabelText(/Side 7, base, blue, HP 4, ready, .*Space$/)).toBeTruthy();
  });

  it("announces readiness only for cards a player can rest in their public play zone", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01Gundam001, gd01Gundam001, gd01FortressDefense106],
      resourceArea: activeResources(7),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd01Gundam001));
    expectSuccess(p1.playCommandAsPilot(gd01FortressDefense106, gd01Gundam001));

    const handUnit = renderVisibleCard(engine, "hand", gd01Gundam001.cardNumber);
    expect(handUnit.getByLabelText(/^Gundam, unit, blue/).getAttribute("aria-label")).not.toMatch(
      /\b(?:ready|rested)\b/,
    );

    const readyUnit = renderVisibleCard(engine, "battleArea", gd01Gundam001.cardNumber);
    expect(readyUnit.getByLabelText(/Gundam, unit, blue, .*\bready\b/)).toBeTruthy();

    const pairedCommand = renderVisibleCard(
      engine,
      "battleArea",
      gd01FortressDefense106.cardNumber,
    );
    expect(
      pairedCommand.getByLabelText(/^Fortress Defense, command, green/).getAttribute("aria-label"),
    ).not.toMatch(/\b(?:ready|rested)\b/);

    const restedResource = visibleCards(engine, "resourceArea").find((card) => card.exerted);
    if (!restedResource) throw new Error("Expected a spent resource after legal deployments");
    const resource = render(<CardFace card={restedResource} width={587} height={819} />);
    expect(resource.getByLabelText(/Test Resource, resource, rested/)).toBeTruthy();
  });
});

function renderVisibleCard(
  engine: GundamTestEngine,
  zone: "battleArea" | "baseSection" | "hand",
  cardNumber: string,
) {
  const card = visibleCards(engine, zone).find((candidate) => candidate.cardNumber === cardNumber);
  if (!card) throw new Error(`Expected visible ${cardNumber} in ${zone}`);
  return render(<CardFace card={card} width={587} height={819} />);
}

function visibleCards(
  engine: GundamTestEngine,
  zone: "battleArea" | "baseSection" | "hand" | "resourceArea",
) {
  const view = engine.asPlayer(PLAYER_ONE).getView();
  return mapZone(view, zone, PLAYER_ONE).map((candidate) => toGameCardData(view, candidate));
}
