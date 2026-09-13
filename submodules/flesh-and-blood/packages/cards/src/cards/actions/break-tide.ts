import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/break-tide.generated.ts";

import { comboResolution } from "@tcg/flesh-and-blood-types";

import { combo, dominate } from "../shared/keywords.ts";

export const breakTide = definePitchFamily(fabPitchFamilies["break-tide"], {
  keywords: [combo],
  abilities: () => ({
    rushingRiverOrFloodOfForceCombo: comboResolution({
      names: ["Rushing River", "Flood Of Force"],
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 3,
            target: {
              selector: "self",
            },
            duration: "this-turn",
          },
          {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: dominate,
            },
            target: {
              selector: "self",
            },
            duration: "this-turn",
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "whenHitsBanishTopDeckUntilEndNextTurn",
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
                    type: "sequence",
                    steps: [
                      {
                        type: "banish",
                        target: {
                          selector: "object",
                          declared: "at-resolution",
                          player: "controller",
                          zones: ["deck"],
                          position: "top",
                          count: 1,
                        },
                        outputBinding: "it",
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
                          duration: "until-end-of-own-next-turn",
                        },
                      },
                    ],
                  },
                },
              },
            },
            target: {
              selector: "self",
            },
            duration: "this-turn",
          },
        ],
      },
    }),
  }),
});
export const { yellow: breakTideYellow } = breakTide.cards;
