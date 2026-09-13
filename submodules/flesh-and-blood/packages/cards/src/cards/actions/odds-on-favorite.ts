import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/odds-on-favorite.generated.ts";

export const oddsOnFavorite = definePitchFamily(fabPitchFamilies["odds-on-favorite"], {
  keywords: [goAgain],
  abilities: () => ({
    nextSwordAttackTurnGetsAttacksWagerDefendingWinnerSearchesDeckShufflesThenPutsTop: {
      kind: "resolution",
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "attacksWagerDefendingWinnerSearchesDeckShufflesThenPutsTop",
            text: "",
            trigger: {
              kind: "event",
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
            },
            resolution: {
              kind: "effect",
              effect: {
                type: "wager",
                prize: {
                  type: "sequence",
                  steps: [
                    {
                      type: "search",
                      zones: ["deck"],
                      filter: {},
                      mayFail: true,
                      to: {
                        zone: "deck",
                        position: "top",
                      },
                    },
                    {
                      type: "shuffle",
                      zone: "deck",
                    },
                  ],
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
              subtypes: ["Sword"],
            },
          },
        },
      },
      label: {
        name: "wager",
      },
    },
  }),
});

export const { blue: oddsOnFavoriteBlue } = oddsOnFavorite.cards;
