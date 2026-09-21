import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { viridescentAetherstreak } from "./viridescent-aetherstreak.ts";
import { backdash } from "./backdash.ts";
import { enfeebledDagger } from "../items/enfeebled-dagger.ts";
import { trivariateDream } from "../weapons/trivariate-dream.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

function fixture(matching = true, opposingTurn = false, hosts = true) {
  const hero = enableAllTestElements(
    createClassBonusTestChampion(viridescentAetherstreak, matching, "activation-discount"),
  );
  const game = GrandArchiveTestEngine.startFixture({
    firstPlayer: opposingTurn ? "playerTwo" : "playerOne",
    playerOne: {
      champion: hero,
      zones: {
        hand: [
          viridescentAetherstreak,
          ...Array.from({ length: 5 }, () => backdash),
          ...Array.from({ length: 12 }, () => woodlandSquirrels),
        ],
        field: [
          giantTortoise,
          woodlandSquirrels,
          trainingSword,
          ...(hosts ? [trivariateDream, trivariateDream] : []),
        ],
        graveyard: [giantTortoise],
        "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
      },
    },
    playerTwo: {
      champion: hero,
      zones: {
        field: [
          giantTortoise,
          woodlandSquirrels,
          trivariateDream,
          trainingSword,
          ...Array.from({ length: 16 }, () => enfeebledDagger),
        ],
        hand: [sparkAlight, woodlandSquirrels, woodlandSquirrels],
        "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
      },
    },
  });
  const p = game.player("player-one"),
    q = game.player("player-two");
  const ownHero = p.card(hero),
    otherHero = q.card(hero);
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
  const distant = (targetId: typeof ownHero.objectId) => {
    opportunity(p.id);
    p.activate(p.cards(backdash, { zone: "hand" })[0]!, {
      reservePayment: pay(p, 1),
      targets: { "target-1": [targetId] },
    });
    passEffectsStack(game);
  };
  const hit = (targetId: typeof ownHero.objectId) => {
    opportunity(q.id);
    q.activateAbility(q.cards(enfeebledDagger, { zone: "field" })[0]!, "idpdon8f0h-a1", {
      targets: { "target-unit": [targetId] },
    });
    passEffectsStack(game);
  };
  return { game, p, q, ownHero, otherHero, pay, opportunity, distant, hit };
}

/** @covers pc0y3xneg7-a1 */
describe("Viridescent Aetherstreak — class discount", () => {
  for (const matching of [false, true])
    it(`class=${matching}`, () => {
      const { game, p, pay } = fixture(matching),
        cost = matching ? 2 : 3;
      const modes = ["become-distant", "prevent-damage"],
        before = game.state;
      expect(() =>
        p.activate(viridescentAetherstreak, {
          modeIds: modes,
          reservePayment: pay(p, cost - 1),
          targets: { "distant-unit": [] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      p.activate(viridescentAetherstreak, {
        modeIds: modes,
        reservePayment: pay(p, cost),
        targets: { "distant-unit": [] },
      });
      expect(p.zone("memory")).toHaveLength(cost);
      passEffectsStack(game);
      expect(p.cards(viridescentAetherstreak, { zone: "graveyard" })).toHaveLength(1);
    });
});

/** @covers pc0y3xneg7-a2 */
describe("Viridescent Aetherstreak — exactly two modes", () => {
  const pairs = [
    ["become-distant", "prevent-damage"],
    ["become-distant", "load"],
    ["prevent-damage", "load"],
  ];
  for (const modes of pairs)
    for (const targetKind of [
      "own-champion",
      "opposing-champion",
      "own-ally",
      "opposing-ally",
      "none",
    ] as const)
      it(`${modes.join("+")}, target=${targetKind}`, () => {
        const { game, p, q, ownHero, otherHero, pay, opportunity, distant, hit } = fixture();
        const target =
          targetKind === "own-champion"
            ? ownHero
            : targetKind === "opposing-champion" || targetKind === "none"
              ? otherHero
              : (targetKind === "own-ally" ? p : q).card(giantTortoise, { zone: "field" });
        const selected = targetKind === "none" ? [] : [target.objectId];
        if (!modes.includes("become-distant") && selected.length) distant(target.objectId);
        opportunity(p.id);
        const source = p.card(viridescentAetherstreak),
          initial = game.state;
        for (const invalid of [
          [],
          ["load"],
          ["load", "load"],
          ["become-distant", "prevent-damage", "load"],
        ]) {
          expect(() =>
            p.activate(source, { modeIds: invalid, reservePayment: pay(p, 2) }),
          ).toThrow();
          expect(game.state).toEqual(initial);
        }
        if (modes.includes("become-distant"))
          for (const ids of [
            [p.card(trainingSword).objectId],
            [p.card(giantTortoise, { zone: "graveyard" }).objectId],
            [ownHero.objectId, otherHero.objectId],
            [target.objectId, target.objectId],
          ]) {
            expect(() =>
              p.activate(source, {
                modeIds: modes,
                reservePayment: pay(p, 2),
                targets: { "distant-unit": ids },
              }),
            ).toThrow();
            expect(game.state).toEqual(initial);
          }
        p.activate(source, {
          modeIds: modes,
          reservePayment: pay(p, 2),
          ...(modes.includes("become-distant") ? { targets: { "distant-unit": selected } } : {}),
        });
        expect(game.state.objects[source.objectId]!.zone).toBe("effects-stack");
        passEffectsStack(game);
        if (modes.includes("load")) {
          const hosts = p.cards(trivariateDream, { zone: "field" });
          for (const ids of [
            [],
            [q.card(trivariateDream).objectId],
            [p.card(trainingSword).objectId],
            hosts.map((c) => c.objectId),
          ]) {
            const before = game.state;
            expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
            expect(game.state).toEqual(before);
          }
          answerDecision(game, "resolve-effect-choice", [hosts[0]!.objectId]);
          passEffectsStack(game);
        }
        expect(game.state.objects[source.objectId]!.zone).toBe(
          modes.includes("load") ? "loaded" : "graveyard",
        );
        expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(
          selected.length > 0,
        );
        for (let i = 1; i <= 3; i++) {
          hit(target.objectId);
          expect(game.state.objects[target.objectId]!.damage).toBe(
            modes.includes("prevent-damage") && selected.length ? Math.max(0, i - 2) : i,
          );
        }
        if (modes.includes("load")) {
          opportunity(p.id);
          const before = game.state;
          expect(() =>
            p.declareAttack(ownHero, otherHero, {
              weaponIds: [p.cards(trivariateDream)[1]!.objectId],
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          const priorDamage = game.state.objects[otherHero.objectId]!.damage;
          p.declareAttack(ownHero, otherHero, {
            weaponIds: [p.cards(trivariateDream)[0]!.objectId],
          });
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[otherHero.objectId]!.damage).toBe(priorDamage + 2);
          expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
        }
        advanceToMain(game, q.id);
        expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(
          selected.length > 0 &&
            (targetKind === "opposing-champion" || targetKind === "opposing-ally"),
        );
        advanceToMain(game, p.id);
        expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(false);
      });
});

/** @covers pc0y3xneg7-a2 */
describe("Viridescent Aetherstreak — independent shields, damage types and expiry", () => {
  for (const opposingTurn of [false, true])
    it(`separate champion/ally shields on both sides; opposing turn=${opposingTurn}`, () => {
      const { game, p, q, ownHero, otherHero, pay, opportunity, distant, hit } = fixture(
        true,
        opposingTurn,
      );
      const allies = [p.card(giantTortoise, { zone: "field" }), q.card(giantTortoise)];
      for (const card of [otherHero, ...allies]) distant(card.objectId);
      opportunity(p.id);
      p.activate(viridescentAetherstreak, {
        modeIds: ["become-distant", "prevent-damage"],
        reservePayment: pay(p, 2),
        targets: { "distant-unit": [ownHero.objectId] },
      });
      passEffectsStack(game);
      opportunity(q.id);
      q.activate(sparkAlight, {
        reservePayment: pay(q, 2),
        targets: { "target-1": [ownHero.objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[ownHero.objectId]!.damage).toBe(2);
      for (const card of [ownHero, otherHero, ...allies]) {
        const initial = card.objectId === ownHero.objectId ? 2 : 0;
        hit(card.objectId);
        hit(card.objectId);
        expect(game.state.objects[card.objectId]!.damage).toBe(initial);
        hit(card.objectId);
        expect(game.state.objects[card.objectId]!.damage).toBe(initial + 1);
      }
      const ordinary = p.card(woodlandSquirrels, { zone: "field" });
      hit(ordinary.objectId);
      expect(game.state.objects[ordinary.objectId]!.zone).toBe("graveyard");
    });
  for (const opposingTurn of [false, true])
    it(`unused shields expire even while Distant remains; opposing turn=${opposingTurn}`, () => {
      const { game, p, q, ownHero, otherHero, pay, opportunity, hit } = fixture(true, opposingTurn);
      const target = opposingTurn ? ownHero : otherHero;
      opportunity(p.id);
      p.activate(viridescentAetherstreak, {
        modeIds: ["become-distant", "prevent-damage"],
        reservePayment: pay(p, 2),
        targets: { "distant-unit": [target.objectId] },
      });
      passEffectsStack(game);
      advanceToMain(game, opposingTurn ? p.id : q.id, game.state.turn.number);
      expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(true);
      hit(target.objectId);
      expect(game.state.objects[target.objectId]!.damage).toBe(1);
    });
  it("spends the shield on combat damage while loading and later allows noncombat damage", () => {
    const { game, p, q, ownHero, otherHero, pay, opportunity, distant, hit } = fixture();
    distant(otherHero.objectId);
    opportunity(p.id);
    const source = p.card(viridescentAetherstreak),
      weapon = p.cards(trivariateDream)[0]!;
    p.activate(source, { modeIds: ["prevent-damage", "load"], reservePayment: pay(p, 2) });
    passEffectsStack(game);
    answerDecision(game, "resolve-effect-choice", [weapon.objectId]);
    passEffectsStack(game);
    p.declareAttack(ownHero, otherHero, { weaponIds: [weapon.objectId] });
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[otherHero.objectId]!.damage).toBe(0);
    expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
    hit(otherHero.objectId);
    expect(game.state.objects[otherHero.objectId]!.damage).toBe(1);
  });
  it("resolves the other chosen mode when there is no controlled Aetherwing to load", () => {
    const { game, p, ownHero, pay } = fixture(true, false, false);
    p.activate(viridescentAetherstreak, {
      modeIds: ["become-distant", "load"],
      reservePayment: pay(p, 2),
      targets: { "distant-unit": [ownHero.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[ownHero.objectId]!.states.has("distant")).toBe(true);
    expect(p.cards(viridescentAetherstreak, { zone: "graveyard" })).toHaveLength(1);
    expect(p.zone("loaded")).toHaveLength(0);
  });
});
