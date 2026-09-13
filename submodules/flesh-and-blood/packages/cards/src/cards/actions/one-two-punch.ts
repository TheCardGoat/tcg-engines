import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/one-two-punch.generated.ts";
import { comboStatic } from "@tcg/flesh-and-blood-types";
import { combo } from "../shared/keywords.ts";

export const oneTwoPunch = definePitchFamily(fabPitchFamilies["one-two-punch"], {
  keywords: [combo],
  abilities: () => ({
    comboStaticGrantPropertyTriggeredHitDealDamagePermanent: comboStatic({
      names: ["Head Jab"],
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "triggeredHitDealDamage",
            text: "",
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
                type: "deal-damage",
                damageType: "generic",
                amount: 2,
                target: {
                  selector: "attack-target",
                },
              },
            },
          },
        },
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    }),
  }),
});

export const {
  red: oneTwoPunchRed,
  yellow: oneTwoPunchYellow,
  blue: oneTwoPunchBlue,
} = oneTwoPunch.cards;
