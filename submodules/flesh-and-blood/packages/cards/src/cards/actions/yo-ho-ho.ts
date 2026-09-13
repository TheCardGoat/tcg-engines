import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/yo-ho-ho.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const yoHoHo = definePitchFamily(fabPitchFamilies["yo-ho-ho"], {
  keywords: [goAgain],
  abilities: () => ({
    nextPirateAllyAttackTurnGetsNumber1PowerWhenHitsHeroCreate: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
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

export const { blue: yoHoHoBlue } = yoHoHo.cards;
