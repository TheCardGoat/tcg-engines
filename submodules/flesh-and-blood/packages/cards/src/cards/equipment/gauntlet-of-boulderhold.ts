import { battleworn, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/gauntlet-of-boulderhold.generated.ts";

/**
 * MPG007 Gauntlet of Boulderhold — Guardian Arms d1 Battleworn.
 *
 * Printed:
 *   Action - {r}{r}{r}, destroy this: The next Guardian attack action card you
 *   play from arsenal this turn gets +2{p}. Go again
 *   Battleworn
 *
 * Model notes (hand-authored; case-by-case):
 * - Mixed cost 3{r} + destroy-self; layerKeywords goAgain refunds Action AP.
 * - Floating next buff: modify-numeric +2{p} on this-attack, appliesTo next
 *   Guardian Action Attack with playedFromZones:["arsenal"] (not from hand).
 * - Battleworn on defend.
 */
export const gauntletOfBoulderhold = defineCard(
  fabCardIdentitiesByCanonicalId["GPRfKmdq6LnRwNQCG8jnR"],
  {
    keywords: [battleworn],
    abilities: {
      actionDestroyNextGuardianAttackActionPlayFromArsenal: {
        kind: "activated",
        abilityType: "action",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "asset",
              type: "resources",
              amount: 3,
            },
            {
              class: "effect",
              type: "destroy-self",
            },
          ],
        },
        layerKeywords: [goAgain],
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 2,
          target: {
            selector: "this-attack",
          },
          duration: "this-turn",
          appliesTo: {
            next: {
              typeBox: {
                supertypes: ["Guardian"],
                types: ["Action"],
                subtypes: ["Attack"],
              },
              playedFromZones: ["arsenal"],
            },
          },
        },
      },
    },
  },
);
