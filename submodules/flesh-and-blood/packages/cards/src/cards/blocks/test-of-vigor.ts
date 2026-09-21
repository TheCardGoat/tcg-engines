import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/test-of-vigor.generated.ts";

export const testOfVigor = definePitchFamily(fabPitchFamilies["test-of-vigor"], {
  supertypeSets: [["Guardian"], ["Warrior"]],
  abilities: () => ({
    clashForVigor: {
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
            token: "vigor",
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

export const { red: testOfVigorRed } = testOfVigor.cards;
