import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/breed-anger.generated.ts";

import { goAgain, combo } from "../shared/keywords.ts";

const abilities = {
  onAttackGrantPropertyCreateTokenCrouchingTiger: {
    kind: "static",
    staticKind: "triggered",
    trigger: {
      kind: "event-and-state",
      event: {
        name: "attack",
        actor: {
          kind: "player",
          player: "ability-controller",
        },
        observes: {
          kind: "source",
          selector: "attack",
        },
      },
      state: {
        type: "last-attack-this-combat-chain",
        names: ["Crouching Tiger"],
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "sequence",
            steps: [
              {
                type: "grant-property",
                property: {
                  kind: "keyword",
                  keyword: {
                    name: "go-again",
                  },
                },
                target: {
                  selector: "self",
                },
                duration: "this-turn",
              },
              {
                type: "create-token",
                token: "crouching-tiger",
                controller: "controller",
                to: {
                  zone: "banished",
                },
                outputBinding: "it",
              },
            ],
          },
          {
            type: "optional",
            effect: {
              type: "play-card",
              fromZones: ["banished"],
              source: {
                selector: "binding",
                binding: "it",
              },
              duration: "this-turn",
            },
          },
        ],
      },
    },
    label: {
      name: "combo",
      params: {
        names: ["Crouching Tiger"],
      },
    },
  },
} as const;

export const breedAnger = definePitchFamily(fabPitchFamilies["breed-anger"], {
  keywords: [goAgain, combo],
  abilities: () => ({ ...abilities }),
});

export const {
  red: breedAngerRed,
  yellow: breedAngerYellow,
  blue: breedAngerBlue,
} = breedAnger.cards;
