import type { CharacterCard } from "@tcg/lorcana-types";
import { winnieThePoohHunnyPirateI18n } from "./003-winnie-the-pooh-hunny-pirate.i18n";
import { support } from "../../../helpers/abilities/support";

export const winnieThePoohHunnyPirate: CharacterCard = {
  id: "R7L",
  canonicalId: "ci_R7L",
  reprints: ["set6-003"],
  cardType: "character",
  name: "Winnie the Pooh",
  version: "Hunny Pirate",
  inkType: ["amber"],
  franchise: "Winnie the Pooh",
  set: "006",
  cardNumber: 3,
  rarity: "rare",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_59aa66bcac7b43528a3c9c01f4bc1124",
    tcgPlayer: 593050,
  },
  text: [
    {
      title: "Support",
    },
    {
      title: "WE'RE PIRATES, YOU SEE",
      description:
        "Whenever this character quests, you pay 1 {I} less for the next Pirate character you play this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Pirate"],
  abilities: [
    support,
    {
      effect: {
        amount: 1,
        cardType: "character",
        classification: "Pirate",
        duration: "next-play-this-turn",
        target: "CONTROLLER",
        type: "cost-reduction",
      },
      id: "1v3-2",
      name: "WE'RE PIRATES, YOU SEE",
      text: "WE'RE PIRATES, YOU SEE Whenever this character quests, you pay 1 {I} less for the next Pirate character you play this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: winnieThePoohHunnyPirateI18n,
};
