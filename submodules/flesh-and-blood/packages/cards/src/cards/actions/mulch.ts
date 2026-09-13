import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fusion } from "../shared/keywords.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/mulch.generated.ts";

export const mulch = definePitchFamily(fabPitchFamilies["mulch"], {
  keywords: [fusion("Earth")],
  abilities: () => ({
    continuousHasStatusFusedGrantPropertyTriggeredHitMoveCardPermanent: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "has-status",
        status: "fused",
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "putArsenalOnBottomOnHit",
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
                  zones: ["arsenal"],
                  count: 1,
                },
                to: {
                  zone: "deck",
                  position: "bottom",
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
    },
  }),
});

export const { red: mulchRed, yellow: mulchYellow, blue: mulchBlue } = mulch.cards;
