import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/art-of-the-dragon-fire.generated.ts";

export const artOfTheDragonFire = definePitchFamily(fabPitchFamilies["art-of-the-dragon-fire"], {
  abilities: () => ({
    whenAttacksIfIsDraconicDeal2DamageAny: {
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
        },
        state: {
          type: "binding-matches",
          binding: "it",
          filter: {
            typeBox: {
              supertypes: ["Draconic"],
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "deal-damage",
          damageType: "generic",
          amount: 2,
          target: {
            selector: "object",
            declared: "on-stack",
            zones: ["hero", "permanent"],
            count: 1,
          },
        },
      },
    },
  }),
});
export const { red: artOfTheDragonFireRed } = artOfTheDragonFire.cards;
