import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/call-down-the-lightning.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const callDownTheLightning = definePitchFamily(fabPitchFamilies["call-down-the-lightning"], {
  keywords: [
    {
      name: "specialization",
      hero: "Lexi",
    },
    goAgain,
  ],
  abilities: () => ({
    attacksTurnGetWheneverDefendingHeroAdds1More: {
      kind: "resolution",
      layerKeywords: [goAgain],
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "wheneverDefendingHeroAdds1MoreDefendingFromHand",
            text: "",
            trigger: {
              kind: "event",
              event: {
                name: "defend",
                actor: {
                  kind: "player",
                  player: "defending-hero",
                },
                observes: {
                  kind: "source",
                  selector: "defended-attack",
                },
                cohort: {
                  kind: "together-with",
                  filter: {
                    playedFromZones: ["hand"],
                  },
                  count: {
                    op: "gte",
                    value: 1,
                  },
                },
              },
            },
            resolution: {
              kind: "effect",
              effect: {
                type: "deal-damage",
                damageType: "generic",
                amount: 1,
                target: {
                  selector: "defending-hero",
                },
              },
            },
          },
        },
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Attack"],
            },
          },
          count: { type: "all" },
        },
      },
    },
    whenDefendsTogetherFromHandCreateEmbodimentLightningToken: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
          cohort: {
            kind: "together-with",
            filter: {
              playedFromZones: ["hand"],
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "embodiment-of-lightning",
          controller: "any",
        },
      },
      label: {
        name: "unity",
      },
    },
  }),
});
export const { yellow: callDownTheLightningYellow } = callDownTheLightning.cards;
