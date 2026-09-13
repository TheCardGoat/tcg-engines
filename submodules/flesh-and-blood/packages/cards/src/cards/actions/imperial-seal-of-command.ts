import { goAgain, legendary } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/imperial-seal-of-command.generated.ts";

export const imperialSealOfCommand = definePitchFamily(
  fabPitchFamilies["imperial-seal-of-command"],
  {
    keywords: [legendary],
    abilities: () => ({
      actionDestroyDefenseReactionCantPlayedTurnRoyalNextTimeHitTurnDestroyAllArsenalGoAgain: {
        kind: "activated",
        abilityType: "action",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        layerKeywords: [goAgain],
        effect: {
          type: "sequence",
          steps: [
            {
              type: "rule-modification",
              mode: "restrict",
              action: "play",
              filter: {
                typeBox: {
                  types: ["Defense Reaction"],
                },
              },
              duration: "this-turn",
            },
            {
              type: "conditional",
              condition: {
                type: "has-status",
                status: "hero-is-royal",
              },
              then: {
                type: "delayed-trigger",
                trigger: {
                  kind: "event",
                  event: {
                    name: "hit",
                    actor: {
                      kind: "player",
                      player: "ability-controller",
                    },
                    observes: {
                      kind: "none",
                    },
                    target: {
                      kind: "hero",
                    },
                  },
                },
                policy: {
                  kind: "windowed",
                  duration: "this-turn",
                  matching: "first",
                },
                resolution: {
                  kind: "effect",
                  effect: {
                    type: "destroy",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "opponent",
                      zones: ["arsenal"],
                      count: {
                        type: "all",
                      },
                    },
                  },
                },
              },
            },
          ],
        },
      },
    }),
  },
);

export const { red: imperialSealOfCommandRed } = imperialSealOfCommand.cards;
