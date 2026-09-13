import { comboStatic } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/mugenshi-release.generated.ts";

import { combo, goAgain } from "../shared/keywords.ts";

export const mugenshiRelease = definePitchFamily(fabPitchFamilies["mugenshi-release"], {
  keywords: [
    {
      name: "specialization",
      hero: "Katsu",
    },
    combo,
  ],
  abilities: () => ({
    whelmingGustwaveLastAttackCombatChainMugenshiRELEASEGains1PowerGoAgainHitsSearchDeckAnyNumberNamedLordWindRevealPutHandThenShuffleDeck:
      comboStatic({
        names: ["Whelming Gustwave"],
        effect: {
          type: "sequence",
          steps: [
            {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 1,
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
                  id: "hitsSearchDeckAnyNumberNamedLordWindRevealPutHandThenShuffleDeck",
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
                          type: "search",
                          zones: ["deck"],
                          filter: {
                            name: "Lord of Wind",
                          },
                          count: {
                            type: "any-number",
                          },
                          mayFail: true,
                          to: {
                            zone: "hand",
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

export const { yellow: mugenshiReleaseYellow } = mugenshiRelease.cards;
