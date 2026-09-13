import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/disturb-the-peace.generated.ts";

export const disturbThePeace = definePitchFamily(fabPitchFamilies["disturb-the-peace"], {
  abilities: () => ({
    canTBeDefendedByGuardianAuras: {
      kind: "resolution",
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "defend",
        filter: {
          typeBox: {
            supertypes: ["Guardian"],
            subtypes: ["Aura"],
          },
        },
        duration: "this-combat-chain",
      },
    },
    whenHitsGuardianHeroDestroyAuraTheyControl: {
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
                supertypes: ["Guardian"],
              },
            },
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "destroy",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "attack-target",
            zones: ["permanent"],
            filter: {
              typeBox: {
                subtypes: ["Aura"],
              },
            },
            count: 1,
          },
        },
      },
    },
  }),
});
export const { red: disturbThePeaceRed } = disturbThePeace.cards;
