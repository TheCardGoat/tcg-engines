import { auditNativeFixtureLegality } from "./native-fixture-legality";
import { expect, test } from "vite-plus/test";
import { officialCatalog, getCard } from "@tcg/alpha-clash-cards";
import { projectState } from "@tcg/alpha-clash-engine";
import {
  INTERACTION_PROTOCOL_VERSION,
  type InteractionAction,
  type InteractionSubmission,
} from "@tcg/protocol";
import { alphaClashVisualFixtures, createAlphaClashVisualFixture } from "./visual-fixtures";
import { alphaClashInteractionCases, casesForFixture } from "./interaction-coverage";
import {
  fixtureBeginDestination,
  fixtureSubmit,
  fixtureAnswer,
  fixtureAttack,
  fixturePassResponses,
} from "./native-fixture-test-actions";

type Engine = ReturnType<typeof createAlphaClashVisualFixture>;
function card(engine: Engine, definitionId: string, zone: string, seat = "player-one") {
  const found = Object.values(engine.state.cards).find(
    (c) => c.definitionId === definitionId && c.zone === zone && c.controller === seat,
  );
  if (!found) throw new Error(`Missing ${definitionId} in ${zone}`);
  return found;
}
function payment(action: InteractionAction): InteractionSubmission["values"] {
  const values: InteractionSubmission["values"] = {};
  for (const input of action.inputs) {
    if (input.kind !== "option-selection" || input.presentation?.kind !== "cost-slots") continue;
    const used = new Set<string>();
    values[input.id] = input.presentation.slots.map((slot) => {
      const option = input.options.find(
        (o) =>
          slot.optionIds.includes(o.id) && o.enabled && o.entity && !used.has(o.entity.instanceId),
      );
      if (!option?.entity) throw new Error("No resource for slot");
      used.add(option.entity.instanceId);
      return option.id;
    });
  }
  return values;
}
function action(engine: Engine, id: string) {
  const found = engine
    .getInteractionView(engine.getActivePlayerId()!)
    .actions.find((a) => a.id === id);
  if (!found)
    throw new Error(
      `Missing ${id}: ${engine
        .getInteractionView(engine.getActivePlayerId()!)
        .actions.map((a) => a.id)
        .join(", ")}`,
    );
  return found;
}
function passUntil(engine: Engine, step: string) {
  for (let n = 0; engine.state.clash?.step !== step && n < 30; n++) {
    const pass = engine
      .getInteractionView(engine.getActivePlayerId()!)
      .actions.find((a) => a.intent === "pass" && a.enabled);
    if (!pass) throw new Error(`No pass before ${step}`);
    fixtureSubmit(engine, pass.id);
  }
  expect(engine.state.clash?.step).toBe(step);
}

test("all catalog boards start before commands, contain only official cards, and have traceable coverage", () => {
  const official = new Set(officialCatalog.map((c) => getCard(c.id).id));
  for (const entry of alphaClashVisualFixtures) {
    const engine = createAlphaClashVisualFixture(entry.id);
    expect(casesForFixture(entry.id).length, entry.id).toBeGreaterThan(0);
    expect(engine.state.pendingChoices, entry.id).toHaveLength(0);
    expect(engine.state.standby, entry.id).toHaveLength(0);
    expect(engine.state.responseWindow, entry.id).toBeFalsy();
    expect(engine.state.clash, entry.id).toBeFalsy();
    for (const c of Object.values(engine.state.cards))
      expect(official.has(c.definitionId), `${entry.id}: ${c.definitionId}`).toBe(true);
    for (const seat of ["player-one", "player-two"] as const) {
      const view = projectState(engine.state, seat);
      expect(
        view.cards.filter((c) => c.zone === "deck").every((c) => c.definitionId === null),
      ).toBe(true);
      expect(
        view.cards
          .filter((c) => c.zone === "hand" && c.controller !== seat)
          .every((c) => c.definitionId === null),
      ).toBe(true);
    }
  }
  for (const entry of alphaClashInteractionCases)
    for (const id of entry.fixtureIds)
      expect(
        alphaClashVisualFixtures.some((f) => f.id === id),
        entry.id,
      ).toBe(true);
});

test("Portal toggles both ways; stale requests and undo preserve authoritative state", () => {
  const engine = createAlphaClashVisualFixture("board-actions");
  const before = structuredClone(engine.state);
  const view = engine.getInteractionView("human");
  const activate = action(engine, "activatePortal");
  fixtureSubmit(engine, activate.id);
  expect(engine.state.portalOpen).toBe(true);
  expect(engine.getInteractionView("human").actions.some((a) => a.id === "activatePortal")).toBe(
    true,
  );
  expect(
    engine.submitInteraction(
      "human",
      {
        protocolVersion: INTERACTION_PROTOCOL_VERSION,
        stateVersion: view.stateVersion,
        requestId: activate.requestId,
        actionId: activate.id,
        values: {},
      },
      { gameId: engine.state.id, sourceAuthority: "server" },
    ).success,
  ).toBe(false);
  expect(engine.canUndo("human")).toBe(true);
  expect(
    engine.dispatch("undo", "human", {}, { gameId: engine.state.id, sourceAuthority: "server" })
      .success,
  ).toBe(true);
  expect(engine.state.portalOpen).toBe(before.portalOpen);
  expect(engine.state.cards).toEqual(before.cards);
  fixtureSubmit(engine, "activatePortal");
  fixtureSubmit(engine, "activatePortal");
  expect(engine.state.portalOpen).toBe(false);
  expect(engine.canUndoToTurnStart("human")).toBe(true);
  expect(
    engine.dispatch(
      "undoToTurnStart",
      "human",
      {},
      { gameId: engine.state.id, sourceAuthority: "server" },
    ).success,
  ).toBe(true);
  expect(engine.state.cards).toEqual(before.cards);
  expect(engine.canUndo("human")).toBe(false);
  fixtureSubmit(engine, "activatePortal");
  expect(engine.canUndo("human")).toBe(true);
  const haven = card(engine, "ac-ac1-051", "hand");
  const play = action(engine, `playCard:${haven.instanceId}`);
  fixtureSubmit(engine, play.id, payment(play));
  expect(engine.canUndo("human")).toBe(false);
  expect(engine.canUndoToTurnStart("human")).toBe(false);
  const committed = structuredClone(engine.state);
  expect(
    engine.dispatch("undo", "human", {}, { gameId: engine.state.id, sourceAuthority: "server" })
      .success,
  ).toBe(false);
  expect(engine.state).toEqual(committed);
});

test("Set hides the Trap; attachment and detachment use native costs", () => {
  const engine = createAlphaClashVisualFixture("board-actions");
  const trap = card(engine, "ac-ac5-082", "hand");
  fixtureSubmit(engine, `setCard:${trap.instanceId}`);
  expect(engine.state.cards[trap.instanceId].faceDown).toBe(true);
  expect(
    projectState(engine.state, "player-two").cards.find((c) => c.instanceId === trap.instanceId)
      ?.definitionId,
  ).toBeNull();
  const weapon = card(engine, "ac-ac5-028", "accessory");
  const contender = card(engine, "ac-ac1-047", "contender");
  fixtureSubmit(engine, `attachWeapon:${weapon.instanceId}`, { targetId: [contender.instanceId] });
  expect(engine.state.cards[weapon.instanceId].attachedTo).toBe(contender.instanceId);
  expect(
    engine.getInteractionView("human").actions.some((a) => a.id.startsWith("detachWeapon")),
  ).toBe(true);
  expect(action(engine, `detachWeapon:${weapon.instanceId}`).source?.instanceId).toBe(
    weapon.instanceId,
  );
  fixtureSubmit(engine, `detachWeapon:${weapon.instanceId}`);
  expect(engine.state.cards[weapon.instanceId].attachedTo).toBeUndefined();
  expect(engine.state.cards[weapon.instanceId].zone).toBe("accessory");
});

test("Dread Titan plays from the public pile and Rizlac activates there", () => {
  for (const type of ["play", "activate"] as const) {
    const engine = createAlphaClashVisualFixture("board-actions");
    const source = card(engine, type === "play" ? "ac-ac6-175" : "ac-ac3-013", "oblivion");
    const move = action(
      engine,
      type === "play" ? `playCard:${source.instanceId}` : `activateAbility:${source.instanceId}:1`,
    );
    fixtureSubmit(engine, move.id, payment(move));
    fixturePassResponses(engine);
    expect(engine.state.cards[source.instanceId].zone).toBe("clash");
  }
});

test.each([true, false])(
  "hand Counter–Play accepts or declines its native effect: %s",
  (accept) => {
    const engine = createAlphaClashVisualFixture("board-actions");
    const source = card(engine, "ac-ac1-097", "hand");
    const play = action(engine, `playCard:${source.instanceId}`);
    fixtureSubmit(engine, play.id, payment(play));
    const counter = card(engine, "ac-ac1-076", "hand", "player-two");
    fixtureSubmit(engine, `activateAbility:${counter.instanceId}:0`);
    fixturePassResponses(engine);
    fixtureAnswer(engine, { confirm: accept });
    fixturePassResponses(engine);
    expect(engine.state.cards[counter.instanceId].zone).toBe(accept ? "oblivion" : "hand");
    expect(engine.state.cards[source.instanceId].zone).toBe(accept ? "hand" : "clashground");
    if (!accept) {
      // The uncountered Antarctica enters; its damage defeats Magnate, whose
      // real optional draw must still be resolved after declining T-Bone.
      const pending = engine.state.pendingChoices[0];
      if (!pending?.sourceId) throw new Error("Expected Magnate trigger source");
      const magnate = engine.state.cards[pending.sourceId];
      expect(magnate.definitionId).toBe("ac-ac1-028");
      expect(engine.state.pendingChoices[0]).toMatchObject({
        kind: "option",
        sourceId: magnate.instanceId,
        prompt: "You may draw one card.",
      });
      const chooser = engine.getActivePlayerId()!;
      const choiceView = engine.getInteractionView(chooser);
      const drawAction = choiceView.actions.find(
        (entry) => entry.id === `resolveChoice:${pending.id}`,
      );
      expect(drawAction?.source).toMatchObject({ instanceId: magnate.instanceId });
      const projectedSource = projectState(engine.state, magnate.controller).cards.find(
        (entry) => entry.instanceId === drawAction?.source?.instanceId,
      );
      expect(projectedSource).toMatchObject({ definitionId: "ac-ac1-028", faceDown: false });
      fixtureAnswer(engine, { confirm: false });
      fixturePassResponses(engine);
    }
    expect(engine.state.pendingChoices).toHaveLength(0);
  },
);

for (const count of [0, 1, 2])
  test(`combat accepts ${count} obstructors and completes damage`, () => {
    const engine = createAlphaClashVisualFixture("combat-buffs");
    fixtureAttack(engine);
    passUntil(engine, "obstruct");
    const obstruct = action(engine, "declareObstructors");
    const input = obstruct.inputs[0];
    if (input.kind !== "entity-selection") throw new Error("No obstructors");
    const selected = input.candidates.slice(0, count).map((c) => c.entity.instanceId);
    expect(selected).toHaveLength(count);
    fixtureSubmit(engine, obstruct.id, { obstructorIds: selected });
    for (let n = 0; engine.state.clash && n < 30; n++) {
      const view = engine.getInteractionView(engine.getActivePlayerId()!);
      if (
        view.actions.some(
          (a) => a.id.startsWith("resolveChoice:") && a.inputs.some((i) => i.kind === "boolean"),
        )
      ) {
        fixtureAnswer(engine, { confirm: false });
        continue;
      }
      const order = view.actions.flatMap((a) => a.inputs).find((i) => i.kind === "ordering");
      if (order?.kind === "ordering") {
        fixtureAnswer(engine, { order: order.candidates.map((c) => c.entity.instanceId) });
        continue;
      }
      const pass = view.actions.find((a) => a.intent === "pass" && a.enabled);
      if (!pass) throw new Error(JSON.stringify(view));
      fixtureSubmit(engine, pass.id);
    }
    expect(engine.state.clash).toBeNull();
    if (count === 0) expect(engine.state.players["player-two"].health).toBe(28);
    if (count === 1) {
      const attacker = card(engine, "ac-ac1-027", "oblivion");
      expect(engine.state.cards[selected[0]].zone).toBe("oblivion");
      expect(attacker.clashDamage).toBe(0);
      expect(engine.state.cards[selected[0]].clashDamage).toBe(0);
      for (const viewer of ["player-one", "player-two"] as const) {
        expect(projectState(engine.state, viewer).damageEvents).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ targetId: attacker.instanceId, amount: 2 }),
            expect.objectContaining({ targetId: selected[0], amount: 2 }),
          ]),
        );
      }
      expect(engine.state.players["player-one"].health).toBe(30);
      expect(engine.state.players["player-two"].health).toBe(30);
    }
    expect(engine.state.moveLog.some((e) => e.public && /damage|clash/i.test(e.message))).toBe(
      true,
    );
  });

test("both combat buff steps apply native stats and expire at end of turn", () => {
  const engine = createAlphaClashVisualFixture("combat-buffs");
  const targets = ["player-one", "player-two"].map((seat) =>
    card(engine, "ac-ac1-027", "clash", seat),
  );
  const stats = (instanceId: string) => {
    const projected = projectState(engine.state, "player-one").cards.find(
      (c) => c.instanceId === instanceId,
    );
    if (!projected) throw new Error("Missing projected buff target");
    return { attack: projected.attack, defense: projected.defense };
  };
  for (const target of targets) expect(stats(target.instanceId)).toEqual({ attack: 2, defense: 2 });
  fixtureAttack(engine);
  passUntil(engine, "attackerBuff");
  for (const seat of ["player-one", "player-two"]) {
    const source = card(engine, "ac-ac3-033", "hand", seat);
    const target = card(engine, "ac-ac1-027", "clash", seat);
    const play = action(engine, `playCard:${source.instanceId}`);
    fixtureSubmit(engine, play.id, {
      ...payment(play),
      targetId: [target.instanceId],
    });
    fixturePassResponses(engine);
    expect(engine.state.cards[source.instanceId].zone).toBe("oblivion");
    expect(stats(target.instanceId)).toEqual({ attack: 4, defense: 4 });
    if (seat === "player-one") passUntil(engine, "defenderBuff");
  }
  for (let n = 0; engine.state.clash && n < 30; n++) {
    const pass = engine
      .getInteractionView(engine.getActivePlayerId()!)
      .actions.find((a) => a.intent === "pass" && a.enabled);
    if (!pass) throw new Error("No native pass to finish buffed clash");
    fixtureSubmit(engine, pass.id);
  }
  expect(engine.state.clash).toBeNull();
  expect(engine.state.players["player-two"].health).toBe(26);
  for (const target of targets) expect(stats(target.instanceId)).toEqual({ attack: 4, defense: 4 });
  fixtureSubmit(engine, "endTurn");
  for (const target of targets) expect(stats(target.instanceId)).toEqual({ attack: 2, defense: 2 });
});

test("buffed attacker defeats an obstructor and resolves its granted Victory target", () => {
  const engine = createAlphaClashVisualFixture("combat-buffs-victory");
  const shield = card(engine, "ac-ac5-082", "hand");
  fixtureSubmit(engine, `setCard:${shield.instanceId}`);
  expect(engine.state.cards[shield.instanceId].faceDown).toBe(true);
  fixtureAttack(engine);
  passUntil(engine, "obstruct");
  const obstructor = card(engine, "ac-ac1-027", "clash", "player-two");
  fixtureSubmit(engine, "declareObstructors", { obstructorIds: [obstructor.instanceId] });
  passUntil(engine, "attackerBuff");
  const source = card(engine, "ac-ac3-033", "hand");
  const attacker = card(engine, "ac-ac1-027", "clash");
  const play = action(engine, `playCard:${source.instanceId}`);
  fixtureSubmit(engine, play.id, { ...payment(play), targetId: [attacker.instanceId] });
  fixturePassResponses(engine);
  for (let n = 0; !engine.state.pendingChoices.length && engine.state.clash && n < 30; n++) {
    const pass = engine
      .getInteractionView(engine.getActivePlayerId()!)
      .actions.find((a) => a.intent === "pass" && a.enabled);
    if (!pass) throw new Error("No pass before Victory choice");
    fixtureSubmit(engine, pass.id);
  }
  expect(engine.state.cards[attacker.instanceId].zone).toBe("clash");
  expect(engine.state.cards[obstructor.instanceId].zone).toBe("oblivion");
  const choice = engine
    .getInteractionView(engine.getActivePlayerId()!)
    .actions.find((a) => a.id.startsWith("resolveChoice:"));
  const input = choice?.inputs.find((i) => i.kind === "entity-selection");
  if (input?.kind !== "entity-selection") throw new Error("No native Victory target choice");
  expect(input.candidates.map((c) => c.entity.instanceId)).toEqual([shield.instanceId]);
  fixtureAnswer(engine, { [input.id]: [shield.instanceId] });
  fixturePassResponses(engine);
  expect(engine.state.cards[shield.instanceId].zone).toBe("oblivion");
  expect(engine.state.pendingChoices).toHaveLength(0);
});

test("health payment uses a real counter response and changes health only on commit", () => {
  const engine = createAlphaClashVisualFixture("prompt-health-payment");
  fixtureAttack(engine);
  const source = card(engine, "ac-ac5-032", "hand", "player-two");
  const response = action(engine, `respond:${source.instanceId}`);
  expect(response.source?.instanceId).toBe(source.instanceId);
  const target = response.inputs.find((i) => i.kind === "entity-selection");
  if (target?.kind !== "entity-selection") throw new Error("Expected target");
  const before = engine.state.players["player-two"].health;
  fixtureSubmit(engine, response.id, {
    ...payment(response),
    healthReduction: 0,
    [target.id]: [target.candidates[0].entity.instanceId],
  });
  expect(engine.state.players["player-two"].health).toBe(before);
  fixturePassResponses(engine);
  expect(engine.state.cards[source.instanceId].zone).toBe("banished");
});

test("concede cancellation is atomic and confirmation produces the native game result", () => {
  const engine = createAlphaClashVisualFixture("arena");
  const before = structuredClone(engine.state);
  const view = engine.getInteractionView("human");
  const concede = action(engine, "concede");
  const cancelled = engine.submitInteraction(
    "human",
    {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      stateVersion: view.stateVersion,
      requestId: concede.requestId,
      actionId: concede.id,
      values: { confirm: false },
    },
    { gameId: engine.state.id, sourceAuthority: "server" },
  );
  expect(cancelled.success).toBe(false);
  expect(engine.state).toEqual(before);
  fixtureSubmit(engine, "concede", { confirm: true });
  expect(engine.hasGameEnded()).toBe(true);
  expect(engine.getInteractionView("human").status).toBe("game-over");
  expect(engine.getGameEndResult()?.winnerId).toBe("bot");
});

test("Archaic Shield opens shared clash prevention after two obstructors", () => {
  const engine = createAlphaClashVisualFixture("combat-prevention");
  fixtureBeginDestination(engine, "destination-reveal");
  const reveal = engine
    .getInteractionView(engine.getActivePlayerId()!)
    .actions.find((a) => a.id.startsWith("resolveChoice:"))!;
  const select = reveal.inputs[0];
  if (select.kind !== "option-selection") throw new Error(JSON.stringify(reveal));
  fixtureAnswer(engine, { [select.id]: [select.options.find((o) => o.entity)!.id] });
  fixturePassResponses(engine);
  passUntil(engine, "obstruct");
  const blockers = Object.values(engine.state.cards).filter(
    (c) => c.controller === "player-two" && c.zone === "clash",
  );
  fixtureSubmit(engine, "declareObstructors", { obstructorIds: blockers.map((c) => c.instanceId) });
  for (let n = 0; !engine.state.pendingChoices.length && engine.state.clash && n < 20; n++) {
    const next = engine
      .getInteractionView(engine.getActivePlayerId()!)
      .actions.find((a) => a.intent === "pass" && a.enabled);
    if (!next) throw new Error("No pass to prevention");
    fixtureSubmit(engine, next.id);
  }
  const choice = engine
    .getInteractionView(engine.getActivePlayerId()!)
    .actions.find((a) => a.id.startsWith("resolveChoice:"))!;
  const allocation = choice.inputs.find((i) => i.kind === "entity-allocation");
  if (allocation?.kind !== "entity-allocation") throw new Error(JSON.stringify(choice));
  expect(allocation.candidates.length).toBeGreaterThan(1);
  fixtureAnswer(engine, { [allocation.id]: { [allocation.candidates[0].entity.instanceId]: 1 } });
});

test("all native fixture card ledgers pass native construction validation", () => {
  const invalid = alphaClashVisualFixtures
    .map((f) => ({
      id: f.id,
      ...auditNativeFixtureLegality(createAlphaClashVisualFixture(f.id).state),
    }))
    .filter((r) => r.construction !== "valid");
  expect(invalid).toEqual([]);
});

test("nested Counter targets resolve through native declarations and Set needs no attack target", () => {
  const engine = createAlphaClashVisualFixture("combat-counter-targets");
  const missile = card(engine, "ac-ac1-020", "hand");
  expect(action(engine, `setCard:${missile.instanceId}`).inputs).toHaveLength(0);
  expect(engine.getInteractionView("human").actions.some((a) => a.id.startsWith("playCard:"))).toBe(
    false,
  );
  const attacker = card(engine, "ac-ac1-027", "clash");
  const blocker = card(engine, "ac-ac1-028", "clash", "player-two");
  fixtureAttack(engine);
  const barricade = card(engine, "ac-ac1-069", "hand", "player-two");
  const respond = action(engine, `respond:${barricade.instanceId}`);
  fixtureSubmit(engine, respond.id, { ...payment(respond), targetId: [blocker.instanceId] });
  const roll = card(engine, "ac-ac5-060", "hand");
  const counter = action(engine, `respond:${roll.instanceId}`);
  const target = counter.inputs.find((i) => i.id === "targetId");
  if (target?.kind !== "entity-selection") throw new Error("Nested target missing");
  expect(target.candidates.map((c) => c.entity.instanceId)).toContain(attacker.instanceId);
  expect(target.candidates.map((c) => c.entity.instanceId)).not.toContain(blocker.instanceId);
  fixtureSubmit(engine, counter.id, { ...payment(counter), targetId: [attacker.instanceId] });
  fixturePassResponses(engine);
  expect(engine.state.players["player-two"].health).toBe(22);
  fixtureSubmit(engine, "declareObstructors", { obstructorIds: [blocker.instanceId] });
  for (let n = 0; n < 20 && engine.state.clash; n++) {
    const pass = engine
      .getInteractionView(engine.getActivePlayerId()!)
      .actions.find((a) => a.intent === "pass" && a.enabled);
    if (!pass) throw new Error("Missing native clash continuation");
    fixtureSubmit(engine, pass.id);
  }
  expect(engine.state.clash).toBeFalsy();
  expect(engine.state.cards[attacker.instanceId].zone).toBe("clash");
  expect(engine.state.cards[blocker.instanceId].zone).toBe("clash");
});

test("native cost previews disable unaffordable Portal and Weapon actions without mutation", () => {
  const engine = createAlphaClashVisualFixture("board-actions");
  fixtureSubmit(engine, "activatePortal");
  fixtureSubmit(engine, "activatePortal");
  const before = JSON.stringify(engine.state);
  const weapon = card(engine, "ac-ac5-028", "accessory");
  const attach = action(engine, `attachWeapon:${weapon.instanceId}`);
  expect(attach.enabled).toBe(false);
  expect(attach.disabledText?.key).toContain("black");
  expect(JSON.stringify(engine.state)).toBe(before);
  fixtureSubmit(engine, "activatePortal");
  fixtureSubmit(engine, "activatePortal");
  const portal = action(engine, "activatePortal");
  expect(portal.enabled).toBe(false);
  expect(portal.disabledText?.key).toBeTruthy();
});

test("native attack projection includes Contenders and engaged targets, with Close Combat scoped per attacker", () => {
  const engine = createAlphaClashVisualFixture("combat-target-legality");
  const before = JSON.stringify(engine.state);
  const attack = action(engine, "initiateClash");
  const sonoro = card(engine, "ac-ac1-027", "clash");
  const linn = card(engine, "ac-ac1-060", "clash");
  const ready = card(engine, "ac-ac1-027", "clash", "player-two");
  const engaged = card(engine, "ac-ac1-028", "clash", "player-two");
  const contender = card(engine, "ac-st-001", "contender");
  const attackers = attack.inputs[0];
  if (attackers.kind !== "entity-selection") throw new Error("Missing attackers");
  expect(attackers.candidates.map((c) => c.entity.instanceId)).toContain(contender.instanceId);
  const targetsFor = (id: string) => {
    const input = attack.inputs.find((i) => i.id === `targetId:${id}`);
    if (input?.kind !== "entity-selection") throw new Error("Missing native target branch");
    expect(input.requiredWhen).toEqual([{ all: [{ inputId: "attackerId", value: [id] }] }]);
    return input.candidates.map((c) => c.entity.instanceId);
  };
  expect(targetsFor(sonoro.instanceId)).toContain(engaged.instanceId);
  expect(targetsFor(sonoro.instanceId)).not.toContain(ready.instanceId);
  expect(targetsFor(linn.instanceId)).toContain(ready.instanceId);
  expect(JSON.stringify(engine.state)).toBe(before);
  fixtureSubmit(engine, attack.id, {
    attackerId: [linn.instanceId],
    [`targetId:${linn.instanceId}`]: [ready.instanceId],
  });
  // Empty response/buff windows resolve inside the accepted submission.
  // Prove the selected target's result rather than an expired clash snapshot.
  expect(engine.state.clash).toBeNull();
  expect(engine.state.cards[linn.instanceId]).toMatchObject({ zone: "clash", ready: false });
  expect(engine.state.cards[ready.instanceId].zone).toBe("oblivion");
  expect(engine.state.cards[engaged.instanceId]).toEqual(engaged);
  expect(engine.state.players["player-two"].health).toBe(30);
});

test.each(["flight", "torment"] as const)(
  "%s obstruction candidates and minima use native validation",
  (variant) => {
    const engine = createAlphaClashVisualFixture(`combat-obstruct-${variant}`);
    fixtureAttack(engine, variant === "flight" ? "ac-ac1-081" : "ac-ac6-016");
    for (let n = 0; n < 30 && engine.state.clash?.step !== "obstruct"; n++) {
      const choice = engine.state.pendingChoices[0];
      if (choice?.kind === "ordering")
        fixtureAnswer(engine, { order: choice.candidates.map((c) => c.id) });
      else if (choice?.kind === "modal" && choice.triggerOrder)
        fixtureAnswer(engine, { order: choice.options.map((o) => o.id) });
      else {
        const pass = engine
          .getInteractionView(engine.getActivePlayerId()!)
          .actions.find((a) => a.intent === "pass" && a.enabled);
        if (!pass) throw new Error(JSON.stringify(choice));
        fixtureSubmit(engine, pass.id);
      }
    }
    expect(engine.getInteractionView("bot").status).toBe("ready");
    expect(engine.getInteractionView("human").status).toBe("waiting");
    const input = action(engine, "declareObstructors").inputs[0];
    if (input.kind !== "entity-selection") throw new Error("Missing native obstructors");
    const ids = input.candidates.map((c) => c.entity.instanceId);
    const ordinary = card(engine, "ac-ac1-027", "clash", "player-two");
    expect(input.min).toBe(variant === "torment" ? 2 : 0);
    if (variant === "flight") expect(ids).not.toContain(ordinary.instanceId);
    else expect(ids).toContain(ordinary.instanceId);
    expect(ids).toContain(card(engine, "ac-ac1-060", "clash", "player-two").instanceId);
    const beforeInvalid = JSON.stringify(engine.state);
    expect(() =>
      fixtureSubmit(engine, "declareObstructors", {
        obstructorIds: variant === "flight" ? [ordinary.instanceId] : ids.slice(0, 1),
      }),
    ).toThrow();
    expect(JSON.stringify(engine.state)).toBe(beforeInvalid);
    const selected = ids.slice(0, variant === "torment" ? 2 : 1);
    const unselected = ids.filter((id) => !selected.includes(id));
    fixtureSubmit(engine, "declareObstructors", { obstructorIds: selected });
    expect(engine.state.clash).toBeNull();
    for (const id of selected)
      expect(engine.state.cards[id]).toMatchObject({ zone: "oblivion", ready: false });
    for (const id of unselected)
      expect(engine.state.cards[id]).toMatchObject({ zone: "clash", ready: true });
    // Iron Piston's native attack trigger grants Breakthrough; Plasmax has none.
    expect(engine.state.players["player-two"].health).toBe(variant === "torment" ? 27 : 30);
    if (variant === "flight")
      expect(engine.state.cards[ordinary.instanceId]).toMatchObject({ zone: "clash", ready: true });
  },
);

test.each(["lethal", "deckout"] as const)(
  "%s reaches game over through native commands",
  (variant) => {
    const engine = createAlphaClashVisualFixture(`finish-${variant}`);
    expect(engine.hasGameEnded()).toBe(false);
    if (variant === "deckout") fixtureSubmit(engine, "endTurn");
    else {
      fixtureAttack(engine);
      for (let n = 0; !engine.hasGameEnded() && n < 20; n++) {
        const pass = engine
          .getInteractionView(engine.getActivePlayerId()!)
          .actions.find((a) => a.intent === "pass" && a.enabled);
        if (!pass) throw new Error("Missing native lethal continuation");
        fixtureSubmit(engine, pass.id);
      }
    }
    expect(engine.hasGameEnded()).toBe(true);
    expect(engine.getGameEndResult()?.winnerId).toBe("human");
    for (const viewer of ["human", "bot"]) {
      expect(engine.getInteractionView(viewer).status).toBe("game-over");
      expect(engine.getInteractionView(viewer).actions).toHaveLength(0);
    }
  },
);

test.each([
  ["streak", "ac-ac1-077", 2],
  ["toxic", "ac-ac2-038", 3],
  ["bounty", "ac-ac3-106", 1],
  ["collection", "ac-ac2-094", 2],
] as const)(
  "counter gallery creates %s through native card play",
  (counter, definitionId, amount) => {
    const engine = createAlphaClashVisualFixture("counter-types");
    const source = card(engine, definitionId, "hand");
    const target =
      counter === "bounty"
        ? card(engine, "ac-ac1-027", "clash", "player-two")
        : counter === "collection"
          ? card(engine, "ac-ac7-128", "accessory")
          : source;
    const play = action(engine, `playCard:${source.instanceId}`);
    fixtureSubmit(engine, play.id, {
      ...payment(play),
      ...(target !== source ? { targetId: [target.instanceId] } : {}),
    });
    fixturePassResponses(engine);
    expect(engine.state.cards[target.instanceId].counters[counter]).toBe(amount);
  },
);

test("counter gallery creates Scarab through native Portal and Temper through attachment", () => {
  const engine = createAlphaClashVisualFixture("counter-types");
  fixtureSubmit(engine, "activatePortal");
  const choice = engine
    .getInteractionView(engine.getActivePlayerId()!)
    .actions.find((a) => a.id.startsWith("resolveChoice:"))!;
  const input = choice.inputs[0];
  const target = card(engine, "ac-ac1-027", "clash", "player-two");
  if (input.kind === "entity-selection") fixtureAnswer(engine, { [input.id]: [target.instanceId] });
  else if (input.kind === "option-selection")
    fixtureAnswer(engine, {
      [input.id]: [input.options.find((o) => o.entity?.instanceId === target.instanceId)!.id],
    });
  else throw new Error("No native Scarab target");
  fixturePassResponses(engine);
  // This official effect currently emits the title-case native key.
  expect(engine.state.cards[target.instanceId].counters.Scarab).toBe(1);
  const weapon = card(engine, "ac-st2-010", "accessory");
  const gearwin = card(engine, "ac-ac7-150", "clash");
  fixtureSubmit(engine, `attachWeapon:${weapon.instanceId}`, { targetId: [gearwin.instanceId] });
  fixtureAnswer(engine, { confirm: true });
  expect(engine.state.cards[weapon.instanceId].counters.temper).toBe(1);
});

test("Ambush Set supports Weapons and defers Clash responses until a later turn", () => {
  const engine = createAlphaClashVisualFixture("ambush-set-response");
  const gur = card(engine, "ac-ac3-007", "hand");
  const weapon = card(engine, "ac-ac7-065", "hand");
  fixtureSubmit(engine, `setCard:${weapon.instanceId}`);
  expect(engine.state.cards[weapon.instanceId].faceDown).toBe(true);
  fixtureSubmit(engine, "activatePortal");
  fixtureSubmit(engine, `setCard:${gur.instanceId}`);
  expect(
    projectState(engine.state, "player-two").cards.find((c) => c.instanceId === gur.instanceId)
      ?.definitionId,
  ).toBeNull();
  const ownPlay = card(engine, "ac-ac1-027", "hand");
  let play = action(engine, `playCard:${ownPlay.instanceId}`);
  fixtureSubmit(engine, play.id, payment(play));
  expect(engine.state.responseWindow).toBeNull();
  expect(engine.state.cards[ownPlay.instanceId].zone).toBe("clash");
  expect(engine.state.cards[gur.instanceId]).toMatchObject({ zone: "accessory", faceDown: true });
  expect(
    engine.getInteractionView("human").actions.some((a) => a.id === `respond:${gur.instanceId}`),
  ).toBe(false);
  fixturePassResponses(engine);
  fixtureSubmit(engine, "endTurn");
  fixtureSubmit(engine, "passResource");
  const opposingPlay = card(engine, "ac-ac1-027", "hand", "player-two");
  play = action(engine, `playCard:${opposingPlay.instanceId}`);
  fixtureSubmit(engine, play.id, payment(play));
  const respond = action(engine, `respond:${gur.instanceId}`);
  fixtureSubmit(engine, respond.id, payment(respond));
  fixturePassResponses(engine);
  expect(engine.state.cards[gur.instanceId].zone).toBe("clash");
  expect(engine.state.cards[gur.instanceId].faceDown).toBe(false);
});

test("Ambush response projection rejects wrong windows and missing native hosts", () => {
  const engine = createAlphaClashVisualFixture("ambush-set-response");
  for (const id of ["ac-ac3-007", "ac-ac7-065"])
    fixtureSubmit(engine, `setCard:${card(engine, id, "hand").instanceId}`);
  fixtureSubmit(engine, "activatePortal");
  fixtureSubmit(engine, "endTurn");
  fixtureSubmit(engine, "passResource");
  fixtureAttack(engine);
  const responses = engine
    .getInteractionView("human")
    .actions.filter((a) => a.id.startsWith("respond:"));
  // Gur is Counter-Play; Weaponry Morphing has no native Synthoria host here.
  expect(responses).toHaveLength(0);
});

test.each(["split", "concentrated"] as const)(
  "local prevention supports %s allocation through a real Counter chain",
  (variant) => {
    const engine = createAlphaClashVisualFixture("combat-prevention-local");
    const attacker = card(engine, "ac-ac1-027", "clash");
    const magnate = card(engine, "ac-ac1-028", "clash", "player-two");
    const plasmax = card(engine, "ac-ac1-081", "clash", "player-two");
    fixtureAttack(engine);
    const barricade = card(engine, "ac-ac1-069", "hand", "player-two");
    const response = action(engine, `respond:${barricade.instanceId}`);
    fixtureSubmit(engine, response.id, { ...payment(response), targetId: [magnate.instanceId] });
    const roll = card(engine, "ac-ac5-060", "hand");
    const counter = action(engine, `respond:${roll.instanceId}`);
    fixtureSubmit(engine, counter.id, { ...payment(counter), targetId: [attacker.instanceId] });
    fixturePassResponses(engine);
    fixtureSubmit(engine, "declareObstructors", {
      obstructorIds: [magnate.instanceId, plasmax.instanceId],
    });
    for (let n = 0; !engine.state.pendingChoices.length && engine.state.clash && n < 20; n++) {
      const next = engine
        .getInteractionView(engine.getActivePlayerId()!)
        .actions.find((a) => a.intent === "pass" && a.enabled);
      if (!next) throw new Error("No pass to local prevention");
      fixtureSubmit(engine, next.id);
    }
    const choice = engine
      .getInteractionView(engine.getActivePlayerId()!)
      .actions.find((a) => a.id.startsWith("resolveChoice:"))!;
    const allocation = choice.inputs.find((i) => i.kind === "entity-allocation");
    if (allocation?.kind !== "entity-allocation") throw new Error(JSON.stringify(choice));
    expect(allocation.candidates.map((c) => c.entity.instanceId).sort()).toEqual(
      [magnate.instanceId, plasmax.instanceId].sort(),
    );
    const before = JSON.stringify(engine.state);
    expect(() => fixtureAnswer(engine, { [allocation.id]: { [plasmax.instanceId]: 4 } })).toThrow();
    expect(JSON.stringify(engine.state)).toBe(before);
    fixtureAnswer(engine, {
      [allocation.id]:
        variant === "split"
          ? { [magnate.instanceId]: 1, [plasmax.instanceId]: 2 }
          : { [plasmax.instanceId]: 3 },
    });
    expect(engine.state.pendingChoices).toHaveLength(0);
    expect(engine.state.clash).toBeNull();
    expect(engine.state.damageDealtBySourceThisTurn[plasmax.instanceId] ?? 0).toBe(
      variant === "split" ? 2 : 1,
    );
    expect(engine.state.cards[attacker.instanceId].zone).toBe("oblivion");
    expect(engine.state.cards[magnate.instanceId].zone).toBe("clash");
    expect(engine.state.cards[plasmax.instanceId].zone).toBe("clash");
  },
);

test("Soul Barrier allocates one shared point between real non-clash damage recipients", () => {
  const engine = createAlphaClashVisualFixture("combat-prevention-non-clash");
  expect(engine.state.sharedDamageBarriers).toHaveLength(0);
  fixtureSubmit(engine, "activatePortal");
  const sonoro = card(engine, "ac-ac1-027", "hand");
  const play = action(engine, `playCard:${sonoro.instanceId}`);
  fixtureSubmit(engine, play.id, payment(play));
  const soul = card(engine, "ac-ac5-025", "accessory", "player-two");
  const response = action(engine, `respond:${soul.instanceId}`);
  fixtureSubmit(engine, response.id, payment(response));
  fixturePassResponses(engine);
  const sacrifice = Object.values(engine.state.cards).filter(
    (c) => c.zone === "clash" && c.controller === "player-two",
  );
  const sendChoice = engine
    .getInteractionView(engine.getActivePlayerId()!)
    .actions.find((a) => a.id.startsWith("resolveChoice:"))!;
  const sendInput = sendChoice.inputs[0];
  if (sendInput.kind !== "option-selection") throw new Error(JSON.stringify(sendChoice));
  const sendOption = sendInput.options.find(
    (o) => o.entity?.instanceId === sacrifice[0].instanceId,
  )!;
  fixtureAnswer(engine, { [sendInput.id]: [sendOption.id] });
  fixturePassResponses(engine);
  expect(engine.state.sharedDamageBarriers[0]?.remaining).toBe(1);
  fixtureAttack(engine, "ac-ac1-081");
  const erupting = card(engine, "ac-ac4-140", "accessory", "player-two");
  const damage = action(engine, `respond:${erupting.instanceId}`);
  const playerInput = damage.inputs.find((i) => i.id === "targetId");
  if (playerInput?.kind !== "entity-selection") throw new Error("Missing player target");
  expect(playerInput.entityKinds).toEqual(["player"]);
  expect(playerInput.candidates.map((c) => c.entity)).toEqual([
    { kind: "player", instanceId: "player-one" },
  ]);
  const beforeDeclaration = JSON.stringify(engine.state);
  for (const invalid of ["player-two", card(engine, "ac-st-001", "contender").instanceId]) {
    expect(() =>
      fixtureSubmit(engine, damage.id, { ...payment(damage), targetId: [invalid] }),
    ).toThrow();
    expect(JSON.stringify(engine.state)).toBe(beforeDeclaration);
  }
  fixtureSubmit(engine, damage.id, { ...payment(damage), targetId: ["player-one"] });
  fixturePassResponses(engine);
  const choice = engine
    .getInteractionView(engine.getActivePlayerId()!)
    .actions.find((a) => a.id.startsWith("resolveChoice:"));
  const allocation = choice?.inputs.find((i) => i.kind === "entity-allocation");
  if (allocation?.kind !== "entity-allocation") throw new Error(JSON.stringify(choice));
  expect(engine.getActivePlayerId()).toBe("bot");
  expect(allocation.candidates.map((c) => c.entity.instanceId).sort()).toEqual(
    sacrifice
      .slice(1)
      .map((c) => c.instanceId)
      .sort(),
  );
  expect(
    engine.getInteractionView("human").actions.some((a) => a.id.startsWith("resolveChoice:")),
  ).toBe(false);
  const beforeAllocation = JSON.stringify(engine.state);
  for (const invalid of [{}, { [sacrifice[1].instanceId]: 2 }]) {
    expect(() => fixtureAnswer(engine, { [allocation.id]: invalid })).toThrow();
    expect(JSON.stringify(engine.state)).toBe(beforeAllocation);
  }
  fixtureAnswer(engine, { [allocation.id]: { [sacrifice[1].instanceId]: 1 } });
  expect(engine.state.cards[sacrifice[1].instanceId].zone).toBe("clash");
  expect(engine.state.cards[sacrifice[2].instanceId].zone).toBe("oblivion");
  expect(engine.state.sharedDamageBarriers.every((b) => b.remaining === 0)).toBe(true);
  expect(engine.state.pendingChoices).toHaveLength(0);
});

test.each([
  ["forced", false],
  ["forced-unable", false],
  ["forced", true],
  ["forced-unable", true],
] as const)(
  "War's native trigger handles %s obstruction with explicit companion %s",
  (variant, companion) => {
    const engine = createAlphaClashVisualFixture(`combat-obstruct-${variant}`);
    const demanded = card(engine, "ac-ac1-027", "clash", "player-two");
    fixtureAttack(engine, "ac-ac2-108");
    const trigger = engine
      .getInteractionView(engine.getActivePlayerId()!)
      .actions.find((a) => a.id.startsWith("resolveChoice:"))!;
    const target = trigger.inputs[0];
    if (target.kind !== "entity-selection") throw new Error(JSON.stringify(trigger));
    fixtureAnswer(engine, { [target.id]: [demanded.instanceId] });
    fixturePassResponses(engine);
    passUntil(engine, "obstruct");
    expect(engine.state.clash?.requiredObstructorIds).toContain(demanded.instanceId);
    const additional = card(engine, "ac-ac1-060", "clash", "player-two");
    if (companion)
      fixtureSubmit(engine, "declareObstructors", { obstructorIds: [additional.instanceId] });
    else fixtureSubmit(engine, "passObstruct");
    expect(engine.state.clash).toBeNull();
    expect(engine.state.cards[demanded.instanceId]).toMatchObject({
      zone: variant === "forced" ? "oblivion" : "clash",
      ready: false,
    });
    expect(engine.state.cards[additional.instanceId]).toMatchObject({
      zone: companion ? "oblivion" : "clash",
      ready: !companion,
    });
    // Only the unable/no-companion case leaves the Contender unobstructed.
    expect(engine.state.players["player-two"].health).toBe(
      variant === "forced-unable" && !companion ? 27 : 30,
    );
  },
);

test("resource chronology remains separate from valid card construction", () => {
  const engine = createAlphaClashVisualFixture("resource-payment");
  expect(auditNativeFixtureLegality(engine.state).resourceHistoryGaps).toEqual([]);
  const tooEarly = { ...engine.state, turnNumber: 3 };
  const audit = auditNativeFixtureLegality(tooEarly);
  expect(audit.construction).toBe("valid");
  expect(audit.resourceHistoryGaps).toEqual([
    "player-one: 4 resources exceed 2 ordinary Resource Steps; effect provenance required.",
  ]);
  expect(
    auditNativeFixtureLegality(createAlphaClashVisualFixture("arena-crowded").state)
      .resourceHistoryGaps,
  ).toEqual([]);
});

test("all native initial boards fit ordinary resource opportunities", () => {
  const gaps = alphaClashVisualFixtures.flatMap((fixture) => {
    const audit = auditNativeFixtureLegality(createAlphaClashVisualFixture(fixture.id).state);
    return audit.resourceHistoryGaps.map((reason) => ({ id: fixture.id, reason }));
  });
  expect(gaps).toEqual([]);
});

test("resource chronology accounts for waiting seat and an unfinished Resource Step", () => {
  const engine = createAlphaClashVisualFixture("resource-step");
  expect(auditNativeFixtureLegality(engine.state).resourceHistoryGaps).toEqual([]);
  const early = auditNativeFixtureLegality({ ...engine.state, turnNumber: 3 });
  expect(early.resourceHistoryGaps).toEqual([
    "player-two: 2 resources exceed 1 ordinary Resource Steps; effect provenance required.",
  ]);
  const firstTurn = auditNativeFixtureLegality({ ...engine.state, turnNumber: 1 });
  expect(firstTurn.resourceHistoryGaps).toContain(
    "player-one: 1 resources exceed 0 ordinary Resource Steps; effect provenance required.",
  );
});

test.each([
  ["board-actions", 2],
  ["portal-reduced", 1],
  ["portal-increased", 3],
] as const)(
  "%s uses native Portal costs on both transitions and rejects an unaffordable retry",
  (id, cost) => {
    const engine = createAlphaClashVisualFixture(id);
    const ready = () =>
      Object.values(engine.state.cards).filter(
        (card) => card.controller === "player-one" && card.zone === "resource" && card.ready,
      ).length;
    const initial = ready();
    for (let index = 0; index < Math.floor(initial / cost); index++) {
      const before = ready();
      fixtureSubmit(engine, "activatePortal");
      expect(ready()).toBe(before - cost);
      expect(engine.state.portalOpen).toBe(index % 2 === 0);
    }
    const state = structuredClone(engine.state);
    const view = engine.getInteractionView("human");
    const action = view.actions.find((entry) => entry.id === "activatePortal")!;
    expect(action.enabled).toBe(false);
    expect(action.disabledText?.key).toBeTruthy();
    const result = engine.submitInteraction(
      "human",
      {
        protocolVersion: INTERACTION_PROTOCOL_VERSION,
        stateVersion: view.stateVersion,
        requestId: action.requestId,
        actionId: action.id,
        values: {},
      },
      { gameId: "portal-boundaries", sourceAuthority: "server" },
    );
    expect(result.success).toBe(false);
    expect(engine.state).toEqual(state);
  },
);

test("card actions across native starting boards identify a visible source for inspection", () => {
  const families = new Set<string>();
  for (const fixture of alphaClashVisualFixtures) {
    const engine = createAlphaClashVisualFixture(fixture.id);
    for (const seat of ["player-one", "player-two"] as const) {
      const projection = projectState(engine.state, seat);
      for (const action of engine.getInteractionView(engine.seatToPlayerId[seat]).actions) {
        const family = action.id.split(":")[0];
        if (
          ![
            "playCard",
            "setCard",
            "respond",
            "attachWeapon",
            "detachWeapon",
            "activateAbility",
          ].includes(family)
        )
          continue;
        families.add(family);
        const context = `${fixture.id}/${seat}/${action.id}`;
        expect(action.source, context).toBeDefined();
        const source = projection.cards.find(
          (card) => card.instanceId === action.source?.instanceId,
        );
        expect(source, context).toBeDefined();
        expect(source?.controller, context).toBe(seat);
        expect(source?.definitionId, context).toBeTruthy();
        expect(action.id.startsWith(`${family}:${source?.instanceId}`), context).toBe(true);
      }
    }
  }
  // Starting boards have no pending response window or pre-attached Weapons.
  expect([...families].sort()).toEqual(["activateAbility", "attachWeapon", "playCard", "setCard"]);
});

test("public decision seat follows native War choice and obstruction without exposing opponent choices", () => {
  const engine = createAlphaClashVisualFixture("combat-obstruct-forced-unable");
  fixtureAttack(engine, "ac-ac2-108");
  const own = engine.getViewerState({ role: "player", actorId: "human" });
  const other = engine.getViewerState({ role: "player", actorId: "bot" });
  expect(own.decisionSeat).toBe("player-one");
  expect(other.decisionSeat).toBe("player-one");
  expect(own.responseWindow?.openFor).toBe("player-two");
  expect(own.pendingChoices.length).toBeGreaterThan(0);
  expect(other.pendingChoices).toHaveLength(0);
  expect(engine.getViewerState({ role: "spectator" }).decisionSeat).toBe("player-one");
  const trigger = action(engine, `resolveChoice:${own.pendingChoices[0].id}`);
  const target = trigger.inputs[0];
  if (target.kind !== "entity-selection") throw new Error("Missing native target");
  fixtureAnswer(engine, {
    [target.id]: [card(engine, "ac-ac1-027", "clash", "player-two").instanceId],
  });
  const obstruct = engine.getViewerState({ role: "player", actorId: "bot" });
  expect(obstruct.clash?.step).toBe("obstruct");
  expect(obstruct.decisionSeat).toBe("player-two");
  expect(obstruct.activePlayer).toBe("player-one");
  expect(obstruct.responseWindow).toBeNull();
});
