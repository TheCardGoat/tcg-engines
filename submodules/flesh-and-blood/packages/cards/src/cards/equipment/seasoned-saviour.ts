import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/seasoned-saviour.generated.ts";

export const seasonedSaviour = defineCard(fabCardIdentitiesByCanonicalId["MmJd7JwGC8rjPmLNLPCCW"], {
  keywords: [battleworn],
  abilities: {
    whenEquipSeasonedSaviourPutTwo1CountersBattleworn: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "equip",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "moved-object",
            relationship: {
              kind: "any",
            },
            filter: {
              name: "Seasoned Saviour",
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "add-counter",
              counter: {
                kind: "numeric",
                value: -1,
                property: "defense",
              },
              count: 2,
              target: {
                selector: "self",
              },
            },
            {
              type: "grant-property",
              property: {
                kind: "keyword",
                keyword: battleworn,
              },
              target: {
                selector: "self",
              },
              duration: "this-turn",
            },
          ],
        },
      },
    },
  },
});
