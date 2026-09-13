import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tear-down-the-idols.generated.ts";

export const tearDownTheIdols = definePitchFamily(fabPitchFamilies["tear-down-the-idols"], {
  abilities: () => ({
    whenAttacksReveredHeroIntimidateThem: {
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
              typeBox: {
                supertypes: ["Revered"],
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
          type: "intimidate",
          target: "attack-target",
        },
      },
      label: {
        name: "intimidate",
      },
    },
    whenHitsReveredHeroTheyDiscard: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
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
              typeBox: {
                supertypes: ["Revered"],
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
          type: "discard",
          target: {
            selector: "attack-target",
          },
        },
      },
      label: {
        name: "intimidate",
      },
    },
  }),
});

export const { red: tearDownTheIdolsRed } = tearDownTheIdols.cards;
