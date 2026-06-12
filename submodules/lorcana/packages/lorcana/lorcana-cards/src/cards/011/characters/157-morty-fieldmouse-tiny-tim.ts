import type { CharacterCard } from "@tcg/lorcana-types";
import { mortyFieldmouseTinyTimI18n } from "./157-morty-fieldmouse-tiny-tim.i18n";

export const mortyFieldmouseTinyTim: CharacterCard = {
  id: "KXg",
  canonicalId: "ci_KXg",
  reprints: ["set11-157"],
  cardType: "character",
  name: "Morty Fieldmouse",
  version: "Tiny Tim",
  inkType: ["sapphire"],
  franchise: "Mickey's Christmas Carol",
  set: "011",
  cardNumber: 157,
  rarity: "rare",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_5c9d96ae2b6248f19d3a431a93576adb",
    tcgPlayer: 676226,
  },
  text: [
    {
      title: "HOLIDAY SPIRIT",
      description:
        "Once during your turn, whenever you put a card under one of your other characters, put the top card of your deck facedown under this character.",
    },
    {
      title: "HOLIDAY CHEER",
      description: "This character gets +1 {L} for each card under him.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "KXg-1",
      name: "HOLIDAY SPIRIT",
      type: "triggered",
      trigger: {
        event: "put-card-under",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: ["character"],
          excludeSelf: true,
        },
        restrictions: [{ type: "once-per-turn" }, { type: "during-turn", whose: "your" }],
      },
      effect: {
        type: "put-under",
        source: "top-of-deck",
        under: "self",
      },
      text: "HOLIDAY SPIRIT Once during your turn, whenever you put a card under one of your other characters, put the top card of your deck facedown under this character.",
    },
    {
      id: "KXg-2",
      name: "HOLIDAY CHEER",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: {
          type: "cards-under-self",
        },
        target: "SELF",
      },
      text: "HOLIDAY CHEER This character gets +1 {L} for each card under him.",
    },
  ],
  i18n: mortyFieldmouseTinyTimI18n,
};
