import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/clash-of-bravado.generated.ts";

export const clashOfBravado = definePitchFamily(fabPitchFamilies["clash-of-bravado"], {
  abilities: () => ({
    whenDefendsClashAttackingHeroWinnerDestroysAuraOther: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "clash",
          with: {
            selector: "attacking-hero",
          },
          prize: {
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
      label: {
        name: "clash",
      },
    },
  }),
});
export const { yellow: clashOfBravadoYellow } = clashOfBravado.cards;
