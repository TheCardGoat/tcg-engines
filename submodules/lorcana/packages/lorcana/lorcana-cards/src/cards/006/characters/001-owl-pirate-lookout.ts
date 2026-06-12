import type { CharacterCard } from "@tcg/lorcana-types";
import { owlPirateLookoutI18n } from "./001-owl-pirate-lookout.i18n";

export const owlPirateLookout: CharacterCard = {
  id: "6MA",
  canonicalId: "ci_6MA",
  reprints: ["set6-001"],
  cardType: "character",
  name: "Owl",
  version: "Pirate Lookout",
  inkType: ["amber"],
  franchise: "Winnie the Pooh",
  set: "006",
  cardNumber: 1,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_7b8a887fbfda4b869f7529f31da115f6",
    tcgPlayer: 588072,
  },
  text: [
    {
      title: "WELL SPOTTED",
      description:
        "During your turn, whenever a card is put into your inkwell, chosen opposing character gets -1 {S} until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Pirate"],
  abilities: [
    {
      effect: {
        modifier: -1,
        stat: "strength",
        duration: "until-start-of-next-turn",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "opponent",
          selector: "chosen",
          zones: ["play"],
        },
        type: "modify-stat",
      },
      id: "kq3-1",
      name: "WELL SPOTTED",
      text: "WELL SPOTTED During your turn, whenever a card is put into your inkwell, chosen opposing character gets -1 {S} until the start of your next turn.",
      trigger: {
        event: "ink",
        on: "CONTROLLER",
        timing: "whenever",
        restrictions: [{ type: "during-turn", whose: "your" }],
      },
      type: "triggered",
    },
  ],
  i18n: owlPirateLookoutI18n,
};
