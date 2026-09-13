import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/test-of-agility.generated.ts";

export const testOfAgility = definePitchFamily(fabPitchFamilies["test-of-agility"], {
  supertypeSets: [["Brute"], ["Warrior"]],
  abilities: () => ({
    clashForAgility: {
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
            token: "agility",
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

export const { red: testOfAgilityRed } = testOfAgility.cards;
