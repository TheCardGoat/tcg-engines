import type { CharacterCard } from "@tcg/lorcana-types";
import { mirabelMadrigalResourcefulDaughterI18n } from "./142-mirabel-madrigal-resourceful-daughter.i18n";

export const mirabelMadrigalResourcefulDaughter: CharacterCard = {
  id: "9UM",
  canonicalId: "ci_9UM",
  reprints: ["set12-142"],
  cardType: "character",
  name: "Mirabel Madrigal",
  version: "Resourceful Daughter",
  inkType: ["sapphire"],
  franchise: "Encanto",
  set: "012",
  cardNumber: 142,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 6,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "This Will Help",
      description: "When you play this character, remove up to 2 damage from chosen character.",
    },
  ],
  abilities: [
    {
      id: "9UM-1",
      name: "This Will Help",
      type: "triggered",
      trigger: { event: "play", on: "SELF", timing: "when" },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "remove-damage",
          amount: { type: "up-to", value: 2 },
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
  classifications: ["Storyborn", "Hero", "Madrigal"],
  i18n: mirabelMadrigalResourcefulDaughterI18n,
};
