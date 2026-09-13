import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/corrosive-space-dust.generated.ts";

export const corrosiveSpaceDust = definePitchFamily(fabPitchFamilies["corrosive-space-dust"], {
  parameters: pitchMap({
    red: { holoWard: 4 },
    yellow: { holoWard: 3 },
    blue: { holoWard: 2 },
  }),
  keywords: [{ name: "ward", value: { type: "x" } }],
  abilities: ({ holoWard }) => ({
    damageOnLeave: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "leave-arena",
          actor: { kind: "any" },
          observes: { kind: "source", selector: "moved-object" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "deal-damage",
          damageType: "arcane",
          amount: 1,
          target: { selector: "any-hero" },
        },
      },
    },
    wardValue: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: {
            name: "ward",
            value: {
              type: "conditional",
              condition: {
                type: "has-counter",
                counter: { kind: "named", name: "holo" },
                target: { selector: "self" },
              },
              then: holoWard,
              else: 1,
            },
          },
        },
        target: { selector: "self" },
        duration: "while-in-arena",
      },
    },
  }),
});

export const {
  red: corrosiveSpaceDustRed,
  yellow: corrosiveSpaceDustYellow,
  blue: corrosiveSpaceDustBlue,
} = corrosiveSpaceDust.cards;
