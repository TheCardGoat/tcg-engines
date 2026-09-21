import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { stellarionShift } from "./stellarion-shift.ts";
import { backdash } from "./backdash.ts";
import { enfeebledDagger } from "../items/enfeebled-dagger.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { extractionIncision } from "../../AMB/attacks/extraction-incision.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceToMain,
  answerDecision,
  declareResolvedAttack,
  passEffectsStack,
} from "../../../testing/decisions.ts";
function champion(matching = true, element = true) {
  const base = createClassBonusTestChampion(stellarionShift, matching, "activation-discount");
  return enableAllTestElements({
    ...base,
    layout: {
      kind: "single-faced",
      face: { ...requireSingleFace(base), elements: element ? ["ASTRA"] : ["NORM"] },
    },
  });
}
function opportunity(game: GrandArchiveTestEngine, id: string) {
  const w = game.waitState();
  if (w.kind !== "opportunity") throw new Error(`Unexpected ${w.kind}`);
  if (w.playerId !== id) game.player(w.playerId).pass();
}
/** @covers ms2x2v4qe3-a1 */
describe("Stellarion Shift — target unit Distant and draw", () => {
  for (const own of [false, true])
    for (const ally of [false, true])
      for (const opposingTurn of [false, true])
        it(`own=${own}, ally=${ally}, opposing turn=${opposingTurn}`, () => {
          const hero = champion(false, false);
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: opposingTurn ? "playerTwo" : "playerOne",
            playerOne: {
              champion: hero,
              zones: {
                hand: [stellarionShift, woodlandSquirrels, woodlandSquirrels],
                field: [woodlandSquirrels, trainingSword],
                graveyard: [woodlandSquirrels],
                "main-deck": [backdash, backdash, backdash],
              },
            },
            playerTwo: {
              champion: hero,
              zones: { field: [woodlandSquirrels], "main-deck": [backdash, backdash, backdash] },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            owner = own ? p : q,
            target = owner.card(ally ? woodlandSquirrels : hero, { zone: "field" }),
            source = p.card(stellarionShift),
            top = p.zone("main-deck")[0]!;
          opportunity(game, p.id);
          const payment = p
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
            before = game.state;
          for (const ids of [
            [],
            [p.card(trainingSword).objectId],
            [p.card(woodlandSquirrels, { zone: "graveyard" }).objectId],
            [target.objectId, target.objectId],
          ]) {
            expect(() =>
              p.activate(source, { reservePayment: payment, targets: { "target-1": ids } }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          expect(() =>
            p.activate(source, {
              reservePayment: payment.slice(0, 1),
              targets: { "target-1": [target.objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          p.activate(source, {
            reservePayment: payment,
            targets: { "target-1": [target.objectId] },
          });
          expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(false);
          expect(game.state.objects[top.objectId]!.zone).toBe("main-deck");
          passEffectsStack(game);
          expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(true);
          expect(game.state.objects[top.objectId]!.zone).toBe("hand");
          expect(p.zone("main-deck")).toHaveLength(2);
          expect(q.zone("main-deck")).toHaveLength(3);
          expect(p.zone("memory")).toHaveLength(2);
          expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
          advanceToMain(game, opposingTurn ? p.id : q.id, game.state.turn.number);
          expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(
            own === opposingTurn,
          );
          advanceToMain(game, opposingTurn ? q.id : p.id, game.state.turn.number);
          expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(false);
        });
  it("does not draw when its only target is destroyed before resolution", () => {
    const hero = champion();
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: hero,
        zones: { hand: [stellarionShift, backdash, backdash], "main-deck": [backdash] },
      },
      playerTwo: { champion: hero, zones: { field: [woodlandSquirrels, enfeebledDagger] } },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      target = q.card(woodlandSquirrels);
    p.activate(stellarionShift, {
      reservePayment: p.cards(backdash).map((c) => ({ kind: "card", cardId: c.objectId })),
      targets: { "target-1": [target.objectId] },
    });
    p.pass();
    q.activateAbility(enfeebledDagger, "idpdon8f0h-a1", {
      targets: { "target-unit": [target.objectId] },
    });
    passEffectsStack(game);
    expect(p.zone("main-deck")).toHaveLength(1);
    expect(p.zone("hand")).toHaveLength(0);
    expect(p.zone("memory")).toHaveLength(2);
    expect(game.state.objects[target.objectId]!.zone).toBe("graveyard");
  });
});
function prepare(
  matching = true,
  element = true,
  distant = true,
  zone: "graveyard" | "hand" | "memory" | "banishment" = "graveyard",
  opposingTurn = true,
) {
  const hero = champion(matching, element),
    foe = champion(false, false);
  const game = GrandArchiveTestEngine.startFixture({
    firstPlayer: opposingTurn ? "playerTwo" : "playerOne",
    playerOne: {
      champion: hero,
      zones: {
        hand: [
          backdash,
          ...Array.from({ length: 5 }, () => woodlandSquirrels),
          ...(zone === "hand" ? [stellarionShift] : []),
        ],
        graveyard: zone === "graveyard" ? [stellarionShift] : [],
        memory: zone === "memory" ? [stellarionShift] : [],
        banishment: zone === "banishment" ? [stellarionShift] : [],
        field: [woodlandSquirrels],
        "main-deck": Array.from({ length: 5 }, () => backdash),
      },
    },
    playerTwo: {
      champion: foe,
      zones: {
        field: [trainingSword, ...Array.from({ length: 9 }, () => enfeebledDagger)],
        hand: [
          extractionIncision,
          sparkAlight,
          ...Array.from({ length: 5 }, () => woodlandSquirrels),
        ],
        "main-deck": Array.from({ length: 5 }, () => backdash),
      },
    },
  });
  const p = game.player("player-one"),
    q = game.player("player-two"),
    target = p.card(hero),
    source = p.card(stellarionShift, { zone });
  const payment = (n: number) =>
    p
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(0, n)
      .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
  opportunity(game, p.id);
  if (distant) {
    p.activate(backdash, {
      reservePayment: payment(1),
      targets: { "target-1": [target.objectId] },
    });
    passEffectsStack(game);
    opportunity(game, p.id);
  }
  const hit = (id = target.objectId) => {
    opportunity(game, q.id);
    q.activateAbility(q.cards(enfeebledDagger, { zone: "field" })[0]!, "idpdon8f0h-a1", {
      targets: { "target-unit": [id] },
    });
    passEffectsStack(game);
  };
  return { game, p, q, target, source, payment, hit, hero, foe };
}
/** @covers ms2x2v4qe3-a2 */
describe("Stellarion Shift — gated graveyard shield and stealth", () => {
  for (const matching of [false, true])
    for (const element of [false, true])
      for (const distant of [false, true])
        it(`class=${matching}, element=${element}, distant=${distant}`, () => {
          const { game, p, source, payment, target, hit } = prepare(matching, element, distant);
          const before = game.state;
          const act = () =>
            p.activateAbility(source, "ms2x2v4qe3-a2", { reservePayment: payment(2) });
          if (matching && element && distant) {
            expect(() =>
              p.activateAbility(source, "ms2x2v4qe3-a2", { reservePayment: payment(1) }),
            ).toThrow();
            expect(game.state).toEqual(before);
            act();
            expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
            expect(p.zone("memory")).toHaveLength(3);
            passEffectsStack(game);
            hit();
            expect(game.state.objects[target.objectId]!.damage).toBe(0);
          } else {
            expect(act).toThrow();
            expect(game.state).toEqual(before);
            hit();
            expect(game.state.objects[target.objectId]!.damage).toBe(1);
          }
        });
  for (const zone of ["hand", "memory", "banishment"] as const)
    it(`cannot pay the graveyard banish cost from ${zone}`, () => {
      const { game, p, source, payment, target, hit } = prepare(true, true, true, zone);
      const before = game.state;
      expect(() =>
        p.activateAbility(source, "ms2x2v4qe3-a2", { reservePayment: payment(2) }),
      ).toThrow();
      expect(game.state).toEqual(before);
      hit();
      expect(game.state.objects[target.objectId]!.damage).toBe(1);
    });
  it("blocks ordinary attacks but permits True Sight combat, and absorbs four preventable noncombat damage cumulatively", () => {
    const { game, p, q, source, payment, target, hit, foe } = prepare();
    p.activateAbility(source, "ms2x2v4qe3-a2", { reservePayment: payment(2) });
    passEffectsStack(game);
    opportunity(game, q.id);
    const before = game.state;
    expect(() =>
      q.declareAttack(q.card(foe), target, { weaponIds: [q.card(trainingSword).objectId] }),
    ).toThrow();
    expect(game.state).toEqual(before);
    q.activate(extractionIncision, {
      reservePayment: q
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 2)
        .map((c) => ({ kind: "card", cardId: c.objectId })),
      attackAttackerId: q.card(foe).objectId,
    });
    passEffectsStack(game);
    declareResolvedAttack(
      game,
      q.card(foe).objectId,
      target.objectId,
      "True Sight through Stellarion stealth",
    );
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(3);
    opportunity(game, q.id);
    q.activate(sparkAlight, {
      reservePayment: q
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 2)
        .map((c) => ({ kind: "card", cardId: c.objectId })),
      targets: { "target-1": [target.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[target.objectId]!.damage).toBe(5);
    const ally = p.card(woodlandSquirrels, { zone: "field" });
    hit(ally.objectId);
    expect(game.state.objects[ally.objectId]!.zone).toBe("graveyard");
    hit(q.card(foe).objectId);
    expect(game.state.objects[q.card(foe).objectId]!.damage).toBe(1);
    for (let i = 1; i <= 5; i++) {
      hit();
      expect(game.state.objects[target.objectId]!.damage).toBe(i <= 4 ? 5 : 6);
    }
  });
  for (const opposingTurn of [false, true])
    it(`unused shield and stealth expire at this turn's end, opposing turn=${opposingTurn}`, () => {
      const { game, p, q, source, payment, target, hit, foe } = prepare(
        true,
        true,
        true,
        "graveyard",
        opposingTurn,
      );
      p.activateAbility(source, "ms2x2v4qe3-a2", { reservePayment: payment(2) });
      passEffectsStack(game);
      advanceToMain(game, opposingTurn ? p.id : q.id, game.state.turn.number);
      hit();
      expect(game.state.objects[target.objectId]!.damage).toBe(1);
      if (opposingTurn) advanceToMain(game, q.id, game.state.turn.number);
      opportunity(game, q.id);
      q.declareAttack(q.card(foe), target, { weaponIds: [q.card(trainingSword).objectId] });
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(2);
    });
});

/** @covers ms2x2v4qe3-a2 */
it("cannot banish Stellarion Shift from intent to pay its explicitly graveyard-only cost", () => {
  const base = champion(),
    face = requireSingleFace(base);
  const hero: typeof base = {
    ...base,
    layout: {
      kind: "single-faced",
      face: {
        ...face,
        abilities: [
          ...face.abilities,
          {
            id: `${base.canonicalId}-a2`,
            kind: "activated",
            text: "Put a Stellarion Shift card from your graveyard into your intent.",
            activation: "ability",
            cost: { kind: "pay-reserve", amount: 0 },
            effect: {
              kind: "choose",
              selection: {
                id: "shift",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: { kind: "exactly", amount: 1 },
                candidates: {
                  kind: "card",
                  zones: ["graveyard"],
                  relationship: "zone-of",
                  player: "controller",
                  filter: { kind: "canonical-id", value: stellarionShift.canonicalId },
                },
              },
              effect: {
                kind: "move",
                subject: { kind: "bound", binding: "shift" },
                destination: { zone: "intent", host: { kind: "champion", player: "controller" } },
              },
            },
          },
        ],
      },
    },
  };
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion: hero,
      zones: {
        field: [trainingSword],
        graveyard: [stellarionShift],
        hand: [backdash, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
      },
    },
    playerTwo: { champion: champion(false) },
  });
  const p = game.player("player-one"),
    q = game.player("player-two"),
    source = p.card(stellarionShift),
    target = p.card(hero);
  p.activate(backdash, {
    targets: { "target-1": [target.objectId] },
    reservePayment: [{ kind: "card", cardId: p.cards(woodlandSquirrels)[0]!.objectId }],
  });
  passEffectsStack(game);
  p.declareAttack(target, q.card(champion(false)), { weaponIds: [p.card(trainingSword).objectId] });
  expect(game.state.combat).not.toBeNull();
  p.activateAbility(target, `${base.canonicalId}-a2`);
  passEffectsStack(game);
  if (game.state.decision?.kind === "resolve-effect-choice") {
    answerDecision(game, "resolve-effect-choice", [source.objectId]);
    passEffectsStack(game);
  }
  expect(game.state.objects[source.objectId]!.zone).toBe("intent");
  opportunity(game, p.id);
  const before = game.state;
  expect(() =>
    p.activateAbility(source, "ms2x2v4qe3-a2", {
      reservePayment: p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card", cardId: c.objectId })),
    }),
  ).toThrow();
  expect(game.state).toEqual(before);
  game.resolveCombatWithoutRetaliation();
  expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
});
