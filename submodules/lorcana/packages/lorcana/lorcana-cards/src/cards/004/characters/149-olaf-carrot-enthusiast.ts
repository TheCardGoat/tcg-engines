import type { CharacterCard } from "@tcg/lorcana-types";
import { olafCarrotEnthusiastI18n } from "./149-olaf-carrot-enthusiast.i18n";

export const olafCarrotEnthusiast: CharacterCard = {
  id: "fW1",
  canonicalId: "ci_fW1",
  reprints: ["set4-149"],
  cardType: "character",
  name: "Olaf",
  version: "Carrot Enthusiast",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "004",
  cardNumber: 149,
  rarity: "uncommon",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_f4f749bc095641e1b953b1784a6efa51",
    tcgPlayer: 547767,
  },
  text: [
    {
      title:
        "Shift: Discard an item card (You may discard an item card to play this on top of one of your characters named Olaf.)",
    },
    {
      title: "CARROTS ALL AROUND!",
      description:
        "Whenever he quests, each of your other characters gets +{S} equal to this character's {S} this turn.",
    },
  ],
  classifications: ["Floodborn", "Ally"],
  abilities: [
    {
      id: "fW1-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        discardCards: 1,
        discardCardType: "item",
      },
      shiftTarget: "Olaf",
      text: "Shift: Discard an item card (You may discard an item card to play this on top of one of your characters named Olaf.)",
    },
    {
      id: "fW1-2",
      name: "CARROTS ALL AROUND!",
      text: "CARROTS ALL AROUND! Whenever he quests, each of your other characters gets +{S} equal to this character's {S} this turn.",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "modify-stat",
          stat: "strength",
          modifier: {
            type: "strength-of",
            target: { ref: "self" },
          },
          target: "YOUR_OTHER_CHARACTERS",
          duration: "this-turn",
        },
      },
    },
  ],
  i18n: olafCarrotEnthusiastI18n,
};
