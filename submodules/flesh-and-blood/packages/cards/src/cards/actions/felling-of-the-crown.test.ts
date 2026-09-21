import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../shared/test-recipients.ts";
import { dash } from "../heroes/dash.ts";
import { autumnSTouchBlue } from "./autumn-s-touch.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { fellingOfTheCrownRed } from "./felling-of-the-crown.ts";

describe("Felling of the Crown (ROS031) AAA", () => {
  it("happy: 4 Earth cards in banished give this +4 power", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [fellingOfTheCrownRed],
        banished: [autumnSTouchBlue, autumnSTouchBlue, autumnSTouchBlue, autumnSTouchBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(fellingOfTheCrownRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(8);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(12);
    expectFabCard(Briar, fellingOfTheCrownRed).toBeIn("graveyard");
  });

  it("boundary: fewer than 4 Earth cards in banished stay at printed 4 power", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [fellingOfTheCrownRed],
        banished: [autumnSTouchBlue, autumnSTouchBlue, autumnSTouchBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(fellingOfTheCrownRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("timing: declining decompose leaves both hands untouched", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [fellingOfTheCrownRed, snatchRed],
        graveyard: [autumnSTouchBlue, autumnSTouchBlue, autumnSTouchBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(fellingOfTheCrownRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(Briar.zone("graveyard")).toHaveLength(4);
    expectFabPlayer(Briar).toHaveHandCount(1);
    expectFabPlayer(game.as(dash)).toHaveHandCount(1);
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("seat: decompose asks each hero to bottom a card from their own hand", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [fellingOfTheCrownRed, autumnSTouchBlue, nimblismBlue],
        graveyard: [autumnSTouchBlue, autumnSTouchBlue, snatchRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [snatchRed, brutalAssaultBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    // playAttack (unlike the legacy attackWith) never answers on the test's
    // behalf: the Decompose optional must actually ask.
    Briar.playAttack(fellingOfTheCrownRed, { stopAt: "on-attack" });
    // Decompose cost (2 Earth + 1 action) is fully determined: exactly two
    // Earth and one action in the graveyard (CR 1.8.6c). The per-hero bottom
    // picks follow — Briar first (CR 1.8.6a). The sequence-prefix flush may
    // re-ask a pick, so answer every ask as the seat the engine names.
    for (let step = 0; step < 96; step += 1) {
      const wait = game.waitState();
      if (wait.kind === "decision") {
        const decision = wait.decision;
        if (decision.kind === "boolean") {
          Briar.accept(); // decompose
          continue;
        }
        if (decision.kind !== "entity-target") break;
        const seat = decision.actorId === Briar.id ? Briar : Dash;
        if (!decision.label.includes("Felling")) {
          seat.target(); // unrelated optional ask (arsenal load): choose none
          continue;
        }
        game.advanceToDecision(seat, "entity-target");
        seat.target(seat === Briar ? autumnSTouchBlue : snatchRed);
        continue;
      }
      if (wait.kind === "priority") {
        game.passBoth();
        continue;
      }
      if (wait.kind === "resolving") continue;
      if (wait.kind === "defense-declaration") {
        Dash.defendWith(); // unblocked hit
        continue;
      }
      break;
    }

    // Both bottoms landed; hand counts roll with the next draw step so they
    // are not asserted here.
    expect(Briar.zone("deck")[0]).toBe(autumnSTouchBlue.canonicalId);
    expect(Dash.zone("deck")[0]).toBe(snatchRed.canonicalId);
    expect(Dash.zone("hand")).toContain(brutalAssaultBlue.canonicalId);
    expectFabPlayer(Dash).toHaveLife(16);
  });
});
