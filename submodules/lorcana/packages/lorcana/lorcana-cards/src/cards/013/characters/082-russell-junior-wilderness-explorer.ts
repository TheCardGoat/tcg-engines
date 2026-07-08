import type { CharacterCard } from "@tcg/lorcana-types";
import { russellJuniorWildernessExplorerI18n } from "./082-russell-junior-wilderness-explorer.i18n";

export const russellJuniorWildernessExplorer: CharacterCard = {
  id: "5au",
  canonicalId: "ci_5au",
  slug: "lorcana-ci_5au",
  printings: [
    {
      id: "set13-082",
      artId: "set13-082",
      setCode: "set13",
      collectorNumber: "82",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-082"],
  cardType: "character",
  name: "Russell",
  version: "Junior Wilderness Explorer",
  inkType: ["emerald"],
  franchise: "Up",
  set: "013",
  cardNumber: 82,
  rarity: "common",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c78da4f23cfe4cb39c87abf0893dbcb4",
  },
  text: [
    {
      title: "ASSISTING THE ELDERLY BADGE",
      description:
        "Whenever this character quests, you may move him and one of your other characters to the same location for free.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      type: "triggered",
      name: "ASSISTING THE ELDERLY BADGE",
      text: "ASSISTING THE ELDERLY BADGE Whenever this character quests, you may move him and one of your other characters to the same location for free.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "move-to-location",
              character: "ANOTHER_CHOSEN_CHARACTER_OF_YOURS",
              location: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["location"],
              },
              cost: "free",
            },
            {
              type: "move-to-location",
              character: "SELF",
              location: {
                ref: "previous-target",
              },
              cost: "free",
            },
          ],
        },
      },
    },
  ],
  i18n: russellJuniorWildernessExplorerI18n,
};
