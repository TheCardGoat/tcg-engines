import { divineComedy, shiftingCurrents } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveCard,
  GrandArchiveCardFilter,
  GrandArchiveEffect,
  GrandArchiveTargetDeclaration,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "../../testing/test-engine.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";

function card(
  id: string,
  type: "ACTION" | "CHAMPION" | "ALLY",
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
        ...(type === "CHAMPION" ? { lineageName: "Kongming" } : {}),
        cost: { kind: "reserve", amount: 0 },
        typeLine: { types: [type], classes: ["MAGE"], subtypes: [], supertypes: [] },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        stats: type === "CHAMPION" ? { level: 0, life: 30 } : { life: 10, power: 1 },
        rulesText: "",
        abilities,
      },
    },
  };
}
const champion = card("mastery-source-champion", "CHAMPION");
const ally = card("mastery-source-ally", "ALLY");
const protectedAlly = card("mastery-source-protected", "ALLY", [
  {
    id: "protected-a1",
    kind: "static",
    staticKind: "intrinsic",
    text: "Spellshroud",
    keyword: { name: "spellshroud" },
  },
]);
const target: GrandArchiveTargetDeclaration = {
  id: "target",
  kind: "target",
  declared: "announcement",
  chooser: "controller",
  count: { kind: "exactly", amount: 1 },
  unique: true,
  candidates: { kind: "object", zones: ["field"], filter: { kind: "type", oneOf: ["ALLY"] } },
};
const mark: GrandArchiveEffect = {
  kind: "add-counter",
  subject: { kind: "bound", binding: "target" },
  counter: { named: "marked" },
  amount: 1,
};
const spellMastery: GrandArchiveCard<GrandArchiveAbilityDefinition, "mastery-representation"> = {
  canonicalId: "mastery-source-test-spell",
  slug: "mastery-source-test-spell",
  definitionKind: "mastery-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "mastery-source-test-spell:face:default",
      catalogId: "mastery-source-test-spell",
      name: "Test Spell Mastery",
      cost: { kind: "none" },
      typeLine: { types: ["MASTERY"], classes: ["MAGE"], subtypes: ["SPELL"], supertypes: [] },
      elements: [],
      stats: {},
      rulesText: "At the beginning of your end phase, mark target ally.",
      abilities: [
        {
          id: "test-spell-a1",
          kind: "triggered",
          text: "Mark target ally.",
          trigger: {
            kind: "event",
            event: { name: "phase-begins", phase: "end", actor: "controller" },
          },
          targets: [target],
          effect: mark,
        },
      ],
    },
  },
};
function action(
  id: string,
  effect: GrandArchiveEffect,
  targets?: readonly GrandArchiveTargetDeclaration[],
) {
  return card(id, "ACTION", [
    { id: `${id}-a1`, kind: "card-resolution", text: id, effect, ...(targets ? { targets } : {}) },
  ]);
}
const grantProtection = action(
  "mastery-source-grant-protection",
  {
    kind: "continuous",
    subjects: { kind: "bound", binding: "target" },
    affectedSet: "locked",
    duration: { kind: "until-end-of-turn", whose: "controller" },
    layer: { layer: "D", modifies: "ability" },
    change: { kind: "grant-keyword", keyword: { name: "spellshroud" } },
  },
  [target],
);

function pass(engine: GrandArchiveTestEngine) {
  const wait = engine.waitState();
  if (wait.kind !== "opportunity") throw new Error(`Expected opportunity, got ${wait.kind}`);
  engine.player(wait.playerId).pass();
}
function drain(engine: GrandArchiveTestEngine) {
  for (let i = 0; engine.state.stack.length && i < 30; i++) pass(engine);
  expect(engine.state.stack).toHaveLength(0);
}
function setup(
  mastery = spellMastery,
  hand: readonly GrandArchiveCard<GrandArchiveAbilityDefinition>[] = [grantProtection],
  onlyProtected = false,
  extraDefinitions: readonly (typeof spellMastery)[] = [],
) {
  const face =
    mastery.layout.kind === "single-faced" ? mastery.layout.face : mastery.layout.defaultFace;
  const gain = action("mastery-source-gain", {
    kind: "gain-mastery",
    player: "controller",
    mastery: face.name,
  });
  const engine = GrandArchiveTestEngine.startFixture({
    playerOne: { champion, zones: { hand: [gain], "main-deck": [ally, ally] } },
    playerTwo: {
      champion,
      zones: {
        hand,
        field: onlyProtected ? [protectedAlly] : [ally, protectedAlly],
        "main-deck": [ally, ally],
      },
    },
    definitions: [mastery, ...extraDefinitions],
  });
  engine.player("player-one").activate(gain);
  drain(engine);
  for (let i = 0; engine.state.turn.phase !== "end" && i < 20; i++) pass(engine);
  expect(engine.state.turn.phase).toBe("end");
  return engine;
}
function announce(engine: GrandArchiveTestEngine, ref = ally) {
  const decision = engine.state.decision;
  if (!decision || decision.kind !== "announce-triggered-ability")
    throw new Error("Missing mastery announcement");
  return engine.player(decision.playerId).tryExecute({
    move: "answer-decision",
    decisionId: decision.id,
    stateVersion: decision.stateVersion,
    answer: {
      targets: { target: [engine.player("player-two").card(ref, { zone: "field" }).objectId] },
    },
  });
}

describe("non-object mastery source characteristics", () => {
  it("puts a mastery-sourced reflexive effect on its own stack layer and restores it", () => {
    if (spellMastery.layout.kind !== "single-faced") throw new Error("Expected fixture face");
    const reflexiveMastery: typeof spellMastery = {
      ...spellMastery,
      layout: {
        kind: "single-faced",
        face: {
          ...spellMastery.layout.face,
          abilities: spellMastery.layout.face.abilities.map((ability) =>
            ability.kind === "triggered" && ability.effect
              ? {
                  ...ability,
                  effect: {
                    kind: "reflexive",
                    action: mark,
                    consequence: {
                      kind: "add-counter",
                      subject: { kind: "bound", binding: "target" },
                      counter: { named: "follow-up" },
                      amount: 1,
                    },
                  },
                }
              : ability,
          ),
        },
      },
    };
    let engine = setup(reflexiveMastery);
    expect(announce(engine).ok).toBe(true);
    pass(engine);
    pass(engine);
    const allyId = engine.player("player-two").card(ally, { zone: "field" }).objectId;
    expect(engine.state.objects[allyId]?.counters["named:marked"]).toBe(1);
    expect(engine.state.objects[allyId]?.counters["named:follow-up"] ?? 0).toBe(0);
    expect(engine.state.stack).toHaveLength(1);
    expect(engine.state.stack[0]?.masterySource).toEqual({
      playerId: "player-one",
      name: "Test Spell Mastery",
    });
    expect(engine.state.stack[0]?.sourceId).toBeUndefined();
    engine = GrandArchiveTestEngine.fromState(
      engine.program,
      restoreGrandArchiveMatchSnapshot(
        engine.program,
        JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(engine.state))),
      ),
    );
    drain(engine);
    expect(engine.state.objects[allyId]?.counters["named:follow-up"]).toBe(1);
  });
  it("allows a non-Spell mastery trigger to target Spellshroud", () => {
    if (spellMastery.layout.kind !== "single-faced")
      throw new Error("Expected single-faced fixture");
    const skillMastery: typeof spellMastery = {
      ...spellMastery,
      layout: {
        kind: "single-faced",
        face: {
          ...spellMastery.layout.face,
          typeLine: { ...spellMastery.layout.face.typeLine, subtypes: ["SKILL"] },
        },
      },
    };
    const engine = setup(skillMastery);
    expect(announce(engine, protectedAlly).ok).toBe(true);
    drain(engine);
    expect(
      engine.state.objects[
        engine.player("player-two").card(protectedAlly, { zone: "field" }).objectId
      ]?.counters["named:marked"],
    ).toBe(1);
  });

  it.each<GrandArchiveCardFilter>([
    { kind: "subtype", oneOf: ["SPELL"] },
    {
      kind: "all",
      filters: [
        { kind: "class", oneOf: ["MAGE"] },
        { kind: "name", value: "Shifting Currents" },
      ],
    },
  ])("allows targeting a Shifting Currents trigger by its printed source: %j", (sourceFilter) => {
    const inspect = action("mastery-source-inspect", { kind: "no-op" }, [
      {
        ...target,
        candidates: { kind: "stack-item", itemTypes: ["ability"], sourceFilter },
      },
    ]);
    const engine = setup(shiftingCurrents, [inspect]);
    const item = engine.state.stack.find((candidate) => candidate.masterySource);
    expect(item).toBeDefined();
    expect(item?.sourceId).toBeUndefined();
    expect(
      Object.values(engine.state.objects).some(
        (object) => object.definitionId === shiftingCurrents.canonicalId,
      ),
    ).toBe(false);
    if (engine.state.opportunity?.holderId === "player-one") pass(engine);
    engine.player("player-two").activate(inspect, { targets: { target: [item!.id] } });
  });

  it("rejects a Spellshroud target during the mastery announcement", () => {
    const engine = setup();
    const state = engine.state;
    expect(announce(engine, protectedAlly).ok).toBe(false);
    expect(engine.state).toBe(state);
    expect(announce(engine).ok).toBe(true);
    drain(engine);
    expect(
      engine.state.objects[engine.player("player-two").card(ally, { zone: "field" }).objectId]
        ?.counters["named:marked"],
    ).toBe(1);
  });

  it("does not request an impossible announcement when all allies have Spellshroud", () => {
    const engine = setup(spellMastery, [], true);
    expect(engine.state.decision).toBeNull();
    expect(engine.state.stack).toHaveLength(0);
    expect(engine.state.pendingTriggers).toHaveLength(0);
  });

  it("rechecks protection granted in response after restoring the pending mastery trigger", () => {
    let engine = setup();
    expect(announce(engine).ok).toBe(true);
    if (engine.state.opportunity?.holderId === "player-one") pass(engine);
    const allyId = engine.player("player-two").card(ally, { zone: "field" }).objectId;
    engine.player("player-two").activate(grantProtection, { targets: { target: [allyId] } });
    while (engine.state.stack.length > 1) pass(engine);
    engine = GrandArchiveTestEngine.fromState(
      engine.program,
      restoreGrandArchiveMatchSnapshot(
        engine.program,
        serializeGrandArchiveMatchSnapshot(engine.state),
      ),
    );
    drain(engine);
    expect(engine.state.objects[allyId]?.counters["named:marked"] ?? 0).toBe(0);
  });

  it("retains the pending Spell source after its player replaces that mastery", () => {
    const replace = action("mastery-source-replace", {
      kind: "gain-mastery",
      player: "opponent",
      mastery: "Divine Comedy",
    });
    const engine = setup(spellMastery, [replace, grantProtection], false, [divineComedy]);
    expect(announce(engine).ok).toBe(true);
    if (engine.state.opportunity?.holderId === "player-one") pass(engine);
    engine.player("player-two").activate(replace);
    while (engine.state.stack.length > 1) pass(engine);
    expect(engine.state.players[engine.player("player-one").id]?.mastery?.name).toBe(
      "Divine Comedy",
    );
    if (engine.state.opportunity?.holderId === "player-one") pass(engine);
    const allyId = engine.player("player-two").card(ally, { zone: "field" }).objectId;
    engine.player("player-two").activate(grantProtection, { targets: { target: [allyId] } });
    drain(engine);
    expect(engine.state.objects[allyId]?.counters["named:marked"] ?? 0).toBe(0);
  });

  it("preserves the original mastery source when an opponent copies and retargets its trigger", () => {
    const copy = action(
      "mastery-source-copy",
      {
        kind: "copy",
        copy: "ability",
        subject: { kind: "bound", binding: "target" },
        mayChooseNewTargets: true,
      },
      [{ ...target, candidates: { kind: "stack-item", itemTypes: ["ability"] } }],
    );
    let engine = setup(spellMastery, [copy]);
    expect(announce(engine).ok).toBe(true);
    const original = engine.state.stack.find((item) => item.masterySource)!;
    if (engine.state.opportunity?.holderId === "player-one") pass(engine);
    engine.player("player-two").activate(copy, { targets: { target: [original.id] } });
    for (let i = 0; !engine.state.decision && i < 20; i++) pass(engine);
    const optional = engine.state.decision;
    if (!optional || optional.kind !== "resolve-optional-effect")
      throw new Error("Missing copy target option");
    engine.player(optional.playerId).execute({
      move: "answer-decision",
      decisionId: optional.id,
      stateVersion: optional.stateVersion,
      answer: true,
    });
    engine = GrandArchiveTestEngine.fromState(
      engine.program,
      restoreGrandArchiveMatchSnapshot(
        engine.program,
        JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(engine.state))),
      ),
    );
    const decision = engine.state.decision;
    if (!decision || decision.kind !== "retarget-stack-item")
      throw new Error("Missing copy retargeting");
    const answer = (ref: typeof ally) =>
      engine.player(decision.playerId).tryExecute({
        move: "answer-decision",
        decisionId: decision.id,
        stateVersion: decision.stateVersion,
        answer: {
          targets: { target: [engine.player("player-two").card(ref, { zone: "field" }).objectId] },
        },
      });
    const before = engine.state;
    expect(answer(protectedAlly).ok).toBe(false);
    expect(engine.state).toBe(before);
    expect(answer(ally).ok).toBe(true);
    expect(engine.state.stack.at(-1)).toMatchObject({
      isCopy: true,
      controllerId: "player-two",
      masterySource: original.masterySource,
    });
    drain(engine);
    expect(
      engine.state.objects[engine.player("player-two").card(ally, { zone: "field" }).objectId]
        ?.counters["named:marked"],
    ).toBe(2);
  });

  it.each<GrandArchiveCardFilter>([
    { kind: "subtype", oneOf: ["SKILL"] },
    { kind: "not", filter: { kind: "subtype", oneOf: ["SPELL"] } },
    { kind: "zone", oneOf: ["field"] },
  ])("does not invent a matching characteristic or field object: %j", (sourceFilter) => {
    const inspect = action("mastery-source-inspect-negative", { kind: "no-op" }, [
      {
        ...target,
        candidates: { kind: "stack-item", itemTypes: ["ability"], sourceFilter },
      },
    ]);
    const engine = setup(shiftingCurrents, [inspect]);
    const item = engine.state.stack.find((candidate) => candidate.masterySource)!;
    if (engine.state.opportunity?.holderId === "player-one") pass(engine);
    const before = engine.state;
    expect(
      engine.player("player-two").tryExecute({
        move: "activate-card",
        cardId: engine.player("player-two").card(inspect).objectId,
        targets: { target: [item.id] },
      }).ok,
    ).toBe(false);
    expect(engine.state).toBe(before);
  });
});
