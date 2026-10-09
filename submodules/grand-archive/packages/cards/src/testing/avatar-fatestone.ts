import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import { enableAllTestElements } from "./class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "./decisions.ts";
type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
export function proveAvatarFatestone(card: Card, stone: Card, wrongStone: Card) {
  for (const matching of [false, true])
    for (const mode of ["material-deck", "banishment", "decline", "absent"] as const)
      it(`sacrifices for two quest and the named Fatestone: Guo Jia=${matching}, mode=${mode}`, () => {
        const champion = enableAllTestElements(
          lineageTestChampion(matching ? "Guo Jia" : "Other", 0),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [card],
              hand: [stone, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              graveyard: [stone],
              "material-deck": [wrongStone, ...(mode === "absent" ? [] : [stone])],
              banishment: mode === "absent" ? [] : [stone],
            },
          },
          playerTwo: { champion, zones: { "material-deck": [stone] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const source = p.card(card),
          hero = p.card(champion),
          foe = q.card(champion);
        const abilityId = `${card.canonicalId}-a2`;
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const before = game.state;
        expect(() => q.activateAbility(source, abilityId)).toThrow();
        expect(game.state).toEqual(before);
        if (!matching) {
          expect(() => p.activateAbility(source, abilityId, { reservePayment: pay(2) })).toThrow();
          expect(game.state).toEqual(before);
          return;
        }
        expect(() => p.activateAbility(source, abilityId, { reservePayment: pay(1) })).toThrow();
        expect(game.state).toEqual(before);
        p.activateAbility(source, abilityId, { reservePayment: pay(2) });
        expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
        expect(game.state.objects[hero.objectId]!.counters["named:quest"] ?? 0).toBe(0);
        expect(p.zone("memory")).toHaveLength(2);
        const paid = game.state;
        expect(() => p.activateAbility(source, abilityId)).toThrow();
        expect(game.state).toEqual(paid);
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]!.counters["named:quest"]).toBe(2);
        expect(game.state.objects[foe.objectId]!.counters["named:quest"] ?? 0).toBe(0);
        if (game.state.decision?.kind === "resolve-optional-effect") {
          answerDecision(game, "resolve-optional-effect", mode !== "decline");
          passEffectsStack(game);
        }
        if (mode === "material-deck" || mode === "banishment") {
          expect(game.state.decision?.kind).toBe("resolve-effect-choice");
          for (const invalid of [
            p.card(wrongStone),
            p.card(stone, { zone: "hand" }),
            p.card(stone, { zone: "graveyard" }),
            q.card(stone),
          ]) {
            const choosing = game.state;
            expect(() =>
              answerDecision(game, "resolve-effect-choice", [invalid.objectId]),
            ).toThrow();
            expect(game.state).toEqual(choosing);
          }
          const chosen = p.card(stone, { zone: mode });
          const unchosen = p.card(stone, {
            zone: mode === "material-deck" ? "banishment" : "material-deck",
          });
          answerDecision(game, "resolve-effect-choice", [chosen.objectId]);
          passEffectsStack(game);
          expect(game.state.objects[chosen.objectId]!.zone).toBe("field");
          expect(game.state.objects[chosen.objectId]!.face).toBe("default");
          expect(game.state.objects[unchosen.objectId]!.zone).toBe(
            mode === "material-deck" ? "banishment" : "material-deck",
          );
        } else expect(p.cards(stone, { zone: "field" })).toHaveLength(0);
        expect(game.state.objects[hero.objectId]!.counters["named:quest"]).toBe(2);
        expect(game.state.decision).toBeNull();
        expect(game.state.stack).toHaveLength(0);
      });
}
