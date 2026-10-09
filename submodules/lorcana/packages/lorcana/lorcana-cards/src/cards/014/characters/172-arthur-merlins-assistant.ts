import type { CharacterCard } from "@tcg/lorcana-types";
import { arthurMerlinsAssistantI18n } from "./172-arthur-merlins-assistant.i18n";

export const arthurMerlinsAssistant: CharacterCard = {
  id: "DrF",
  canonicalId: "ci_DrF",
  slug: "lorcana-ci_DrF",
  printings: [
    {
      id: "set14-172",
      artId: "set14-172",
      setCode: "set14",
      collectorNumber: "172",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-172"],
  cardType: "character",
  name: "Arthur",
  version: "Merlin's Assistant",
  inkType: ["steel"],
  franchise: "Sword in the Stone",
  set: "014",
  cardNumber: 172,
  rarity: "rare",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Magical Travel",
      description: "When you play this character, you may move him to a location for free.",
    },
    {
      title: "Arcane Deliveries",
      description:
        "Once during your turn, whenever this character moves to a location, get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "arthur-assistant-1",
      name: "Magical Travel",
      type: "triggered",
      text: "Magical Travel When you play this character, you may move him to a location for free.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "move-to-location",
              character: "SELF",
              location: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["location"],
              },
              cost: "free",
            },
          ],
        },
      },
    },
    {
      id: "arthur-assistant-2",
      name: "Arcane Deliveries",
      type: "triggered",
      text: "Arcane Deliveries Once during your turn, whenever this character moves to a location, get 1 ink drop.",
      trigger: {
        event: "move",
        on: "SELF",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
          {
            type: "once-per-turn",
          },
        ],
      },
      effect: {
        type: "gain-ink-drop",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: arthurMerlinsAssistantI18n,
};
