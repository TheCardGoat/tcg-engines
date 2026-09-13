import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fusion } from "../shared/keywords.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/snow-under.generated.ts";

export const snowUnder = definePitchFamily(fabPitchFamilies["snow-under"], {
  keywords: [fusion("Ice")],
  abilities: () => ({
    grantFrostbiteCreationOnHitWhenFused: {
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
            id: "createFrostbiteOnHit",
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
                type: "create-token",
                token: "frostbite",
                controller: "attack-target",
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

export const { red: snowUnderRed, yellow: snowUnderYellow, blue: snowUnderBlue } = snowUnder.cards;
