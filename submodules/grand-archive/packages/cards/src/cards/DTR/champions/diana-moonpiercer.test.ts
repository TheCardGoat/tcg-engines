import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { dianaMoonpiercer } from "./diana-moonpiercer.ts";
import { backdash } from "../actions/backdash.ts";
import { enfeebledDagger } from "../items/enfeebled-dagger.ts";
import { spellwardScepter } from "../items/spellward-scepter.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";
import { lineageTestChampion, proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

type Position = "current" | "buried" | "material-deck";
function fixture(position: Position = "current", ownTurn = false, poor = false) {
  const starter = lineageTestChampion("Diana", 0),
    foe = enableAllTestElements(lineageTestChampion("Opponent", 0));
  const game = GrandArchiveTestEngine.startFixture({
    firstPlayer: ownTurn ? "playerOne" : "playerTwo",
    playerOne: {
      champion: starter,
      lineage: [
        lineageTestChampion("Diana", 1),
        lineageTestChampion("Diana", 2),
        ...(position === "material-deck" ? [] : [dianaMoonpiercer]),
        ...(position === "buried" ? [lineageTestChampion("Diana", 4)] : []),
      ],
      zones: {
        field: [enableAllTestElements(trainingSword), giantTortoise],
        hand: [
          ...Array.from({ length: 4 }, () => backdash),
          ...Array.from({ length: 3 }, () => sparkAlight),
          ...Array.from({ length: 15 }, () => woodlandSquirrels),
        ],
        "material-deck": position === "material-deck" ? [dianaMoonpiercer] : [],
        "main-deck": Array.from({ length: 10 }, () => giantTortoise),
      },
    },
    playerTwo: {
      champion: foe,
      zones: {
        field: [
          enableAllTestElements(trainingSword),
          giantTortoise,
          enfeebledDagger,
          spellwardScepter,
        ],
        hand: [
          ...Array.from({ length: poor ? 1 : 3 }, () => sparkAlight),
          ...Array.from({ length: poor ? 2 : 15 }, () => woodlandSquirrels),
        ],
        "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
      },
    },
  });
  const p = game.player("player-one"),
    q = game.player("player-two"),
    hero = p.card(starter),
    opponent = q.card(foe);
  const pay = (player: typeof p, n: number) =>
    player
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(0, n)
      .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
  const opportunity = (id: string) => {
    const wait = game.waitState();
    if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
    if (wait.playerId !== id) game.player(wait.playerId).pass();
  };
  const becomeDistant = (targetId = hero.objectId) => {
    opportunity(p.id);
    p.activate(p.cards(backdash, { zone: "hand" })[0]!, {
      reservePayment: pay(p, 1),
      targets: { "target-1": [targetId] },
    });
    passEffectsStack(game);
  };
  const mode = (
    modeId: "glimpse" | "negate-targeting-activations",
    activationIds: readonly string[] = [],
  ) => {
    expect(game.state.decision?.kind).toBe("announce-triggered-ability");
    const before = game.state;
    for (const modeIds of [
      [],
      ["glimpse", "negate-targeting-activations"],
      ["glimpse", "glimpse"],
    ]) {
      expect(() => answerDecision(game, "announce-triggered-ability", { modeIds })).toThrow();
      expect(game.state).toEqual(before);
    }
    answerDecision(game, "announce-triggered-ability", { modeIds: [modeId] });
    passEffectsStack(game);
    if (
      modeId === "negate-targeting-activations" &&
      game.state.decision?.kind === "resolve-effect-choice"
    ) {
      if (activationIds.length) {
        const pending = game.state;
        expect(() => answerDecision(game, "resolve-effect-choice", [])).toThrow();
        expect(game.state).toEqual(pending);
      }
      answerDecision(game, "resolve-effect-choice", activationIds);
      passEffectsStack(game);
    }
  };
  return { game, p, q, hero, opponent, pay, opportunity, becomeDistant, mode };
}

/** @covers v3vfjtwm7g-a1 */
describe("Diana Moonpiercer — Diana Lineage", () => {
  proveChampionLineage({ card: dianaMoonpiercer, lineageName: "Diana", level: 3, memoryCost: 3 });
});

/** @covers v3vfjtwm7g-a2 */
describe("Diana Moonpiercer — Glimpse and becoming distant", () => {
  for (const position of ["current", "buried", "material-deck"] as const)
    for (const self of [false, true])
      it(`position=${position}, self=${self}`, () => {
        const { game, p, q, hero, becomeDistant, mode } = fixture(position);
        const target = self ? hero : p.card(giantTortoise, { zone: "field" });
        becomeDistant(target.objectId);
        const deck = p.zone("main-deck"),
          otherDeck = q.zone("main-deck"),
          hand = p.zone("hand");
        if (position === "current" && self) {
          mode("glimpse");
          expect(game.state.decision).toMatchObject({
            kind: "resolve-glimpse",
            playerId: p.id,
            cardIds: deck.slice(0, 2).map((c) => c.objectId),
          });
          const before = game.state;
          expect(() =>
            answerDecision(game, "resolve-glimpse", {
              kind: "reorder",
              top: [deck[0]!.objectId, deck[2]!.objectId],
              bottom: [],
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          answerDecision(game, "resolve-glimpse", {
            kind: "reorder",
            top: [deck[1]!.objectId],
            bottom: [deck[0]!.objectId],
          });
          passEffectsStack(game);
          expect(p.zone("main-deck").map((c) => c.objectId)).toEqual(
            [...deck.slice(1), deck[0]!].map((c) => c.objectId),
          );
        } else expect(game.state.decision).toBeNull();
        expect(p.zone("hand")).toEqual(hand);
        expect(q.zone("main-deck")).toEqual(otherDeck);
        becomeDistant(target.objectId);
        expect(game.state.decision).toBeNull();
      });
});

/** @covers v3vfjtwm7g-a2 */
describe("Diana Moonpiercer — targeting card activations pay their controller", () => {
  for (const own of [false, true])
    for (const accept of [false, true])
      it(`own activation=${own}, pay=${accept}`, () => {
        const { game, p, q, hero, pay, opportunity, becomeDistant, mode } = fixture();
        const actor = own ? p : q;
        opportunity(actor.id);
        const spell = actor.cards(sparkAlight)[0]!;
        actor.activate(spell, {
          reservePayment: pay(actor, 2),
          targets: { "target-1": [hero.objectId] },
        });
        const activation = game.state.stack.at(-1)!;
        becomeDistant();
        expect(game.state.objects[spell.objectId]!.zone).toBe("effects-stack");
        mode("negate-targeting-activations", [activation.id]);
        expect(game.state.decision).toMatchObject({
          kind: "resolve-effect-payment",
          playerId: actor.id,
        });
        const before = game.state,
          memory = actor.zone("memory").length;
        expect(() =>
          answerDecision(game, "resolve-effect-payment", { reservePayment: pay(actor, 1) }),
        ).toThrow();
        expect(game.state).toEqual(before);
        answerDecision(
          game,
          "resolve-effect-payment",
          accept ? { reservePayment: pay(actor, 2) } : false,
        );
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]!.damage).toBe(accept ? 2 : 0);
        expect(game.state.objects[spell.objectId]!.zone).toBe("graveyard");
        expect(actor.zone("memory")).toHaveLength(memory + (accept ? 2 : 0));
      });
});

/** @covers v3vfjtwm7g-a2 */
describe("Diana Moonpiercer — combat continuation payment", () => {
  for (const defending of [false, true])
    for (const accept of [false, true])
      it(`Diana defending=${defending}, pay=${accept}`, () => {
        const { game, p, q, hero, opponent, pay, becomeDistant, mode } = fixture();
        const target = defending ? hero : p.card(giantTortoise, { zone: "field" });
        q.declareAttack(opponent, target, { weaponIds: [q.card(trainingSword).objectId] });
        becomeDistant();
        mode("negate-targeting-activations");
        if (defending) {
          expect(game.state.decision).toMatchObject({
            kind: "resolve-effect-payment",
            playerId: q.id,
          });
          const before = game.state;
          expect(() =>
            answerDecision(game, "resolve-effect-payment", { reservePayment: pay(q, 1) }),
          ).toThrow();
          expect(game.state).toEqual(before);
          answerDecision(
            game,
            "resolve-effect-payment",
            accept ? { reservePayment: pay(q, 2) } : false,
          );
          passEffectsStack(game);
        }
        if (!defending || accept) game.resolveCombatWithoutRetaliation();
        expect(game.state.combat).toBeNull();
        expect(game.state.objects[target.objectId]!.damage).toBe(defending && !accept ? 0 : 1);
        expect(q.zone("memory")).toHaveLength(defending && accept ? 2 : 0);
        expect(game.state.objects[q.card(trainingSword).objectId]!.counters.durability).toBe(
          defending && !accept ? 2 : 1,
        );
      });
});

/** @covers v3vfjtwm7g-a2 */
describe("Diana Moonpiercer — each activation is independent", () => {
  for (const accepted of [0, 1, 2, 3])
    it(`pays for ${accepted} of three qualifying activations across both controllers`, () => {
      const { game, p, q, hero, opponent, pay, opportunity, becomeDistant, mode } = fixture();
      const ids = [],
        spells = [];
      for (let i = 0; i < 2; i++) {
        const spell = q.cards(sparkAlight, { zone: "hand" })[0]!;
        q.activate(spell, { reservePayment: pay(q, 2), targets: { "target-1": [hero.objectId] } });
        ids.push(game.state.stack.at(-1)!.id);
        spells.push(spell);
      }
      const unrelated = q.cards(sparkAlight, { zone: "hand" })[0]!;
      q.activate(unrelated, {
        reservePayment: pay(q, 2),
        targets: { "target-1": [opponent.objectId] },
      });
      q.activateAbility(enfeebledDagger, "idpdon8f0h-a1", {
        targets: { "target-unit": [hero.objectId] },
      });
      opportunity(p.id);
      const ownSpell = p.cards(sparkAlight, { zone: "hand" })[0]!;
      p.activate(ownSpell, { reservePayment: pay(p, 2), targets: { "target-1": [hero.objectId] } });
      ids.push(game.state.stack.at(-1)!.id);
      spells.push(ownSpell);
      becomeDistant();
      mode("negate-targeting-activations", ids);
      for (let i = 0; i < 3; i++) {
        const actor = i < 2 ? q : p;
        expect(game.state.decision).toMatchObject({
          kind: "resolve-effect-payment",
          playerId: actor.id,
        });
        answerDecision(
          game,
          "resolve-effect-payment",
          i < accepted ? { reservePayment: pay(actor, 2) } : false,
        );
        passEffectsStack(game);
      }
      expect(game.state.objects[hero.objectId]!.damage).toBe(1 + 2 * accepted);
      expect(game.state.objects[opponent.objectId]!.damage).toBe(2);
      expect(q.zone("memory")).toHaveLength(6 + Math.min(2, accepted) * 2);
      expect(p.zone("memory")).toHaveLength(3 + (accepted === 3 ? 2 : 0));
      for (const spell of spells)
        expect(game.state.objects[spell.objectId]!.zone).toBe("graveyard");
      expect(game.state.objects[unrelated.objectId]!.zone).toBe("graveyard");
    });
  it("negates an activation when its controller cannot pay", () => {
    const { game, q, hero, pay, becomeDistant, mode } = fixture("current", false, true);
    const spell = q.card(sparkAlight);
    q.activate(spell, { reservePayment: pay(q, 2), targets: { "target-1": [hero.objectId] } });
    const activation = game.state.stack.at(-1)!;
    expect(q.zone("hand")).toHaveLength(0);
    becomeDistant();
    mode("negate-targeting-activations", [activation.id]);
    if (game.state.decision?.kind === "resolve-effect-payment") {
      answerDecision(game, "resolve-effect-payment", false);
      passEffectsStack(game);
    }
    expect(game.state.objects[hero.objectId]!.damage).toBe(0);
    expect(game.state.objects[spell.objectId]!.zone).toBe("graveyard");
    expect(q.zone("memory")).toHaveLength(2);
  });
  it("cannot negate a protected Spell when its controller declines payment", () => {
    const { game, q, hero, pay, becomeDistant, mode, opportunity } = fixture();
    q.activateAbility(spellwardScepter, "f6lxizyuml-a2");
    passEffectsStack(game);
    opportunity(q.id);
    const spell = q.cards(sparkAlight, { zone: "hand" })[0]!;
    q.activate(spell, { reservePayment: pay(q, 2), targets: { "target-1": [hero.objectId] } });
    const activation = game.state.stack.at(-1)!;
    becomeDistant();
    mode("negate-targeting-activations", [activation.id]);
    answerDecision(game, "resolve-effect-payment", false);
    passEffectsStack(game);
    expect(game.state.objects[hero.objectId]!.damage).toBe(2);
    expect(q.zone("memory")).toHaveLength(2);
  });
});

/** @covers v3vfjtwm7g-a2 */
for (const paySpell of [false, true])
  for (const payCombat of [false, true])
    it(`while defending, spell payment=${paySpell}, combat payment=${payCombat}`, () => {
      const { game, p, q, hero, opponent, pay, becomeDistant, mode } = fixture();
      q.declareAttack(opponent, hero, { weaponIds: [q.card(trainingSword).objectId] });
      const spell = q.cards(sparkAlight, { zone: "hand" })[0]!;
      q.activate(spell, { reservePayment: pay(q, 2), targets: { "target-1": [hero.objectId] } });
      const activation = game.state.stack.at(-1)!;
      becomeDistant();
      mode("negate-targeting-activations", [activation.id]);
      expect(game.state.decision).toMatchObject({ kind: "resolve-effect-payment", playerId: q.id });
      answerDecision(
        game,
        "resolve-effect-payment",
        paySpell ? { reservePayment: pay(q, 2) } : false,
      );
      passEffectsStack(game);
      expect(game.state.decision).toMatchObject({ kind: "resolve-effect-payment", playerId: q.id });
      expect(game.state.objects[hero.objectId]!.damage).toBe(0);
      answerDecision(
        game,
        "resolve-effect-payment",
        payCombat ? { reservePayment: pay(q, 2) } : false,
      );
      passEffectsStack(game);
      if (payCombat) game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[hero.objectId]!.damage).toBe(
        payCombat ? (paySpell ? 2 : 0) + 1 : 0,
      );
      // Ending Phases 1: ending combat banishes pending stack cards even after their tax was paid.
      expect(game.state.objects[spell.objectId]!.zone).toBe(
        paySpell && !payCombat ? "banishment" : "graveyard",
      );
      expect(q.zone("memory")).toHaveLength(2 + (paySpell ? 2 : 0) + (payCombat ? 2 : 0));
      expect(game.state.combat).toBeNull();
    });

/** @covers v3vfjtwm7g-a2 */
it("Glimpse while defending leaves combat and its damage intact", () => {
  const { game, p, q, hero, opponent, becomeDistant, mode } = fixture();
  q.declareAttack(opponent, hero, { weaponIds: [q.card(trainingSword).objectId] });
  becomeDistant();
  mode("glimpse");
  const top = p
    .zone("main-deck")
    .slice(0, 2)
    .map((c) => c.objectId);
  answerDecision(game, "resolve-glimpse", { kind: "reorder", top, bottom: [] });
  passEffectsStack(game);
  game.resolveCombatWithoutRetaliation();
  expect(game.state.objects[hero.objectId]!.damage).toBe(1);
  expect(q.zone("memory")).toHaveLength(0);
  expect(game.state.objects[q.card(trainingSword).objectId]!.counters.durability).toBe(1);
});

/** @covers v3vfjtwm7g-a2 */
it("triggers again after Distant expires and Diana becomes distant on a later turn", () => {
  const { game, p, q, hero, becomeDistant, mode } = fixture();
  const glimpse = () => {
    becomeDistant();
    mode("glimpse");
    const cards = p
      .zone("main-deck")
      .slice(0, 2)
      .map((c) => c.objectId);
    expect(game.state.decision).toMatchObject({ kind: "resolve-glimpse", cardIds: cards });
    answerDecision(game, "resolve-glimpse", { kind: "reorder", top: cards, bottom: [] });
    passEffectsStack(game);
  };
  glimpse();
  advanceToMain(game, p.id);
  expect(game.state.objects[hero.objectId]!.states.has("distant")).toBe(true);
  advanceToMain(game, q.id);
  expect(game.state.objects[hero.objectId]!.states.has("distant")).toBe(false);
  glimpse();
  expect(game.state.objects[hero.objectId]!.states.has("distant")).toBe(true);
});
