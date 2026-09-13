import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/jaws-of-victory.generated.ts";

/**
 * Model notes (hand-authored):
 * - Go again is not printed; it is a continuous grant while you've been cheered.
 * - Static continuous (not resolution) so this attack's own cheer can still grant it.
 */
export const jawsOfVictory = definePitchFamily(fabPitchFamilies["jaws-of-victory"], {
  abilities: () => ({
    attacksLessLifeThanCrowdCheers: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
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
          target: {
            kind: "hero",
          },
        },
        state: {
          type: "life-comparison",
          player: "self",
          vs: "opponent",
          op: "lt",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "crowd-cheers",
          target: "controller",
        },
      },
      label: {
        name: "the-crowd-cheers",
      },
    },
    cheeredTurnGetsGoAgain: {
      kind: "static",
      staticKind: "continuous",
      condition: { type: "performed-this-turn", event: "cheered", player: "controller" },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "self",
        },
        duration: "while-in-arena",
      },
      label: {
        name: "the-crowd-cheers",
      },
    },
  }),
});

export const { red: jawsOfVictoryRed } = jawsOfVictory.cards;
