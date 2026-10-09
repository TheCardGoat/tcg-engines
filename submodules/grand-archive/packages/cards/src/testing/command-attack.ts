import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { declareResolvedAttack, passEffectsStack } from "./decisions.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { snowWhiteWeissQueen } from "../cards/DTR/allies/snow-white-weiss-queen.ts";
import { spirelleSchwartzQueen } from "../cards/DTR/allies/spirelle-schwartz-queen.ts";
import { firetunedAutomaton } from "../cards/ALC/allies/firetuned-automaton.ts";
import { cellConverter } from "../cards/MRC/allies/cell-converter.ts";
import { enfeebledDagger } from "../cards/DTR/items/enfeebled-dagger.ts";
import { powercell } from "../cards/MRC/tokens/powercell.ts";
export function proveCommandAttack({
  card,
  automaton = false,
  sacrifice = false,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  automaton?: boolean;
  sacrifice?: boolean;
}): void {
  const face = grandArchiveTestFace(card);
  if (
    face.cost.kind !== "reserve" ||
    typeof face.cost.amount !== "number" ||
    typeof face.stats.power !== "number"
  )
    throw new Error("Expected fixed Command stats");
  const cost = face.cost.amount,
    power = face.stats.power;
  for (const scenario of ["normal", "zero", "rested", "removed"] as const)
    it(`Command selects the correct ally and preserves champion readiness: ${scenario}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(card, false, "activation-discount"),
      );
      const ally = automaton
        ? scenario === "zero"
          ? cellConverter
          : firetunedAutomaton
        : scenario === "zero"
          ? spirelleSchwartzQueen
          : snowWhiteWeissQueen;
      const allyPower = scenario === "zero" ? 0 : automaton ? 3 : 1;
      const game = GrandArchiveTestEngine.startFixture({
        definitions: [powercell],
        playerOne: {
          champion,
          zones: {
            hand: [card, ally, ...Array.from({ length: cost }, () => woodlandSquirrels)],
            field: [ally, woodlandSquirrels],
            graveyard: [ally],
          },
        },
        playerTwo: { champion, zones: { field: [ally, enfeebledDagger] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(card),
        attacker = p.card(ally, { zone: "field" }),
        hero = p.card(champion),
        target = q.card(champion);
      const reservePayment = p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
      const costs = sacrifice ? { costSelections: [[]] } : {};
      for (const invalid of [
        hero,
        p.card(woodlandSquirrels, { zone: "field" }),
        p.card(ally, { zone: "hand" }),
        p.card(ally, { zone: "graveyard" }),
        q.card(ally),
      ]) {
        const before = game.state;
        expect(() =>
          p.activate(source, { ...costs, reservePayment, attackAttackerId: invalid.objectId }),
        ).toThrow();
        expect(game.state).toEqual(before);
      }
      if (scenario === "rested") {
        p.declareAttack(attacker, target);
        game.resolveCombatWithoutRetaliation();
        const before = game.state;
        expect(() =>
          p.activate(source, { ...costs, reservePayment, attackAttackerId: attacker.objectId }),
        ).toThrow();
        expect(game.state).toEqual(before);
        return;
      }
      if (scenario === "zero") expect(() => p.declareAttack(attacker, target)).toThrow();
      p.activate(source, { ...costs, reservePayment, attackAttackerId: attacker.objectId });
      expect(game.state.objects[attacker.objectId]!.states.has("rested")).toBe(true);
      expect(game.state.objects[hero.objectId]!.states.has("rested")).toBe(false);
      expect(p.zone("memory")).toHaveLength(cost);
      if (scenario === "removed") {
        p.pass();
        q.activateAbility(enfeebledDagger, "idpdon8f0h-a1", {
          targets: { "target-unit": [attacker.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[attacker.objectId]!.zone).toBe("graveyard");
        expect(game.state.combat).toBeNull();
        expect(game.state.decision).toBeNull();
        expect(game.state.objects[target.objectId]!.damage).toBe(0);
      } else {
        passEffectsStack(game);
        declareResolvedAttack(
          game,
          attacker.objectId,
          target.objectId,
          "Command attack declaration",
        );
        expect(game.state.combat?.attackerId).toBe(attacker.objectId);
        expect(game.state.objects[source.objectId]!.zone).toBe("intent");
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(allyPower + power);
      }
      expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
      expect(game.state.objects[hero.objectId]!.states.has("rested")).toBe(false);
    });
}
