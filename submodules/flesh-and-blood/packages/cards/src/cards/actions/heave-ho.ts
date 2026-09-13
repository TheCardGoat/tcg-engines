import { goAgain, overpower } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/heave-ho.generated.ts";

export const heaveHo = definePitchFamily(fabPitchFamilies["heave-ho"], {
  keywords: [goAgain],
  abilities: () => ({
    nextPirateAllyAttackTurnGetsOverpowerHitsCreateGoldToken: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: overpower,
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
                id: "hitsCreateGoldToken",
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

export const { blue: heaveHoBlue } = heaveHo.cards;
