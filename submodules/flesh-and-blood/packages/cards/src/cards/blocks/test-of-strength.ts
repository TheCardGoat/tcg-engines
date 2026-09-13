import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/test-of-strength.generated.ts";

export const testOfStrength = definePitchFamily(fabPitchFamilies["test-of-strength"], {
  abilities: () => ({
    clashForGold: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
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
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "clash",
          with: {
            selector: "attacking-hero",
          },
          prize: {
            type: "create-token",
            token: "gold",
            controller: "winner",
          },
        },
      },
      label: {
        name: "clash",
      },
    },
  }),
});

export const { red: testOfStrengthRed } = testOfStrength.cards;
