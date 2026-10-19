import { describe, expect, it } from "vitest";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveCard,
  GrandArchiveEffect,
} from "@tcg/grand-archive-types";
import {
  GrandArchiveTestEngine,
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "@tcg/grand-archive-engine/testing";
import { divineComedy } from "./divine-comedy.ts";
import { advanceToMain } from "../../../testing/decisions.ts";

// These isolate the printed page effects. Full Divine Comedy activation/Cascade
// acceptance remains separate until the native non-object command is implemented.
function card(
  id: string,
  type: "CHAMPION" | "ALLY" | "ACTION",
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
): GrandArchiveCard<GrandArchiveAbilityDefinition> {
  return {
    canonicalId: id,
    slug: id,
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: `${id}:face:default`,
        catalogId: id,
        name: id,
        cost: { kind: "reserve", amount: 0 },
        typeLine: { types: [type], classes: ["MAGE"], subtypes: [], supertypes: [] },
        elements: ["NORM"],
        stats: { life: 30, power: 1, ...(type === "CHAMPION" ? { level: 0 } : {}) },
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        rulesText: "",
        abilities,
      },
    },
  };
}
const champion = card("divine-page-champion", "CHAMPION");
const ally = card("divine-page-ally", "ALLY", [
  {
    id: "divine-page-draw-a1",
    kind: "activated",
    activation: "ability",
    text: "Draw a card.",
    cost: { kind: "pay-reserve", amount: 0 },
    effect: { kind: "draw", player: "controller", amount: 1 },
  },
]);
const filler = card("divine-page-filler", "ACTION");
function action(id: string, effect: GrandArchiveEffect) {
  return card(id, "ACTION", [{ id: `${id}-a1`, kind: "card-resolution", text: id, effect }]);
}
const wound = action("divine-page-wound", {
  kind: "add-counter",
  subject: { kind: "champion", player: "controller" },
  counter: "damage",
  amount: 6,
});
const negate = card("divine-page-negate", "ACTION", [
  {
    id: "divine-page-negate-a1",
    kind: "card-resolution",
    text: "Negate target triggered ability.",
    targets: [
      {
        id: "trigger",
        kind: "target",
        declared: "announcement",
        chooser: "controller",
        count: { kind: "exactly", amount: 1 },
        unique: true,
        candidates: { kind: "stack-item", itemTypes: ["ability"], abilityKinds: ["triggered"] },
      },
    ],
    effect: { kind: "negate", subject: { kind: "bound", binding: "trigger" } },
  },
]);
function page(number: number) {
  if (divineComedy.layout.kind !== "single-faced") throw new Error("Expected mastery face");
  const ability = divineComedy.layout.face.abilities[0];
  if (ability?.kind !== "activated") throw new Error("Expected activated Cascade");
  const mode = ability.cascade?.modes.find((candidate) => candidate.counts.includes(number));
  if (!mode) throw new Error(`Missing page ${number}`);
  return card(`divine-page-${number}`, "ACTION", [
    {
      id: `divine-page-${number}-a1`,
      kind: "card-resolution",
      text: mode.text,
      effect: mode.effect,
      ...(mode.targets ? { targets: mode.targets } : {}),
      ...(mode.variables ? { variables: mode.variables } : {}),
    },
  ]);
}
function pass(game: GrandArchiveTestEngine) {
  const wait = game.waitState();
  if (wait.kind !== "opportunity") throw new Error(`Expected Opportunity, got ${wait.kind}`);
  game.player(wait.playerId).pass();
}
function drain(game: GrandArchiveTestEngine) {
  for (let i = 0; game.state.stack.length && i < 20; i++) pass(game);
  expect(game.state.stack).toHaveLength(0);
}
function setup(pageCard: ReturnType<typeof page>, field: readonly ReturnType<typeof card>[] = []) {
  return GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: {
        hand: [pageCard, wound, filler, negate],
        "main-deck": [filler, filler, filler, filler],
      },
    },
    playerTwo: {
      champion,
      zones: {
        hand: [filler],
        field: [ally, ...field],
        "main-deck": [filler, filler, filler, filler],
      },
    },
  });
}

describe("Divine Comedy printed page effects", () => {
  it("page 2 rejects a Spellshroud target without changing the match", () => {
    const protectedAlly = card("divine-page-spellshroud", "ALLY", [
      {
        id: "divine-page-spellshroud-a1",
        kind: "static",
        staticKind: "intrinsic",
        text: "Spellshroud",
        keyword: { name: "spellshroud" },
      },
    ]);
    const pageCard = page(2);
    const game = setup(pageCard, [protectedAlly]);
    const before = game.state;
    const p = game.player("player-one");
    expect(
      p.tryExecute({
        move: "activate-card",
        cardId: p.card(pageCard).objectId,
        targets: { "target-1": [game.player("player-two").card(protectedAlly).objectId] },
      }).ok,
    ).toBe(false);
    expect(game.state).toBe(before);
  });

  it("page 2 recovery can be negated after successful destruction", () => {
    const pageCard = page(2);
    const game = setup(pageCard);
    const p = game.player("player-one");
    p.activate(wound);
    drain(game);
    p.activate(pageCard, {
      targets: { "target-1": [game.player("player-two").card(ally).objectId] },
    });
    pass(game);
    pass(game);
    const trigger = game.state.stack[0];
    if (trigger?.kind !== "triggered-ability") throw new Error("Expected recovery trigger");
    p.activate(negate, { targets: { trigger: [trigger.id] } });
    drain(game);
    expect(game.state.objects[p.card(champion).objectId]?.damage).toBe(6);
    expect(game.player("player-two").zone("graveyard")).toHaveLength(1);
  });

  it.each([false, true])(
    "page 2 preserves its destruction requirement across replacement restoration (prevent=%s)",
    (prevent) => {
      const keeper = card("divine-page-prevent", "ALLY", [
        {
          id: "divine-page-prevent-a1",
          kind: "static",
          staticKind: "effects",
          text: "You may prevent destruction.",
          effects: [
            {
              kind: "replacement",
              event: { name: "card-moved", from: "field", to: "graveyard" },
              optionalFor: "controller",
              operation: { kind: "prevent" },
              duration: { kind: "while-source-in-functional-zone" },
            },
          ],
        },
      ]);
      const pageCard = page(2);
      let game = setup(pageCard, [keeper]);
      game.player("player-one").activate(wound);
      drain(game);
      const allyId = game.player("player-two").card(ally).objectId;
      game.player("player-one").activate(pageCard, { targets: { "target-1": [allyId] } });
      pass(game);
      pass(game);
      expect(game.state.decision?.kind).toBe("choose-replacement");
      game = GrandArchiveTestEngine.fromState(
        game.program,
        restoreGrandArchiveMatchSnapshot(
          game.program,
          JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(game.state))),
        ),
      );
      const decision = game.state.decision;
      if (decision?.kind !== "choose-replacement") throw new Error("Expected replacement choice");
      game.player(decision.playerId).execute({
        move: "answer-decision",
        decisionId: decision.id,
        stateVersion: decision.stateVersion,
        answer: prevent,
      });
      drain(game);
      expect(game.state.objects[allyId]?.zone).toBe(prevent ? "field" : "graveyard");
      expect(game.state.objects[game.player("player-one").card(champion).objectId]?.damage).toBe(
        prevent ? 6 : 2,
      );
      expect(
        game.state.eventHistory.filter((event) => event.type === "reflexive-trigger-generated"),
      ).toHaveLength(prevent ? 0 : 1);
    },
  );

  it.each([1, 3])(
    "page %s restricts only opponents' even-cost cards, and expires at the controller's next turn",
    (number) => {
      const pageCard = page(number);
      const game = setup(pageCard);
      game.player("player-one").activate(pageCard);
      drain(game);
      game.player("player-one").activate(filler);
      drain(game);
      game.player("player-one").pass();
      const opponent = game.player("player-two");
      expect(
        opponent.tryExecute({ move: "activate-card", cardId: opponent.card(filler).objectId }).ok,
      ).toBe(false);
      opponent.activateAbility(ally, "divine-page-draw-a1");
      drain(game);
      advanceToMain(game, game.player("player-one").id, game.state.turn.number);
      game.player("player-one").pass();
      opponent.activate(opponent.zone("hand")[0]!);
    },
  );

  it("page 2 destroys first, then exposes a separate recovery trigger to responses", () => {
    const pageCard = page(2);
    const game = setup(pageCard);
    const p = game.player("player-one");
    p.activate(wound);
    drain(game);
    p.activate(pageCard, {
      targets: { "target-1": [game.player("player-two").card(ally).objectId] },
    });
    pass(game);
    pass(game);
    expect(game.state.objects[game.player("player-two").card(ally).objectId]?.zone).toBe(
      "graveyard",
    );
    expect(game.state.objects[p.card(champion).objectId]?.damage).toBe(6);
    expect(game.state.stack).toHaveLength(1);
    expect(game.state.stack[0]?.kind).toBe("triggered-ability");
    drain(game);
    expect(game.state.objects[p.card(champion).objectId]?.damage).toBe(2);
  });

  it("page 2 does not recover when destruction is replaced with banishment", () => {
    const keeper = card("divine-page-banish-instead", "ALLY", [
      {
        id: "divine-page-banish-instead-a1",
        kind: "static",
        staticKind: "effects",
        text: "Banish instead.",
        effects: [
          {
            kind: "replacement",
            event: { name: "card-moved", from: "field", to: "graveyard" },
            duration: { kind: "while-source-in-functional-zone" },
            operation: {
              kind: "replace-with",
              effect: {
                kind: "move",
                subject: { kind: "event-subject" },
                from: "field",
                destination: { zone: "banishment" },
              },
            },
          },
        ],
      },
    ]);
    const pageCard = page(2);
    const game = setup(pageCard, [keeper]);
    const p = game.player("player-one");
    p.activate(wound);
    drain(game);
    p.activate(pageCard, {
      targets: { "target-1": [game.player("player-two").card(ally).objectId] },
    });
    drain(game);
    expect(game.state.objects[game.player("player-two").card(ally).objectId]?.zone).toBe(
      "banishment",
    );
    expect(game.state.objects[p.card(champion).objectId]?.damage).toBe(6);
  });
});
