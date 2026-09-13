import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/clash-of-agility.generated.ts";

export const clashOfAgility = definePitchFamily(fabPitchFamilies["clash-of-agility"], {
  supertypeSets: [["Brute"], ["Warrior"]],

  abilities: () => ({
    onDefendClashCreateTokenAgility: {
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
export const {
  red: clashOfAgilityRed,
  yellow: clashOfAgilityYellow,
  blue: clashOfAgilityBlue,
} = clashOfAgility.cards;
