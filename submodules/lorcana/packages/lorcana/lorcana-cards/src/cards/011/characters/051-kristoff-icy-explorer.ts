import type { CharacterCard } from "@tcg/lorcana-types";
import { kristoffIcyExplorerI18n } from "./051-kristoff-icy-explorer.i18n";

export const kristoffIcyExplorer: CharacterCard = {
  id: "rkl",
  canonicalId: "ci_rkl",
  reprints: ["set11-051"],
  cardType: "character",
  name: "Kristoff",
  version: "Icy Explorer",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "011",
  cardNumber: 51,
  rarity: "rare",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_094f62fcb6094af1922921881eddf3f6",
    tcgPlayer: 675381,
  },
  text: [
    {
      title: "HIDDEN DEPTHS",
      description:
        "When you play this character, if you have a character named Anna in play, you may put a card from chosen player's discard on the bottom of their deck.",
    },
    {
      title: "STROKE OF LUCK",
      description: "Once during your turn, whenever a card leaves your discard, draw a card.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [
    {
      id: "ryn-1",
      condition: {
        type: "has-named-character",
        name: "Anna",
        controller: "you",
      },
      effect: {
        effect: {
          target: {
            cardTypes: ["card"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["discard"],
          },
          type: "put-on-bottom",
        },
        type: "optional",
      },
      name: "HIDDEN DEPTHS",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "HIDDEN DEPTHS When you play this character, if you have a character named Anna in play, you may put a card from chosen player’s discard on the bottom of their deck.",
    },
    {
      id: "ryn-2",
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      name: "STROKE OF LUCK",
      trigger: {
        event: "leave-discard",
        on: "CONTROLLER",
        timing: "whenever",
        restrictions: [{ type: "once-per-turn" }, { type: "during-turn", whose: "your" }],
      },
      type: "triggered",
      text: "STROKE OF LUCK Once during your turn, whenever a card leaves your discard, draw a card.",
    },
  ],
  i18n: kristoffIcyExplorerI18n,
};
