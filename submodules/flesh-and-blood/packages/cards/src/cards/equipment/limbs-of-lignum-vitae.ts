import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/limbs-of-lignum-vitae.generated.ts";

export const limbsOfLignumVitae = defineCard(
  fabCardIdentitiesByCanonicalId["R6NHGRHdjzP77nfqbDGHM"],
  {
    keywords: [bladeBreak],
    abilities: {
      ifThereAre4MoreEarthBanishedZoneGets: {
        kind: "static",
        staticKind: "continuous",
        condition: {
          type: "zone-count",
          zone: "banished",
          player: "controller",
          filter: {
            typeBox: {
              supertypes: ["Earth"],
            },
          },
          comparison: {
            op: "gte",
            value: 4,
          },
        },
        effect: {
          type: "modify-numeric",
          property: "defense",
          op: "add",
          amount: 1,
          target: {
            selector: "self",
          },
          // Continuous while-condition (CR 5.4.7): re-evaluate while equipped,
          // not a one-turn grant that expires at end of turn. Mirrors FLR003
          // helm-of-lignum-vitae (same printed text; §7 continuous static
          // duration this-turn row names this card as the sibling).
          duration: "permanent",
        },
      },
    },
  },
);
