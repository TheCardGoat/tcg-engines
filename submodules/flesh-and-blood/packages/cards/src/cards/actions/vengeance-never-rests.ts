import { comboStatic } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/vengeance-never-rests.generated.ts";
import { combo, goAgain } from "../shared/keywords.ts";

export const vengeanceNeverRests = definePitchFamily(fabPitchFamilies["vengeance-never-rests"], {
  keywords: [goAgain, combo],
  abilities: () => ({
    comboStatic: comboStatic({
      names: ["Edge Of Autumn"],
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
                id: "whenHitsHeroBanishPlayTurn",
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
                    type: "sequence",
                    steps: [
                      {
                        type: "banish",
                        target: {
                          selector: "self",
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

export const { blue: vengeanceNeverRestsBlue } = vengeanceNeverRests.cards;
