import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/cut-through-the-facade.generated.ts";

export const cutThroughTheFacade = definePitchFamily(fabPitchFamilies["cut-through-the-facade"], {
  abilities: () => ({
    canTBeDefendedByAuras: {
      kind: "resolution",
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "defend",
        filter: {
          typeBox: {
            subtypes: ["Aura"],
          },
        },
        duration: "this-combat-chain",
      },
    },
    whenHitsHeroMayDestroyAuraTheyControl: {
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
            kind: "source",
            selector: "attack",
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "destroy",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "opponent",
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
    },
  }),
});
export const { red: cutThroughTheFacadeRed } = cutThroughTheFacade.cards;
