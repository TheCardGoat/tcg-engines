import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/chorus-of-ironsong.generated.ts";

export const chorusOfIronsong = definePitchFamily(fabPitchFamilies["chorus-of-ironsong"], {
  keywords: [
    {
      name: "specialization",
      hero: "Dorinthea",
    },
  ],
  abilities: () => ({
    empowerDawnblade: {
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
              selector: "object",
              declared: "on-stack",
              zones: ["combat-chain"],
              filter: {
                name: "Dawnblade",
              },
              count: 1,
            },
            duration: "this-turn",
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                id: "damageCannotBePrevented",
                text: "",
                kind: "resolution",
                effect: {
                  type: "rule-modification",
                  mode: "restrict",
                  action: "be-prevented",
                  subject: {
                    name: "This",
                  },
                  duration: "this-chain-link",
                },
              },
            },
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["combat-chain"],
              filter: {
                name: "Dawnblade",
              },
              count: 1,
            },
            duration: "this-turn",
          },
        ],
        outputBinding: "it",
      },
    },
    createCourageWhenDefendingTogether: {
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
          token: "courage",
          creator: "effect-controller",
          controller: "any",
        },
      },
      label: {
        name: "unity",
      },
    },
  }),
});

export const { yellow: chorusOfIronsongYellow } = chorusOfIronsong.cards;
