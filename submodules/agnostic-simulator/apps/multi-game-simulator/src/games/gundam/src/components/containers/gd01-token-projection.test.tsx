// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vite-plus/test";
import { cleanup, render, within } from "@testing-library/react";

import {
  gd01FirstContact107,
  gd01FortressDefense106,
  gd01JusticeGundam066,
} from "@tcg/gundam-cards";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  asPlayerId,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";

import { CardFace } from "../ui/card/CardFace.tsx";
import { applyLiveStateUpdate, createLiveMatchViewerEngine } from "../../engine/live/liveState.ts";
import { mapZone, toGameCardData } from "./mappers.ts";

describe("GD01 token cards in the live simulator", () => {
  afterEach(cleanup);

  it("shows Fatum-00 to an existing viewer and a player joining after deployment", () => {
    const serverEngine = GundamTestEngine.create({
      hand: [gd01JusticeGundam066],
      resourceArea: activeResources(7),
    });
    const live = createLiveMatchViewerEngine(serializedState(serverEngine));

    expectSuccess(serverEngine.asPlayer(PLAYER_ONE).deployUnit(gd01JusticeGundam066));
    const tokenState = serializedState(serverEngine);
    applyLiveStateUpdate(live.runtime, live.staticResources, tokenState);
    const joinedAfterDeployment = createLiveMatchViewerEngine(tokenState);

    for (const runtime of [live.runtime, joinedAfterDeployment.runtime]) {
      const visible = renderVisibleToken(runtime, "battleArea", "T-011");

      expect(
        visible.getByLabelText("Fatum-00, unit, AP 2, HP 2, ready, Blocker, triple ship alliance"),
      ).toBeTruthy();
      expect(visible.getByLabelText("BLOCK")).toBeTruthy();
      expect(visible.getByAltText("Fatum-00").getAttribute("src")).toBe(
        "https://r2.tcg.online/public/gundam/cards/t/T-011.webp",
      );
    }
  });

  it("shows both Zaku II tokens deployed by Fortress Defense", () => {
    const serverEngine = GundamTestEngine.create({
      hand: [gd01FortressDefense106],
      resourceArea: activeResources(5),
    });
    const live = createLiveMatchViewerEngine(serializedState(serverEngine));

    expectSuccess(serverEngine.asPlayer(PLAYER_ONE).playCommand(gd01FortressDefense106));
    const tokenState = serializedState(serverEngine);
    applyLiveStateUpdate(live.runtime, live.staticResources, tokenState);
    const joinedAfterDeployment = createLiveMatchViewerEngine(tokenState);

    for (const runtime of [live.runtime, joinedAfterDeployment.runtime]) {
      const view = runtime.getFilteredView({ role: "player", playerId: asPlayerId(PLAYER_ONE) });
      const zakus = mapZone(view, "battleArea", PLAYER_ONE)
        .map((card) => toGameCardData(view, card))
        .filter((card) => card.cardNumber === "T-007");
      expect(zakus).toHaveLength(2);

      for (const zaku of zakus) {
        const visible = within(render(<CardFace card={zaku} width={587} height={819} />).container);
        expect(visible.getByLabelText("Zaku Ⅱ, unit, AP 1, HP 1, ready, zeon")).toBeTruthy();
        expect(visible.getByAltText("Zaku Ⅱ").getAttribute("src")).toBe(
          "https://r2.tcg.online/public/gundam/cards/t/T-007.webp",
        );
      }
    }
  });

  it("shows the ready EX Resource created by First Contact's Burst", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const serverEngine = GundamTestEngine.create(
      { shieldArea: [gd01FirstContact107], deck: 5 },
      { play: [attacker], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const live = createLiveMatchViewerEngine(serializedState(serverEngine));
    const p1 = serverEngine.asPlayer(PLAYER_ONE);
    const p2 = serverEngine.asPlayer(PLAYER_TWO);
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));

    const tokenState = serializedState(serverEngine);
    applyLiveStateUpdate(live.runtime, live.staticResources, tokenState);
    const joinedAfterDeployment = createLiveMatchViewerEngine(tokenState);

    for (const runtime of [live.runtime, joinedAfterDeployment.runtime]) {
      const visible = renderVisibleToken(runtime, "resourceArea", "EXRP-003");

      expect(visible.getByLabelText("EX Resource, resource, ready")).toBeTruthy();
      expect(visible.getByAltText("EX Resource").getAttribute("src")).toBe(
        "https://r2.tcg.online/public/gundam/cards/exrp/EXRP-003.webp",
      );
    }
  });
});

function renderVisibleToken(
  runtime: ReturnType<typeof createLiveMatchViewerEngine>["runtime"],
  zone: "battleArea" | "resourceArea",
  cardNumber: string,
) {
  const view = runtime.getFilteredView({ role: "player", playerId: asPlayerId(PLAYER_ONE) });
  const card = mapZone(view, zone, PLAYER_ONE)
    .map((candidate) => toGameCardData(view, candidate))
    .find((candidate) => candidate.cardNumber === cardNumber);
  if (!card) throw new Error(`Expected visible ${cardNumber} in ${zone}`);

  return within(render(<CardFace card={card} width={587} height={819} />).container);
}

function serializedState(engine: GundamTestEngine): Record<string, unknown> {
  return structuredClone(engine.getState()) as unknown as Record<string, unknown>;
}
