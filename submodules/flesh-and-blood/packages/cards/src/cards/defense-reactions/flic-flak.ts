import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/flic-flak.generated.ts";

export const flicFlak = definePitchFamily(fabPitchFamilies["flic-flak"], {
  abilities: () => ({
    boostNextComboDefense: {
      kind: "resolution",

      effect: {
        type: "delayed-trigger",
        trigger: {
          kind: "event",
          event: {
            name: "defend",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "event-object",
              selector: "defender",
              relationship: {
                kind: "any",
              },
              bindAs: "it",
            },
          },
        },
        policy: {
          kind: "windowed",
          duration: "this-turn",
          matching: "first",
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "conditional",
            condition: {
              type: "binding-matches",
              binding: "it",
              filter: { hasKeyword: "combo" },
            },
            then: {
              type: "modify-numeric",
              property: "defense",
              op: "add",
              amount: 2,
              target: { selector: "binding", binding: "it" },
              duration: "this-turn",
            },
          },
        },
      },
    },
  }),
});

export const { red: flicFlakRed, yellow: flicFlakYellow, blue: flicFlakBlue } = flicFlak.cards;
