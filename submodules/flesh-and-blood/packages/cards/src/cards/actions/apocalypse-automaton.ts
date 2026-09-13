import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/apocalypse-automaton.generated.ts";

export const apocalypseAutomaton = definePitchFamily(fabPitchFamilies["apocalypse-automaton"], {
  abilities: () => ({
    playOnlyIfHave1MoreEvosEquipped: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "equipped-count",
        filter: {
          typeBox: {
            subtypes: ["Evo"],
          },
        },
        comparison: {
          op: "gte",
          value: 1,
        },
      },
      playEffect: {
        role: "condition",
      },
    },
    attacksUpXTargetOpposingHeroesWhereXIs: {
      kind: "resolution",
      effect: {
        type: "rule-modification",
        mode: "allow",
        action: "attack-target",
        target: "any-opposing-hero",
        limit: {
          count: {
            type: "count",
            what: "equipped-objects",
            player: "controller",
            filter: {
              typeBox: {
                subtypes: ["Evo"],
              },
            },
          },
        },
        duration: "this-combat-chain",
      },
      label: {
        name: "evo-upgrade",
      },
    },
  }),
});
export const { red: apocalypseAutomatonRed } = apocalypseAutomaton.cards;
