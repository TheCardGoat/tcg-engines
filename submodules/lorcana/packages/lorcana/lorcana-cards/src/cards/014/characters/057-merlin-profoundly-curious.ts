import type { CharacterCard } from "@tcg/lorcana-types";
import { merlinProfoundlyCuriousI18n } from "./057-merlin-profoundly-curious.i18n";

export const merlinProfoundlyCurious: CharacterCard = {
  id: "CTD",
  canonicalId: "ci_CTD",
  slug: "lorcana-ci_CTD",
  printings: [
    {
      id: "set14-057",
      artId: "set14-057",
      setCode: "set14",
      collectorNumber: "57",
      rarity: "super_rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-057"],
  cardType: "character",
  name: "Merlin",
  version: "Profoundly Curious",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "014",
  cardNumber: 57,
  rarity: "super_rare",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: false,
  text: [
    {
      title: "Untapped Potential",
      description:
        "When you play this character, get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
    },
    {
      title: "Thrilling Discovery",
      description: "Whenever this character quests, draw a card.",
    },
  ],
  classifications: ["Dreamborn", "Mentor", "Sorcerer"],
  abilities: [
    {
      id: "CTD-1",
      name: "Untapped Potential",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "gain-ink-drop",
        amount: 1,
        target: "CONTROLLER",
      },
      text: "Untapped Potential When you play this character, get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
    },
    {
      id: "CTD-2",
      name: "Thrilling Discovery",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
      text: "Thrilling Discovery Whenever this character quests, draw a card.",
    },
  ],
  i18n: merlinProfoundlyCuriousI18n,
};
