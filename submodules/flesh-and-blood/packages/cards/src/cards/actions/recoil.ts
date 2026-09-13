import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/recoil.generated.ts";
import { comboStatic } from "@tcg/flesh-and-blood-types";
import { combo } from "../shared/keywords.ts";

export const recoil = definePitchFamily(fabPitchFamilies["recoil"], {
  keywords: [combo],
  abilities: () => ({
    comboStaticGrantPropertyTriggeredHitMoveCardPermanent: comboStatic({
      names: ["Head Jab"],
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "triggeredHitMoveCard",
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
                type: "move-card",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "attack-target",
                  zones: ["hand"],
                  count: 1,
                },
                to: {
                  zone: "deck",
                  position: "top",
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

export const { red: recoilRed, yellow: recoilYellow, blue: recoilBlue } = recoil.cards;
