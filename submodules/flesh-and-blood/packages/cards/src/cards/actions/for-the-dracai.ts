import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/for-the-dracai.generated.ts";

export const forTheDracai = definePitchFamily(fabPitchFamilies["for-the-dracai"], {
  abilities: () => ({
    whenAttacksMarkedHeroCreateFealtyToken: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "attack",
            relationship: {
              kind: "any",
            },
            filter: {
              hasStatus: "marked",
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
          type: "create-token",
          token: "fealty",
          controller: "controller",
        },
      },
    },
  }),
});
export const { red: forTheDracaiRed } = forTheDracai.cards;
