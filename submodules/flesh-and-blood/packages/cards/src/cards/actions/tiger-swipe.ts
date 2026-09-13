import { comboStatic } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tiger-swipe.generated.ts";
import { combo, goAgain } from "../shared/keywords.ts";

export const tigerSwipe = definePitchFamily(fabPitchFamilies["tiger-swipe"], {
  keywords: [goAgain, combo],
  abilities: () => ({
    comboStatic: comboStatic({
      names: ["Crouching Tiger"],
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 2,
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
          {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: goAgain,
            },
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "whenHitsCreateXCrouchingTigersInBanishedZoneWhereXNumber",
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
                        type: "create-token",
                        token: "crouching-tiger",
                        controller: "controller",
                        count: {
                          type: "count",
                          what: "cards-in-zone",
                          zone: "permanent",
                          player: "controller",
                          filter: {
                            name: "Crouching tigers",
                          },
                        },
                        to: {
                          zone: "banished",
                        },
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
              },
            },
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
        ],
      },
    }),
  }),
});

export const { red: tigerSwipeRed } = tigerSwipe.cards;
