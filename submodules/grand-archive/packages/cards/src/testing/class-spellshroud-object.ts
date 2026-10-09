import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { meltdown } from "../cards/ALC/actions/meltdown.ts";
import { soothingDisillusion } from "../cards/AMB/actions/soothing-disillusion.ts";
import { temperedSteel } from "../cards/DOA/actions/tempered-steel.ts";
import { trainingSession } from "../cards/DOA/actions/training-session.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { classBonusLeveledChampion } from "./class-bonus-level.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";

/** Spellshroud 1: spells from either player cannot target the object; Skills can. */
export function proveClassSpellshroudObject(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
) {
  const phantasia = grandArchiveTestFace(card).typeLine.types.includes("PHANTASIA");
  const spell = phantasia ? soothingDisillusion : meltdown,
    cost = phantasia ? 2 : 4;
  for (const matching of [false, true]) {
    for (const own of [false, true]) {
      it(`checks the object's controller rather than the caster: class=${matching}, own spell=${own}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(card, matching, "activation-discount"),
        );
        const otherChampion = enableAllTestElements(
          createClassBonusTestChampion(card, false, "activation-discount"),
        );
        const hand = [spell, ...Array.from({ length: cost }, () => woodlandSquirrels)];
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: own ? "playerOne" : "playerTwo",
          playerOne: { champion, zones: { field: [card], hand: own ? hand : [] } },
          playerTwo: { champion: otherChampion, zones: { field: [card], hand: own ? [] : hand } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          caster = own ? p : q;
        const protectedCard = p.card(card),
          unprotectedCard = q.card(card);
        const payment = caster
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
        const declaration = {
          ...(phantasia ? { modeIds: ["mode-1"] } : {}),
          reservePayment: payment,
        };
        if (matching) {
          const before = game.state;
          expect(() =>
            caster.activate(spell, {
              ...declaration,
              targets: { "target-1": [protectedCard.objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        const target = matching ? unprotectedCard : protectedCard;
        caster.activate(spell, { ...declaration, targets: { "target-1": [target.objectId] } });
        expect(game.state.objects[target.objectId]!.zone).toBe("field");
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.zone).toBe(
          phantasia ? "graveyard" : "banishment",
        );
        expect(
          game.state.objects[(matching ? protectedCard : unprotectedCard).objectId]!.zone,
        ).toBe("field");
        expect(caster.zone("memory")).toHaveLength(cost);
      });
    }
    it(`permits a targeted Skill while class bonus=${matching}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(card, matching, "activation-discount"),
      );
      const skill = phantasia ? trainingSession : temperedSteel;
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [card],
            hand: [skill, ...Array.from({ length: phantasia ? 2 : 1 }, () => woodlandSquirrels)],
          },
        },
        playerTwo: { champion },
      });
      const p = game.player("player-one"),
        source = p.card(card),
        counter = phantasia ? "buff" : "durability";
      const previous = game.state.objects[source.objectId]!.counters[counter] ?? 0;
      p.activate(skill, {
        reservePayment: p
          .cards(woodlandSquirrels)
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
        targets: { "target-1": [source.objectId] },
      });
      expect(game.state.objects[source.objectId]!.counters[counter] ?? 0).toBe(previous);
      passEffectsStack(game);
      expect(game.state.objects[source.objectId]!.counters[counter]).toBe(previous + 1);
      expect(game.state.objects[source.objectId]!.zone).toBe("field");
      expect(p.zone("memory")).toHaveLength(phantasia ? 2 : 1);
    });
  }
  for (const initiallyEnabled of [false, true]) {
    it(`rechecks Spellshroud after a public level change: initially enabled=${initiallyEnabled}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(card, initiallyEnabled, "activation-discount"),
      );
      const successor = classBonusLeveledChampion(card, !initiallyEnabled, 1).lineage[0]!;
      const otherChampion = enableAllTestElements(
        createClassBonusTestChampion(card, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        phase: "materialize",
        playerOne: {
          champion,
          zones: {
            field: [card],
            "material-deck": [successor],
            memory: [woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion: otherChampion,
          zones: {
            field: [card],
            hand: [spell, ...Array.from({ length: cost }, () => woodlandSquirrels)],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(card),
        other = q.card(card);
      p.materialize(successor);
      passEffectsStack(game);
      advanceToMain(game, q.id);
      const declarations = {
        ...(phantasia ? { modeIds: ["mode-1"] } : {}),
        reservePayment: q
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, cost)
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
      };
      if (!initiallyEnabled) {
        const before = game.state;
        expect(() =>
          q.activate(spell, { ...declarations, targets: { "target-1": [source.objectId] } }),
        ).toThrow();
        expect(game.state).toEqual(before);
      }
      const target = initiallyEnabled ? source : other;
      q.activate(spell, { ...declarations, targets: { "target-1": [target.objectId] } });
      passEffectsStack(game);
      expect(game.state.objects[target.objectId]!.zone).toBe(
        phantasia ? "graveyard" : "banishment",
      );
      expect(game.state.objects[(initiallyEnabled ? other : source).objectId]!.zone).toBe("field");
    });
  }
}
