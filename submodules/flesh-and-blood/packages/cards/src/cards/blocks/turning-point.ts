import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/turning-point.generated.ts";

export const turningPoint = definePitchFamily(fabPitchFamilies["turning-point"], {
  abilities: () => ({
    cheerWhenDefendingFromBehind: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
        state: {
          type: "life-comparison",
          player: "self",
          vs: "attacking-hero",
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
    gainDefenseWhenCheered: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "and",
        conditions: [
          { type: "has-status", status: "defending" },
          { type: "performed-this-turn", event: "cheered", player: "controller" },
        ],
      },
      effect: {
        type: "modify-numeric",
        property: "defense",
        op: "add",
        amount: 3,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
      label: {
        name: "the-crowd-cheers",
      },
    },
  }),
});

export const { blue: turningPointBlue } = turningPoint.cards;
