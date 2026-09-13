import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/induction-chamber.generated.ts";

export const inductionChamber = definePitchFamily(fabPitchFamilies["induction-chamber"], {
  abilities: () => ({
    actionResourceThereNoSteamCountersInductionChamberPutSteamCounterGoAgain: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "asset",
        type: "resources",
        amount: 1,
      },
      layerKeywords: [goAgain],
      effect: {
        type: "conditional",
        condition: {
          type: "has-counter",
          counter: {
            kind: "named",
            name: "steam",
          },
          target: {
            selector: "self",
          },
          comparison: {
            op: "eq",
            value: 0,
          },
        },
        then: {
          type: "add-counter",
          counter: {
            kind: "named",
            name: "steam",
          },
          count: 1,
          target: {
            selector: "self",
          },
        },
      },
    },
    oncePerTurnAttackReactionRemoveSteamCounterInductionChamberTargetMechanologistPistolAttackGainsGoAgain:
      {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "attack-reaction",
        cost: {
          class: "effect",
          type: "remove-counters",
          counter: {
            kind: "named",
            name: "steam",
          },
          count: 1,
        },
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: goAgain,
          },
          target: {
            selector: "object",
            declared: "on-stack",
            zones: ["combat-chain"],
            filter: {
              and: [
                {
                  typeBox: {
                    supertypes: ["Mechanologist"],
                  },
                },
                {
                  typeBox: {
                    subtypes: ["Pistol"],
                  },
                },
              ],
            },
            count: 1,
          },
          duration: "this-turn",
          outputBinding: "it",
        },
      },
  }),
});

export const { red: inductionChamberRed } = inductionChamber.cards;
