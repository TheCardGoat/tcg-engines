import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/brainstorm.generated.ts";

export const brainstorm = definePitchFamily(fabPitchFamilies["brainstorm"], {
  abilities: () => ({
    untilEndTurnHeroGainsWheneverDrawActionPhase: {
      kind: "resolution",
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "wheneverDrawActionPhaseDeal1ArcaneDamageAny",
            text: "",
            trigger: {
              kind: "event",
              event: {
                name: "draw",
                actor: {
                  kind: "player",
                  player: "ability-controller",
                },
                observes: {
                  kind: "none",
                },
              },
            },
            resolution: {
              kind: "effect",
              effect: {
                type: "deal-damage",
                damageType: "arcane",
                amount: 1,
                target: {
                  selector: "object",
                  declared: "on-stack",
                  zones: ["hero", "permanent"],
                  count: 1,
                },
              },
            },
          },
        },
        target: {
          selector: "controller",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { blue: brainstormBlue } = brainstorm.cards;
