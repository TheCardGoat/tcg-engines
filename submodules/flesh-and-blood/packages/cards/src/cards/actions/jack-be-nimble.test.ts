import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../shared/test-recipients.ts";
import { dash } from "../heroes/dash.ts";
import { copper } from "../tokens/copper.ts";
import { nimblismBlue } from "./nimblism.ts";
import { jackBeNimbleRed } from "./jack-be-nimble.ts";

describe("Jack Be Nimble (SEA201) AAA", () => {
  it("happy: banishing a Nimblism from graveyard grants +1{p} and go again", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [jackBeNimbleRed],
        graveyard: [nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(jackBeNimbleRed);
    if (game.pendingDecision()?.kind === "ordering") {
      game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: true });
    } else {
      game.advanceToDecision(Briar, "boolean");
      Briar.accept();
      if (game.pendingDecision()?.kind === "entity-target") Briar.target(nimblismBlue);
    }

    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    expect(game.combat()?.activeLink?.keywords ?? []).toContain("go-again");
    expectFabCard(Briar, nimblismBlue).toBeBanished();
    game.helpers.resolveUntilIdle({ optionalBoolean: false, ordering: "listed" });

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabPlayer(Briar).toHaveAP(1);
  });

  it("boundary: without a Nimblism this stays at 3 power and spends the action point", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [jackBeNimbleRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(jackBeNimbleRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
    game.helpers.resolveUntilIdle({ optionalBoolean: false, ordering: "listed" });

    expectFabPlayer(game.as(dash)).toHaveLife(17);
    expectFabPlayer(Briar).toHaveAP(0);
  });

  it("synergy: when this hits a hero, steal an item they control", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [jackBeNimbleRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, arena: [copper], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.attackWith(jackBeNimbleRed);
    game.helpers.resolveUntilIdle({
      optionalBoolean: false,
      entityTargets: "minimum",
      ordering: "listed",
    });

    expectFabCard(Briar, copper).toBeIn("arena");
    expect(Dash.zone("arena")).not.toContain(copper.canonicalId);
  });
});
