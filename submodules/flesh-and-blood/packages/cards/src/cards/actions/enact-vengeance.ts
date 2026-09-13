import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/enact-vengeance.generated.ts";

import { combo } from "../shared/keywords.ts";

export const enactVengeance = definePitchFamily(fabPitchFamilies["enact-vengeance"], {
  keywords: [combo],
  abilities: () => ({
    ifEdgeAutumnVengeanceNameWasLastAttackCombat: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "or",
        conditions: [
          {
            type: "last-attack-this-combat-chain",
            names: ["Edge Of Autumn"],
          },
          {
            type: "last-attack-this-combat-chain",
            nameIncludes: ["Vengeance"],
          },
        ],
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "whenHitsHeroDestroyAllTheirArsenal",
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
                type: "destroy",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "opponent",
                  zones: ["arsenal"],
                  count: {
                    type: "all",
                  },
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
      label: {
        name: "combo",
        params: {
          names: ["Edge Of Autumn", "*Vengeance*"],
        },
      },
    },
  }),
});
export const { red: enactVengeanceRed } = enactVengeance.cards;
