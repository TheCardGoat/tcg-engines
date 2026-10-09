import type { CharacterCard } from "@tcg/lorcana-types";
import { owenBurnettXanatossAssistantI18n } from "./035-owen-burnett-xanatoss-assistant.i18n";

export const owenBurnettXanatossAssistant: CharacterCard = {
  id: "Ae0",
  canonicalId: "ci_Ae0",
  slug: "lorcana-ci_Ae0",
  printings: [
    {
      id: "set14-035",
      artId: "set14-035",
      setCode: "set14",
      collectorNumber: "35",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-035"],
  cardType: "character",
  name: "Owen Burnett",
  version: "Xanatos's Assistant",
  inkType: ["amethyst"],
  franchise: "Gargoyles",
  set: "014",
  cardNumber: 35,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_cafb43eabd50438f9248ff55a7dd8850",
  },
  text: [
    {
      title: "CUT YOUR LOSSES",
      description:
        "When you play this character, you may return chosen character, item, or location with cost 2 or less to their player's hand.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "Ae0-1",
      name: "CUT YOUR LOSSES",
      type: "triggered",
      text: "CUT YOUR LOSSES When you play this character, you may return chosen character, item, or location with cost 2 or less to their player's hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "return-to-hand",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character", "item", "location"],
            filter: [
              {
                type: "cost-comparison",
                comparison: "less-or-equal",
                value: 2,
              },
            ],
          },
        },
      },
    },
  ],
  i18n: owenBurnettXanatossAssistantI18n,
};
