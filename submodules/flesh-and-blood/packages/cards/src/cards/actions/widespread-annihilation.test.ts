import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { vynnset } from "../heroes/vynnset.ts";
import { dash } from "../heroes/dash.ts";
import { runechant } from "../tokens/runechant.ts";
import { nimblismBlue } from "./nimblism.ts";
import { autumnSTouchBlue } from "./autumn-s-touch.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { widespreadAnnihilationBlue } from "./widespread-annihilation.ts";

describe("Widespread Annihilation (DTD137) AAA", () => {
  it("happy: when the chain closes, a hero who lost {h} banishes a card from hand", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [widespreadAnnihilationBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(vynnset).attackWith(widespreadAnnihilationBlue);
    Dash.defendWith(); // unblocked 6{p} hit
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    game.helpers.resolveRestOfCombat();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(14);
    expectFabCard(Dash, nimblismBlue).toBeBanished();
  });

  it("boundary: a hero who did not lose {h} does not banish from hand", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [widespreadAnnihilationBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue, brutalAssaultBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(vynnset).attackWith(widespreadAnnihilationBlue);
    game.advanceCombatTo("defend");
    Dash.defendWith([brutalAssaultBlue, brutalAssaultBlue]);
    game.helpers.resolveRestOfCombat();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Dash.zone("hand")).toHaveLength(0);
    expect(Dash.zone("banished")).toHaveLength(0);
  });

  it("timing: Rune Gate lets you play this from banished when you control enough Runechants", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        banished: [widespreadAnnihilationBlue],
        arena: [runechant, runechant, runechant, runechant],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.attackWith(widespreadAnnihilationBlue, { from: "banished" });
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
  });

  it("seat: the qualifying hero is asked to banish a card from their own hand", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [widespreadAnnihilationBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue, autumnSTouchBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(vynnset).attackWith(widespreadAnnihilationBlue);
    // Only Dash lost {h} (the 6{p} hit). CR 1.8.6: Dash determines his own
    // pick — the controller is never asked over Dash's cards, and the
    // sequence-prefix flush may re-ask, so answer every ask as Dash.
    for (let step = 0; step < 24; step += 1) {
      const wait = game.waitState();
      if (wait.kind === "decision") {
        const decision = wait.decision;
        if (decision.kind !== "entity-target" || !decision.label.includes("Widespread")) {
          Dash.target(); // unrelated optional ask (arsenal load): choose none
          continue;
        }
        game.advanceToDecision(Dash, "entity-target");
        Dash.target(brutalAssaultBlue);
        continue;
      }
      if (wait.kind === "priority") {
        game.passBoth();
        continue;
      }
      if (wait.kind === "resolving") {
        continue;
      }
      if (wait.kind === "defense-declaration") {
        Dash.defendWith(); // unblocked hit
        continue;
      }
      break;
    }

    expectFabPlayer(Dash).toHaveLife(14);
    expectFabCard(Dash, brutalAssaultBlue).toBeBanished();
    expectFabCard(Dash, autumnSTouchBlue).toBeIn("hand");
  });
});
