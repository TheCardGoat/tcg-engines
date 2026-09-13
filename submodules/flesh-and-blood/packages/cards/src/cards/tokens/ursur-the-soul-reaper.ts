import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/tokens/ursur-the-soul-reaper.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const ursurTheSoulReaper = defineCard(fabCardIdentitiesByCanonicalId.pN9zPNQfc6GGrwdgMBLkj, {
  abilities: {
    attack: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "attack",
      cost: {
        class: "asset",
        type: "resources",
        amount: 0,
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    grantGoAgainAgainstHeroWithSoul: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "conditional",
        condition: {
          type: "and",
          conditions: [
            {
              type: "has-status",
              status: "attacking",
            },
            {
              type: "zone-count",
              zone: "soul",
              player: "attack-target",
              comparison: {
                op: "gte",
                value: 1,
              },
            },
          ],
        },
        then: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: goAgain,
          },
          target: {
            selector: "self",
          },
          duration: "while-condition",
        },
      },
    },
  },
});
