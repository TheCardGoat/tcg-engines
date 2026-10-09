import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveCharacteristics } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { powercell } from "../cards/MRC/tokens/powercell.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { ferventBeastmaster } from "../cards/DOA/allies/fervent-beastmaster.ts";
import { dredgingStreams } from "../cards/SP4/actions/dredging-streams.ts";
import { reclaim } from "../cards/DOA/actions/reclaim.ts";
import { umbilicalRitual } from "../cards/PRD/actions/umbilical-ritual.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { advanceCombatToTrigger, passEffectsStack } from "./decisions.ts";
type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
export function proveDeathPowercell(card: Card, abilityId: string) {
  for (const matching of [false, true])
    for (const mode of ["combat", "exile", "sacrifice", "bounce"] as const)
      it(`summons exactly one owned Powercell only after death: class=${matching}, mode=${mode}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(card, matching, "activation-discount"),
        );
        const combat = mode === "combat" || mode === "exile";
        const game = GrandArchiveTestEngine.startFixture({
          definitions: [powercell],
          firstPlayer: combat ? "playerTwo" : "playerOne",
          playerOne: {
            champion,
            zones: {
              field: [card],
              hand: combat ? [] : [reclaim, umbilicalRitual, woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [ferventBeastmaster, powercell],
              hand: mode === "exile" ? [dredgingStreams, woodlandSquirrels, woodlandSquirrels] : [],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(card),
          opposing = q.card(powercell);
        const cells = () => p.cards(powercell, { zone: "field" });
        expect(cells()).toHaveLength(0);
        if (combat) {
          q.declareAttack(ferventBeastmaster, source);
          expect(cells()).toHaveLength(0);
          advanceCombatToTrigger(game, abilityId);
          expect(p.card(card, { zone: "graveyard" })).toEqual(source);
          expect(cells()).toHaveLength(0);
          expect(
            game.state.stack.some(
              (item) => item.kind === "triggered-ability" && item.ability.id === abilityId,
            ),
          ).toBe(true);
          if (mode === "exile")
            q.activate(dredgingStreams, {
              reservePayment: q
                .cards(woodlandSquirrels, { zone: "hand" })
                .map((ref) => ({ kind: "card", cardId: ref.objectId })),
              targets: { "target-card": [source.objectId] },
            });
        } else if (mode === "sacrifice") {
          p.activate(umbilicalRitual, { costSelections: [[source.objectId]] });
          expect(p.card(card, { zone: "graveyard" })).toEqual(source);
          expect(cells()).toHaveLength(0);
        } else
          p.activate(reclaim, {
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((ref) => ({ kind: "card", cardId: ref.objectId })),
            targets: { "target-1": [source.objectId] },
          });
        passEffectsStack(game);
        expect(cells()).toHaveLength(mode === "bounce" ? 0 : 1);
        expect(
          p.card(card, {
            zone: mode === "bounce" ? "hand" : mode === "exile" ? "banishment" : "graveyard",
          }),
        ).toEqual(source);
        if (mode !== "bounce") {
          const token = game.state.objects[cells()[0]!.objectId]!;
          expect(token).toMatchObject({ ownerId: p.id, controllerId: p.id, isToken: true });
          expect(token.states.has("rested")).toBe(false);
          const traits = deriveGrandArchiveCharacteristics(token, {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          });
          expect(traits.types).toEqual(["ITEM"]);
          expect(traits.subtypes).toContain("POWERCELL");
        }
        expect(q.cards(powercell, { zone: "field" })).toEqual([opposing]);
      });
}
