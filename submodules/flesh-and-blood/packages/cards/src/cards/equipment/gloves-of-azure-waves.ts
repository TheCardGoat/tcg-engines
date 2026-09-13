import { arcaneBarrier, bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/gloves-of-azure-waves.generated.ts";

export const glovesOfAzureWaves = defineCard(
  fabCardIdentitiesByCanonicalId["gJbTFDQTW7HfKnkpwgLCw"],
  {
    keywords: [arcaneBarrier(1)],
    abilities: {
      ifThereAre2MoreBluePitchZoneGets: {
        kind: "static",
        staticKind: "continuous",
        condition: {
          type: "zone-count",
          zone: "pitch",
          player: "controller",
          filter: {
            color: ["blue"],
          },
          comparison: {
            op: "gte",
            value: 2,
          },
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "modify-numeric",
              property: "defense",
              op: "add",
              amount: 3,
              target: {
                selector: "self",
              },
              duration: "permanent",
            },
            {
              type: "grant-property",
              property: {
                kind: "keyword",
                keyword: bladeBreak,
              },
              target: {
                selector: "self",
              },
              duration: "permanent",
            },
          ],
        },
        label: {
          name: "high-tide",
        },
      },
    },
  },
);
