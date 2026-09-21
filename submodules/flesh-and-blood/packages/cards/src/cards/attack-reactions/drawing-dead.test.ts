import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kassai } from "../heroes/kassai.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { browbeatBlue } from "../actions/browbeat.ts";
import { durendal } from "../weapons/durendal.ts";
import { drawingDeadYellow } from "./drawing-dead.ts";

/**
 * Drawing Dead, Yellow (MPW044) — Warrior Attack Reaction, cost 0, 3{d}.
 *
 * Printed: "Target sword attack gets +1{p} and wagers with the defending
 * hero. The winner discards a card."
 */

describe("Drawing Dead (MPW044) AAA", () => {
  it("happy: the targeted sword gets +1{p} and wagers", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [durendal],
        hand: [drawingDeadYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    Kassai.activateAttack(durendal);
    game.toReaction();
    Kassai.must.playReaction(drawingDeadYellow);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Kassai, drawingDeadYellow).toBeIn("graveyard");
  });

  it("boundary: a Generic attack action is not a legal sword attack (silent no-op)", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [drawingDeadYellow, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    Kassai.must.playAttack(snatchRed);
    game.toReaction();
    expectFabUnplayable(() => Kassai.must.playReaction(drawingDeadYellow));

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Kassai, drawingDeadYellow).toBeIn("hand");
  });

  it("timing: still defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: kassai, hand: [drawingDeadYellow], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Kassai = game.as(kassai);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Kassai.defendWith([drawingDeadYellow]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Kassai).toHaveLife(19);
    expectFabCard(Kassai, drawingDeadYellow).toBeIn("graveyard");
  });

  it("seat: a hit makes the wager winner (attacker) discard from their own hand", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [durendal],
        hand: [drawingDeadYellow, nimblismBlue, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);
    const Dash = game.as(dash);

    Kassai.activateAttack(durendal);
    game.toReaction();
    Kassai.must.playReaction(drawingDeadYellow);
    // Drive to the wager prize: the winner (Kassai on the hit) is asked over
    // her own hand; unrelated asks are declined as choose-none.
    for (let step = 0; step < 32; step += 1) {
      const wait = game.waitState();
      if (wait.kind === "decision") {
        const d = wait.decision;
        if (d.kind === "entity-target" && d.label.includes("Durendal")) {
          const seat = d.actorId === Kassai.id ? Kassai : Dash;
          game.advanceToDecision(seat, "entity-target");
          seat.target(seat === Kassai ? nimblismBlue : brutalAssaultBlue);
          continue;
        }
        if (d.kind === "entity-target" && d.min === 0) {
          game.as(kassai).target();
          continue;
        }
        break;
      }
      if (wait.kind === "priority") {
        game.passBoth();
        continue;
      }
      if (wait.kind === "resolving") continue;
      if (wait.kind === "defense-declaration") {
        Dash.defendWith(); // no blocks — Kassai wins the wager on the hit
        continue;
      }
      break;
    }

    expectFabPlayer(Dash).toHaveLife(16); // 4{p} hit
    expectFabCard(Kassai, nimblismBlue).toBeIn("graveyard");
    expectFabCard(Kassai, snatchRed).toBeIn("hand");
  });

  it("seat: a miss makes the defending wager winner discard from their own hand", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [durendal],
        hand: [drawingDeadYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [nimblismBlue, brutalAssaultBlue, browbeatBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);
    const Dash = game.as(dash);

    Kassai.activateAttack(durendal);
    Dash.defendWith(nimblismBlue, brutalAssaultBlue); // blocked — Dash wins the wager
    game.toReaction();
    Kassai.must.playReaction(drawingDeadYellow);
    // The winner is the DEFENDER, not the reaction's controller: Dash is asked
    // over his own hand (his last remaining card).
    for (let step = 0; step < 32; step += 1) {
      const wait = game.waitState();
      console.log(
        `[miss ${step}] ${wait.kind}`,
        wait.kind === "decision"
          ? `d=${wait.decision.kind} actor=${(wait.decision as unknown as { actorId: string }).actorId} label="${(wait.decision as unknown as { label: string }).label}"`
          : "",
      );
      if (wait.kind === "decision") {
        const d = wait.decision;
        if (d.kind === "entity-target" && d.label.includes("Durendal")) {
          const seat = d.actorId === Kassai.id ? Kassai : Dash;
          game.advanceToDecision(seat, "entity-target");
          seat.target(seat === Kassai ? snatchRed : browbeatBlue);
          continue;
        }
        if (d.kind === "entity-target" && d.min === 0) {
          game.as(dash).target();
          continue;
        }
        break;
      }
      if (wait.kind === "priority") {
        game.passBoth();
        continue;
      }
      if (wait.kind === "resolving") continue;
      if (wait.kind === "defense-declaration") {
        Dash.defendWith();
        continue;
      }
      break;
    }

    expectFabPlayer(Dash).toHaveLife(20); // blocked
    expectFabCard(Dash, brutalAssaultBlue).toBeIn("graveyard"); // defended
    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard"); // defended
    expectFabCard(Dash, browbeatBlue).toBeIn("graveyard"); // the winner's discard
  });
});
