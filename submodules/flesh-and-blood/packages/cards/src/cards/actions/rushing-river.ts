import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rushing-river.generated.ts";
import { comboResolution } from "@tcg/flesh-and-blood-types";
import { combo, goAgain } from "../shared/keywords.ts";

export const rushingRiver = definePitchFamily(fabPitchFamilies["rushing-river"], {
  keywords: [combo],
  abilities: () => ({
    comboResolutionSequenceModifyNumericPowerThisTurnGrantPropertyThisTurnGrantPropertyTriggeredHitSequenceDrawCountMoveCardCount:
      comboResolution({
        names: ["Torrent Of Tempo"],
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
              duration: "this-turn",
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
              duration: "this-turn",
            },
            {
              type: "grant-property",
              property: {
                kind: "ability",
                ability: {
                  kind: "static",
                  staticKind: "triggered",
                  id: "triggeredHitSequenceDrawCountMoveCardCount",
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
                          type: "draw",
                          count: {
                            type: "count",
                            what: "attacks-hit-this-combat-chain",
                          },
                          player: "controller",
                        },
                        {
                          type: "move-card",
                          target: {
                            selector: "object",
                            declared: "on-stack",
                            player: "controller",
                            zones: ["hand"],
                            count: {
                              type: "count",
                              what: "attacks-hit-this-combat-chain",
                            },
                          },
                          to: {
                            zone: "deck",
                            position: "top",
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

export const {
  red: rushingRiverRed,
  yellow: rushingRiverYellow,
  blue: rushingRiverBlue,
} = rushingRiver.cards;
