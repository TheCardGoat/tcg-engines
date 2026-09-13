// @vitest-environment jsdom

import { describe, expect, it } from "vite-plus/test";
import { cleanup, render } from "@testing-library/react";
import { afterEach } from "vite-plus/test";
import { createElement } from "react";
import type { Action, GameState } from "@tcg-engines/naruto-engine";
import { TestingLibraryDomDriver } from "@tcg/simulator-testing/testing-library";
import type { SimulatorRouteContextValue } from "../../../simulator/providers";
import { SimulatorRouteContextProvider } from "../../../simulator/providers/route-context";
import {
  NarutoLiveMatchPage,
  narutoAudioCueForLog,
  submissionPayloadForAction,
} from "../pages/LiveMatch.page";

afterEach(cleanup);

describe("Naruto live-match submissions", () => {
  it("shows the spectator limitation before requiring a player seat", async () => {
    const route = {
      gameSlug: "naruto",
      routeKind: "live-match",
      matchPageData: {
        viewer: { role: "spectator" },
        game: { gameId: "", view: {} },
      },
      matchResolution: null,
      error: null,
    } as unknown as SimulatorRouteContextValue;
    const { baseElement } = render(
      createElement(
        SimulatorRouteContextProvider,
        { value: route },
        createElement(NarutoLiveMatchPage),
      ),
    );
    const driver = new TestingLibraryDomDriver(baseElement);

    expect(await driver.getByRole("heading", { name: "Spectating unavailable" }).count()).toBe(1);
    expect(baseElement.textContent).toContain("currently support seated players only");
  });

  it.each([
    [{ type: "SUMMON", player: "p1", handUid: "hand-1" }, "handUid", "hand-1"],
    [{ type: "SET_SUPPORT", player: "p1", handUid: "hand-2" }, "handUid", "hand-2"],
    [{ type: "ACTIVATE_SUPPORT_FROM_HAND", player: "p1", handUid: "hand-3" }, "handUid", "hand-3"],
    [{ type: "ACTIVATE_CHARACTER", player: "p1", uid: "character-1" }, "uid", "character-1"],
    [
      {
        type: "DECLARE_ATTACK",
        player: "p1",
        attackerUid: "character-1",
        attackerKind: "character",
        targetKind: "leader",
        targetUid: "leader:p2",
      },
      "attackerUid",
      "character-1",
    ],
    [{ type: "RESOLVE_CHOICE", player: "p1", key: "choice-1" }, "key", "choice-1"],
  ] satisfies ReadonlyArray<readonly [Action, string, string]>)(
    "serializes $0 as a scalar interaction value",
    (action, key, expected) => {
      const payload = submissionPayloadForAction(action, null);
      expect(payload?.values[key]).toBe(expected);
      expect(Object.values(payload?.values ?? {}).some(Array.isArray)).toBe(false);
    },
  );

  it("serializes a declined choice as null", () => {
    const payload = submissionPayloadForAction(
      { type: "RESOLVE_CHOICE", player: "p1", key: null },
      null,
    );
    expect(payload?.values.key).toBeNull();
  });

  it("resolves a set support to its scalar uid", () => {
    const state = {
      players: { p1: { supports: [{ uid: "support-1" }] } },
    } as unknown as GameState;
    const payload = submissionPayloadForAction(
      { type: "ACTIVATE_SUPPORT", player: "p1", slot: 0 },
      state,
    );
    expect(payload?.values.supportUid).toBe("support-1");
  });
});

describe("Naruto live-match audio", () => {
  it.each([
    ["log.draw", "system", "card.draw"],
    ["log.summon", "p1", "card.play"],
    ["log.setSupport", "p1", "card.play"],
    ["log.declareAttack", "p1", "combat.start"],
    ["log.hitLeader", "p1", "combat.hit"],
    ["log.characterTrashed", "p1", "card.destroy"],
    ["log.turnStart", "system", "turn.change"],
  ] as const)("maps %s to %s", (key, actor, expected) => {
    expect(narutoAudioCueForLog({ key, actor }, "p1")).toBe(expected);
  });

  it("uses viewer-relative terminal cues", () => {
    expect(narutoAudioCueForLog({ key: "log.victory", actor: "p1" }, "p1")).toBe("game.win");
    expect(narutoAudioCueForLog({ key: "log.victory", actor: "p1" }, "p2")).toBe("game.loss");
  });

  it("keeps silent log entries silent", () => {
    expect(narutoAudioCueForLog({ key: "log.passPriority", actor: "p1" }, "p1")).toBeNull();
  });
});
