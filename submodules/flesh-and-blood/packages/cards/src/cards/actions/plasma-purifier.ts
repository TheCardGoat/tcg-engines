import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/plasma-purifier.generated.ts";

export const plasmaPurifier = definePitchFamily(fabPitchFamilies["plasma-purifier"], {
  abilities: () => ({
    actionResourceThereNoSteamCountersPlasmaPurifierPutSteamCounterGoAgain: {
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
    oncePerTurnActionRemoveSteamCounterPlasmaPurifierTargetMechanologistPistolGains1PowerEndTurnGoAgain:
      {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "action",
        cost: {
          class: "effect",
          type: "remove-counters",
          counter: {
            kind: "named",
            name: "steam",
          },
          count: 1,
        },
        layerKeywords: [goAgain],
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 1,
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["permanent"],
            filter: {
              moniker: "Target Mechanologist Pistol",
            },
            count: {
              type: "all",
            },
          },
          duration: "this-turn",
        },
      },
  }),
});

export const { red: plasmaPurifierRed } = plasmaPurifier.cards;
