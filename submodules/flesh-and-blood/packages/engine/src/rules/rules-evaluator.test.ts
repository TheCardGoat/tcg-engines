import type {
  FabBaseObjectProperties,
  FabCondition,
  FabEffect,
  FabKeyword,
  FabNumericProperty,
} from "@tcg/flesh-and-blood-types";
import { describe, expect, it } from "vite-plus/test";
import { compileFabContinuousEffect } from "./continuous/compiler.ts";
import type { FabContinuousAtom, FabResolvedBindings } from "./continuous/ir.ts";
import {
  evaluateFabRules,
  EMPTY_RULES_FACTS,
  FabRulesOrderingRequiredError,
} from "./rules-evaluator.ts";
import type { FabActiveContinuousAtom, FabRulesBaseObject, FabRulesFacts } from "./rules-view.ts";
import { fabPlayerId } from "../game/identity.ts";

const FALSE_PERFORMED_THIS_TURN = {
  transcend: false,
  "create-fealty-token": false,
  "play-draconic-card": false,
  "create-card": false,
  "activate-cannon": false,
  "activate-weapon": false,
  "phantasm-destroy-illusionist-attack-action": false,
  "play-or-activate": false,
  "destroy-item": false,
  charge: false,
  boost: false,
  crank: false,
  usurp: false,
  cheered: false,
  booed: false,
  "intimidate-an-opponent": false,
  "beat-chest": false,
  "play-or-create-aura": false,
  "put-card-into-soul": false,
  "deal-damage": false,
  "be-dealt-damage": false,
  "banish-from-boost": false,
  "evo-banish-from-boost": false,
  "control-toughness": false,
  "control-seismic-surge": false,
  "put-blue-card-into-graveyard": false,
  draw: false,
  "play-non-attack-action": false,
  "play-another-blue-card": false,
  "play-another-red-card": false,
  "attack-with-weapon": false,
  "deal-arcane-damage": false,
  hit: false,
  fuse: false,
  "fuse-ice": false,
  "fuse-lightning": false,
  "fuse-earth": false,
  "roll-4-or-higher": false,
  "roll-5-or-higher": false,
  "roll-6": false,
  "banish-power-6": false,
  "discard-power-6": false,
  "pitch-power-6": false,
  "discard-power-6-for-cost": false,
  "complete-contract": false,
  "create-crouching-tiger": false,
  "attack-with-crouching-tiger": false,
  "create-seismic-surge": false,
  "create-or-activate-gate-to-iarathael": false,
  "destroy-lightning-flow": false,
  "destroy-aura": false,
  "create-or-steal-gold": false,
  "banish-earth-card": false,
  "lose-life": false,
  "attack-or-defend-attack-action": false,
  "weapon-hit": false,
  "fragment-attack": false,
  "holo-aura-entered": false,
  "herald-into-soul": false,
  "yellow-into-soul": false,
  "physical-damage": false,
} as const;

const emptyBindings: FabResolvedBindings = { objects: {}, numbers: {}, strings: {} };

describe("pure staged rules evaluator", () => {
  it("matches exact type-box categories without legacy cross-category coercion", () => {
    const weapon = baseObject("weapon", {}, [], ["Weapon"], ["Sword"], ["Warrior"]);
    const view = evaluateFabRules({ objects: [weapon], atoms: [] });
    const evaluated = view.object(weapon.ref)!;
    const context = { controllerId: "p1", source: weapon.ref, bindings: emptyBindings };

    expect(
      view.matchesFilter(
        evaluated,
        { typeBox: { types: ["Weapon"], subtypes: ["Sword"], supertypes: ["Warrior"] } },
        context,
      ),
    ).toBe(true);
    expect(view.matchesFilter(evaluated, { typeBox: { types: ["Action"] } }, context)).toBe(false);
  });

  it("matches binding-relative type-box overlap without synthetic vocabulary", () => {
    const banished = baseObject("banished", {}, [], ["Equipment"], ["Head"]);
    const sameSlot = baseObject("same-slot", {}, [], ["Equipment"], ["Head"]);
    const otherSlot = baseObject("other-slot", {}, [], ["Equipment"], ["Chest"]);
    const view = evaluateFabRules({ objects: [banished, sameSlot, otherSlot], atoms: [] });
    const filter = {
      sameTypeBoxAs: {
        binding: "banished",
        categories: ["subtypes"],
        comparison: "overlap",
      },
    } as const;
    const context = {
      controllerId: "p1",
      source: banished.ref,
      bindings: { ...emptyBindings, objects: { banished: [banished.ref] } },
    };

    expect(view.matchesFilter(view.object(sameSlot.ref)!, filter, context)).toBe(true);
    expect(view.matchesFilter(view.object(otherSlot.ref)!, filter, context)).toBe(false);
    expect(
      view.matchesFilter(view.object(sameSlot.ref)!, filter, {
        ...context,
        bindings: emptyBindings,
      }),
    ).toBe(false);
  });

  it("matches cards whose controller currently controls a filtered arena object", () => {
    const target = {
      ...baseObject("target"),
      ownerId: "p2",
      controllerId: "p2",
      zone: { playerId: fabPlayerId("p2"), zone: "hand" as const },
    };
    const disease = {
      ...baseObject("bloodrot-pox", {}, [], ["Token"], ["Aura", "Disease"]),
      ownerId: "p2",
      controllerId: "p2",
      zone: { playerId: fabPlayerId("p2"), zone: "arena" as const },
    };
    const view = evaluateFabRules({ objects: [target, disease], atoms: [] });
    const context = { controllerId: "p1", source: target.ref, bindings: emptyBindings };

    expect(
      view.matchesFilter(
        view.object(target.ref)!,
        { controllerControls: { typeBox: { subtypes: ["Disease"] } } },
        context,
      ),
    ).toBe(true);
  });

  it("source-damage-dealt reads per-source realized damage (Surge CR 8.4.8)", () => {
    const source = baseObject("src-1");
    const facts: FabRulesFacts = {
      ...EMPTY_RULES_FACTS,
      sourceDamageDealtThisTurn: { "src-1": 5 },
    };
    const view = evaluateFabRules({ objects: [source], atoms: [], facts });
    const context = { controllerId: "p1", source: source.ref, bindings: emptyBindings };

    expect(
      view.evaluateCondition(
        { type: "source-damage-dealt", per: "turn", comparison: { op: "gt", value: 4 } },
        context,
      ),
    ).toBe(true);
    expect(
      view.evaluateCondition(
        { type: "source-damage-dealt", per: "turn", comparison: { op: "gt", value: 5 } },
        context,
      ),
    ).toBe(false);
    const other = baseObject("src-2");
    const otherContext = { controllerId: "p1", source: other.ref, bindings: emptyBindings };
    expect(
      view.evaluateCondition(
        { type: "source-damage-dealt", per: "turn", comparison: { op: "gte", value: 1 } },
        otherContext,
      ),
    ).toBe(false);
    expect(
      view.evaluateCondition(
        { type: "source-damage-dealt", per: "chain-link", comparison: { op: "gte", value: 1 } },
        context,
      ),
    ).toBe(false);
  });

  it("source-damage-dealt toHero reads only hero-targeted damage (Surge '...to a hero' CR 8.4.8)", () => {
    // Source dealt 6 total but only 4 to a hero (2 to a permanent).
    const source = baseObject("src-1");
    const facts: FabRulesFacts = {
      ...EMPTY_RULES_FACTS,
      sourceDamageDealtThisTurn: { "src-1": 6 },
      sourceDamageDealtToHeroThisTurn: { "src-1": 4 },
    };
    const view = evaluateFabRules({ objects: [source], atoms: [], facts });
    const context = { controllerId: "p1", source: source.ref, bindings: emptyBindings };

    // Thresholds separate the two maps: total 6 > 5, but the hero share 4 ≯ 5.
    expect(
      view.evaluateCondition(
        { type: "source-damage-dealt", per: "turn", comparison: { op: "gt", value: 5 } },
        context,
      ),
    ).toBe(true);
    expect(
      view.evaluateCondition(
        {
          type: "source-damage-dealt",
          per: "turn",
          comparison: { op: "gt", value: 5 },
          toHero: true,
        },
        context,
      ),
    ).toBe(false);
    // Hero-only with a threshold the hero share clears (4 > 3).
    expect(
      view.evaluateCondition(
        {
          type: "source-damage-dealt",
          per: "turn",
          comparison: { op: "gt", value: 3 },
          toHero: true,
        },
        context,
      ),
    ).toBe(true);
  });

  it("count evos-equipped counts Evo objects in equipment/weapon zones (CR 8.4.11)", () => {
    // "Evo" is a Mechanologist subtype token. The normalized runtime type box
    // routes it to subtypes (FAB_SUBTYPES — see reducers/mechanics.ts and
    // automation isEvo), while module authoring lines and hand-built fixtures
    // may carry it in `types`; both shapes must count. baseObject's `types`
    // param is the narrower FAB_TYPES union, so override the typeBox and cast
    // (same reality as matches-filter).
    const inZone = (
      id: string,
      zone: string,
      typeLine: readonly string[],
      subtypes: readonly string[] = [],
      playerId = "p1",
    ): FabRulesBaseObject => {
      const obj = baseObject(id);
      return {
        ...obj,
        zone: { playerId: fabPlayerId(playerId), zone },
        base: {
          ...obj.base,
          typeBox: { ...obj.base.typeBox, types: typeLine, subtypes },
        },
      } as FabRulesBaseObject as FabRulesBaseObject;
    };
    const evoArms = inZone("evo-arms", "arms", ["Equipment", "Evo"]);
    const evoWeapon = inZone("evo-weapon", "weapon1", ["Equipment", "Evo"]);
    const nonEvoHead = inZone("non-evo-head", "head", ["Equipment"], ["Base", "Head"]);
    const evoOnStack = inZone("evo-stack", "stack", ["Equipment", "Evo"]);
    // Runtime catalog shape: "Evo" carried in subtypes (EVO030-style objects).
    const evoHeadRuntime = inZone("evo-head-runtime", "head", ["Equipment"], ["Evo", "Head"]);
    // Opponent-seat evos never count for the controller.
    const evoOpponent = inZone("evo-opponent", "head", ["Equipment", "Evo"], [], "p2");
    // Defending equipment remains equipped on the combat chain.
    const evoDefending = inZone("evo-defending", "combatChain", ["Equipment", "Evo"]);
    const view = evaluateFabRules({
      objects: [
        evoArms,
        evoWeapon,
        nonEvoHead,
        evoOnStack,
        evoHeadRuntime,
        evoOpponent,
        evoDefending,
      ],
      atoms: [],
    });
    const context = { controllerId: "p1", source: evoArms.ref, bindings: emptyBindings };

    expect(
      view.evaluateAmount({ type: "count", what: "evos-equipped", player: "controller" }, context)
        .value,
    ).toBe(4);
  });

  it("has-status yellow-card-put-into-soul-this-turn survives after the yellow card leaves soul", () => {
    // Beaming Blade (DTD046): the qualifying put event is a this-turn fact.
    // After charging a yellow card and banishing it, the history scan must
    // still see the soul entry without requiring current soul membership.
    const leftSoulYellow = {
      ...baseObject("left-soul-yellow"),
      zone: { playerId: fabPlayerId("p1"), zone: "banished" },
      base: { ...baseObject("left-soul-yellow").base, color: "yellow" },
      history: {
        moves: [
          {
            from: { playerId: fabPlayerId("p1"), zone: "hand" },
            to: { playerId: fabPlayerId("p1"), zone: "soul" },
            eventId: null,
            turnNumber: 0,
            combatNumber: null,
            chainLinkNumber: null,
            lki: null,
          },
          {
            from: { playerId: fabPlayerId("p1"), zone: "soul" },
            to: { playerId: fabPlayerId("p1"), zone: "banished" },
            eventId: null,
            turnNumber: 0,
            combatNumber: null,
            chainLinkNumber: null,
            lki: null,
          },
        ],
      },
    } as FabRulesBaseObject;
    const soulBlue = {
      ...baseObject("soul-blue"),
      zone: { playerId: fabPlayerId("p1"), zone: "soul" },
      base: { ...baseObject("soul-blue").base, color: "blue" },
      history: {
        moves: [
          {
            from: null,
            to: { playerId: fabPlayerId("p1"), zone: "soul" },
            eventId: null,
            turnNumber: 0,
            combatNumber: null,
            chainLinkNumber: null,
            lki: null,
          },
        ],
      },
    } as FabRulesBaseObject;
    const ctx = (src: FabRulesBaseObject) => ({
      controllerId: "p1",
      source: src.ref,
      bindings: emptyBindings,
    });
    expect(
      evaluateFabRules({ objects: [leftSoulYellow], atoms: [] }).evaluateCondition(
        { type: "has-status", status: "yellow-card-put-into-soul-this-turn" },
        ctx(leftSoulYellow),
      ),
    ).toBe(true);
    expect(
      evaluateFabRules({ objects: [soulBlue], atoms: [] }).evaluateCondition(
        { type: "has-status", status: "yellow-card-put-into-soul-this-turn" },
        ctx(soulBlue),
      ),
    ).toBe(false);
  });

  it("matches a boosted object only through its exact declaration fact and zone", () => {
    const boostedOnChain: FabRulesBaseObject = {
      ...baseObject("boosted-on-chain"),
      zone: { playerId: fabPlayerId("p1"), zone: "combatChain" },
      declarationFacts: [{ kind: "boost" }],
    };
    const plainOnChain: FabRulesBaseObject = {
      ...baseObject("plain-on-chain"),
      zone: { playerId: fabPlayerId("p1"), zone: "combatChain" },
    };
    const boostedOnStack: FabRulesBaseObject = {
      ...baseObject("boosted-on-stack"),
      declarationFacts: [{ kind: "boost" }],
    };
    const condition = {
      type: "control-object",
      zones: ["combat-chain"],
      filter: { wasBoosted: true },
    } as const satisfies FabCondition;
    const context = {
      controllerId: "p1",
      source: boostedOnChain.ref,
      bindings: emptyBindings,
    };

    expect(
      evaluateFabRules({
        objects: [boostedOnChain, plainOnChain, boostedOnStack],
        atoms: [],
      }).evaluateCondition(condition, context),
    ).toBe(true);
    expect(
      evaluateFabRules({ objects: [plainOnChain, boostedOnStack], atoms: [] }).evaluateCondition(
        condition,
        context,
      ),
    ).toBe(false);
  });

  it("control-object reads actual control, never ownership of a hidden-zone card", () => {
    const condition = {
      type: "control-object",
      filter: { typeBox: { types: ["Action"] } },
    } as const satisfies FabCondition;
    const context = {
      controllerId: "p1",
      source: baseObject("source").ref,
      bindings: emptyBindings,
    };
    const hiddenZones = [
      "deck",
      "hand",
      "graveyard",
      "banished",
      "arsenal",
      "pitch",
      "soul",
      "inventory",
      "under",
    ] as const;

    for (const zone of hiddenZones) {
      const hidden = {
        ...baseObject(`hidden-${zone}`),
        controllerId: null,
        zone: { playerId: fabPlayerId("p1"), zone },
      } satisfies FabRulesBaseObject;
      expect(
        evaluateFabRules({ objects: [hidden], atoms: [] }).evaluateCondition(condition, context),
        `${zone} ownership must not imply control`,
      ).toBe(false);
    }
  });

  it("control-object follows the live controller independently of the object's owner", () => {
    const borrowed = {
      ...baseObject("borrowed"),
      ownerId: "p1",
      controllerId: "p2",
      zone: { playerId: fabPlayerId("p2"), zone: "arena" as const },
    } satisfies FabRulesBaseObject;
    const view = evaluateFabRules({
      objects: [borrowed],
      atoms: [],
      facts: { ...EMPTY_RULES_FACTS, playerIds: ["p1", "p2"] },
    });
    const context = {
      controllerId: "p1",
      source: baseObject("source").ref,
      bindings: emptyBindings,
    };
    const filter = { typeBox: { types: ["Action"] } } as const;

    expect(view.evaluateCondition({ type: "control-object", filter }, context)).toBe(false);
    expect(
      view.evaluateCondition({ type: "control-object", player: "opponent", filter }, context),
    ).toBe(true);
  });

  it("applies object stages 1 through 8 in one deterministic pass", () => {
    const target = baseObject("target", { power: 1 });
    const copied = baseObject("copied", { power: 2 }, [], ["Action"], ["Attack"]);
    const opponent = { ...baseObject("opponent"), ownerId: "p2", controllerId: "p2" };
    const bindings = { ...emptyBindings, objects: { copied: [copied.ref], target: [target.ref] } };
    const effects: readonly FabEffect[] = [
      {
        type: "copy",
        target: { selector: "self" },
        source: { selector: "binding", binding: "copied" },
        duration: "this-turn",
      },
      {
        type: "gain-control",
        target: { selector: "self" },
        controller: "opponent",
        duration: "this-turn",
      },
      {
        type: "grant-property",
        property: { kind: "name", value: "Evaluated" },
        target: { selector: "self" },
        duration: "this-turn",
      },
      {
        type: "grant-property",
        property: { kind: "type", value: "Instant" },
        target: { selector: "self" },
        duration: "this-turn",
      },
      {
        type: "grant-property",
        property: { kind: "supertype", value: "Wizard" },
        target: { selector: "self" },
        duration: "this-turn",
      },
      {
        type: "grant-property",
        property: { kind: "keyword", keyword: { name: "go-again" } },
        target: { selector: "self" },
        duration: "this-turn",
      },
      {
        type: "modify-numeric",
        property: "power",
        op: "set-base",
        amount: 4,
        target: { selector: "self" },
        duration: "this-turn",
      },
      numeric("add", 3),
    ];
    const atoms = effects.flatMap((effect, index) =>
      compileActive(`stage-${index + 1}`, target.ref, effect, index + 1, bindings),
    );

    const object = evaluateFabRules({ objects: [target, copied, opponent], atoms }).object(
      target.ref,
    );

    expect(object).toMatchObject({
      controllerId: "p2",
      copyable: {
        numeric: { power: 2 },
        typeBox: { types: ["Action"], subtypes: ["Attack"], supertypes: [] },
      },
      current: {
        names: expect.arrayContaining(["Evaluated"]),
        typeBox: {
          types: ["Action", "Instant"],
          subtypes: ["Attack"],
          supertypes: ["Wizard"],
        },
        numeric: { power: 7 },
        keywords: [{ name: "go-again" }],
      },
      appliedEffectIds: effects.map((_, index) => `stage-${index + 1}`),
    });
  });

  it("uses stage-7 base changes when deciding stage-8 eligibility", () => {
    const attack = baseObject("attack", { power: 4 }, [], ["Action"], ["Attack"]);
    const source = baseObject("source");
    const baseChange = compileActive(
      "base-change",
      source.ref,
      {
        type: "modify-numeric",
        property: "power",
        op: "set-base",
        amount: 3,
        target: { selector: "binding", binding: "attack" },
        duration: "this-turn",
      },
      1,
      { ...emptyBindings, objects: { attack: [attack.ref] } },
    );
    const bonus = compileActive(
      "bonus",
      source.ref,
      {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 3,
        target: {
          selector: "object",
          declared: "at-resolution",
          zones: ["stack"],
          count: 1,
          filter: {
            numeric: [{ property: "power", basis: "base", comparison: { op: "lte", value: 3 } }],
          },
        },
        duration: "this-turn",
      },
      2,
    );

    const view = evaluateFabRules({ objects: [attack, source], atoms: [...baseChange, ...bonus] });

    expect(view.object(attack.ref)).toMatchObject({
      baseNumeric: { power: 3 },
      current: { numeric: { power: 6 } },
    });
    expect(view.explain(attack.ref)?.appliedEffectIds).toEqual(["base-change", "bonus"]);
  });

  it("evaluates current-versus-base conditions in dependent stage 8", () => {
    const attack = baseObject("attack", { power: 3 }, [], ["Action"], ["Attack"]);
    const pump = compileActive("pump", attack.ref, numeric("add", 1), 1);
    const conditionalGrant = compileActiveWithCondition(
      "conditional-grant",
      attack.ref,
      {
        type: "grant-property",
        property: { kind: "keyword", keyword: { name: "dominate" } },
        target: { selector: "self" },
        duration: "while-condition",
      },
      2,
      {
        type: "object-numeric-comparison",
        property: "power",
        left: "current",
        op: "gt",
        right: "base",
      },
    );

    const evaluated = evaluateFabRules({
      objects: [attack],
      atoms: [...pump, ...conditionalGrant],
    }).object(attack.ref);

    expect(evaluated?.baseNumeric.power).toBe(3);
    expect(evaluated?.current.numeric.power).toBe(4);
    expect(evaluated?.current.keywords).toContainEqual({ name: "dominate" });
  });

  it("reads a continuous amount from the receiving subject", () => {
    const source = baseObject("source");
    const attack = baseObject("attack", { power: 4 }, [], ["Action"], ["Attack"]);
    const atoms = compileActive(
      "tear-limb",
      source.ref,
      {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: { type: "subject-property", property: "power", basis: "base" },
        target: { selector: "binding", binding: "attack" },
        duration: "this-turn",
      },
      1,
      { ...emptyBindings, objects: { attack: [attack.ref] } },
    );

    const first = evaluateFabRules({ objects: [source, attack], atoms });
    expect(first.object(attack.ref)).toMatchObject({
      baseNumeric: { power: 4 },
      current: { numeric: { power: 8 } },
    });
    const application = first.applications()[0]!;
    expect(Object.values(application.lockedBindings.numbers)).toEqual([4]);

    const baseChange = compileActive(
      "later-base-change",
      source.ref,
      {
        type: "modify-numeric",
        property: "power",
        op: "set-base",
        amount: 6,
        target: { selector: "binding", binding: "attack" },
        duration: "this-turn",
      },
      0,
      { ...emptyBindings, objects: { attack: [attack.ref] } },
    );
    const restored = atoms.map((entry) => ({ ...entry, acceptedApplications: [application] }));
    expect(
      evaluateFabRules({ objects: [source, attack], atoms: [...baseChange, ...restored] }).object(
        attack.ref,
      ),
    ).toMatchObject({
      baseNumeric: { power: 6 },
      current: { numeric: { power: 10 } },
    });
  });

  it("uses changed eligibility in the current dependent substage and future stages", () => {
    const object = baseObject("eligibility", { power: 1 });
    const earlyIdentity = compileActive(
      "early-name",
      object.ref,
      {
        type: "grant-property",
        property: { kind: "name", value: "Too Late" },
        target: {
          selector: "object",
          declared: "at-resolution",
          zones: ["stack"],
          count: 1,
          filter: {
            typeBox: {
              types: ["Instant"],
            },
          },
        },
        duration: "this-turn",
      },
      1,
    );
    const typeGrant = compileActive(
      "grant-instant",
      object.ref,
      {
        type: "grant-property",
        property: { kind: "type", value: "Instant" },
        target: { selector: "self" },
        duration: "this-turn",
      },
      2,
    );
    const futurePower = compileActive(
      "future-power",
      object.ref,
      {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: {
          selector: "object",
          declared: "at-resolution",
          zones: ["stack"],
          count: 1,
          filter: {
            typeBox: {
              types: ["Instant"],
            },
          },
        },
        duration: "this-turn",
      },
      3,
    );

    const evaluated = evaluateFabRules({
      objects: [object],
      atoms: [...earlyIdentity, ...typeGrant, ...futurePower],
    }).object(object.ref)!;

    expect(earlyIdentity[0]).toMatchObject({
      atom: { applicationStage: 4, substage: "dependent" },
    });
    expect(evaluated.current.names).toEqual(["eligibility", "Too Late"]);
    expect(evaluated.current.typeBox.types).toContain("Instant");
    expect(evaluated.current.numeric.power).toBe(3);
    expect(evaluated.appliedEffectIds).toEqual(["grant-instant", "early-name", "future-power"]);
  });

  it("orders all numeric substages before timestamp order", () => {
    const attack = baseObject("attack", { power: 2 });
    const effects: readonly FabEffect[] = [
      numeric("add", 3),
      numeric("multiply", 4),
      numeric("set", 5),
      numeric("subtract", 1),
      numeric("divide", 2),
    ];
    const atoms = effects.flatMap((effect, index) =>
      compileActive(`numeric-${index}`, attack.ref, effect, effects.length - index),
    );

    const view = evaluateFabRules({ objects: [attack], atoms });

    // set 5 → multiply 4 → divide 2 → add 3 → subtract 1
    expect(view.object(attack.ref)?.current.numeric.power).toBe(12);
  });

  it("persists turn-player order for equal timestamp atoms", () => {
    const attack = baseObject("attack", { power: 2 });
    const first = compileActive("set-five", attack.ref, numeric("set", 5), 1, emptyBindings, 0);
    const second = compileActive("set-seven", attack.ref, numeric("set", 7), 1, emptyBindings, 1);

    expect(
      evaluateFabRules({ objects: [attack], atoms: [...first, ...second] }).object(attack.ref)
        ?.current.numeric.power,
    ).toBe(7);
    expect(
      evaluateFabRules({
        objects: [attack],
        atoms: [
          ...first.map((entry) => ({ ...entry, simultaneousOrder: 1 })),
          ...second.map((entry) => ({ ...entry, simultaneousOrder: 0 })),
        ],
      }).object(attack.ref)?.current.numeric.power,
    ).toBe(5);
  });

  it("commutes equal-timestamp pure add continuous effects without APNAP order", () => {
    // Raw Meat / Stand Ground: two +1{d} continuous gates on the same equipment
    // share a timestamp but are commutative — do not require player ordering.
    const equipment = baseObject("raw-meat", { defense: 0 });
    const addDefense = (amount: number): FabEffect => ({
      type: "modify-numeric",
      property: "defense",
      op: "add",
      amount,
      target: { selector: "self" },
      duration: "this-turn",
    });
    const agility = compileActive("agility-plus", equipment.ref, addDefense(1), 1).map((entry) => ({
      ...entry,
      simultaneousOrder: null,
    }));
    const might = compileActive("might-plus", equipment.ref, addDefense(1), 1).map((entry) => ({
      ...entry,
      simultaneousOrder: null,
    }));

    expect(
      evaluateFabRules({ objects: [equipment], atoms: [...agility, ...might] }).object(
        equipment.ref,
      )?.current.numeric.defense,
    ).toBe(2);
  });

  it("refuses equal timestamp atoms without a persisted turn-player order", () => {
    const attack = baseObject("attack", { power: 2 });
    const first = compileActive("set-five", attack.ref, numeric("set", 5), 1).map((entry) => ({
      ...entry,
      simultaneousOrder: null,
    }));
    const second = compileActive("set-seven", attack.ref, numeric("set", 7), 1).map((entry) => ({
      ...entry,
      simultaneousOrder: null,
    }));

    expect(() => evaluateFabRules({ objects: [attack], atoms: [...first, ...second] })).toThrow(
      FabRulesOrderingRequiredError,
    );
    try {
      evaluateFabRules({ objects: [attack], atoms: [...first, ...second] });
    } catch (error) {
      expect(error).toMatchObject({
        code: "rules_ordering_required",
        requirement: {
          subject: { kind: "object", ref: attack.ref },
          stage: 8,
          substage: 2,
          atomIds: ["set-five:atom", "set-seven:atom"],
        },
      });
    }
  });

  it("applies equal-timestamp rule modifications simultaneously without ordering", () => {
    const source = baseObject("source");
    const rule = (effectId: string, mode: "allow" | "restrict") =>
      compileActive(
        effectId,
        source.ref,
        {
          type: "rule-modification",
          mode,
          action: "gain-keyword",
          duration: "this-turn",
        },
        1,
      ).map((entry) => ({ ...entry, simultaneousOrder: null }));
    const atoms = [...rule("allow-rule", "allow"), ...rule("restrict-rule", "restrict")];

    // CR 6.3.1 applies rule-modifying continuous effects simultaneously;
    // CR 1.0.2 resolves their meaning by restriction > requirement > allowance.
    expect(evaluateFabRules({ objects: [source], atoms }).rules("gain-keyword")).toEqual([
      expect.objectContaining({ effectId: "allow-rule", mode: "allow" }),
      expect.objectContaining({ effectId: "restrict-rule", mode: "restrict" }),
    ]);
  });

  it("removes base properties without deleting another effect's contribution", () => {
    const attack = baseObject("attack", {}, [], ["Action"], ["Attack"], ["Guardian"]);
    const grant = compileActive(
      "grant",
      attack.ref,
      {
        type: "grant-property",
        property: { kind: "supertype", value: "Guardian" },
        target: { selector: "self" },
        duration: "this-turn",
      },
      1,
    );
    const remove = compileActive(
      "remove",
      attack.ref,
      {
        type: "remove-property",
        property: { kind: "supertype", value: "Guardian" },
        target: { selector: "self" },
        duration: "this-turn",
      },
      2,
    );

    const current = evaluateFabRules({ objects: [attack], atoms: [...grant, ...remove] }).object(
      attack.ref,
    )?.current;

    expect(current?.typeBox.supertypes).toContain("Guardian");
  });

  it("lets a restriction prevent a later grant without deleting the base keyword", () => {
    const baseGoAgain = baseObject("base-go-again", {}, [{ name: "go-again" }]);
    const noGoAgain = baseObject("no-go-again");
    const restriction = compileActive(
      "hypothermia",
      noGoAgain.ref,
      {
        type: "rule-modification",
        mode: "restrict",
        action: "gain-keyword",
        duration: "this-turn",
      },
      1,
    );
    const grant = compileActive(
      "grant-go-again",
      noGoAgain.ref,
      {
        type: "grant-property",
        property: { kind: "keyword", keyword: { name: "go-again" } },
        target: {
          selector: "object",
          declared: "at-resolution",
          zones: ["stack"],
          count: 2,
        },
        duration: "this-turn",
      },
      2,
    );

    const view = evaluateFabRules({
      objects: [baseGoAgain, noGoAgain],
      atoms: [...restriction, ...grant],
    });

    expect(view.object(baseGoAgain.ref)?.current.keywords).toContainEqual({ name: "go-again" });
    expect(view.object(noGoAgain.ref)?.current.keywords).not.toContainEqual({ name: "go-again" });
    expect(view.explain(noGoAgain.ref)?.contributions).toContainEqual(
      expect.objectContaining({ effectId: "grant-go-again", operation: "prevented" }),
    );
  });

  it("distinguishes an absent numeric property from zero", () => {
    const absent = baseObject("absent");
    const zero = baseObject("zero", { cost: 0 });
    const view = evaluateFabRules({ objects: [absent, zero], atoms: [] });
    const context = { controllerId: "p1", source: absent.ref, bindings: emptyBindings };
    const filter = {
      numeric: [{ property: "cost", basis: "current", comparison: { op: "eq", value: 0 } }],
    } as const;

    expect(view.matchesFilter(view.object(absent.ref)!, filter, context)).toBe(false);
    expect(view.matchesFilter(view.object(zero.ref)!, filter, context)).toBe(true);
  });

  it("fails closed for unimplemented filter mechanics", () => {
    const object = baseObject("object");
    const view = evaluateFabRules({ objects: [object], atoms: [] });

    // Unknown hasStatus values fail closed (no match) rather than throw —
    // throwing during defend/trigger matching aborts combat (see matches-filter
    // default branch). Marker-backed statuses still match when present.
    expect(
      view.matchesFilter(
        view.object(object.ref)!,
        { hasStatus: "sharpened" },
        { controllerId: "p1", source: object.ref, bindings: emptyBindings },
      ),
    ).toBe(false);
  });

  it("preserves ordered-zone position and binding exclusions in target candidates", () => {
    const bottom = {
      ...baseObject("bottom"),
      controllerId: null,
      zone: { playerId: fabPlayerId("p1"), zone: "deck" as const },
      zoneIndex: 0,
    };
    const top = {
      ...baseObject("top"),
      controllerId: null,
      zone: { playerId: fabPlayerId("p1"), zone: "deck" as const },
      zoneIndex: 1,
    };
    const view = evaluateFabRules({ objects: [top, bottom], atoms: [] });
    const context = {
      controllerId: "p1",
      source: null,
      bindings: {
        ...emptyBindings,
        objects: { selected: [bottom.ref, top.ref], excluded: [bottom.ref] },
      },
    };

    expect(
      view
        .targetCandidates(
          {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["deck"],
            position: "top",
            count: 1,
          },
          context,
        )
        .map((object) => object.ref),
    ).toEqual([top.ref]);
    expect(
      view
        .targetCandidates(
          {
            selector: "binding",
            binding: "selected",
            exclude: "excluded",
          },
          context,
        )
        .map((object) => object.ref),
    ).toEqual([top.ref]);
  });

  it("evaluates combat, player, counter, equipment, and pitch facts from one view", () => {
    const source = {
      ...baseObject("source", { power: 4 }, [{ name: "ward", value: 3 }]),
      counters: [{ kind: "named" as const, name: "steam", count: 2 }],
    };
    const attack = baseObject("attack", { power: 7 }, [], ["Action"], ["Attack"]);
    const previousAttack = {
      ...baseObject("previous-attack", { power: 4 }, [], ["Action"], ["Attack"], ["Ninja"]),
      base: {
        ...baseObject("previous-attack", { power: 4 }, [], ["Action"], ["Attack"], ["Ninja"]).base,
        names: ["Surging Strike"],
        color: "blue" as const,
      },
    };
    const defender = {
      ...baseObject("defender", { defense: 3 }),
      controllerId: "p2",
      ownerId: "p2",
      zone: { playerId: fabPlayerId("p2"), zone: "combatChain" as const },
      counters: [{ kind: "named" as const, name: "steam", count: 1 }],
    };
    const equipment = {
      ...baseObject("equipment"),
      zone: { playerId: fabPlayerId("p1"), zone: "head" as const },
    };
    const pitch = {
      ...baseObject("pitch", { pitch: 3 }, [], ["Action"], [], ["Guardian"]),
      controllerId: null,
      zone: { playerId: fabPlayerId("p1"), zone: "pitch" as const },
    };
    const p1Hero = {
      ...baseObject("hero-p1", { life: 20 }, [], ["Hero"]),
      zone: { playerId: fabPlayerId("p1"), zone: "heroZone" as const },
    };
    const p2Hero = {
      ...baseObject("hero-p2", { life: 30 }, [], ["Hero"]),
      controllerId: "p2",
      ownerId: "p2",
      zone: { playerId: fabPlayerId("p2"), zone: "heroZone" as const },
    };
    const facts: FabRulesFacts = {
      playerCreatedCrouchingTigerThisTurn: {},
      playerDamageTakenBySource: {},
      playerSwordHitsThisTurn: {},
      playerDealtDamageThisTurn: {},
      playerIds: ["p1", "p2"],
      activePlayerId: "p1",
      phase: "action",
      turnNumber: 2,
      playerLife: { p1: 20, p2: 30 },
      pendingDamageByPlayerId: {},
      playerMarked: { p1: true, p2: false },
      playerIntimidatesThisTurn: { p1: 0, p2: 0 },
      frozenObjectRefs: [],
      playerCardsDrawn: { p1: 0, p2: 2 },
      playerPerformedThisTurn: {
        p1: {
          ...FALSE_PERFORMED_THIS_TURN,
        },
        p2: {
          ...FALSE_PERFORMED_THIS_TURN,
        },
      },
      playerBlueCardsPlayed: { p1: 2, p2: 0 },
      playerRedCardsPlayed: { p1: 0, p2: 0 },
      playerDestroyedTokenNamesThisTurn: { p1: [], p2: [] },
      playerDestroyedAuraThisTurn: { p1: false, p2: false },
      playerWeaponHit: { p1: true, p2: false },
      playerHit: { p1: true, p2: false },
      sourceHitThisTurn: { "src-1": true },
      playerAttackFragmented: { p1: false, p2: false },
      playerHoloAuraEnteredThisTurn: { p1: false, p2: false },
      playerHeraldPutIntoSoulThisTurn: { p1: false, p2: false },
      playerCardPutIntoSoulThisTurn: { p1: false, p2: false },
      playerYellowCardPutIntoSoulThisTurn: { p1: false, p2: false },
      playerWeaponAttacks: { p1: 1, p2: 0 },
      playerWeaponAttackInstanceIdsThisTurn: { p1: [], p2: [] },
      playerWeaponHits: { p1: 1, p2: 0 },
      playerLifeGainedThisTurn: { p1: 0, p2: 0 },
      playerClashesWonThisTurn: { p1: 0, p2: 0 },
      playerDraconicChainLinks: { p1: 0, p2: 0 },
      playerPitchedPower6: { p1: true, p2: false },
      playerCreatedSeismicSurgeThisTurn: { p1: false, p2: false },
      playerControlledSeismicSurgeThisTurn: { p1: false, p2: false },
      playerCreatedOrStolenGoldThisTurn: { p1: false, p2: false },
      playerBanishedPower6: { p1: false, p2: false },
      playerCharged: { p1: false, p2: false },
      playerPlayedFromBanishedThisTurn: { p1: false, p2: false },
      playerWeaponInstancesGainedGoAgainThisTurn: { p1: [], p2: [] },
      playerPlayedOrCreatedAuraThisTurn: { p1: false, p2: false },
      playerBoosted: { p1: false, p2: false },
      playerBoostsThisTurn: { p1: 0, p2: 0 },
      playerBanishedFromBoostingThisTurn: { p1: false, p2: false },
      playerEvoBanishedFromBoostingThisTurn: { p1: false, p2: false },
      playerIntimidatedAnOpponentThisTurn: { p1: false, p2: false },
      playerAttackedOrDefendedWithAttackActionThisTurn: { p1: false, p2: false },
      playerLastActionCardPlayedSupertypes: { p1: [], p2: [] },
      playerActionCardPlaysThisTurn: { p1: [], p2: [] },
      playerControlledToughnessThisTurn: { p1: false, p2: false },
      playerControlledVigorThisTurn: { p1: false, p2: false },
      playerControlledMightThisTurn: { p1: false, p2: false },
      playerDiscardedPower6AsAdditionalCost: { p1: false, p2: false },
      playerHighestPowerRevealedThisTurn: { p1: 0, p2: 0 },
      playerFusedSupertypesThisTurn: { p1: [], p2: [] },
      playerDiplomacyChoice: { p1: null, p2: null },
      playerBoostsThisCombatChain: { p1: 0, p2: 0 },
      playerCardsBanishedFromSoulThisCombatChain: { p1: 0, p2: 0 },
      playerDaggerHitsThisCombatChain: { p1: 0, p2: 0 },
      playerCrowdCheered: { p1: false, p2: false },
      playerCrowdBooed: { p1: false, p2: false },
      playerBeatenChest: { p1: false, p2: false },
      playerCranked: { p1: false, p2: false },
      playerCompletedAContractThisTurn: { p1: false, p2: false },
      playerHighestDieRollThisTurn: { p1: 0, p2: 0 },
      playerDestroyedLightningFlowThisTurn: { p1: false, p2: false },
      playerAttacksThisTurn: { p1: 0, p2: 0 },
      playerTimesAttackedThisTurn: { p1: 0, p2: 0 },
      playerWeaponAttackCountsByInstanceIdThisTurn: { p1: {}, p2: {} },
      playerBanishedEarthCardThisTurn: { p1: false, p2: false },
      playerLostLifeThisTurn: { p1: false, p2: false },
      playerBluePutIntoGraveyardThisTurn: { p1: false, p2: false },
      playerLastAttackDidHit: { p1: false, p2: false },
      lastClosedAttackDidHitByInstanceId: {},
      lastClosedDefendedAttackPowersByInstanceId: {},
      playerCombatChainHits: { p1: 0, p2: 0 },
      playerNonAttackActionPlayed: { p1: 0, p2: 0 },
      playerCreatedOrActivatedGateToIArathaelThisTurn: { p1: false, p2: false },
      playerRunechantsCreatedThisTurn: { p1: 0, p2: 0 },
      playerDamageDealt: {
        p1: {
          turn: { arcane: 2, physical: 7, generic: 0 },
          chainLink: { arcane: 0, physical: 7, generic: 0 },
        },
        p2: {
          turn: { arcane: 0, physical: 0, generic: 0 },
          chainLink: { arcane: 0, physical: 0, generic: 0 },
        },
      },
      playerBeenDealtDamage: { p1: false, p2: true },
      playerDamageTaken: {
        p1: { arcane: 0, physical: 0, generic: 0 },
        p2: { arcane: 0, physical: 7, generic: 0 },
      },
      playerAttackActionPlayed: { p1: 1, p2: 0 },
      playerPlayedCardNamesThisTurn: { p1: ["Nimblism"], p2: [] },
      playerDiscardedPower6: { p1: false, p2: false },
      playerLastAttackNamesThisTurn: { p1: [], p2: [] },
      playerAttackedWithCrouchingTigerThisTurn: { p1: false, p2: false },
      heroRefs: { p1: p1Hero.ref, p2: p2Hero.ref },
      combat: {
        attack: attack.ref,
        previousAttack: previousAttack.ref,
        attackingPlayerId: "p1",
        defendingPlayerId: "p2",
        heroTargetPlayerId: "p2",
        attackTarget: null,
        chainLinkNumber: 4,
        resolvedAttacks: [],
        didHit: true,
        defending: [defender.ref],
        defendedFromHand: true,
        attackReactionPlayedOrActivated: false,
        playedCardOrActivatedAbilityThisReactionStep: false,
      },
      lastClosedDefendingInstanceIds: [],
      leftArenaThisTurn: [],
    };
    const view = evaluateFabRules({
      objects: [source, attack, previousAttack, defender, equipment, pitch, p1Hero, p2Hero],
      atoms: [],
      facts,
    });
    const context = { controllerId: "p1", source: source.ref, bindings: emptyBindings };

    expect(
      view.evaluateCondition(
        {
          type: "has-counter",
          counter: { kind: "named", name: "steam" },
          comparison: { op: "eq", value: 2 },
        },
        context,
      ),
    ).toBe(true);
    expect(
      view.evaluateCondition(
        {
          type: "chain-link-count",
          comparison: { op: "eq", value: 4 },
        },
        context,
      ),
    ).toBe(true);
    expect(
      view.evaluateCondition(
        {
          type: "chain-link-property",
          property: "has-hit",
        },
        context,
      ),
    ).toBe(true);
    expect(
      view.evaluateCondition(
        {
          type: "attack-power",
          comparison: { op: "gte", value: 7 },
        },
        context,
      ),
    ).toBe(true);
    expect(
      view.evaluateCondition(
        {
          type: "attack-defense",
          comparison: { op: "eq", value: 3 },
        },
        context,
      ),
    ).toBe(true);
    expect(
      view.evaluateCondition(
        {
          type: "life-comparison",
          player: "self",
          vs: "each-other-hero",
          op: "lt",
        },
        context,
      ),
    ).toBe(true);
    expect(view.evaluateCondition({ type: "has-status", status: "marked" }, context)).toBe(true);
    expect(
      view.evaluateCondition(
        {
          type: "is-marked",
          target: { selector: "controller" },
        },
        context,
      ),
    ).toBe(true);
    expect(
      view.evaluateCondition(
        {
          type: "equipped-count",
          player: "controller",
          comparison: { op: "eq", value: 1 },
        },
        context,
      ),
    ).toBe(true);
    expect(
      view.evaluateCondition(
        {
          type: "pitch-zone-has",
          filter: {
            typeBox: {
              supertypes: ["Guardian"],
            },
          },
        },
        context,
      ),
    ).toBe(true);
    expect(
      view.evaluateCondition(
        {
          type: "defended-this-chain-link",
          filter: {
            numeric: [
              { property: "defense", basis: "current", comparison: { op: "eq", value: 3 } },
            ],
          },
        },
        context,
      ),
    ).toBe(true);
    expect(
      view.evaluateCondition(
        {
          type: "defended-this-chain-link",
          from: "hand",
        },
        context,
      ),
    ).toBe(true);
    expect(view.evaluateCondition({ type: "turn-player", who: "self" }, context)).toBe(true);
    expect(
      view.evaluateCondition(
        {
          type: "last-attack-this-combat-chain",
          nameIncludes: ["Surging"],
          color: "Blue",
          filter: {
            typeBox: {
              supertypes: ["Ninja"],
              subtypes: ["Attack"],
            },
          },
        },
        { ...context, source: attack.ref },
      ),
    ).toBe(true);
    expect(
      view.evaluateCondition(
        {
          type: "damage-dealt",
          damageType: "physical",
          player: "controller",
          per: "chain-link",
          comparison: { op: "eq", value: 7 },
        },
        context,
      ),
    ).toBe(true);
    expect(
      view.evaluateAmount(
        {
          type: "count",
          what: "counters-on-source",
          counter: { kind: "named", name: "steam" },
        },
        context,
      ),
    ).toEqual({ value: 2, dependencies: [source.ref] });
    expect(
      view.evaluateAmount(
        {
          type: "count",
          what: "equipped-objects",
          player: "controller",
        },
        context,
      ).value,
    ).toBe(1);
    expect(
      view.evaluateAmount(
        {
          type: "count",
          what: "cards-defending",
        },
        context,
      ),
    ).toEqual({ value: 1, dependencies: [defender.ref] });
    expect(
      view.evaluateAmount(
        {
          type: "count",
          what: "life-difference-vs-opponent",
        },
        context,
      ).value,
    ).toBe(10);
    expect(
      view.evaluateAmount(
        {
          type: "count",
          what: "base-power-of-source",
        },
        context,
      ),
    ).toEqual({ value: 4, dependencies: [source.ref] });
    expect(
      view.evaluateAmount(
        {
          type: "hero-property",
          property: "life",
          player: "opponent",
        },
        context,
      ),
    ).toEqual({ value: 30, dependencies: [p2Hero.ref] });
    expect(
      view.matchesFilter(
        view.object(defender.ref)!,
        {
          defending: true,
          hasCounter: "steam",
          lacksCounter: "rust",
          defendingAgainst: {
            typeBox: {
              subtypes: ["Attack"],
            },
          },
        },
        context,
      ),
    ).toBe(true);
    // die-result condition binds the staged roll under `die-result`.
    expect(
      view.evaluateCondition(
        {
          type: "die-result",
          comparison: { op: "gte", value: 5 },
        },
        {
          ...context,
          bindings: { ...emptyBindings, numbers: { "die-result": 5 } },
        },
      ),
    ).toBe(true);
    // roll-result amount requires exactly one numeric binding (the roll value).
    expect(
      view.evaluateAmount(
        {
          type: "roll-result",
          divisor: 2,
          rounding: "up",
        },
        {
          ...context,
          bindings: { ...emptyBindings, numbers: { roll: 5 } },
        },
      ).value,
    ).toBe(3);
    expect(
      view.evaluateAmount(
        {
          type: "keyword-value",
          keyword: "ward",
        },
        context,
      ).value,
    ).toBe(3);
    expect(
      view.evaluateAmount(
        { type: "event-amount" },
        { ...context, bindings: { ...emptyBindings, numbers: { "event-amount": 6 } } },
      ).value,
    ).toBe(6);
  });
});

function numeric(
  op: "set" | "multiply" | "divide" | "add" | "subtract",
  amount: number,
): FabEffect {
  return {
    type: "modify-numeric",
    property: "power",
    op,
    amount,
    target: { selector: "self" },
    duration: "this-turn",
  };
}

function compileActive(
  effectId: string,
  source: FabRulesBaseObject["ref"],
  effect: FabEffect,
  timestamp: number,
  lockedBindings: FabResolvedBindings = emptyBindings,
  simultaneousOrder = 0,
): FabActiveContinuousAtom[] {
  const result = compileFabContinuousEffect({ effectId, effect });
  if (!result.ok) throw new Error(result.error.mechanic);
  return result.atoms.map((atom: FabContinuousAtom) => ({
    effectId,
    controllerId: "p1",
    source,
    atom,
    timestamp: { sequence: timestamp, simultaneousGroupId: "group-1" },
    lockedBindings,
    simultaneousOrder,
    acceptedApplications: [],
  }));
}

function compileActiveWithCondition(
  effectId: string,
  source: FabRulesBaseObject["ref"],
  effect: FabEffect,
  timestamp: number,
  condition: FabCondition,
): FabActiveContinuousAtom[] {
  const result = compileFabContinuousEffect({ effectId, effect, condition });
  if (!result.ok) throw new Error(result.error.mechanic);
  return result.atoms.map((atom) => ({
    effectId,
    controllerId: "p1",
    source,
    atom,
    timestamp: { sequence: timestamp, simultaneousGroupId: "group-1" },
    lockedBindings: emptyBindings,
    simultaneousOrder: 0,
    acceptedApplications: [],
  }));
}

function baseObject(
  instanceId: string,
  numeric: Partial<Record<FabNumericProperty, number>> = {},
  keywords: readonly FabKeyword[] = [],
  types: FabBaseObjectProperties["typeBox"]["types"] = ["Action"],
  subtypes: FabBaseObjectProperties["typeBox"]["subtypes"] = [],
  supertypes: FabBaseObjectProperties["typeBox"]["supertypes"] = [],
): FabRulesBaseObject {
  return {
    ref: { instanceId, incarnation: 1 },
    canonicalId: instanceId,
    ownerId: instanceId === "source" ? "p1" : "p1",
    controllerId: "p1",
    zone: { playerId: fabPlayerId("p1"), zone: "stack" },
    zoneIndex: 0,
    visibility: "public",
    base: {
      names: [instanceId],
      activeFaceIds: [`${instanceId}:face:front`],
      color: null,
      typeBox: { metatypes: [], supertypes, types, subtypes },
      typeBoxes: [{ metatypes: [], supertypes, types, subtypes }],
      traits: [],
      textBoxIds: [],
      numeric,
      keywords,
      abilities: [],
    },
    counters: [],
    markers: [],
    history: { moves: [] },
  };
}
