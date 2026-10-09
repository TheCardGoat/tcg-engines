import type { CharacterCard } from "@tcg/lorcana-types";
import { madamMimResourcefulTricksterI18n } from "./059-madam-mim-resourceful-trickster.i18n";

export const madamMimResourcefulTrickster: CharacterCard = {
  id: "n2V",
  canonicalId: "ci_n2V",
  slug: "lorcana-ci_n2V",
  printings: [
    {
      id: "set14-059",
      artId: "set14-059",
      setCode: "set14",
      collectorNumber: "59",
      rarity: "legendary",
      imageUrl: "",
    },
  ],
  reprints: ["set14-059"],
  cardType: "character",
  name: "Madam Mim",
  version: "Resourceful Trickster",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "014",
  cardNumber: 59,
  rarity: "legendary",
  cost: 8,
  strength: 7,
  willpower: 5,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_a3dedabdcc464fd1bea731c85f439226",
  },
  text: [
    {
      title: "UPPER HAND",
      description:
        "When you play this character, if you removed an ink drop to play her, draw 2 cards.",
    },
    {
      title: "BAUBLE GAME",
      description: "Once during your turn, whenever you remove an ink drop, draw a card.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
  abilities: [
    {
      id: "n2V-1",
      name: "UPPER HAND",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "play-context",
        context: "paid-with-ink-drop",
      },
      effect: {
        type: "draw",
        amount: 2,
        target: "CONTROLLER",
      },
      text: "UPPER HAND When you play this character, if you removed an ink drop to play her, draw 2 cards.",
    },
    {
      id: "n2V-2",
      name: "BAUBLE GAME",
      type: "triggered",
      trigger: {
        event: "ink-drop-removed",
        on: "YOU",
        timing: "whenever",
        restrictions: [{ type: "once-per-turn" }, { type: "during-turn", whose: "your" }],
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
      text: "BAUBLE GAME Once during your turn, whenever you remove an ink drop, draw a card.",
    },
  ],
  i18n: madamMimResourcefulTricksterI18n,
};
