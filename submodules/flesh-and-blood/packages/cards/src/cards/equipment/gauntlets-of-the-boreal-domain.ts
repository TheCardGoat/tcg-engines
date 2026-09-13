import { dominate, goAgain, temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/gauntlets-of-the-boreal-domain.generated.ts";

export const gauntletsOfTheBorealDomain = defineCard(
  fabCardIdentitiesByCanonicalId["HTF6WHdnfmgHD7pBFhMQL"],
  {
    keywords: [temper],
    abilities: {
      oncePerTurnActionIfEarthIsPitchedWay: {
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
        layerKeywords: [goAgain],
        // Printed "your attacks named Mangle get … this turn" is a floating
        // multi-fire future-object grant (Savage Sash / appliesTo.count family),
        // not a star scan of combat-chain at resolution (that only hits Mangles
        // already on the chain — useless for the normal arm-then-attack sequence).
        // subtypes:["Attack"] was also wrong: Attack is a type, not a subtype.
        effect: {
          type: "sequence",
          steps: [
            {
              type: "conditional",
              condition: {
                type: "binding-numeric",
                binding: "pitched-this-way-earth-card",
                comparison: { op: "eq", value: 1 },
              },
              then: {
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
                    name: "Mangle",
                  },
                  count: 32,
                },
              },
            },
            {
              type: "conditional",
              condition: {
                type: "binding-numeric",
                binding: "pitched-this-way-ice-card",
                comparison: { op: "eq", value: 1 },
              },
              then: {
                type: "grant-property",
                property: {
                  kind: "keyword",
                  keyword: dominate,
                },
                target: {
                  selector: "this-attack",
                },
                duration: "this-turn",
                appliesTo: {
                  next: {
                    name: "Mangle",
                  },
                  count: 32,
                },
              },
            },
          ],
        },
      },
    },
  },
);
