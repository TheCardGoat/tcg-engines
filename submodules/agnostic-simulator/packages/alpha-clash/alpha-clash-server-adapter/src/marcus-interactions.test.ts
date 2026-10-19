import { expect, it } from "vite-plus/test";
import { action, getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import {
  EngineInteractionView,
  INTERACTION_PROTOCOL_VERSION,
  type InteractionSubmission,
} from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";

const marcus = getCard("ac-pg-003");
const haven = getCard("ac-ac1-055");
const incoming = action({
  id: "adapter-marcus-action",
  name: "Incoming Action",
  colors: [],
  cost: { total: 0 },
  subtype: "basic",
  effects: [{ type: "gainHealth", controller: "friendly", amount: 5 }],
});
const context = { gameId: "marcus", sourceAuthority: "server" as const };
function fixture() {
  const g = Spec.fromFixture({
    definitions: [incoming],
    playerOne: { hand: [incoming], health: 20 },
    playerTwo: { clash: [marcus, haven, haven] },
  });
  g.playerOne.play(incoming);
  return {
    engine: new AlphaClashServerEngine(g.state, { p1: "player-one", p2: "player-two" }),
    partners: g.playerTwo.instances(haven).map((card) => card.instanceId),
    source: g.playerTwo.at(marcus, "clash").instanceId,
  };
}
function submit(
  engine: AlphaClashServerEngine,
  prefix: string,
  values: InteractionSubmission["values"],
) {
  const view = engine.getInteractionView("p2");
  expect(EngineInteractionView.safeParse(view).success).toBe(true);
  const action = view.actions.find((action) => action.id.startsWith(prefix));
  if (!action) throw new Error(`Missing ${prefix}`);
  return engine.submitInteraction(
    "p2",
    {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      stateVersion: view.stateVersion,
      requestId: action.requestId,
      actionId: action.id,
      values,
    },
    context,
  );
}
function settle(engine: AlphaClashServerEngine) {
  for (
    let i = 0;
    i < 30 && engine.state.responseWindow && !engine.state.pendingChoices.length;
    i++
  ) {
    const actor = engine.getActivePlayerId();
    if (!actor) throw new Error("Missing response actor");
    expect(engine.dispatch("pass", actor, {}, context).success).toBe(true);
  }
}

it("Marcus exposes distinct same-name partners and submits the selected pair's Oblivion order", () => {
  const { engine, partners, source } = fixture();
  expect(submit(engine, `activateAbility:${source}:0`, {}).success).toBe(true);
  settle(engine);
  const view = engine.getInteractionView("p2");
  const input = view.actions.find((a) => a.id.startsWith("resolveChoice:"))?.inputs[0];
  if (input?.kind !== "option-selection") throw new Error("Expected partner options");
  expect(input.options.map((o) => o.entity?.instanceId)).toEqual([...partners, undefined]);
  expect(submit(engine, "resolveChoice:", { selection: [input.options[1]!.id] }).success).toBe(
    true,
  );
  const before = structuredClone(engine.state);
  expect(submit(engine, "resolveChoice:", { order: [source] }).success).toBe(false);
  expect(engine.state).toEqual(before);
  expect(submit(engine, "resolveChoice:", { order: [partners[1]!, source] }).success).toBe(true);
  settle(engine);
  expect(engine.state.cards[partners[0]!].zone).toBe("clash");
  expect(engine.state.oblivionOrder["player-two"].slice(0, 2)).toEqual([partners[1], source]);
  expect(engine.state.players["player-one"].health).toBe(20);
});

it("Marcus's adapter choice can decline without consuming either card", () => {
  const { engine, partners, source } = fixture();
  expect(submit(engine, `activateAbility:${source}:0`, {}).success).toBe(true);
  settle(engine);
  const choice = engine.state.pendingChoices[0]!;
  if (choice.kind !== "modal") throw new Error("Expected optional send");
  const decline = choice.options.find((option) => option.label === "Do not send")!;
  expect(submit(engine, "resolveChoice:", { selection: [decline.id] }).success).toBe(true);
  settle(engine);
  expect(engine.state.cards[source].zone).toBe("clash");
  expect(partners.every((id) => engine.state.cards[id].zone === "clash")).toBe(true);
  expect(engine.state.players["player-one"].health).toBe(25);
});

it.each(["meta-v1", "meta-v2", "meta-v3", "expert-oracle"])(
  "%s finishes an Action response when Marcus has no partner",
  (strategyId) => {
    const g = Spec.fromFixture({
      definitions: [incoming],
      playerOne: { hand: [incoming], health: 20 },
      playerTwo: { clash: [marcus] },
    });
    g.playerOne.play(incoming);
    const engine = new AlphaClashServerEngine(g.state, { p1: "player-one", p2: "player-two" });
    for (let i = 0; i < 12 && engine.state.standby.length; i++) {
      expect(engine.takeAutomatedAction({ strategyId }, context).finalResult.success).toBe(true);
    }
    expect(engine.state.standby).toHaveLength(0);
    expect(engine.state.players["player-one"].health).toBe(25);
  },
);

it("the recommended bot still uses Marcus when a sendable partner is available", () => {
  const { engine, source } = fixture();
  for (
    let i = 0;
    i < 12 && (engine.state.standby.length || engine.state.pendingChoices.length);
    i++
  ) {
    expect(engine.takeAutomatedAction({ strategyId: "meta-v1" }, context).finalResult.success).toBe(
      true,
    );
  }
  expect(engine.state.standby).toHaveLength(0);
  expect(engine.state.cards[source].zone).toBe("oblivion");
  expect(engine.state.players["player-one"].health).toBe(20);
});
