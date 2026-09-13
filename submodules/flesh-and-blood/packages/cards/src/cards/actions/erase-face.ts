import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/erase-face.generated.ts";

import { FAB_PLAYER_OWNED_CARD_ZONES } from "@tcg/flesh-and-blood-types";

export const eraseFace = definePitchFamily(fabPitchFamilies["erase-face"], {
  abilities: () => ({
    whenHitsHeroTheyOwnLoseAllClassTalent: {
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
          type: "remove-property",
          property: {
            kind: "supertype",
            value: "class-and-talent",
          },
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "opponent",
            playerRelation: "owner",
            zones: FAB_PLAYER_OWNED_CARD_ZONES,
            count: {
              type: "all",
            },
          },
          duration: "until-end-of-next-turn",
        },
      },
    },
  }),
});
export const { red: eraseFaceRed } = eraseFace.cards;
