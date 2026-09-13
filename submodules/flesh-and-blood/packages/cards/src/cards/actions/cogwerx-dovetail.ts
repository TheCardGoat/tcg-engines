import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/cogwerx-dovetail.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const cogwerxDovetail = definePitchFamily(fabPitchFamilies["cogwerx-dovetail"], {
  keywords: [goAgain],
  abilities: () => ({
    whenHitsHeroAllCogsControl: {
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
          type: "untap",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["permanent"],
            filter: {
              typeBox: {
                subtypes: ["Cog"],
              },
            },
            count: {
              type: "all",
            },
          },
        },
      },
    },
    thricePerTurnInstantCogControlGets1Go: {
      kind: "activated",
      limit: {
        count: 3,
        per: "turn",
      },
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "tap",
        filter: {
          typeBox: {
            subtypes: ["Cog"],
          },
        },
      },
      effect: {
        type: "choice",
        options: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
          {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: goAgain,
            },
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
        ],
      },
    },
  }),
});
export const { red: cogwerxDovetailRed } = cogwerxDovetail.cards;
