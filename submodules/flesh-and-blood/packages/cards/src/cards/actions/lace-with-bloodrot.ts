import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/lace-with-bloodrot.generated.ts";

export const laceWithBloodrot = definePitchFamily(fabPitchFamilies["lace-with-bloodrot"], {
  keywords: [goAgain],
  abilities: () => ({
    nextArrowAttackTurnGains3PowerHitsCreateBloodrotPoxToken: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 3,
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  subtypes: ["Arrow"],
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
                id: "hitsCreateBloodrotPoxToken",
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
                    token: "bloodrot-pox",
                    controller: "attack-target",
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
                  subtypes: ["Arrow"],
                },
              },
            },
          },
        ],
      },
    },
  }),
});

export const { red: laceWithBloodrotRed } = laceWithBloodrot.cards;
