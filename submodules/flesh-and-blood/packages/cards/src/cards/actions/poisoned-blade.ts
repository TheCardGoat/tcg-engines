import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/poisoned-blade.generated.ts";

export const poisonedBlade = definePitchFamily(fabPitchFamilies["poisoned-blade"], {
  supertypeSets: [["Assassin"], ["Ninja"]],
  keywords: [goAgain],

  abilities: () => ({
    triggeredHitLoseLife: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "attack",
            relationship: {
              kind: "any",
            },
            filter: {
              typeBox: {
                subtypes: ["Dagger"],
              },
            },
            bindAs: "it",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "lose-life",
          amount: 1,
          target: {
            selector: "attack-target",
          },
        },
      },
    },
  }),
});
export const {
  red: poisonedBladeRed,
  yellow: poisonedBladeYellow,
  blue: poisonedBladeBlue,
} = poisonedBlade.cards;
