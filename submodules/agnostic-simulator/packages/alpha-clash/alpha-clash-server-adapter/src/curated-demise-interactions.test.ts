import { expect, it } from "vitest";
import { clashCard, getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
const demise = getCard("ac-ac4-030");
const body = clashCard({
  id: "demise-adapter-body",
  name: "Body",
  affiliation: "alpha",
  colors: [],
  cost: { total: 0 },
  attack: 1,
  defense: 8,
});
it.each([false, true])(
  "I am Demise keeps its two target declarations distinct (reversed: %s)",
  (reversed) => {
    const g = Spec.fromFixture({
      definitions: [body],
      playerOne: { hand: [demise], resource: [demise, demise], clash: [body] },
      playerTwo: { clash: [body] },
    });
    const engine = new AlphaClashServerEngine(g.state, { p1: "player-one", p2: "player-two" });
    const view = engine.getInteractionView("p1");
    const action = view.actions.find(
      (a) => a.id === `playCard:${g.playerOne.hand(demise).instanceId}`,
    )!;
    const own = g.playerOne.at(body, "clash").instanceId,
      enemy = g.playerTwo.at(body, "clash").instanceId;
    for (const [key, id] of [
      ["targetId", own],
      ["targetIds", enemy],
    ]) {
      const input = action.inputs.find((i) => i.id === key);
      expect(input?.kind).toBe("entity-selection");
      if (input?.kind !== "entity-selection") throw new Error("Missing target input");
      expect(input.candidates.map((c) => c.entity.instanceId)).toEqual([id]);
    }
    expect(action.inputs.find((input) => input.id === "resourcePayment")).toMatchObject({
      kind: "option-selection",
      min: 2,
      max: 2,
    });
    const resourcePayment = g.playerOne
      .instances(demise)
      .filter((card) => card.zone === "resource")
      .map((card) => JSON.stringify([card.instanceId, "black"]));
    const before = structuredClone(engine.state);
    const result = engine.submitInteraction(
      "p1",
      buildInteractionSubmission({
        view,
        action,
        values: {
          targetId: [reversed ? enemy : own],
          targetIds: [reversed ? own : enemy],
          resourcePayment,
        },
      }),
      { gameId: "curated-demise", sourceAuthority: "server" },
    );
    expect(result.success, JSON.stringify(result)).toBe(!reversed);
    if (reversed) {
      expect(engine.state).toEqual(before);
      return;
    }
    expect(result.acceptedMoveRecord?.processedCommand).toMatchObject({
      targetId: own,
      targetIds: [enemy],
    });
    for (let i = 0; i < 20 && engine.state.responseWindow; i++)
      expect(
        engine.dispatch(
          "pass",
          engine.getActivePlayerId()!,
          {},
          { gameId: "curated-demise", sourceAuthority: "server" },
        ).success,
      ).toBe(true);
    expect(engine.state.cards[own].zone).toBe("oblivion");
    expect(engine.state.cards[enemy].zone).toBe("oblivion");
  },
);
