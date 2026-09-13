import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/smack-of-reality.generated.ts";

export const smackOfReality = definePitchFamily(fabPitchFamilies["smack-of-reality"], {
  abilities: () => ({
    hasNumber13MorePowerGetsWhenHitsHeroDestroyAllAuraTokens: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "attack-power",
        comparison: { op: "gte", value: 13 },
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "whenHitsHeroDestroyAllAuraTokensTheyControl",
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
                  player: "attack-target",
                  zones: ["permanent"],
                  filter: {
                    typeBox: {
                      metatypes: ["Token"],
                      subtypes: ["Aura"],
                    },
                  },
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
        name: "tower",
      },
    },
  }),
});

export const { red: smackOfRealityRed } = smackOfReality.cards;
