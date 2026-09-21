import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { vynnset } from "../heroes/vynnset.ts";
import { viseraiRuneBlood } from "../heroes/viserai-rune-blood.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { autumnSTouchBlue } from "./autumn-s-touch.ts";
import { browbeatBlue } from "./browbeat.ts";
import { cullRed } from "./cull.ts";

describe("Cull (HNT259) AAA", () => {
  it("happy: each hero banishes a card from their hand", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [cullRed, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [autumnSTouchBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);
    const Dash = game.as(dash);

    Vynnset.play(cullRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Vynnset, nimblismBlue).toBeBanished();
    expectFabCard(Dash, autumnSTouchBlue).toBeBanished();
    expectFabCard(Vynnset, cullRed).toBeIn("graveyard");
    expectFabPlayer(Vynnset).toHaveHandCount(0);
    expectFabPlayer(Dash).toHaveHandCount(0);
  });

  it("happy: you may play this from your banished zone", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [nimblismBlue],
        banished: [cullRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [autumnSTouchBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.play(cullRed, { from: "banished" });
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Vynnset, nimblismBlue).toBeBanished();
    expectFabCard(Vynnset, cullRed).toBeIn("graveyard");
  });

  it("boundary: without a hero having lost {h} this turn it is not an instant", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [cullRed, nimblismBlue],
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [autumnSTouchBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    expect(() => Vynnset.play(cullRed)).toThrow();
    expectFabCard(Vynnset, cullRed).toBeIn("hand");
  });

  it("seat: with an empty own hand the opponent is asked to banish from their own hand", () => {
    const game = FabTestEngine.start(
      {
        hero: viseraiRuneBlood,
        hand: [cullRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue, autumnSTouchBlue, browbeatBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viseraiRuneBlood);
    const Dash = game.as(dash);

    Viserai.play(cullRed);
    // CR 1.8.6: each instructed hero determines their own pick. Cull's
    // controller has no hand left, so the only chooser is Dash — over his own
    // hand, never the controller over Dash's cards.
    // The sequence-prefix flush can re-ask the same pick on later passes;
    // answer every Cull ask as the same seat (advanceToDecision throws on any
    // wrong-seat decision) while draining priority manually. Unrelated
    // optional asks (end-phase arsenal load) are declined as choose-none.
    for (let step = 0; step < 16; step += 1) {
      const wait = game.waitState();
      console.log(
        `[step ${step}] kind=${wait.kind}`,
        wait.kind === "decision"
          ? `d=${wait.decision.kind} actor=${(wait.decision as unknown as { actorId: string }).actorId} label="${(wait.decision as unknown as { label: string }).label}"`
          : "",
      );
      if (wait.kind === "decision") {
        const decision = wait.decision;
        if (decision.kind !== "entity-target" || !decision.label.includes("Cull")) {
          game.as(dash).target();
          continue;
        }
        game.advanceToDecision(Dash, "entity-target");
        Dash.target(autumnSTouchBlue);
        continue;
      }
      if (wait.kind === "priority") {
        game.passBoth();
        continue;
      }
      if (wait.kind === "resolving") {
        continue;
      }
      break;
    }
    expectFabCard(Dash, autumnSTouchBlue).toBeBanished();
    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
    expectFabCard(Dash, browbeatBlue).toBeIn("hand");
    expectFabCard(Viserai, cullRed).toBeIn("graveyard");
  });
});
