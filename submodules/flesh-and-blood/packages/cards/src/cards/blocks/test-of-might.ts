import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/test-of-might.generated.ts";

export const testOfMight = definePitchFamily(fabPitchFamilies["test-of-might"], {
  supertypeSets: [["Brute"], ["Guardian"]],
  abilities: () => ({
    clashForMight: {
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
            token: "might",
            creator: "token-controller",
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

export const { red: testOfMightRed } = testOfMight.cards;
