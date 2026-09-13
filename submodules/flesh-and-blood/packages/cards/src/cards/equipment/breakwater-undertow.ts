import { bladeBreak, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/breakwater-undertow.generated.ts";

export const breakwaterUndertow = defineCard(
  fabCardIdentitiesByCanonicalId["J8LhcKQG9z8mnTm6bMnFp"],
  {
    keywords: [bladeBreak],
    abilities: {
      attackReactionDestroyTargetPirateAllyAttackGetsGo: {
        kind: "activated",
        abilityType: "attack-reaction",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "grant-property",
              property: {
                kind: "keyword",
                keyword: goAgain,
              },
              target: {
                selector: "object",
                declared: "on-stack",
                zones: ["combat-chain"],
                filter: {
                  and: [
                    {
                      typeBox: {
                        supertypes: ["Pirate"],
                      },
                    },
                    {
                      typeBox: {
                        subtypes: ["Ally"],
                      },
                    },
                  ],
                },
                count: 1,
              },
              duration: "this-turn",
              outputBinding: "it",
            },
            {
              type: "delayed-trigger",
              trigger: {
                kind: "event",
                event: {
                  name: "combat-chain-close",
                  actor: {
                    kind: "none",
                  },
                  observes: {
                    kind: "none",
                  },
                },
              },
              policy: {
                kind: "windowed",
                duration: "this-combat-chain",
                matching: "first",
              },
              resolution: {
                kind: "effect",
                effect: {
                  type: "destroy",
                  target: {
                    selector: "binding",
                    binding: "it",
                  },
                },
              },
            },
          ],
        },
      },
    },
  },
);
