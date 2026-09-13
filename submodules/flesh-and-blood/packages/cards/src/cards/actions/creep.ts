import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/creep.generated.ts";

import { goAgain, stealth } from "../shared/keywords.ts";

export const creep = definePitchFamily(fabPitchFamilies["creep"], {
  keywords: [stealth],
  abilities: () => ({
    whenAttacksNextAttackStealthPlayCombatChainGets: {
      kind: "static",
      staticKind: "triggered",
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
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: goAgain,
          },
          target: {
            selector: "this-attack",
          },
          duration: "this-combat-chain",
          appliesTo: {
            next: {
              typeBox: {
                subtypes: ["Attack"],
              },
              hasKeyword: "stealth",
            },
          },
        },
      },
    },
  }),
});
export const { red: creepRed } = creep.cards;
