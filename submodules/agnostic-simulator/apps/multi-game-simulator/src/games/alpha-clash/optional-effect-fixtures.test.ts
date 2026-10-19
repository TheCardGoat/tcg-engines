import { fixtureAtOptionalChoice } from "./optional-effect-test-helpers";
import { fixtureSubmit } from "./native-fixture-test-actions";
import { expect, test } from "vite-plus/test";
import { projectState } from "@tcg/alpha-clash-engine";
import { INTERACTION_PROTOCOL_VERSION, type InteractionSubmission } from "@tcg/protocol";
import { createOptionalEffectFixture, optionalEffectFixtures } from "./optional-effect-fixtures";

type Engine = ReturnType<typeof createOptionalEffectFixture>;
function submission(
  engine: Engine,
  values: InteractionSubmission["values"],
): InteractionSubmission {
  const view = engine.getInteractionView("human");
  const action = view.actions.find((a) => a.id.startsWith("resolveChoice:"));
  if (!action) throw new Error("Missing native choice");
  return {
    protocolVersion: INTERACTION_PROTOCOL_VERSION,
    stateVersion: view.stateVersion,
    requestId: action.requestId,
    actionId: action.id,
    values,
  };
}
function submit(engine: Engine, values: InteractionSubmission["values"]) {
  return engine.submitInteraction("human", submission(engine, values), {
    gameId: "optional",
    sourceAuthority: "server",
  });
}
function card(engine: Engine, id: string, zone?: string) {
  const result = Object.values(engine.state.cards).find(
    (c) => c.controller === "player-one" && c.definitionId === id && (!zone || c.zone === zone),
  );
  if (!result) throw new Error(`Missing ${id} ${zone}`);
  return result;
}
test("optional fixtures start before any player action or trigger", () => {
  for (const fixture of optionalEffectFixtures) {
    const engine = createOptionalEffectFixture(fixture.id);
    expect(engine.state.pendingChoices).toHaveLength(0);
    expect(engine.state.standby).toHaveLength(0);
    expect(engine.state.responseWindow).toBeFalsy();
    expect(engine.state.clash).toBeFalsy();
    expect(engine.getActivePlayerId()).toBe("human");
    expect(
      engine
        .getInteractionView("human")
        .actions.some(
          (action) =>
            action.enabled &&
            action.id.startsWith(
              fixture.id.startsWith("optional-restore")
                ? "initiateClash"
                : fixture.id.startsWith("optional-wrath")
                  ? "activateAbility"
                  : fixture.id === "optional-temper"
                    ? "attachWeapon"
                    : "endTurn",
            ),
        ),
    ).toBe(true);
  }
});
test("nonterminal fixture states play on normally with the practice bot on Player 2", () => {
  for (const fixture of optionalEffectFixtures.filter(
    (f) => !["optional-void-empty-deck", "optional-void-last-card"].includes(f.id),
  )) {
    const engine = createOptionalEffectFixture(fixture.id);
    const context = { gameId: "fixture-progress", sourceAuthority: "server" as const };
    const startedTurn = engine.state.turnNumber;
    let turnChanges = 0;
    let lastTurn = startedTurn;
    for (let guard = 0; guard < 160 && turnChanges < 3 && !engine.hasGameEnded(); guard += 1) {
      const actor = engine.getActivePlayerId();
      if (!actor) break;
      if (actor === "bot") {
        const result = engine.takeAutomatedAction({ strategyId: "default" }, context);
        if (!result.finalResult.success)
          throw new Error(`${fixture.id}: bot could not act: ${result.finalResult.error}`);
      } else {
        // Player One just keeps the game moving: answer its prompts, end the
        // turn, or pass whatever step is owed — never the fixture's setup action.
        const view = engine.getInteractionView(actor);
        const action =
          view.actions.find(
            (candidate) => candidate.enabled && candidate.id.startsWith("resolveChoice:"),
          ) ??
          view.actions.find((candidate) => candidate.enabled && candidate.id === "endTurn") ??
          view.actions.find((candidate) => candidate.enabled && candidate.id.startsWith("pass"));
        if (!action) throw new Error(`${fixture.id}: no action available for ${actor}`);
        const result = engine.submitInteraction(
          actor,
          {
            protocolVersion: INTERACTION_PROTOCOL_VERSION,
            stateVersion: view.stateVersion,
            requestId: action.requestId,
            actionId: action.id,
            values: action.id.startsWith("resolveChoice:") ? { confirm: false } : {},
          },
          context,
        );
        if (!result.success) throw new Error(`${fixture.id}: ${action.id} failed: ${result.error}`);
      }
      if (engine.state.turnNumber !== lastTurn) {
        lastTurn = engine.state.turnNumber;
        turnChanges += 1;
      }
    }
    expect(turnChanges).toBeGreaterThanOrEqual(3);
  }
});
for (const fixture of optionalEffectFixtures.filter((f) => f.id !== "optional-void-empty-deck")) {
  test(`${fixture.id}: contextual Use/Decline is actor-only; stale and illegal answers preserve state`, () => {
    const engine = fixtureAtOptionalChoice(fixture.id);
    const view = engine.getInteractionView("human");
    const input = view.actions.find((a) => a.id.startsWith("resolveChoice:"))?.inputs[0];
    expect(input).toMatchObject({
      kind: "boolean",
      trueText: { key: "Use" },
      falseText: { key: "Decline" },
    });
    const before = structuredClone(engine.state);
    const valid = submission(engine, { confirm: false });
    expect(
      engine.submitInteraction("bot", valid, { gameId: "optional", sourceAuthority: "server" })
        .success,
    ).toBe(false);
    expect(submit(engine, { confirm: "yes" }).success).toBe(false);
    expect(engine.state).toEqual(before);
    expect(submit(engine, { confirm: false }).success).toBe(true);
    expect(
      engine.submitInteraction("human", valid, { gameId: "optional", sourceAuthority: "server" })
        .success,
    ).toBe(false);
    const hidden = projectState(engine.state, "player-two").cards.filter(
      (c) => c.controller === "player-one" && c.zone === "hand",
    );
    expect(hidden.every((c) => c.name === null && c.definitionId === null)).toBe(true);
  });
}
test("Restore moves only the current top Oblivion card to the bottom; declining keeps both piles", () => {
  for (const use of [false, true]) {
    const engine = fixtureAtOptionalChoice("optional-restore");
    const deck = [...engine.state.deckOrder["player-one"]];
    const oblivion = [...engine.state.oblivionOrder["player-one"]];
    expect(engine.state.cards[oblivion[0]].definitionId).toBe("ac-ac1-027");
    expect(engine.state.players["player-one"].health).toBe(26);
    expect(engine.state.players["player-two"].health).toBe(29);
    expect(submit(engine, { confirm: use }).success).toBe(true);
    expect(engine.state.deckOrder["player-one"]).toEqual(use ? [...deck, oblivion[0]] : deck);
    expect(engine.state.oblivionOrder["player-one"]).toEqual(use ? oblivion.slice(1) : oblivion);
    // Restore moves a card; accepting or declining does not reverse clash damage or heal.
    expect(engine.state.players["player-one"].health).toBe(26);
    expect(engine.state.players["player-two"].health).toBe(29);
  }
});
for (const id of ["optional-restore-empty", "optional-restore-one"]) {
  test(`${id}: Use and Decline resolve the native boundary without healing`, () => {
    for (const use of [false, true]) {
      const engine = fixtureAtOptionalChoice(id);
      const deck = [...engine.state.deckOrder["player-one"]];
      const oblivion = [...engine.state.oblivionOrder["player-one"]];
      expect(oblivion).toHaveLength(id.endsWith("empty") ? 0 : 1);
      expect(submit(engine, { confirm: use }).success).toBe(true);
      expect(engine.state.deckOrder["player-one"]).toEqual(use ? [...deck, ...oblivion] : deck);
      expect(engine.state.oblivionOrder["player-one"]).toEqual(use ? [] : oblivion);
      expect(engine.state.pendingChoices).toHaveLength(0);
      expect(engine.state.players["player-one"].health).toBe(26);
      expect(engine.state.players["player-two"].health).toBe(29);
    }
  });
}
test("Wrath requires a real Dragon, rejects a non-Dragon, then reveals and bottoms only the chosen card", () => {
  const engine = fixtureAtOptionalChoice("optional-wrath");
  const dragon = card(engine, "ac-ac6-053", "hand");
  const wrong = card(engine, "ac-ac1-027", "hand");
  expect(submit(engine, { confirm: true }).success).toBe(true);
  expect(JSON.stringify(engine.getInteractionView("bot"))).not.toContain("Fangyin");
  const before = structuredClone(engine.state);
  expect(submit(engine, { selection: [wrong.instanceId] }).success).toBe(false);
  expect(engine.state).toEqual(before);
  const result = submit(engine, { selection: [dragon.instanceId] });
  if (!result.success) throw new Error(result.error ?? "Wrath selection failed");
  expect(dragon.zone).toBe("deck");
  expect(engine.state.deckOrder["player-one"].at(-1)).toBe(dragon.instanceId);
  expect(wrong.zone).toBe("hand");
  expect(card(engine, "ac-ac7-162", "accessory").ready).toBe(false);
  // The accepted reveal is historical presentation data; it must not grant
  // live access to the Dragon after it returns to the hidden deck.
  for (const viewer of [
    { role: "player", actorId: "human" } as const,
    { role: "player", actorId: "bot" } as const,
    { role: "spectator" } as const,
  ]) {
    const projectedDragon = engine
      .getViewerState(viewer)
      .cards.find((c) => c.instanceId === dragon.instanceId);
    expect(projectedDragon).toMatchObject({ zone: "deck", definitionId: null, name: null });
  }
  expect(
    Object.values(engine.state.cards)
      .filter((c) => c.zone === "clash")
      .every((c) => c.phaseDamage === 1),
  ).toBe(true);
  const survivor = card(engine, "ac-ac1-027", "clash");
  expect(survivor.phaseDamage).toBe(1);
  const opposingSonoro = Object.values(engine.state.cards).find(
    (c) =>
      c.controller === "player-two" && c.definitionId === "ac-ac1-027" && c.zone === "oblivion",
  );
  expect(opposingSonoro).toBeDefined();
  fixtureSubmit(engine, "endTurn");
  expect(engine.state.cards[survivor.instanceId].phaseDamage).toBe(0);
});
test("Wrath Decline keeps the source engaged without revealing, returning or damaging", () => {
  const engine = fixtureAtOptionalChoice("optional-wrath");
  const source = card(engine, "ac-ac7-162", "accessory");
  const deck = [...engine.state.deckOrder["player-one"]];
  const dragon = card(engine, "ac-ac6-053", "hand");
  expect(source.ready).toBe(false);
  expect(submit(engine, { confirm: false }).success).toBe(true);
  expect(engine.state.deckOrder["player-one"]).toEqual(deck);
  expect(engine.state.cards[dragon.instanceId].zone).toBe("hand");
  expect(engine.state.cards[source.instanceId].ready).toBe(false);
  expect(engine.state.pendingChoices).toHaveLength(0);
  const clashCards = Object.values(engine.state.cards).filter((c) => c.zone === "clash");
  expect(clashCards).toHaveLength(2);
  expect(clashCards.every((c) => c.phaseDamage === 0)).toBe(true);
});
test("Wrath with no eligible Dragon completes Use or Decline without a candidate trap", () => {
  for (const use of [false, true]) {
    const engine = fixtureAtOptionalChoice("optional-wrath-no-dragon");
    const deck = [...engine.state.deckOrder["player-one"]];
    expect(submit(engine, { confirm: use }).success).toBe(true);
    expect(engine.state.pendingChoices).toHaveLength(0);
    expect(engine.state.deckOrder["player-one"]).toEqual(deck);
    const hand = Object.values(engine.state.cards).filter(
      (c) => c.controller === "player-one" && c.zone === "hand",
    );
    expect(hand).toHaveLength(2);
    expect(hand.every((c) => c.definitionId === "ac-ac1-027")).toBe(true);
    const clash = Object.values(engine.state.cards).filter((c) => c.zone === "clash");
    expect(clash).toHaveLength(2);
    expect(clash.every((c) => c.phaseDamage === 0)).toBe(true);
    expect(card(engine, "ac-ac7-162", "accessory").ready).toBe(false);
  }
});
test("Wrath duplicate Dragon candidates retain identity and return only the chosen instance", () => {
  const engine = fixtureAtOptionalChoice("optional-wrath-two-dragons");
  expect(submit(engine, { confirm: true }).success).toBe(true);
  const action = engine
    .getInteractionView("human")
    .actions.find((a) => a.id.startsWith("resolveChoice:"));
  const input = action?.inputs.find((i) => i.kind === "entity-selection");
  if (input?.kind !== "entity-selection") throw new Error("Missing native Dragon selection");
  const ids = input.candidates.map((c) => c.entity.instanceId);
  expect(ids).toHaveLength(2);
  expect(new Set(ids).size).toBe(2);
  expect(submit(engine, { [input.id]: [ids[1]] }).success).toBe(true);
  expect(engine.state.cards[ids[0]].zone).toBe("hand");
  expect(engine.state.cards[ids[1]].zone).toBe("deck");
  expect(engine.state.deckOrder["player-one"].at(-1)).toBe(ids[1]);
  expect(engine.state.pendingChoices).toHaveLength(0);
});
test("Temper accepts or declines the designated Weapon without reversing its attachment payment", () => {
  for (const use of [false, true]) {
    const engine = fixtureAtOptionalChoice("optional-temper");
    const weapon = card(engine, "ac-st2-010");
    const ready = Object.values(engine.state.cards).filter(
      (c) => c.zone === "resource" && c.ready,
    ).length;
    expect(weapon.attachedTo).toBeTruthy();
    expect(submit(engine, { confirm: use }).success).toBe(true);
    expect(weapon.counters.temper ?? 0).toBe(use ? 1 : 0);
    expect(
      Object.values(engine.state.cards).filter((c) => c.zone === "resource" && c.ready),
    ).toHaveLength(ready);
  }
});
for (const branch of [
  { name: "decline banish", banish: false, draw: false, drawn: 0 },
  { name: "banish then decline contender draw", banish: true, draw: false, drawn: 1 },
  { name: "banish then use contender draw", banish: true, draw: true, drawn: 2 },
]) {
  test(`Void chain: ${branch.name} preserves exact deck, banished and drawn identities`, () => {
    const engine = fixtureAtOptionalChoice("optional-void");
    const deck = [...engine.state.deckOrder["player-one"]];
    const hand = Object.values(engine.state.cards)
      .filter((c) => c.controller === "player-one" && c.zone === "hand")
      .map((c) => c.instanceId);
    expect(engine.state.cards[deck[0]].definitionId).toBe("ac-ac7-004");
    expect(submit(engine, { confirm: branch.banish }).success).toBe(true);
    if (branch.banish) {
      // Void waits until the whole banishing effect, including the optional
      // contender draw, completes (704.34c). No Void draw may happen early.
      expect(engine.state.pendingChoices[0]?.prompt).toBe("Draw a card?");
      expect(engine.state.cards[deck[0]].zone).toBe("banished");
      expect(engine.state.deckOrder["player-one"]).toEqual(deck.slice(1));
      expect(
        Object.values(engine.state.cards).filter(
          (c) => c.controller === "player-one" && c.zone === "hand",
        ),
      ).toHaveLength(hand.length);
      expect(submit(engine, { confirm: branch.draw }).success).toBe(true);
    }
    expect(engine.state.pendingChoices).toHaveLength(0);
    const removed = (branch.banish ? 1 : 0) + branch.drawn;
    expect(engine.state.deckOrder["player-one"]).toEqual(deck.slice(removed));
    for (const id of hand) expect(engine.state.cards[id].zone).toBe("hand");
    for (const id of deck.slice(1, removed)) expect(engine.state.cards[id].zone).toBe("hand");
    expect(
      Object.values(engine.state.cards).filter(
        (c) => c.controller === "player-one" && c.zone === "hand",
      ),
    ).toHaveLength(hand.length + branch.drawn);
    expect(engine.state.cards[deck[0]].zone).toBe(branch.banish ? "banished" : "deck");
    expect(engine.state.players["player-one"].health).toBe(24);
    expect(engine.state.players["player-two"].health).toBe(30);
    const opposing = projectState(engine.state, "player-two");
    expect(opposing.cards.find((c) => c.instanceId === deck[0])?.definitionId).toBe(
      branch.banish ? "ac-ac7-004" : null,
    );
    for (const id of deck.slice(1, removed)) {
      expect(opposing.cards.find((c) => c.instanceId === id)).toMatchObject({
        zone: "hand",
        definitionId: null,
        name: null,
      });
    }
  });
}

test("Void full printed health still reaches The Absence trigger", () => {
  const engine = fixtureAtOptionalChoice("optional-void-full-health");
  expect(engine.state.players["player-one"].health).toBe(25);
  expect(engine.state.pendingChoices[0]?.prompt).toBe("Banish the top card of your deck?");
});
for (const draw of [false, true]) {
  test(`Void-free top card: contender draw ${draw} has no extra mandatory draw`, () => {
    const engine = fixtureAtOptionalChoice("optional-void-no-void");
    const deck = [...engine.state.deckOrder["player-one"]];
    const hand = Object.values(engine.state.cards).filter(
      (c) => c.controller === "player-one" && c.zone === "hand",
    ).length;
    expect(engine.state.cards[deck[0]].definitionId).toBe("ac-tp1-017");
    expect(submit(engine, { confirm: true }).success).toBe(true);
    expect(engine.state.pendingChoices[0]?.prompt).toBe("Draw a card?");
    expect(submit(engine, { confirm: draw }).success).toBe(true);
    expect(engine.state.pendingChoices).toHaveLength(0);
    expect(engine.state.cards[deck[0]].zone).toBe("banished");
    expect(engine.state.deckOrder["player-one"]).toEqual(deck.slice(draw ? 2 : 1));
    expect(
      Object.values(engine.state.cards).filter(
        (c) => c.controller === "player-one" && c.zone === "hand",
      ),
    ).toHaveLength(hand + (draw ? 1 : 0));
  });
}

test("Void chain does not trigger after closing the Portal through its native action", () => {
  const engine = createOptionalEffectFixture("optional-void");
  const deck = [...engine.state.deckOrder["player-one"]];
  fixtureSubmit(engine, "activatePortal");
  expect(engine.state.portalOpen).toBe(false);
  // Closing is still a Portal activation, so resolve The Absence's real
  // Portal target trigger before trying to end the turn.
  const action = engine
    .getInteractionView("human")
    .actions.find((a) => a.id.startsWith("resolveChoice:"));
  const input = action?.inputs.find((i) => i.kind === "entity-selection");
  if (!action || input?.kind !== "entity-selection")
    throw new Error("Missing Portal target choice");
  fixtureSubmit(engine, action.id, { [input.id]: [input.candidates[0].entity.instanceId!] });
  fixtureSubmit(engine, "endTurn");
  expect(engine.state.pendingChoices).toHaveLength(0);
  expect(engine.state.deckOrder["player-one"]).toEqual(deck);
  expect(engine.state.cards[deck[0]].zone).toBe("deck");
});

test("Void empty-deck trigger has no banish or draw choice", () => {
  const engine = createOptionalEffectFixture("optional-void-empty-deck");
  expect(engine.state.deckOrder["player-one"]).toHaveLength(0);
  expect(engine.hasGameEnded()).toBe(false);
  fixtureSubmit(engine, "endTurn");
  expect(engine.state.pendingChoices).toHaveLength(0);
  expect(engine.hasGameEnded()).toBe(false);
  expect(engine.state.deckOrder["player-one"]).toHaveLength(0);
});
for (const draw of [false, true]) {
  test(`Void last-card banish then contender draw ${draw} reaches native deckout`, () => {
    const engine = fixtureAtOptionalChoice("optional-void-last-card");
    const [last] = engine.state.deckOrder["player-one"];
    expect(engine.state.deckOrder["player-one"]).toHaveLength(1);
    expect(engine.state.cards[last].definitionId).toBe("ac-ac7-004");
    expect(submit(engine, { confirm: true }).success).toBe(true);
    expect(engine.state.cards[last].zone).toBe("banished");
    expect(engine.state.deckOrder["player-one"]).toHaveLength(0);
    expect(engine.hasGameEnded()).toBe(false);
    expect(engine.state.pendingChoices[0]?.prompt).toBe("Draw a card?");
    expect(submit(engine, { confirm: draw }).success).toBe(true);
    expect(engine.hasGameEnded()).toBe(true);
    expect(engine.getGameEndResult()).toMatchObject({ winnerId: "bot", reason: "decked" });
    for (const viewer of ["human", "bot"]) {
      expect(engine.getInteractionView(viewer).status).toBe("game-over");
      expect(engine.getInteractionView(viewer).actions).toHaveLength(0);
    }
  });
}
test("Void last-card banish can be declined without deckout", () => {
  const engine = fixtureAtOptionalChoice("optional-void-last-card");
  const deck = [...engine.state.deckOrder["player-one"]];
  expect(submit(engine, { confirm: false }).success).toBe(true);
  expect(engine.hasGameEnded()).toBe(false);
  expect(engine.state.pendingChoices).toHaveLength(0);
  expect(engine.state.deckOrder["player-one"]).toEqual(deck);
});
