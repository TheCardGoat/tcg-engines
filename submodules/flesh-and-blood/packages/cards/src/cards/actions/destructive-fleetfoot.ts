import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/destructive-fleetfoot.generated.ts";
export const destructiveFleetfoot = definePitchFamily(fabPitchFamilies["destructive-fleetfoot"], {
  abilities: () => ({
    resolutionHasKeywordModifyNumericPowerQuickstrike: {
      kind: "resolution",
      condition: {
        type: "has-keyword",
        keyword: "go-again",
        target: {
          selector: "self",
        },
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
      label: {
        name: "quickstrike",
      },
    },
    staticTriggeredHitDestroy: {
      kind: "static",
      staticKind: "triggered",
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
            zones: ["permanent"],
            filter: {
              typeBox: {
                metatypes: ["Token"],
                subtypes: ["Aura"],
              },
            },
            count: 1,
          },
        },
      },
    },
  }),
});
export const {
  red: destructiveFleetfootRed,
  yellow: destructiveFleetfootYellow,
  blue: destructiveFleetfootBlue,
} = destructiveFleetfoot.cards;
