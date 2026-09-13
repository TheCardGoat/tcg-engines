import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/avast-ye.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const avastYe = definePitchFamily(fabPitchFamilies["avast-ye"], {
  keywords: [goAgain],
  abilities: () => ({
    nextPirateAllyAttackTurnGetsGoAgainWhen: {
      kind: "resolution",
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
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
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
            },
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "whenHitsHeroCreateGoldToken",
                text: "",
                trigger: {
                  kind: "event",
                  event: {
                    name: "hit",
                    actor: {
                      kind: "player",
                      player: "ability-controller",
                    },
                    observes: {
                      kind: "source",
                      selector: "attack",
                    },
                    target: {
                      kind: "hero",
                    },
                  },
                },
                resolution: {
                  kind: "effect",
                  effect: {
                    type: "create-token",
                    token: "gold",
                    controller: "controller",
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
            },
          },
        ],
      },
    },
  }),
});
export const { blue: avastYeBlue } = avastYe.cards;
