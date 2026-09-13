import { battleworn, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/grasp-of-the-arknight.generated.ts";

/**
 * ARC078 Grasp of the Arknight — Runeblade Arms d2 Battleworn.
 *
 * Printed:
 *   Once per Turn Action - {r}{r}: Create a Runechant token. This ability
 *   costs an additional {r} to activate for each Runechant you control.
 *   Go again
 *   Battleworn
 *
 * Model notes (hand-authored):
 * - Additional Runechant tax is an activation costIncrease (mirror of
 *   costReduction / dragonscaler-flight-path), evaluated at quote/begin —
 *   NOT a permanent modify-numeric on equipment cost after create (prior
 *   model was dead and wrong: equipment has no play cost on activate).
 * - Runechant count uses name filter (token type-box is Token+Aura; never
 *   subtypes:Runechant) — bloodsheath-skeleta / Amethyst Tiara family.
 * - Effect is create-token only; go again is layerKeywords.
 */
export const graspOfTheArknight = defineCard(
  fabCardIdentitiesByCanonicalId["6WM7PKt9BCGmw7wQzn7k6"],
  {
    keywords: [battleworn],
    abilities: {
      oncePerTurnActionCreateRunechantTokenAbilityCosts: {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "action",
        cost: {
          class: "asset",
          type: "resources",
          amount: 2,
        },
        costIncrease: {
          amount: {
            type: "count",
            what: "cards-in-zone",
            zone: "permanent",
            player: "controller",
            filter: {
              name: "Runechant",
            },
          },
        },
        layerKeywords: [goAgain],
        effect: {
          type: "create-token",
          token: "runechant",
          controller: "controller",
        },
      },
    },
  },
);
