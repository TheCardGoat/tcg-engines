import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { trivariateDream } from "../cards/DTR/weapons/trivariate-dream.ts";
import { strategicPlanning } from "../cards/DOA/actions/strategic-planning.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  requireSingleFace,
} from "./class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "./decisions.ts";

/** Aethercalling 1–2; Element Bonus 1–2. Loading does not activate or pay for the card. */
export function proveElementAethercalling(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
) {
  for (const matchingClass of [false, true]) {
    const astra = enableAllTestElements(
      createClassBonusTestChampion(card, matchingClass, "activation-discount"),
    );
    const normBase = enableAllTestElements(
      createClassBonusTestChampion(strategicPlanning, matchingClass, "activation-discount"),
    );
    const norm = {
      ...normBase,
      layout: {
        kind: "single-faced" as const,
        face: {
          ...requireSingleFace(normBase),
          typeLine: {
            ...requireSingleFace(normBase).typeLine,
            classes: requireSingleFace(astra).typeLine.classes,
          },
        },
      },
    };
    for (const matching of [false, true])
      for (const host of [false, true])
        for (const load of [false, true])
          it(`class matching ${matchingClass}, element matching ${matching}, owned host ${host}, load requested ${load}`, () => {
            const champion = matching ? astra : norm;
            const game = GrandArchiveTestEngine.startFixture({
              playerOne: {
                champion,
                zones: {
                  hand: [strategicPlanning, woodlandSquirrels, woodlandSquirrels, card],
                  field: [...(host ? [trivariateDream] : []), trainingSword],
                  graveyard: [trivariateDream, card],
                  "main-deck": [card, woodlandSquirrels, card],
                },
              },
              playerTwo: {
                champion: astra,
                zones: { field: [trivariateDream], "main-deck": [card] },
              },
            });
            const p = game.player("player-one"),
              q = game.player("player-two");
            const [eclipse, filler, unseen] = p.zone("main-deck");
            if (!eclipse || !filler || !unseen) throw new Error("Expected three deck cards");
            expect(eclipse.definitionId).toBe(card.canonicalId);
            const payment = p
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
            p.activate(p.card(strategicPlanning), { reservePayment: payment });
            passEffectsStack(game);
            expect(game.state.decision).toMatchObject({
              kind: "resolve-glimpse",
              playerId: p.id,
              cardIds: [eclipse.objectId, filler.objectId],
            });
            expect(game.state.objects[eclipse.objectId]!.zone).toBe("main-deck");
            const weapon = host
              ? p.card(trivariateDream, { zone: "field" })
              : p.card(trainingSword);
            const before = game.state;
            const badLoads = [
              { cardId: eclipse.objectId, weaponId: q.card(trivariateDream).objectId },
              { cardId: eclipse.objectId, weaponId: p.card(trainingSword).objectId },
              {
                cardId: eclipse.objectId,
                weaponId: p.card(trivariateDream, { zone: "graveyard" }).objectId,
              },
              { cardId: unseen.objectId, weaponId: weapon.objectId },
              {
                cardId: p.card(card, { zone: "hand" }).objectId,
                weaponId: weapon.objectId,
              },
              {
                cardId: p.card(card, { zone: "graveyard" }).objectId,
                weaponId: weapon.objectId,
              },
              {
                cardId: q.card(card, { zone: "main-deck" }).objectId,
                weaponId: weapon.objectId,
              },
            ];
            for (const attempt of badLoads) {
              expect(() =>
                answerDecision(game, "resolve-glimpse", {
                  kind: "reorder",
                  loads: [attempt],
                  top: [filler.objectId],
                  bottom: attempt.cardId === eclipse.objectId ? [] : [eclipse.objectId],
                }),
              ).toThrow();
              expect(game.state).toEqual(before);
            }
            const answer = {
              kind: "reorder",
              loads: [{ cardId: eclipse.objectId, weaponId: weapon.objectId }],
              top: [filler.objectId],
              bottom: [],
            };
            if (load && matching && host) {
              answerDecision(game, "resolve-glimpse", answer);
              expect(game.state.objects[eclipse.objectId]).toMatchObject({
                zone: "loaded",
                hostId: weapon.objectId,
                ownerId: p.id,
              });
              expect(p.zone("main-deck").map((c) => c.objectId)).toEqual([
                filler.objectId,
                unseen.objectId,
              ]);
              expect(game.state.stack).toHaveLength(0);
              expect(game.state.objects[p.card(champion).objectId]!.counters.preparation).toBe(1);
              p.declareAttack(p.card(champion), q.card(astra), { weaponIds: [weapon.objectId] });
              game.resolveCombatWithoutRetaliation();
              expect(game.state.objects[q.card(astra).objectId]!.damage).toBe(3);
              expect(game.state.objects[eclipse.objectId]!.zone).toBe("graveyard");
            } else {
              if (load) {
                expect(() => answerDecision(game, "resolve-glimpse", answer)).toThrow();
                expect(game.state).toEqual(before);
              }
              answerDecision(game, "resolve-glimpse", {
                kind: "reorder",
                top: [filler.objectId],
                bottom: [eclipse.objectId],
              });
              expect(p.zone("main-deck").map((c) => c.objectId)).toEqual([
                filler.objectId,
                unseen.objectId,
                eclipse.objectId,
              ]);
              expect(p.zone("loaded")).toHaveLength(0);
            }
            expect(game.state.objects[unseen.objectId]!.zone).toBe("main-deck");
            expect(q.zone("loaded")).toHaveLength(0);
            expect(p.zone("memory")).toHaveLength(2);
          });
  }
  for (const sameWeapon of [false, true]) {
    it(`loads two glimpsed cards once each, with separate weapon assignments: same weapon=${sameWeapon}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(card, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [strategicPlanning, woodlandSquirrels, woodlandSquirrels],
            field: [trivariateDream, trivariateDream],
            "main-deck": [card, card, woodlandSquirrels],
          },
        },
        playerTwo: { champion },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const [first, second, unseen] = p.zone("main-deck"),
        [weapon, other] = p.cards(trivariateDream);
      if (!first || !second || !unseen || !weapon || !other)
        throw new Error("Missing test objects");
      p.activate(strategicPlanning, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
      });
      passEffectsStack(game);
      const before = game.state;
      expect(() =>
        answerDecision(game, "resolve-glimpse", {
          kind: "reorder",
          loads: [
            { cardId: first.objectId, weaponId: weapon.objectId },
            { cardId: first.objectId, weaponId: other.objectId },
          ],
          top: [second.objectId],
          bottom: [],
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      answerDecision(game, "resolve-glimpse", {
        kind: "reorder",
        loads: [
          { cardId: first.objectId, weaponId: weapon.objectId },
          { cardId: second.objectId, weaponId: sameWeapon ? weapon.objectId : other.objectId },
        ],
        top: [],
        bottom: [],
      });
      expect(game.state.objects[first.objectId]).toMatchObject({
        zone: "loaded",
        hostId: weapon.objectId,
      });
      expect(game.state.objects[second.objectId]).toMatchObject({
        zone: "loaded",
        hostId: sameWeapon ? weapon.objectId : other.objectId,
      });
      expect(p.zone("main-deck")).toEqual([unseen]);
      expect(p.zone("memory")).toHaveLength(2);
      expect(game.state.stack).toHaveLength(0);
      p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [weapon.objectId] });
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(sameWeapon ? 5 : 3);
      expect(game.state.objects[first.objectId]!.zone).toBe("graveyard");
      expect(game.state.objects[second.objectId]!.zone).toBe(sameWeapon ? "graveyard" : "loaded");
    });
  }
}
