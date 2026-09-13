import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/helm-of-lignum-vitae.generated.ts";

export const helmOfLignumVitae = defineCard(
  fabCardIdentitiesByCanonicalId["7gkkzWWDprGtBpfq8QPWC"],
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
          // not a one-turn grant that expires at end of turn.
          duration: "permanent",
        },
      },
    },
  },
);
