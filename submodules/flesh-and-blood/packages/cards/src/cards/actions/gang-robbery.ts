import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/gang-robbery.generated.ts";

export const gangRobbery = definePitchFamily(fabPitchFamilies["gang-robbery"], {
  abilities: () => ({
    whenAttacksHeroStealAuraTokenTheyControl: {
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
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "gain-control",
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
          controller: "controller",
          duration: "this-turn",
        },
      },
      label: {
        name: "steal",
      },
    },
    ifControl3MoreAurasGets3: {
      kind: "resolution",
      condition: {
        type: "zone-count",
        zone: "permanent",
        player: "controller",
        filter: {
          typeBox: {
            subtypes: ["Aura"],
          },
        },
        comparison: {
          op: "gte",
          value: 3,
        },
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 3,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
      label: {
        name: "steal",
      },
    },
  }),
});
export const { yellow: gangRobberyYellow } = gangRobbery.cards;
