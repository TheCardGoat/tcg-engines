import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { enPassant } from "../cards/PTM/attacks/en-passant.ts";
import { snowWhiteWeissQueen } from "../cards/DTR/allies/snow-white-weiss-queen.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { declareResolvedAttack, passEffectsStack } from "./decisions.ts";
export function proveCommandedWill(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  bonus: number,
) {
  const base = grandArchiveTestFace(card).stats.power!;
  for (const matching of [false, true])
    for (const mode of ["normal", "command", "other-command"] as const) {
      it(`applies only to this unit's Command attack: matching=${matching}, mode=${mode}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(card, matching, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [card, snowWhiteWeissQueen],
              hand: [enPassant, woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: { champion, zones: { field: [card] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(card),
          target = q.card(champion),
          attackCard = p.card(enPassant),
          other = q.card(card);
        const power = (id: typeof source.objectId) =>
          deriveGrandArchiveNumericProperty(game.state.objects[id]!, "power", {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          });
        expect(power(source.objectId)).toBe(base);
        expect(power(other.objectId)).toBe(base);
        const attacker = mode === "other-command" ? p.card(snowWhiteWeissQueen) : source;
        if (mode === "normal") p.declareAttack(attacker, target);
        else {
          p.activate(attackCard, {
            attackAttackerId: attacker.objectId,
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          });
          expect(power(source.objectId)).toBe(base);
          passEffectsStack(game);
          expect(power(source.objectId)).toBe(base);
          declareResolvedAttack(game, attacker.objectId, target.objectId, "Commanded Will attack");
          expect(game.state.objects[attackCard.objectId]!.zone).toBe("intent");
        }
        expect(power(source.objectId)).toBe(base + (mode === "command" ? bonus : 0));
        expect(power(other.objectId)).toBe(base);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(
          mode === "normal" ? base : mode === "command" ? base + bonus + 2 : 3,
        );
        expect(game.state.combat).toBeNull();
        expect(power(source.objectId)).toBe(base);
        expect(power(other.objectId)).toBe(base);
        if (mode !== "normal") expect(p.zone("graveyard")).toContainEqual(attackCard);
      });
    }
}
