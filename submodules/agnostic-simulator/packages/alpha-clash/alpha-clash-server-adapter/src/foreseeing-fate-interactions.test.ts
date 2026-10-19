import { expect, it } from "vite-plus/test";
import { getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
const first = getCard("ac-ac1-051"),
  second = getCard("ac-ac1-057");
const context = { gameId: "foreseeing-fate", sourceAuthority: "server" as const };
it.each(["ac-ac1-061", "ac-ac1-062"])(
  "%s exposes activation and both deck decisions through saved interactions",
  (cardId) => {
    const fate = getCard(cardId);
    const g = Spec.fromFixture({
      playerOne: { clash: [{ card: fate, ready: false }], deck: [first, second, first] },
    });
    const [firstId, secondId, lastId] = g.state.deckOrder["player-one"];
    let engine = new AlphaClashServerEngine(g.state, { p1: "player-one", p2: "player-two" });
    const view = engine.getInteractionView("p1"),
      action = view.actions.find(
        (a) => a.id === `activateAbility:${g.playerOne.at(fate, "clash").instanceId}:1`,
      );
    if (!action) throw Error("Missing activation");
    expect(
      engine.submitInteraction(
        "p1",
        buildInteractionSubmission({ view, action, values: {} }),
        context,
      ).success,
    ).toBe(true);
    engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(engine.state)), {
      p1: "player-one",
      p2: "player-two",
    });
    for (const label of [second.name, "bottom of deck"]) {
      const current = engine.getInteractionView("p1"),
        choice = current.actions.find((a) => a.id.startsWith("resolveChoice:"));
      if (!choice) throw Error("Missing deck choice");
      if (label === "bottom of deck") {
        expect(choice.inputs.find((i) => i.id === "deckOrder")?.kind).toBe("entity-partition");
        expect(
          engine.submitInteraction(
            "p1",
            buildInteractionSubmission({
              view: current,
              action: choice,
              values: { deckOrder: { bottom: [firstId] } },
            }),
            context,
          ).success,
        ).toBe(true);
        continue;
      }
      const input = choice.inputs.find((i) => i.id === "selection");
      if (input?.kind !== "option-selection") throw Error("Missing selection");
      const option = input.options.find((o) => o.text?.key.includes(label));
      if (!option) throw Error(`Missing ${label}`);
      expect(
        engine.submitInteraction(
          "p1",
          buildInteractionSubmission({
            view: current,
            action: choice,
            values: { selection: [option.id] },
          }),
          context,
        ).success,
      ).toBe(true);
    }
    expect(engine.state.cards[secondId].zone).toBe("hand");
    expect(engine.state.deckOrder["player-one"]).toEqual([lastId, firstId]);
    const before = structuredClone(engine.state);
    const fresh = engine.getInteractionView("p1"),
      again = fresh.actions.find((a) => a.id === action.id);
    if (again)
      expect(
        engine.submitInteraction(
          "p1",
          buildInteractionSubmission({ view: fresh, action: again, values: {} }),
          context,
        ).success,
      ).toBe(false);
    expect(engine.state).toEqual(before);
  },
);
