import type { CharacterCard } from "@tcg/lorcana-types";
import { fergusOutpostBuilderI18n } from "./194-fergus-outpost-builder.i18n";

export const fergusOutpostBuilder: CharacterCard = {
  id: "Ys5",
  canonicalId: "ci_Ys5",
  reprints: ["set12-194"],
  cardType: "character",
  name: "Fergus",
  version: "Outpost Builder",
  inkType: ["steel"],
  franchise: "Brave",
  set: "012",
  cardNumber: 194,
  rarity: "common",
  cost: 6,
  strength: 4,
  willpower: 6,
  lore: 2,
  inkable: true,
  text: [
    {
      title: "Just the Spot",
      description:
        "During your turn, whenever this character becomes exerted, you may play a location from your hand or discard with cost 4 or less for free.",
    },
    {
      title: "Hold Fast",
      description:
        "While this character is at a location, whenever a location is challenged and banished, you may deal 4 damage to chosen character.",
    },
  ],
  classifications: ["Dreamborn", "Mentor", "King"],
  abilities: [
    {
      id: "Ys5-1",
      name: "JUST THE SPOT",
      type: "triggered",
      text: "JUST THE SPOT During your turn, whenever this character becomes exerted, you may play a location from your hand or discard with cost 4 or less for free.",
      trigger: {
        event: "exert",
        on: "SELF",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "play-card",
          cardType: "location",
          cost: "free",
          costRestriction: {
            comparison: "less-or-equal",
            value: 4,
          },
          from: ["hand", "discard"],
        },
      },
    },
    {
      id: "Ys5-2",
      name: "HOLD FAST",
      type: "triggered",
      text: "HOLD FAST While this character is at a location, whenever a location is challenged and banished, you may deal 4 damage to chosen character.",
      condition: {
        type: "at-location",
      },
      trigger: {
        event: "challenged-and-banished",
        on: {
          cardType: "location",
        },
        timing: "whenever",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "deal-damage",
          amount: 4,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
      },
    },
  ],
  i18n: fergusOutpostBuilderI18n,
};
