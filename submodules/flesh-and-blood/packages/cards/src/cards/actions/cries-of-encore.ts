import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/cries-of-encore.generated.ts";

export const criesOfEncore = definePitchFamily(fabPitchFamilies["cries-of-encore"], {
  abilities: () => ({
    whenAttacksHeroIfHaveLessThanThemCrowd: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
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
          target: {
            kind: "hero",
          },
        },
        state: {
          type: "life-comparison",
          player: "self",
          vs: "opponent",
          op: "lt",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "crowd-cheers",
          target: "controller",
        },
      },
      label: {
        name: "the-crowd-cheers",
      },
    },
    ifVeBeenCheeredTurnGetsWhenHitsHero: {
      kind: "static",
      staticKind: "continuous",
      condition: { type: "performed-this-turn", event: "cheered", player: "controller" },
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "whenHitsHeroMayPlanAuraSuspenseFromGraveyard",
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
                type: "optional",
                effect: {
                  type: "move-card",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "controller",
                    zones: ["graveyard"],
                    filter: {
                      typeBox: {
                        subtypes: ["Aura"],
                      },
                      hasKeyword: "suspense",
                    },
                    count: 1,
                  },
                  to: {
                    zone: "permanent",
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
        name: "the-crowd-cheers",
      },
    },
  }),
});
export const { red: criesOfEncoreRed } = criesOfEncore.cards;
