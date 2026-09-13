import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/silversheen-needle.generated.ts";

export const silversheenNeedle = defineCard(
  fabCardIdentitiesByCanonicalId["NmgpFhWdc8zCKPKMBmttP"],
  {
    abilities: {
      constructsFabricTheirNameGainGoAgain: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: goAgain,
          },
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["permanent", "stack"],
            filter: {
              typeBox: {
                subtypes: ["Construct"],
              },
              moniker: "Fabric",
            },
            count: {
              type: "all",
            },
          },
          duration: "while-in-arena",
        },
      },
    },
  },
);
