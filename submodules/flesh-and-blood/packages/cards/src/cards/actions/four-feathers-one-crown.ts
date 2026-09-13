import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/four-feathers-one-crown.generated.ts";

export const fourFeathersOneCrown = definePitchFamily(fabPitchFamilies["four-feathers-one-crown"], {
  abilities: () => ({
    whenAttacksGets1EachPhoenixBannermanNameGraveyard: {
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
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: {
            type: "count",
            what: "cards-in-zone",
            zone: "graveyard",
            player: "controller",
            filter: {
              nameContains: "Phoenix Bannerman",
            },
          },
          target: {
            selector: "self",
          },
          duration: "while-in-arena",
        },
      },
    },
  }),
});
export const { red: fourFeathersOneCrownRed } = fourFeathersOneCrown.cards;
