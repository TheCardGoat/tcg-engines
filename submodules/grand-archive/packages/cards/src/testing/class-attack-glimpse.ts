import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { grayWolf } from "../cards/DOA/allies/gray-wolf.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { reclaim } from "../cards/DOA/actions/reclaim.ts";
import { powercell } from "../cards/MRC/tokens/powercell.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { answerDecision, declareResolvedAttack, passEffectsStack } from "./decisions.ts";

type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
export function proveClassAttackGlimpse(card: Card, kind: "ally" | "attack" | "weapon") {
  for (const matching of [false, true])
    for (const size of [0, 1, 5])
      for (const placement of ["top", "bottom", "split"] as const)
        prove(matching, size, placement, "none");
  if (kind === "ally")
    for (const matching of [false, true])
      for (const boost of ["before", "response"] as const) prove(matching, 5, "split", boost);
  it("does not trigger from another ally's attack", () => {
    const champion = enableAllTestElements(
      createClassBonusTestChampion(card, true, "activation-discount"),
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [woodlandSquirrels, ...(kind === "attack" ? [] : [card])],
          hand: kind === "attack" ? [card] : [],
          "main-deck": [grayWolf, giantTortoise],
        },
      },
      playerTwo: { champion },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      deck = p.zone("main-deck");
    p.declareAttack(p.card(woodlandSquirrels), q.card(champion));
    passEffectsStack(game);
    expect(game.state.decision).toBeNull();
    expect(p.zone("main-deck")).toEqual(deck);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(1);
  });
  if (kind === "ally")
    for (const boosted of [false, true])
      it(`keeps the source's last power after leaving the field: boosted=${boosted}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(card, true, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [card, ...(boosted ? [powercell] : [])],
              hand: [reclaim, ...Array.from({ length: boosted ? 3 : 2 }, () => woodlandSquirrels)],
              "main-deck": [grayWolf, giantTortoise, woodlandSquirrels, grayWolf, giantTortoise],
            },
          },
          playerTwo: { champion },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(card),
          deck = p.zone("main-deck");
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
        if (boosted) {
          p.activateAbility(powercell, "qzzadf9q1v-a1", {
            reservePayment: pay(1),
            targets: { "target-1": [source.objectId] },
          });
          passEffectsStack(game);
        }
        p.declareAttack(source, q.card(champion));
        p.activate(reclaim, { reservePayment: pay(2), targets: { "target-1": [source.objectId] } });
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.zone).toBe("hand");
        const looked = deck.slice(0, boosted ? 4 : 2).map((ref) => ref.objectId);
        expect(game.state.decision).toMatchObject({
          kind: "resolve-glimpse",
          playerId: p.id,
          cardIds: looked,
        });
        answerDecision(game, "resolve-glimpse", {
          kind: "reorder",
          top: [],
          bottom: [...looked].reverse(),
        });
        passEffectsStack(game);
        expect(p.zone("main-deck").map((ref) => ref.objectId)).toEqual([
          ...deck.slice(looked.length).map((ref) => ref.objectId),
          ...looked.reverse(),
        ]);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(0);
      });
  function prove(
    matching: boolean,
    size: number,
    placement: "top" | "bottom" | "split",
    boost: "none" | "before" | "response",
  ) {
    it(`glimpses on its attack: class=${matching}, deck=${size}, order=${placement}, power boost=${boost}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(card, matching, "activation-discount"),
      );
      const other = enableAllTestElements(
        createClassBonusTestChampion(card, true, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [...(kind === "attack" ? [] : [card]), ...(boost !== "none" ? [powercell] : [])],
            hand: [
              ...(kind === "attack" ? [card, woodlandSquirrels, woodlandSquirrels] : []),
              ...(boost !== "none" ? [woodlandSquirrels] : []),
            ],
            "main-deck": [
              woodlandSquirrels,
              grayWolf,
              giantTortoise,
              reclaim,
              woodlandSquirrels,
            ].slice(0, size),
          },
        },
        playerTwo: { champion: other, zones: { "main-deck": [woodlandSquirrels] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(card),
        hero = p.card(champion),
        target = q.card(other),
        deck = p.zone("main-deck"),
        enemyDeck = q.zone("main-deck");
      const buff = () =>
        p.activateAbility(powercell, "qzzadf9q1v-a1", {
          reservePayment: [
            { kind: "card", cardId: p.card(woodlandSquirrels, { zone: "hand" }).objectId },
          ],
          targets: { "target-1": [source.objectId] },
        });
      if (boost === "before") {
        buff();
        passEffectsStack(game);
      }
      if (kind === "attack") {
        p.activate(source, {
          attackAttackerId: hero.objectId,
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((ref) => ({ kind: "card", cardId: ref.objectId })),
        });
        passEffectsStack(game);
        expect(p.zone("main-deck")).toEqual(deck);
        declareResolvedAttack(game, hero.objectId, target.objectId, "Riptide Slash attack");
      } else
        p.declareAttack(
          kind === "ally" ? source : hero,
          target,
          kind === "weapon" ? { weaponIds: [source.objectId] } : {},
        );
      expect(game.state.objects[target.objectId]!.damage).toBe(0);
      expect(p.zone("main-deck")).toEqual(deck);
      if (boost === "response") buff();
      passEffectsStack(game);
      const count = boost === "none" ? 2 : 4;
      const looked = deck.slice(0, count).reverse();
      const bottom =
        placement === "bottom" ? looked : placement === "split" ? looked.slice(0, 1) : [];
      const top = looked.filter((ref) => !bottom.includes(ref));
      if (matching && size > 0) {
        expect(game.state.decision).toMatchObject({
          kind: "resolve-glimpse",
          playerId: p.id,
          cardIds: deck.slice(0, count).map((ref) => ref.objectId),
        });
        const before = game.state;
        for (const invalid of [
          [enemyDeck[0]!.objectId],
          [],
          [looked[0]!.objectId, looked[0]!.objectId],
        ]) {
          expect(() =>
            answerDecision(game, "resolve-glimpse", { kind: "reorder", top: invalid, bottom: [] }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        answerDecision(game, "resolve-glimpse", {
          kind: "reorder",
          top: top.map((ref) => ref.objectId),
          bottom: bottom.map((ref) => ref.objectId),
        });
        passEffectsStack(game);
      } else expect(game.state.decision).toBeNull();
      expect(p.zone("main-deck")).toEqual(
        matching ? [...top, ...deck.slice(count), ...bottom] : deck,
      );
      expect(q.zone("main-deck")).toEqual(enemyDeck);
      expect(p.zone("hand")).toHaveLength(0);
      expect(q.zone("hand")).toHaveLength(0);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(
        kind === "weapon" ? 1 : boost === "none" ? 2 : 4,
      );
      if (kind === "attack") expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
      if (kind === "weapon")
        expect(game.state.objects[source.objectId]!.counters.durability).toBe(2);
    });
  }
}
