import type { CharacterCard } from "@tcg/lorcana-types";
import { chipTeamPlayerI18n } from "./027-chip-team-player.i18n";

export const chipTeamPlayer: CharacterCard = {
  id: "Xfn",
  canonicalId: "ci_Xfn",
  reprints: ["set12-027"],
  cardType: "character",
  name: "Chip",
  version: "Team Player",
  inkType: ["amber"],
  franchise: "Rescue Rangers",
  set: "012",
  cardNumber: 27,
  rarity: "common",
  cost: 6,
  strength: 2,
  willpower: 7,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_81be5ee0001a4e908712f662cccff814",
  },
  text: [
    {
      title: "RANGER RESOURCEFULNESS",
      description:
        "When you play this character, if you have another character with 4 {W} or more in play, you may draw a card.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      id: "Xfn-1",
      name: "RANGER RESOURCEFULNESS",
      type: "triggered",
      text: "RANGER RESOURCEFULNESS When you play this character, if you have another character with 4 {W} or more in play, you may draw a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "target-query",
          query: {
            selector: "all",
            owner: "you",
            zones: ["play"],
            cardType: "character",
            excludeSelf: true,
            filters: [
              {
                type: "willpower-comparison",
                comparison: "greater-or-equal",
                value: 4,
              },
            ],
          },
          comparison: {
            operator: "gte",
            value: 1,
          },
        },
        then: {
          type: "optional",
          chooser: "CONTROLLER",
          effect: {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        },
      },
    },
  ],
  i18n: chipTeamPlayerI18n,
};
