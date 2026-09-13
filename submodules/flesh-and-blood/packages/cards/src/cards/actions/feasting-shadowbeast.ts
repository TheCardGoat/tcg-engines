import { bloodDebt } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/feasting-shadowbeast.generated.ts";

export const feastingShadowbeast = definePitchFamily(fabPitchFamilies["feasting-shadowbeast"], {
  keywords: [bloodDebt],

  abilities: () => ({
    onAttackBanish: {
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
          type: "banish",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["deck"],
            position: "top",
            count: 1,
          },
          outputBinding: "it",
        },
      },
    },
    plusPowerAfterBanishingSixPowerCard: {
      kind: "static",
      staticKind: "continuous",
      condition: { type: "performed-this-turn", event: "banish-power-6", player: "controller" },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const {
  red: feastingShadowbeastRed,
  yellow: feastingShadowbeastYellow,
  blue: feastingShadowbeastBlue,
} = feastingShadowbeast.cards;
