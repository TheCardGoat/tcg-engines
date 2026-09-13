import { guardwell } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/testament-of-valahai.generated.ts";

export const testamentOfValahai = defineCard(
  fabCardIdentitiesByCanonicalId["qtGQDP6NNRnFFgNhKjCkd"],
  {
    keywords: [guardwell],
    abilities: {
      ifControlThreeMoreSeismicSurgeTokensGets2: {
        kind: "static",
        staticKind: "continuous",
        // Printed "instead": 6+ surge → +4 REPLACES the +2. The sequence +
        // instead:true form was ignored by the continuous compiler (both
        // steps would fire → +6). Nested conditional: 6+ → +4, else 3+ → +2.
        effect: {
          type: "conditional",
          condition: {
            type: "zone-count",
            zone: "permanent",
            player: "controller",
            filter: {
              name: "Seismic Surge",
              typeBox: {
                metatypes: ["Token"],
              },
            },
            comparison: {
              op: "gte",
              value: 6,
            },
          },
          then: {
            type: "modify-numeric",
            property: "defense",
            op: "add",
            amount: 4,
            target: {
              selector: "self",
            },
            duration: "while-in-arena",
          },
          else: {
            type: "conditional",
            condition: {
              type: "zone-count",
              zone: "permanent",
              player: "controller",
              filter: {
                name: "Seismic Surge",
                typeBox: {
                  metatypes: ["Token"],
                },
              },
              comparison: {
                op: "gte",
                value: 3,
              },
            },
            then: {
              type: "modify-numeric",
              property: "defense",
              op: "add",
              amount: 2,
              target: {
                selector: "self",
              },
              duration: "while-in-arena",
            },
          },
        },
      },
    },
  },
);
