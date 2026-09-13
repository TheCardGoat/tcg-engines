import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/drawn-to-the-blade.generated.ts";
import { goAgain } from "../shared/keywords.ts";
export const drawnToTheBlade = definePitchFamily(fabPitchFamilies["drawn-to-the-blade"], {
  keywords: [{ name: "sharpen" }, goAgain],
  abilities: () => ({
    sequence: {
      type: "sequence",
      steps: [
        {
          type: "sharpen",
          target: {
            selector: "object",
            declared: "on-stack",
            player: "controller",
            zones: ["weapon", "permanent"],
            filter: { typeBox: { subtypes: ["Sword"] } },
            count: 1,
          },
          outputBinding: "it",
        },
        {
          type: "conditional",
          condition: {
            type: "has-counter",
            counter: { kind: "numeric", value: 1, property: "power" },
            target: { selector: "binding", binding: "it" },
            comparison: { op: "gte", value: 2 },
          },
          then: {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "staticTriggeredHitDraw",
                text: "",
                trigger: {
                  kind: "event",
                  event: {
                    name: "hit",
                    actor: { kind: "player", player: "ability-controller" },
                    observes: { kind: "source", selector: "attack" },
                    target: { kind: "hero" },
                  },
                },
                resolution: {
                  kind: "effect",
                  effect: { type: "draw", count: 1, player: "controller" },
                },
                limit: { count: 1, per: "turn", ordinals: [1] },
              },
            },
            target: { selector: "binding", binding: "it" },
            duration: "this-turn",
          },
        },
      ],
    },
  }),
});
export const { yellow: drawnToTheBladeYellow } = drawnToTheBlade.cards;
