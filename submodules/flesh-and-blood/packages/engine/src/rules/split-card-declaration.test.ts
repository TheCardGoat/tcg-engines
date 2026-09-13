import { describe, expect, it } from "vitest";
import {
  FAB_CLASS_SUPERTYPES,
  FAB_SUBTYPES,
  FAB_TALENT_SUPERTYPES,
  FAB_TYPES,
} from "@tcg/flesh-and-blood-types";
import { buildFabRulesView, FabTestEngine } from "../index.ts";
import { validateFabPregameSelection } from "../pregame.ts";
import {
  createFabMatchContext,
  isFabMatchSnapshotV21,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "../snapshot/match-context.ts";
import { bravo, dash, nimblismBlue, snatchRed } from "./fixtures.ts";
import { arcaneSeedsLifeRed } from "../../../cards/src/cards/actions/arcane-seeds-life.ts";
import { consignToCosmosShockYellow } from "../../../cards/src/cards/actions/consign-to-cosmos-shock.ts";
import { cometStormShockRed } from "../../../cards/src/cards/actions/comet-storm-shock.ts";
import { burnUpShockRed } from "../../../cards/src/cards/actions/burn-up-shock.ts";
import { thistleBloomLifeYellow } from "../../../cards/src/cards/actions/thistle-bloom-life.ts";
import { vaporizeShockYellow } from "../../../cards/src/cards/instants/vaporize-shock.ts";
import { nullShockYellow } from "../../../cards/src/cards/instants/null-shock.ts";
import { rampantGrowthLifeYellow } from "../../../cards/src/cards/instants/rampant-growth-life.ts";
import { pulsingAetherLifeRed } from "../../../cards/src/cards/actions/pulsing-aether-life.ts";
import { regrowthShockBlue } from "../../../cards/src/cards/actions/regrowth-shock.ts";
import { everbloomLifeBlue } from "../../../cards/src/cards/actions/everbloom-life.ts";
import { sigilOfSolaceRed } from "../../../cards/src/cards/instants/sigil-of-solace.ts";
import { sigilOfSolaceYellow } from "../../../cards/src/cards/instants/sigil-of-solace.ts";
import { chainsOfEminenceRed } from "../../../cards/src/cards/actions/chains-of-eminence.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;
const MELD_DECLARATION_CARDS = [
  burnUpShockRed,
  arcaneSeedsLifeRed,
  cometStormShockRed,
  thistleBloomLifeYellow,
  vaporizeShockYellow,
  rampantGrowthLifeYellow,
  pulsingAetherLifeRed,
  regrowthShockBlue,
  everbloomLifeBlue,
  consignToCosmosShockYellow,
] as const;
const ALL_PRINTED_MELD_CARDS = [...MELD_DECLARATION_CARDS, nullShockYellow] as const;
const SUPERTYPE_TOKENS = [...FAB_CLASS_SUPERTYPES, ...FAB_TALENT_SUPERTYPES] as readonly string[];

function meldPitch(baseCost: number):
  | { readonly cards: readonly [typeof nimblismBlue]; readonly resources: 3 }
  | {
      readonly cards: readonly [typeof nimblismBlue, typeof sigilOfSolaceYellow];
      readonly resources: 5;
    }
  | undefined {
  if (baseCost === 0) return undefined;
  return baseCost === 1
    ? { cards: [nimblismBlue], resources: 3 }
    : { cards: [nimblismBlue, sigilOfSolaceYellow], resources: 5 };
}

describe("CR 5.1.2c / 9.2 split-card declarations", () => {
  describe("CR 8.3.38 Meld — every printed meld card", () => {
    it.each(ALL_PRINTED_MELD_CARDS)("models both printed faces for $slug", (card) => {
      expect(card.layout.kind).toBe("split");
      if (card.layout.kind !== "split") throw new Error(`${card.slug} must be a split card.`);
      expect(card.base.names).toEqual(card.layout.faces.map((face) => face.name));
      expect(card.base.activeFaceIds).toEqual([
        `${card.canonicalId}:face:left`,
        `${card.canonicalId}:face:right`,
      ]);
      expect(card.base.typeBoxes).toHaveLength(2);
      expect(card.base.textBoxIds).toHaveLength(2);
      expect(
        card.layout.faces.some((face) => face.keywords.some((keyword) => keyword.name === "meld")),
      ).toBe(true);
    });

    it.each(MELD_DECLARATION_CARDS)(
      "melds $slug with both faces and twice its base cost",
      (card) => {
        if (card.layout?.kind !== "split") throw new Error(`${card.slug} must be a split card.`);
        const [left, right] = card.layout.faces;
        const baseCost = card.base.numeric.cost ?? 0;
        const pitch = meldPitch(baseCost);
        const game = FabTestEngine.start(
          {
            hero: bravo,
            hand: [card, nimblismBlue, sigilOfSolaceYellow, nimblismBlue],
            arsenal: [sigilOfSolaceRed],
            graveyard: card === regrowthShockBlue ? [snatchRed] : [],
            deck: 4,
          },
          {
            hero: dash,
            hand: [sigilOfSolaceRed, nimblismBlue, nimblismBlue, nimblismBlue],
            arsenal: [sigilOfSolaceRed],
            deck: 4,
          },
          manual,
        );
        const Player = game.as(bravo);

        Player.play(card, {
          playMethod: { kind: "meld" },
          targetInstanceId: game.as(dash).ref(dash).instanceId,
          ...(pitch ? { pitch: pitch.cards } : {}),
        });

        if (card !== pulsingAetherLifeRed) {
          expect(Player.resourcePoints()).toBe((pitch?.resources ?? 0) - baseCost * 2);
        }
        const containsAction = [left, right].some((face) => face.types.includes("Action"));
        expect(Player.actionPoints()).toBe(containsAction ? 0 : 1);
        expect(game.getState().rulesStack.at(-1)).toMatchObject({
          kind: "card",
          playTiming: containsAction ? "action" : "instant",
          resolutionPlan: {
            cursor: 0,
            steps: [
              { faceId: `${card.canonicalId}:face:right` },
              { faceId: `${card.canonicalId}:face:left` },
            ],
          },
          source: {
            current: {
              names: [left.name, right.name],
              typeBox: {
                supertypes: expect.arrayContaining(
                  [left, right]
                    .flatMap((face) => face.types)
                    .filter((token) => SUPERTYPE_TOKENS.includes(token)),
                ),
                types: expect.arrayContaining(
                  [left, right]
                    .flatMap((face) => face.types)
                    .filter((token) => (FAB_TYPES as readonly string[]).includes(token)),
                ),
                subtypes: expect.arrayContaining(
                  [left, right]
                    .flatMap((face) => face.types)
                    .filter((token) => (FAB_SUBTYPES as readonly string[]).includes(token)),
                ),
              },
              abilities: expect.arrayContaining([
                expect.objectContaining({ id: left.abilities[0]?.id }),
                expect.objectContaining({ id: right.abilities[0]?.id }),
              ]),
            },
          },
        });
        if (card === regrowthShockBlue) {
          expect(game.getState().rulesStack.at(-1)).toMatchObject({
            kind: "card",
            keywords: expect.arrayContaining(["go-again"]),
          });
        }

        // Each real meld card proves the printed right half resolves first,
        // then survives as the same layer across the mandatory priority
        // boundary before its left half.
        const playerLifeBefore = Player.life();
        const opponentLifeBefore = game.as(dash).life();
        game.passBoth();
        if (right.name === "Shock") {
          expect(game.as(dash).life()).toBe(opponentLifeBefore - 1);
          expect(Player.life()).toBe(playerLifeBefore);
        } else if (right.name === "Life") {
          expect(Player.life()).toBe(playerLifeBefore + 1);
          expect(game.as(dash).life()).toBe(opponentLifeBefore);
        } else {
          throw new Error(`Unexpected meld right face ${right.name}.`);
        }
        expect(game.getState().rulesStack.at(-1)).toMatchObject({
          kind: "card",
          resolutionPlan: { cursor: 1 },
        });
        expect(Player.hasPriority()).toBe(true);
        if (card === regrowthShockBlue) {
          if (game.getState().decision?.kind === "entity-target") {
            game.advanceToDecision(Player, "entity-target");
            Player.chooseTargets(Player.cardIn("graveyard", snatchRed));
          }
          game.passBoth();
          expect(Player.zone("hand")).toContain(snatchRed.canonicalId);
          expect(Player.actionPoints()).toBe(1);
        }
      },
    );

    it("CR 8.3.38b: Pulsing Aether // Life meld pays 2 resources before modifiers", () => {
      const game = FabTestEngine.start(
        {
          hero: bravo,
          hand: [pulsingAetherLifeRed, nimblismBlue, nimblismBlue, nimblismBlue],
          arsenal: [sigilOfSolaceRed],
          deck: 4,
        },
        {
          hero: dash,
          hand: [sigilOfSolaceRed, nimblismBlue, nimblismBlue, nimblismBlue],
          arsenal: [sigilOfSolaceRed],
          deck: 4,
        },
        manual,
      );
      const Player = game.as(bravo);
      const resourcesBefore = Player.resourcePoints();
      const instanceId = Player.cardIn("hand", pulsingAetherLifeRed).instanceId;
      expect(
        buildFabRulesView(game.getState()).quotePlay({
          actorId: Player.id,
          instanceId,
          from: "hand",
          playMethod: { kind: "meld" },
        }).resourceCost,
      ).toBe(2);
      Player.play(pulsingAetherLifeRed, {
        playMethod: { kind: "meld" },
        pitch: [nimblismBlue],
      });
      expect(game.committedEvents().filter((event) => event.name === "spend-assets")).toMatchObject(
        [{ data: { resources: 2 } }],
      );
      expect(Player.resourcePoints()).toBe(resourcesBefore + 3 - 2);
    });

    it("uses action timing for an Action // Instant meld while another layer is pending", () => {
      const game = FabTestEngine.start(
        {
          hero: bravo,
          hand: [pulsingAetherLifeRed, nimblismBlue, nimblismBlue, nimblismBlue],
          arsenal: [sigilOfSolaceRed],
          deck: 4,
        },
        {
          hero: dash,
          hand: [sigilOfSolaceYellow, nimblismBlue, nimblismBlue, nimblismBlue],
          arsenal: [sigilOfSolaceRed],
          deck: 4,
        },
        manual,
      );
      const Player = game.as(bravo);
      const Opponent = game.as(dash);
      Player.pass();
      Opponent.play(sigilOfSolaceYellow, { pitch: [nimblismBlue] });
      Opponent.pass();
      expect(Player.hasPriority()).toBe(true);

      expect(
        buildFabRulesView(game.getState()).quotePlay({
          actorId: Player.id,
          instanceId: Player.cardIn("hand", pulsingAetherLifeRed).instanceId,
          from: "hand",
          playMethod: { kind: "meld" },
        }),
      ).toMatchObject({
        allowed: false,
        reasonCode: "illegal_action_timing",
        timing: "action",
        actionPointCost: 1,
      });
    });
    it("Null // Shock meld targets an eligible instant after prior arcane damage", () => {
      const game = FabTestEngine.start(
        {
          hero: bravo,
          hand: [cometStormShockRed, nullShockYellow, nimblismBlue, nimblismBlue],
          arsenal: [sigilOfSolaceRed],
          deck: 4,
        },
        {
          hero: dash,
          hand: [sigilOfSolaceYellow, nimblismBlue, nimblismBlue, nimblismBlue],
          arsenal: [sigilOfSolaceRed],
          deck: 4,
        },
        manual,
      );
      const Player = game.as(bravo);
      const Opponent = game.as(dash);
      Player.play(cometStormShockRed, {
        playMethod: { kind: "face", face: "left" },
        targetInstanceId: game.getState().containers.zonesByPlayerId[Opponent.id]!.heroZone[0]!,
        pitch: [nimblismBlue],
      });
      expect(game.getState().rulesStack.at(-1)).toMatchObject({
        kind: "card",
        resolutionPlan: {
          steps: [
            {
              effects: [expect.objectContaining({ type: "deal-damage", amount: 5 })],
              targets: expect.objectContaining({}),
            },
          ],
        },
      });
      game.passBoth();
      expect(Player.life()).toBe(20);
      expect(Opponent.life()).toBe(15);

      Player.pass();
      Opponent.play(sigilOfSolaceYellow, { pitch: [nimblismBlue] });
      const instantLayer = game.getState().rulesStack.at(-1);
      if (!instantLayer || instantLayer.kind !== "card")
        throw new Error("Expected Sigil on stack.");
      if (!Player.hasPriority()) Opponent.pass();
      const resourcesBefore = Player.resourcePoints();
      Player.play(nullShockYellow, {
        playMethod: { kind: "meld" },
        targetInstanceId: game.getState().containers.zonesByPlayerId[Opponent.id]!.heroZone[0]!,
        pitch: [nimblismBlue],
      });
      expect(game.getState().rulesStack.at(-1)).toMatchObject({
        kind: "card",
        source: { current: { names: ["Null", "Shock"] } },
        resolutionPlan: {
          cursor: 0,
          steps: [
            { faceId: `${nullShockYellow.canonicalId}:face:right` },
            { faceId: `${nullShockYellow.canonicalId}:face:left` },
          ],
        },
      });
      expect(Player.resourcePoints()).toBe(resourcesBefore + 3 - 2);

      game.passBoth();
      expect(Opponent.life()).toBe(14);
      expect(Player.hasPriority()).toBe(true);
      game.passBoth();
      expect(
        game.getState().rulesStack.some((layer) => layer.layerId === instantLayer.layerId),
      ).toBe(false);
    });
  });

  it("CR 9.2.3 example: Comet Storm and Shock have only their declared stack properties", () => {
    const cometStormGame = FabTestEngine.start(
      {
        hero: bravo,
        hand: [cometStormShockRed, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        deck: 4,
      },
      {
        hero: dash,
        hand: [sigilOfSolaceRed, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        deck: 4,
      },
      manual,
    );
    const CometStorm = cometStormGame.as(bravo);
    const CometStormTarget = cometStormGame.as(dash);

    CometStorm.play(cometStormShockRed, {
      playMethod: { kind: "face", face: "left" },
      pitch: [nimblismBlue],
      target: CometStormTarget,
    });
    expect(CometStorm.actionPoints()).toBe(0);
    expect(cometStormGame.getState().rulesStack.at(-1)).toMatchObject({
      kind: "card",
      source: {
        current: {
          names: ["Comet Storm"],
          typeBox: { supertypes: ["Wizard"], types: ["Action"] },
        },
      },
    });
    const shockGame = FabTestEngine.start(
      {
        hero: bravo,
        hand: [cometStormShockRed, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        deck: 4,
      },
      {
        hero: dash,
        hand: [sigilOfSolaceRed, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        deck: 4,
      },
      manual,
    );
    const Shock = shockGame.as(bravo);
    const ShockTarget = shockGame.as(dash);

    Shock.play(cometStormShockRed, {
      playMethod: { kind: "face", face: "right" },
      pitch: [nimblismBlue],
      target: ShockTarget,
    });
    expect(Shock.actionPoints()).toBe(1);
    expect(shockGame.getState().rulesStack.at(-1)).toMatchObject({
      kind: "card",
      source: {
        current: {
          names: ["Shock"],
          typeBox: { supertypes: ["Lightning"], types: ["Instant"] },
        },
      },
    });
  });

  it("CR 9.2.2: outside the stack, Comet Storm // Shock exposes both faces", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [cometStormShockRed, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        deck: 4,
      },
      {
        hero: dash,
        hand: [sigilOfSolaceRed, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        deck: 4,
      },
      manual,
    );
    const instanceId = game.as(bravo).cardIn("hand", cometStormShockRed).instanceId;
    const record = game.getState().objects[instanceId]!;
    const object = buildFabRulesView(game.getState()).object({
      instanceId: record.instanceId,
      incarnation: record.incarnation,
    })!;
    expect(object.current.names).toEqual(["Comet Storm", "Shock"]);
    expect(object.current.activeFaceIds).toEqual([
      `${cometStormShockRed.canonicalId}:face:left`,
      `${cometStormShockRed.canonicalId}:face:right`,
    ]);
    expect(object.current.typeBoxes).toHaveLength(2);
    expect(object.current.textBoxIds).toHaveLength(2);
    expect(object.current.abilities.map((ability) => ability.id)).toEqual(
      expect.arrayContaining([
        `${cometStormShockRed.canonicalId}:dealFiveArcaneDamage`,
        `${cometStormShockRed.canonicalId}:dealOneArcaneDamage`,
      ]),
    );
  });

  it("CR 9.2.2a: card-pool validation requires every split-face supertype", () => {
    const selection = {
      equipment: {},
      deck: [{ canonicalId: cometStormShockRed.canonicalId, quantity: 1 }],
    };
    const invalid = validateFabPregameSelection(
      {
        format: "cc",
        heroId: bravo.canonicalId,
        entries: [{ canonicalId: cometStormShockRed.canonicalId, quantity: 1, source: "main" }],
        cardDefinitions: {
          [bravo.canonicalId]: bravo,
          [cometStormShockRed.canonicalId]: cometStormShockRed,
        },
      },
      selection,
      { relaxDeckSize: true },
    );
    expect(invalid.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "hero-supertype-mismatch",
          canonicalId: cometStormShockRed.canonicalId,
        }),
      ]),
    );
    const dualHero = {
      canonicalId: "dual-hero",
      name: "Dual Hero",
      types: ["Lightning", "Wizard", "Hero"],
    };
    const valid = validateFabPregameSelection(
      {
        format: "cc",
        heroId: dualHero.canonicalId,
        entries: [{ canonicalId: cometStormShockRed.canonicalId, quantity: 1, source: "main" }],
        cardDefinitions: {
          [dualHero.canonicalId]: dualHero,
          [cometStormShockRed.canonicalId]: cometStormShockRed,
        },
      },
      selection,
      { relaxDeckSize: true },
    );
    expect(valid.issues.some((issue) => issue.code === "hero-supertype-mismatch")).toBe(false);
  });
  it("CR 9.2.2b: naming Shock restricts the whole card off-stack but not a Regrowth face play", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [chainsOfEminenceRed, regrowthShockBlue, nimblismBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        deck: 4,
      },
      {
        hero: dash,
        hand: [sigilOfSolaceRed, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        deck: 4,
      },
      {
        ...manual,
        publicCardIdentities: [
          { canonicalId: chainsOfEminenceRed.canonicalId, names: ["Chains of Eminence"] },
          { canonicalId: regrowthShockBlue.canonicalId, names: ["Regrowth", "Shock"] },
          { canonicalId: "global-only", names: ["Command and Conquer"] },
        ],
      },
    );
    const Player = game.as(bravo);
    const splitId = Player.cardIn("hand", regrowthShockBlue).instanceId;
    Player.play(chainsOfEminenceRed);
    game.passBoth();
    game.passBoth();
    const decision = game.getState().decision;
    expect(decision).toMatchObject({
      kind: "effect-resolution",
      options: expect.arrayContaining([
        expect.objectContaining({ label: "Shock" }),
        expect.objectContaining({ label: "Command and Conquer" }),
      ]),
    });
    if (!decision || decision.kind !== "effect-resolution") {
      throw new Error("Expected the name-card decision.");
    }
    expect(decision.options.some((option) => option.label.includes("//"))).toBe(false);
    const shock = decision.options.find((option) => option.label === "Shock");
    if (!shock) throw new Error("Expected Shock as an individual name-card option.");
    game.answerDecision(Player.id, { kind: "effect-resolution", optionId: shock.id });
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    game.helpers.passPriorityTo(Player);

    const view = buildFabRulesView(game.getState());
    const whole = game.getState().objects[splitId]!;
    const ref = { instanceId: whole.instanceId, incarnation: whole.incarnation };
    expect(game.getState().continuousEffectInstances).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          atoms: expect.arrayContaining([
            expect.objectContaining({ action: "pitch", mode: "restrict" }),
          ]),
        }),
        expect.objectContaining({
          atoms: expect.arrayContaining([
            expect.objectContaining({ action: "defend", mode: "restrict" }),
          ]),
        }),
      ]),
    );
    const leftQuote = view.quotePlay({
      actorId: Player.id,
      instanceId: splitId,
      from: "hand",
      playMethod: { kind: "face", face: "left" },
    });
    expect(leftQuote.splitBase?.names).toEqual(["Regrowth"]);
    expect(view.rules("play").map((rule) => rule.filter)).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "Shock" })]),
    );
    expect(leftQuote.reasonCode).toBe(null);
    expect(leftQuote.allowed).toBe(true);
    expect(
      view.quotePlay({
        actorId: Player.id,
        instanceId: splitId,
        from: "hand",
        playMethod: { kind: "face", face: "right" },
      }),
    ).toMatchObject({ allowed: false, reasonCode: "restricted_by_rule" });
    expect(
      view.quotePlay({
        actorId: Player.id,
        instanceId: splitId,
        from: "hand",
        playMethod: { kind: "meld" },
      }),
    ).toMatchObject({ allowed: false, reasonCode: "restricted_by_rule" });
    expect(view.object(ref)?.current.names).toEqual(["Regrowth", "Shock"]);
  });
  it("CR 9.2.2c: same-name matching requires every name of a chosen split card", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [nullShockYellow, regrowthShockBlue, cometStormShockRed, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        deck: 4,
      },
      {
        hero: dash,
        hand: [sigilOfSolaceRed, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        deck: 4,
      },
      manual,
    );
    const Player = game.as(bravo);
    const view = buildFabRulesView(game.getState());
    const evaluated = (card: typeof nullShockYellow) => {
      const instanceId = Player.cardIn("hand", card).instanceId;
      const record = game.getState().objects[instanceId]!;
      return view.object({ instanceId: record.instanceId, incarnation: record.incarnation })!;
    };
    const chosen = evaluated(nullShockYellow);
    const context = {
      controllerId: Player.id,
      source: null,
      bindings: { objects: { it: [chosen.ref] }, numbers: {}, strings: {} },
    };
    expect(view.matchesFilter(chosen, { name: "chosen" }, context)).toBe(true);
    expect(view.matchesFilter(evaluated(regrowthShockBlue), { name: "chosen" }, context)).toBe(
      false,
    );
    expect(view.matchesFilter(evaluated(cometStormShockRed), { name: "chosen" }, context)).toBe(
      false,
    );
  });
  it.each([
    ["left", 5],
    ["right", 1],
  ] as const)("CR 9.2.3: Comet Storm // Shock %s face deals %i arcane damage", (face, damage) => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [cometStormShockRed, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        deck: 4,
      },
      {
        hero: dash,
        life: 20,
        hand: [sigilOfSolaceRed, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        deck: 4,
      },
      manual,
    );
    const Player = game.as(bravo);
    const Opponent = game.as(dash);
    Player.play(cometStormShockRed, {
      playMethod: { kind: "face", face },
      targetInstanceId: game.getState().containers.zonesByPlayerId[Opponent.id]!.heroZone[0]!,
      ...(face === "left" ? { pitch: [nimblismBlue] } : {}),
    });
    game.passBoth();
    expect(Opponent.life()).toBe(20 - damage);
  });

  it("requires a typed side, then gives Arcane Seeds and Life their separate timing, AP, and effects", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 19,
        hand: [arcaneSeedsLifeRed, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        deck: 4,
      },
      {
        hero: dash,
        hand: [sigilOfSolaceRed, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        deck: 4,
      },
      manual,
    );
    const Bravo = game.as(bravo);

    const missing = Bravo.expectFailure({
      move: "begin-play",
      payload: { instanceId: Bravo.cardIn("hand", arcaneSeedsLifeRed).instanceId },
    });
    expect(missing.errorCode).toBe("unsupported_play_declaration");

    Bravo.play(arcaneSeedsLifeRed, { playMethod: { kind: "face", face: "left" } });
    expect(Bravo.actionPoints()).toBe(0);
    expect(game.getState().rulesStack.at(-1)).toMatchObject({
      kind: "card",
      role: "action",
      source: { current: { names: ["Arcane Seeds"] } },
    });
    game.passBoth();
    expect(Bravo.zone("arena").filter((card) => card === "token:runechant")).toHaveLength(2);
    expect(Bravo.life()).toBe(19);

    // A fresh full 4H + arsenal state proves the right side is an Instant,
    // costing no AP and resolving only its face-local gain-life ability.
    const lifeGame = FabTestEngine.start(
      {
        hero: bravo,
        life: 19,
        hand: [arcaneSeedsLifeRed, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        deck: 4,
      },
      {
        hero: dash,
        hand: [sigilOfSolaceRed, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        deck: 4,
      },
      manual,
    );
    const Life = lifeGame.as(bravo);
    Life.play(arcaneSeedsLifeRed, { playMethod: { kind: "face", face: "right" } });
    expect(Life.actionPoints()).toBe(1);
    expect(lifeGame.getState().rulesStack.at(-1)).toMatchObject({
      kind: "card",
      role: "instant",
      source: { current: { names: ["Life"], typeBox: { types: ["Instant"] } } },
    });
    lifeGame.passBoth();
    expect(Life.life()).toBe(20);
    expect(Life.zone("arena")).not.toContain("token:runechant");
  });

  it("rejects non-split meld and invalid wire declarations fail closed", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [sigilOfSolaceRed, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        deck: 4,
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        deck: 4,
      },
      manual,
    );
    const Bravo = game.as(bravo);
    const ordinary = Bravo.cardIn("hand", sigilOfSolaceRed).instanceId;
    expect(
      Bravo.expectFailure({
        move: "begin-play",
        payload: { instanceId: ordinary, playMethod: { kind: "meld" } },
      }).errorCode,
    ).toBe("unsupported_play_declaration");
    expect(
      Bravo.expectFailure({
        move: "begin-play",
        payload: { instanceId: ordinary, playMethod: { kind: "face", face: "center" } },
      }).errorCode,
    ).toBe("invalid_command_payload");
  });

  it("resolves melded Consign // Shock right then left across a persisted priority boundary", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [consignToCosmosShockYellow, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        deck: 4,
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        graveyard: [sigilOfSolaceYellow],
        deck: 4,
      },
      manual,
    );
    let Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(consignToCosmosShockYellow, {
      playMethod: { kind: "meld" },
      targetInstanceId: game.getState().players[Dash.id]!.heroCardId!,
    });
    expect(game.getState().rulesStack.at(-1)).toMatchObject({
      kind: "card",
      resolutionPlan: { cursor: 0 },
      source: { current: { names: ["Consign to Cosmos", "Shock"] } },
    });

    game.passBoth();
    expect(Dash.life()).toBe(19);
    expect(game.getState().players[Bravo.id]!.history.turn.damageDealtByType.arcane).toBe(1);
    expect(Bravo.hasPriority()).toBe(true);
    expect(game.getState().rulesStack.at(-1)).toMatchObject({
      kind: "card",
      resolutionPlan: { cursor: 1 },
      source: { current: { names: ["Consign to Cosmos", "Shock"] } },
    });

    const snapshot = serializeFabMatchSnapshot(game.getState());
    expect(isFabMatchSnapshotV21(snapshot)).toBe(true);
    expect(isFabMatchSnapshotV21({ ...snapshot, schemaVersion: 12 })).toBe(false);
    const resumed = FabTestEngine.fromState(
      restoreFabMatchSnapshot(
        snapshot,
        createFabMatchContext(
          game.getState().cardDefinitions,
          game.getState().publicCardIdentities,
        ),
      ),
    );
    Bravo = resumed.as(bravo);
    resumed.passBoth();
    expect(resumed.as(dash).zone("banished")).toContain(sigilOfSolaceYellow.canonicalId);
    expect(Bravo.actionPoints()).toBe(0);
  });
});
