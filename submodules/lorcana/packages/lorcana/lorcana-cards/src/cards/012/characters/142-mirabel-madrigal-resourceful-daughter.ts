import type { CharacterCard } from "@tcg/lorcana-types";
import { mirabelMadrigalResourcefulDaughterI18n } from "./142-mirabel-madrigal-resourceful-daughter.i18n";

export const mirabelMadrigalResourcefulDaughter: CharacterCard = {
  id: "9UM",
  canonicalId: "ci_9UM",
  slug: "lorcana-ci_9UM",
  printings: [
    {
      id: "set12-142",
      artId: "set12-142",
      setCode: "set12",
      collectorNumber: "142",
      rarity: "common",
      imageUrl: "",
    },
  ],
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
  externalIds: {
    lorcast: "crd_f939abcb55234e9b9507d5d34cac867c",
    tcgPlayer: "692181",
  },
  text: [
    {
      title: "THIS WILL HELP",
      description: "When you play this character, remove up to 2 damage from chosen character.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Madrigal"],
  abilities: [
    {
      id: "9UM-1",
      name: "This Will Help",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "remove-damage",
          amount: {
            type: "up-to",
            value: 2,
          },
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
  i18n: mirabelMadrigalResourcefulDaughterI18n,
};
