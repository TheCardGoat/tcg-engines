import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/mauvrion-skies.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const mauvrionSkies = definePitchFamily(fabPitchFamilies["mauvrion-skies"], {
  parameters: { red: 3, yellow: 2, blue: 1 },
  keywords: [goAgain],
  abilities: (count) => ({
    sequenceGrantPropertyThisTurnGrantPropertyTriggeredHitCreateTokenRunechantThisTurn: {
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
                typeBox: {
                  supertypes: ["Runeblade"],
                  subtypes: ["Attack"],
                },
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
                id: "triggeredHitCreateTokenRunechant",
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
                  },
                },
                resolution: {
                  kind: "effect",
                  effect: {
                    type: "create-token",
                    token: "runechant",
                    controller: "controller",
                    count,
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
                  supertypes: ["Runeblade"],
                  subtypes: ["Attack"],
                },
              },
            },
          },
        ],
      },
    },
  }),
});

export const {
  red: mauvrionSkiesRed,
  yellow: mauvrionSkiesYellow,
  blue: mauvrionSkiesBlue,
} = mauvrionSkies.cards;
