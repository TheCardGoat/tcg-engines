import { ward } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/empyrean-rapture.generated.ts";

/**
 * DTD004 Empyrean Rapture — Light Illusionist Chest.
 *
 * Printed:
 *   If a card with Herald in its name has been put into your hero's soul
 *   during your turn, the first hero ability you activate that turn costs
 *   {r}{r} less to activate.
 *   Once per Turn Instant - {r}: This gets ward 1 until end of turn.
 *
 * Model notes (hand-authored):
 * - Condition is a turn fact (Herald entered soul on your turn), not an
 *   object status. Engine stamps `heraldPutIntoSoulThisTurn`.
 * - "Hero ability" means an activated ability whose source is a Hero object.
 *   Prior `hasStatus: "hero-ability"` was unwired residue; filter is
 *   types:["Hero"] on the activation source (matches continuous quote path).
 * - "First … that turn" → appliesTo count 1 + perTurn so the quota re-arms.
 */
export const empyreanRapture = defineCard(fabCardIdentitiesByCanonicalId["Mr6TbnRrKTrJWndKh8QwF"], {
  abilities: {
    ifHeraldNameHasBeenPutIntoHeroS: {
      kind: "static",
      staticKind: "continuous",
      condition: { type: "performed-this-turn", event: "herald-into-soul", player: "controller" },
      effect: {
        type: "modify-activation-cost",
        op: "subtract",
        amount: 2,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              types: ["Hero"],
            },
          },
          count: 1,
          perTurn: true,
        },
      },
    },
    oncePerTurnInstantGetsWard1UntilEnd: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "instant",
      cost: {
        class: "asset",
        type: "resources",
        amount: 1,
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: ward(1),
        },
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  },
});
