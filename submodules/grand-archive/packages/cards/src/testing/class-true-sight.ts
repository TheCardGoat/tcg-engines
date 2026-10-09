import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { shimmercloakAssassin } from "../cards/ALC/allies/shimmercloak-assassin.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { resonantAether } from "../cards/DTR/actions/resonant-aether.ts";
import { createClassBonusTestChampion, grandArchiveTestFace } from "./class-bonus-test-champion.ts";
import { classBonusLeveledChampion } from "./class-bonus-level.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "./decisions.ts";

/** True Sight applies only to the attacking unit or the weapon used for this attack. */
export function proveClassTrueSight(card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>) {
  const face = grandArchiveTestFace(card),
    weapon = face.typeLine.types.includes("WEAPON"),
    aetherwing = face.typeLine.subtypes.includes("AETHERWING");
  for (const initialMatch of [false, true])
    for (const levelUp of [false, true])
      it(`uses the current class and the selected attacker/weapon: initial match=${initialMatch}, level up=${levelUp}`, () => {
        const champion = createClassBonusTestChampion(card, initialMatch, "activation-discount");
        const successor = classBonusLeveledChampion(card, !initialMatch, 1).lineage[0]!;
        const game = GrandArchiveTestEngine.startFixture({
          phase: levelUp ? "materialize" : "main",
          playerOne: {
            champion,
            zones: {
              field: [card, trainingSword, giantTortoise],
              hand: [resonantAether, woodlandSquirrels],
              "material-deck": [successor],
              memory: [woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [shimmercloakAssassin],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(card),
          hero = p.card(champion),
          hidden = q.card(shimmercloakAssassin),
          targetChampion = q.card(champion);
        const enabled = levelUp ? !initialMatch : initialMatch;
        if (levelUp) {
          p.materialize(successor);
          passEffectsStack(game);
          advanceToMain(game, p.id);
        }
        const attacker = weapon ? hero : source;
        const options = weapon ? { weaponIds: [source.objectId] } : {};
        if (aetherwing) {
          const before = game.state;
          expect(() => p.declareAttack(attacker, targetChampion, options)).toThrow();
          expect(game.state).toEqual(before);
          p.activate(resonantAether, {
            reservePayment: [
              { kind: "card", cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
            ],
          });
          passEffectsStack(game);
          answerDecision(game, "resolve-effect-choice", [source.objectId]);
          passEffectsStack(game);
          expect(p.card(resonantAether, { zone: "loaded" })).toBeDefined();
        }
        const before = game.state;
        expect(() => p.declareAttack(p.card(giantTortoise), hidden)).toThrow();
        expect(game.state).toEqual(before);
        expect(() =>
          p.declareAttack(hero, hidden, { weaponIds: [p.card(trainingSword).objectId] }),
        ).toThrow();
        expect(game.state).toEqual(before);
        if (!enabled) {
          expect(() => p.declareAttack(attacker, hidden, options)).toThrow();
          expect(game.state).toEqual(before);
        }
        const target = enabled ? hidden : targetChampion;
        p.declareAttack(attacker, target, options);
        expect(game.state.combat?.targetIds).toEqual([target.objectId]);
        game.resolveCombatWithoutRetaliation();
        if (aetherwing && enabled)
          expect(game.state.objects[hidden.objectId]!.zone).toBe("graveyard");
        else expect(game.state.objects[target.objectId]!.damage).toBe(aetherwing ? 2 : 1);
        expect(game.state.objects[attacker.objectId]!.states.has("rested")).toBe(true);
        if (aetherwing) expect(p.card(resonantAether, { zone: "graveyard" })).toBeDefined();
        if (!enabled) expect(game.state.objects[hidden.objectId]!.damage).toBe(0);
      });
}
