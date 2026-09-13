/**
 * PEN228 Shattering Grasp — Ice Arms d1 Battleworn.
 *
 * Printed a1: Action — Destroy this: Destroy target frozen ally. Go again.
 *
 * CR 5.2.1–5.2.2: this is an activated Action with destroy-self as its
 * effect-cost. CR 8.5.34 makes the Put on Ice target a frozen Ally, and
 * CR 8.3.5a grants the action point only after the destroy resolves.
 *
 * Status: pending acceptance — public Put on Ice → frozen real Ally →
 * Shattering Grasp destroy, plus the no-frozen-target legality boundary.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { limpitHopALongYellow } from "../../../../../../cards/src/cards/actions/limpit-hop-a-long.ts";
import { putOnIceRed } from "../../../../../../cards/src/cards/actions/put-on-ice.ts";
import { shatteringGrasp } from "../../../../../../cards/src/cards/equipment/shattering-grasp.ts";

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 80; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "entity-target") {
      const ally = decision.candidates.find(
        (candidate) =>
          game.getState().objects[candidate.instanceId]?.canonicalId ===
          limpitHopALongYellow.canonicalId,
      );
      if (!ally && (decision.min ?? 1) > 0) throw new Error("expected Limpit Hop-a-Long target");
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: ally ? [ally.instanceId] : [] },
        },
      });
      continue;
    }
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: true },
        },
      });
      continue;
    }
    if (decision) throw new Error(`unhandled decision ${decision.kind}`);
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const priority = game.getState().priority?.holderPlayerId;
    if (priority) {
      game.exec({ move: "pass", actorId: priority, payload: {} });
      continue;
    }
    return;
  }
  throw new Error("drain exceeded safety limit");
}

function setup(frozen = false) {
  return FabTestEngine.start(
    {
      hero: bravo,
      arms: [shatteringGrasp],
      hand: frozen ? [putOnIceRed] : [],
      actionPoints: frozen ? 2 : 1,
      resourcePoints: frozen ? 1 : 0,
      deck: 6,
    },
    {
      hero: dash,
      hand: [],
      arena: [limpitHopALongYellow],
      deck: 6,
    },
    { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
  );
}

describe("shattering-grasp (PEN228)", () => {
  it("core mechanic: Put on Ice freezes a real Ally, then Action destroy-self destroys it and grants go again", () => {
    const game = setup(true);
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const allyId = Dash.findCardInZone("arena", limpitHopALongYellow);

    Bravo.play(putOnIceRed, { target: allyId });
    drain(game);
    expect(Dash.zone("arena")).toContain(limpitHopALongYellow.canonicalId);
    expect(
      game
        .getState()
        .continuousEffectInstances.some(
          (instance) =>
            instance.atoms.some(
              (atom) =>
                atom.kind === "rule" &&
                atom.mode === "restrict" &&
                atom.parameters.kind === "freeze",
            ) && instance.initialSubjects.some((subject) => subject.instanceId === allyId),
        ),
    ).toBe(true);

    const apBefore = Bravo.actionPoints();
    Bravo.activate(shatteringGrasp);
    drain(game);

    expect(Bravo.zone("arms")).not.toContain(shatteringGrasp.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(shatteringGrasp.canonicalId);
    expect(Dash.zone("arena")).not.toContain(limpitHopALongYellow.canonicalId);
    expect(Dash.zone("graveyard")).toContain(limpitHopALongYellow.canonicalId);
    // The Action spends one AP, and go again returns one when its layer resolves.
    expect(Bravo.actionPoints()).toBe(apBefore);
  });

  it("boundary: the Action cannot be activated when no frozen Ally exists", () => {
    const game = setup();
    expect(() => game.as(bravo).activate(shatteringGrasp)).toThrow();
    expect(game.as(bravo).zone("arms")).toContain(shatteringGrasp.canonicalId);
    expect(game.as(dash).zone("arena")).toContain(limpitHopALongYellow.canonicalId);
  });
});
