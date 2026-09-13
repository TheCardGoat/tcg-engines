import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/cheap-shot.generated.ts";

export const cheapShot = definePitchFamily(fabPitchFamilies["cheap-shot"], {
  abilities: () => ({
    ifVeBeenBooedTurnMayPlayAsThough: {
      kind: "static",
      staticKind: "play",
      condition: { type: "performed-this-turn", event: "booed", player: "controller" },
      playEffect: {
        role: "permission",
        fromZones: ["hand", "arsenal"],
        asType: "instant",
        optional: true,
      },
    },
    deal2DamageTargetHeroUnlessTheyDiscard: {
      kind: "resolution",
      effect: {
        type: "unless",
        effect: {
          type: "deal-damage",
          damageType: "generic",
          amount: 2,
          target: {
            selector: "any-hero",
          },
        },
        escape: {
          type: "discard",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "opponent",
            zones: ["hand"],
            count: 1,
          },
        },
      },
    },
  }),
});
export const { yellow: cheapShotYellow } = cheapShot.cards;
