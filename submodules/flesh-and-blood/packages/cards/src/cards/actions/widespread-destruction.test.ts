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
import { widespreadDestructionYellow } from "./widespread-destruction.ts";

describe("Widespread Destruction (DTD138) AAA", () => {
  it("happy: when the chain closes, a hero who lost {h} banishes a card from arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [widespreadDestructionYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arsenal: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(vynnset).attackWith(widespreadDestructionYellow);
    Dash.defendWith(); // unblocked 6{p} hit
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    game.helpers.resolveRestOfCombat();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(14);
    expectFabCard(Dash, nimblismBlue).toBeBanished();
  });

  it("boundary: a hero who did not lose {h} keeps their arsenal card", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [widespreadDestructionYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [brutalAssaultBlue, brutalAssaultBlue],
        arsenal: [nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(vynnset).attackWith(widespreadDestructionYellow);
    game.advanceCombatTo("defend");
    Dash.defendWith([brutalAssaultBlue, brutalAssaultBlue]);
    game.helpers.resolveRestOfCombat();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Dash, nimblismBlue).toBeIn("arsenal");
  });

  it("timing: Rune Gate lets you play this from banished when you control enough Runechants", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        banished: [widespreadDestructionYellow],
        arena: [runechant, runechant, runechant],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(vynnset).attackWith(widespreadDestructionYellow, { from: "banished" });
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
  });

  it("seat: the qualifying hero is asked to banish a card from their own arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [widespreadDestructionYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arsenal: [brutalAssaultBlue, autumnSTouchBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(vynnset).attackWith(widespreadDestructionYellow);
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
    expectFabCard(Dash, autumnSTouchBlue).toBeIn("arsenal");
  });
});
