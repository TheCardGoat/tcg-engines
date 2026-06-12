import { describe, expect, it } from "bun:test";

import {
  buildFixtureTestRouteHref,
  buildRegressionFixtureTestRouteHref,
  REGRESSION_FIXTURE_INDEX_ROUTE,
  resolveFixtureForTestRoute,
  resolveRegressionFixtureForTestRoute,
} from "./test-routes.js";

describe("test-routes", () => {
  it("builds fixture routes under /tests", () => {
    expect(buildFixtureTestRouteHref("card-states")).toBe("/tests/card-states");
    expect(buildFixtureTestRouteHref("player-selection")).toBe("/tests/player-selection");
  });

  it("builds regression fixture routes under /tests/regressions", () => {
    expect(buildRegressionFixtureTestRouteHref("ward-hidden-zone-selection")).toBe(
      "/tests/regressions/ward-hidden-zone-selection",
    );
    expect(REGRESSION_FIXTURE_INDEX_ROUTE).toBe("/tests/regressions");
  });

  it("resolves registered fixtures for dynamic test routes", () => {
    const fixture = resolveFixtureForTestRoute("card-states");

    expect(fixture?.id).toBe("card-states");
    expect(fixture?.name).toBe("Card States Demo");
  });

  it("resolves the modal abilities fixture route", () => {
    const fixture = resolveFixtureForTestRoute("modal-abilities");

    expect(fixture?.id).toBe("modal-abilities");
    expect(fixture?.name).toBe("Modal Abilities");
  });

  it("resolves the player-selection fixture route", () => {
    const fixture = resolveFixtureForTestRoute("player-selection");

    expect(fixture?.id).toBe("player-selection");
    expect(fixture?.name).toBe("Player Selection");
  });

  it("resolves the 2026-05-14 daily triage visual fixtures", () => {
    const fixtureIds = [
      "triage-2026-05-14-luisa-confident-climber",
      "triage-2026-05-14-bibbidi-bobbidi-boo",
      "triage-2026-05-14-captain-hook-underhanded",
      "triage-2026-05-14-the-family-scattered",
    ];

    for (const fixtureId of fixtureIds) {
      expect(resolveFixtureForTestRoute(fixtureId)?.id).toBe(fixtureId);
      expect(buildFixtureTestRouteHref(fixtureId)).toBe(`/tests/${fixtureId}`);
    }
  });

  it("resolves the Hand-in-the-Box Spring-Loaded visual fixture", () => {
    const fixtureId = "triage-2026-05-15-hand-in-the-box-spring-loaded";

    expect(resolveFixtureForTestRoute(fixtureId)?.id).toBe(fixtureId);
    expect(buildFixtureTestRouteHref(fixtureId)).toBe(`/tests/${fixtureId}`);
  });

  it("resolves the 2026-05-18 Luisa and Mulan move-damage visual fixture", () => {
    const fixtureId = "triage-2026-05-18-luisa-mulan-move-damage";
    const fixture = resolveFixtureForTestRoute(fixtureId);

    expect(fixture?.id).toBe(fixtureId);
    expect(buildFixtureTestRouteHref(fixtureId)).toBe(`/tests/${fixtureId}`);
    expect(fixture?.playerOne.play).toEqual([
      expect.objectContaining({ damage: 0 }),
      expect.objectContaining({ damage: 2 }),
      expect.objectContaining({ damage: 2 }),
    ]);
  });

  it("resolves the 2026-05-18 daily feedback visual fixtures", () => {
    const fixtureIds = [
      "triage-2026-05-18-firefly-swarm-choice",
      "triage-2026-05-18-firefly-swarm-discard-metric",
      "triage-2026-05-18-education-or-elimination-choice",
      "triage-2026-05-18-megabot-destroy-choice",
      "triage-2026-05-18-black-cauldron-mufasa",
      "triage-2026-05-18-luisa-undamaged-source",
    ];

    for (const fixtureId of fixtureIds) {
      expect(resolveFixtureForTestRoute(fixtureId)?.id).toBe(fixtureId);
      expect(buildFixtureTestRouteHref(fixtureId)).toBe(`/tests/${fixtureId}`);
    }
  });

  it("resolves the 2026-05-20 Simba and Cinderella free-play visual fixture", () => {
    const fixtureId = "triage-2026-05-20-simba-cinderella-free-play";
    const fixture = resolveFixtureForTestRoute(fixtureId);

    expect(fixture?.id).toBe(fixtureId);
    expect(buildFixtureTestRouteHref(fixtureId)).toBe(`/tests/${fixtureId}`);
    expect(fixture?.playerOne.inkwell).toBe(3);
    expect(fixture?.playerOne.play).toHaveLength(2);
    expect(fixture?.playerOne.deck).toHaveLength(3);
  });

  it("resolves the 2026-05-20 Fergus discard-location visual fixture", () => {
    const fixtureId = "triage-2026-05-20-fergus-discard-location";
    const fixture = resolveFixtureForTestRoute(fixtureId);

    expect(fixture?.id).toBe(fixtureId);
    expect(buildFixtureTestRouteHref(fixtureId)).toBe(`/tests/${fixtureId}`);
    expect(fixture?.playerOne.hand).toEqual([]);
    expect(fixture?.playerOne.play).toHaveLength(1);
    expect(fixture?.playerOne.discard).toHaveLength(1);
  });

  it("resolves the 2026-05-22 manual validation visual fixtures", () => {
    const fixtureIds = [
      "triage-2026-05-22-woody-under-the-sea-toy-followup",
      "triage-2026-05-22-liquidator-turn-one-expectation",
    ];

    for (const fixtureId of fixtureIds) {
      expect(resolveFixtureForTestRoute(fixtureId)?.id).toBe(fixtureId);
      expect(buildFixtureTestRouteHref(fixtureId)).toBe(`/tests/${fixtureId}`);
    }
  });

  it("resolves the 2026-05-17 daily feedback remaining-item visual fixtures", () => {
    const fixtureIds = [
      "triage-2026-05-17-tiana-dale-bot-challenge",
      "triage-2026-05-17-kristoffs-lute-play-top",
      "triage-2026-05-17-leviathan-return-of-hercules",
      "triage-2026-05-17-hamm-piggy-bank-exert",
      "triage-2026-05-17-mirabel-curious-child-reveal",
      "triage-2026-05-17-bibbidi-another-character",
      "triage-2026-05-17-hades-target-clarity",
      "triage-2026-05-17-cheshire-cat-boost-move-one",
      "triage-2026-05-17-wind-up-frog-toy-banish",
      "triage-2026-05-17-lyle-dirty-tricks",
      "triage-2026-05-17-sid-double-prizes",
      "triage-2026-05-17-under-the-sea-sing-together",
    ];

    for (const fixtureId of fixtureIds) {
      expect(resolveFixtureForTestRoute(fixtureId)?.id).toBe(fixtureId);
      expect(buildFixtureTestRouteHref(fixtureId)).toBe(`/tests/${fixtureId}`);
    }
  });

  it("resolves the Beyond the Horizon empty-hand visual fixture", () => {
    const fixtureId = "triage-2026-05-18-beyond-the-horizon-empty-hand";

    expect(resolveFixtureForTestRoute(fixtureId)?.id).toBe(fixtureId);
    expect(buildFixtureTestRouteHref(fixtureId)).toBe(`/tests/${fixtureId}`);
  });

  it("returns undefined for unknown fixture routes", () => {
    expect(resolveFixtureForTestRoute("does-not-exist")).toBeUndefined();
  });

  it("resolves registered regression fixtures for dynamic test routes", () => {
    const fixture = resolveRegressionFixtureForTestRoute("ward-hidden-zone-selection");

    expect(fixture?.id).toBe("ward-hidden-zone-selection");
    expect(fixture?.name).toBe("Ward Hidden Zone Selection");
  });

  it("resolves the Leviathan's Lair hand-vs-play regression route", () => {
    const fixtureId = "leviathans-lair-hand-vs-play";
    const fixture = resolveRegressionFixtureForTestRoute(fixtureId);

    expect(fixture?.id).toBe(fixtureId);
    expect(buildRegressionFixtureTestRouteHref(fixtureId)).toBe(`/tests/regressions/${fixtureId}`);
  });

  it("resolves the Merida plus Mosquito Bite put-damage regression route", () => {
    const fixtureId = "merida-mosquito-bite-put-damage";
    const fixture = resolveRegressionFixtureForTestRoute(fixtureId);

    expect(fixture?.id).toBe(fixtureId);
    expect(buildRegressionFixtureTestRouteHref(fixtureId)).toBe(`/tests/regressions/${fixtureId}`);
  });

  it("resolves the Desperate Plan discard-choice regression route", () => {
    const fixtureId = "bug-66-desperate-plan-discard-step";
    const fixture = resolveRegressionFixtureForTestRoute(fixtureId);

    expect(fixture?.id).toBe(fixtureId);
    expect(buildRegressionFixtureTestRouteHref(fixtureId)).toBe(`/tests/regressions/${fixtureId}`);
  });

  it("returns undefined for unknown regression fixture routes", () => {
    expect(resolveRegressionFixtureForTestRoute("does-not-exist")).toBeUndefined();
  });
});
