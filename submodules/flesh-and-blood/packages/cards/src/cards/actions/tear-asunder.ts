import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tear-asunder.generated.ts";
import { dominate, goAgain } from "../shared/keywords.ts";

export const tearAsunder = definePitchFamily(fabPitchFamilies["tear-asunder"], {
  keywords: [goAgain],
  abilities: () => ({
    nextGuardianAttackTurnGainsNumber1PowerDominateWhenHitsHeroThey: {
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
                typeBox: {
                  supertypes: ["Guardian"],
                },
              },
            },
          },
          {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: dominate,
            },
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  supertypes: ["Guardian"],
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
                id: "whenHitsHeroTheyDiscardNumber2",
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
                    type: "discard",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "attack-target",
                      zones: ["hand"],
                      count: 2,
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
                  supertypes: ["Guardian"],
                },
              },
            },
          },
        ],
      },
    },
  }),
});

export const { blue: tearAsunderBlue } = tearAsunder.cards;
