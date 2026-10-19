import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "../../testing/test-engine.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";

function card(
  id: string,
  type: "CHAMPION" | "ALLY" | "ATTACK" | "ACTION",
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
  life = 20,
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
        cost: { kind: "none" },
        typeLine: { supertypes: [], types: [type], classes: ["WARRIOR"], subtypes: [] },
        elements: ["NORM"],
        stats: { life, power: 2, ...(type === "CHAMPION" ? { level: 0 } : {}) },
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        rulesText: "",
        abilities,
      },
    },
  };
}
const onHit: GrandArchiveAbilityDefinition = {
  id: "end-step-hit-a1",
  kind: "triggered",
  text: "On Hit: Draw a card.",
  trigger: { kind: "event", event: { name: "attack-hit", subject: { kind: "source" } } },
  effect: { kind: "draw", player: "controller", amount: 1 },
};
const champion = card("end-step-champion", "CHAMPION");
const attacker = card("end-step-attacker", "ALLY", [onHit]);
const attack = card("end-step-attack", "ATTACK", [onHit]);
const deadAlly = card(
  "end-step-dead-ally",
  "ALLY",
  [
    {
      id: "end-step-death-a1",
      kind: "triggered",
      text: "On Death: Draw a card.",
      trigger: { kind: "event", event: { name: "object-died", subject: { kind: "source" } } },
      effect: { kind: "draw", player: "controller", amount: 1 },
    },
  ],
  1,
);
const endCombat = card("end-step-end-combat", "ACTION", [
  {
    id: "end-step-end-combat-a1",
    kind: "card-resolution",
    text: "End the combat phase.",
    effect: { kind: "end-phase", phase: "combat" },
  },
]);
const filler = card("end-step-filler", "ACTION");

function setup(extraField: readonly GrandArchiveCard<GrandArchiveAbilityDefinition>[] = []) {
  return GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: { field: [attacker, ...extraField], hand: [attack], "main-deck": [filler, filler] },
    },
    playerTwo: {
      champion,
      zones: { field: [deadAlly], hand: [endCombat], "main-deck": [filler, filler] },
    },
  });
}
function advance(game: GrandArchiveTestEngine) {
  const decision = game.state.decision;
  if (decision?.kind === "choose-retaliators") {
    game.player(decision.playerId).execute({
      move: "answer-decision",
      decisionId: decision.id,
      stateVersion: decision.stateVersion,
      answer: [],
    });
    return;
  }
  const wait = game.waitState();
  if (wait.kind !== "opportunity") throw new Error(`Unexpected wait: ${JSON.stringify(wait)}`);
  game.player(wait.playerId).pass();
}
function untilEnd(game: GrandArchiveTestEngine) {
  for (let i = 0; game.state.combat?.step !== "end" && i < 20; i++) advance(game);
  expect(game.state.combat?.step).toBe("end");
  expect(game.state.stack.length).toBeGreaterThan(0);
  expect(game.waitState().kind).toBe("opportunity");
}
function expectNoCombatRoles(game: GrandArchiveTestEngine) {
  for (const object of Object.values(game.state.objects)) {
    expect(
      [...object.states].filter((state) =>
        ["attacking", "defending", "retaliating", "wielded", "intercepting"].includes(state),
      ),
    ).toEqual([]);
  }
}

describe("End of Combat turn-based cleanup", () => {
  it("removes combat roles before players respond to On Hit, then returns to Main after resolution", () => {
    const game = setup();
    game.player("player-one").declareAttack(attacker, game.player("player-two").card(champion));
    untilEnd(game);
    expectNoCombatRoles(game);
    expect(game.state.turn.phase).toBe("combat");
    expect(game.player("player-one").zone("hand")).toHaveLength(1);
    for (let i = 0; game.state.stack.length > 0 && i < 10; i++) advance(game);
    expect(game.state.stack).toHaveLength(0);
    expect(game.player("player-one").zone("hand")).toHaveLength(2);
    expect(game.state.turn.phase).toBe("combat");
    advance(game);
    expect(game.state.turn.phase).toBe("combat");
    advance(game);
    expect(game.state.turn.phase).toBe("main");
  });

  it("moves Intent to the graveyard before its On Hit resolves and preserves this boundary in JSON", () => {
    let game = setup();
    const p1 = game.player("player-one");
    const attackId = p1.card(attack).objectId;
    p1.activate(attack, { attackAttackerId: p1.card(champion).objectId });
    for (let i = 0; !game.state.decision && i < 10; i++) advance(game);
    const decision = game.state.decision;
    if (decision?.kind !== "declare-resolved-attack") throw new Error("Missing attack declaration");
    p1.execute({
      move: "answer-decision",
      decisionId: decision.id,
      stateVersion: decision.stateVersion,
      answer: {
        attackerId: p1.card(champion).objectId,
        targetIds: [game.player("player-two").card(champion).objectId],
      },
    });
    untilEnd(game);
    expect(game.state.objects[attackId]?.zone).toBe("graveyard");
    expectNoCombatRoles(game);
    game = GrandArchiveTestEngine.fromState(
      game.program,
      restoreGrandArchiveMatchSnapshot(
        game.program,
        JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(game.state))),
      ),
    );
    game.resolveCombatWithoutRetaliation();
    expect(game.player("player-one").zone("hand")).toHaveLength(1);
    expect(
      game.state.eventHistory.filter(
        (event) =>
          event.type === "object-moved" && event.objectId === attackId && event.from === "intent",
      ),
    ).toHaveLength(1);
  });

  it("collects lethal damage and death triggers before removing the surviving attacker's combat role", () => {
    const game = setup();
    const deadId = game.player("player-two").card(deadAlly).objectId;
    game.player("player-one").declareAttack(attacker, game.player("player-two").card(deadAlly));
    untilEnd(game);
    expect(game.state.objects[deadId]?.zone).toBe("graveyard");
    expect(game.state.stack.filter((item) => item.kind === "triggered-ability")).toHaveLength(2);
    expectNoCombatRoles(game);
    const deathIndex = game.state.eventHistory.findIndex(
      (event) =>
        event.type === "object-moved" && event.objectId === deadId && event.to === "graveyard",
    );
    const stackedHitIndex = game.state.eventHistory.findIndex(
      (event) =>
        event.type === "stack-item-added" &&
        event.item.kind === "triggered-ability" &&
        event.item.ability.id === "end-step-hit-a1",
    );
    const stackedDeathIndex = game.state.eventHistory.findIndex(
      (event) =>
        event.type === "stack-item-added" &&
        event.item.kind === "triggered-ability" &&
        event.item.ability.id === "end-step-death-a1",
    );
    const cleanupIndex = game.state.eventHistory.findIndex(
      (event) => event.type === "combat-cleanup-started",
    );
    expect(stackedHitIndex).toBeGreaterThan(-1);
    expect(deathIndex).toBeGreaterThan(stackedHitIndex);
    expect(stackedDeathIndex).toBeGreaterThan(deathIndex);
    expect(cleanupIndex).toBeGreaterThan(stackedDeathIndex);
    game.resolveCombatWithoutRetaliation();
    expect(game.player("player-one").zone("hand")).toHaveLength(2);
    expect(game.player("player-two").zone("hand")).toHaveLength(2);
  });

  it("allows an end-combat response to abandon On Hit without running cleanup twice", () => {
    const game = setup();
    game.player("player-one").declareAttack(attacker, game.player("player-two").card(champion));
    untilEnd(game);
    expectNoCombatRoles(game);
    if (game.state.opportunity?.holderId === "player-one") advance(game);
    game.player("player-two").activate(endCombat);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.turn.phase).toBe("main");
    expect(game.state.stack).toHaveLength(0);
    expect(game.player("player-one").zone("hand")).toHaveLength(1);
    expect(game.state.eventHistory.filter((event) => event.type === "combat-ended")).toHaveLength(
      1,
    );
  });

  it.each([false, true])(
    "resumes optional Intent cleanup replacement once across JSON (apply=%s)",
    (apply) => {
      const keeper = card("end-step-keeper", "ALLY", [
        {
          id: "end-step-keeper-a1",
          kind: "static",
          staticKind: "effects",
          text: "You may prevent Intent cleanup.",
          effects: [
            {
              kind: "replacement",
              event: { name: "card-moved", from: "intent", to: "graveyard" },
              optionalFor: "controller",
              operation: { kind: "prevent" },
              duration: { kind: "while-source-in-functional-zone" },
            },
          ],
        },
      ]);
      let game = setup([keeper]);
      const p1 = game.player("player-one");
      const attackId = p1.card(attack).objectId;
      p1.activate(attack, { attackAttackerId: p1.card(champion).objectId });
      for (let i = 0; !game.state.decision && i < 10; i++) advance(game);
      const declaration = game.state.decision;
      if (declaration?.kind !== "declare-resolved-attack")
        throw new Error("Missing attack declaration");
      p1.execute({
        move: "answer-decision",
        decisionId: declaration.id,
        stateVersion: declaration.stateVersion,
        answer: {
          attackerId: p1.card(champion).objectId,
          targetIds: [game.player("player-two").card(champion).objectId],
        },
      });
      for (let i = 0; game.state.decision?.kind !== "choose-replacement" && i < 20; i++)
        advance(game);
      expectNoCombatRoles(game);
      expect(game.state.combat?.step).toBe("end");
      expect(game.state.stack).toHaveLength(1);
      game = GrandArchiveTestEngine.fromState(
        game.program,
        restoreGrandArchiveMatchSnapshot(
          game.program,
          JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(game.state))),
        ),
      );
      const decision = game.state.decision;
      if (decision?.kind !== "choose-replacement") throw new Error("Missing cleanup replacement");
      game.player(decision.playerId).execute({
        move: "answer-decision",
        decisionId: decision.id,
        stateVersion: decision.stateVersion,
        answer: apply,
      });
      expect(game.state.objects[attackId]?.zone).toBe(apply ? "intent" : "graveyard");
      game.resolveCombatWithoutRetaliation();
      expect(game.state.turn.phase).toBe("main");
      expect(game.player("player-one").zone("hand")).toHaveLength(1);
      expect(
        game.state.eventHistory.filter((event) => event.type === "combat-cleanup-started"),
      ).toHaveLength(1);
      expect(
        game.state.eventHistory.filter(
          (event) =>
            event.type === "decision-created" && event.decision.kind === "choose-replacement",
        ),
      ).toHaveLength(1);
    },
  );
});
