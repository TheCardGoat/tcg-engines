import type { CharacterCard } from "@tcg/lorcana-types";
import { mauriceWorldfamousInventorI18n } from "./152-maurice-world-famous-inventor.i18n";

export const mauriceWorldfamousInventor: CharacterCard = {
  id: "Yw4",
  canonicalId: "ci_Yw4",
  reprints: ["set1-152"],
  cardType: "character",
  name: "Maurice",
  version: "World-Famous Inventor",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "001",
  cardNumber: 152,
  rarity: "rare",
  cost: 6,
  strength: 2,
  willpower: 7,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_de24a04b1d83417594730a5036cfc2a4",
    tcgPlayer: 492126,
  },
  text: [
    {
      title: "GIVE IT A TRY",
      description:
        "Whenever this character quests, you pay 2 {I} less for the next item you play this turn.",
    },
    {
      title: "IT WORKS!",
      description: "Whenever you play an item, you may draw a card.",
    },
  ],
  classifications: ["Dreamborn", "Mentor", "Inventor"],
  abilities: [
    {
      effect: {
        amount: 2,
        cardType: "item",
        duration: "next-play-this-turn",
        target: "CONTROLLER",
        type: "cost-reduction",
      },
      id: "x5f-1",
      name: "GIVE IT A TRY",
      text: "GIVE IT A TRY Whenever this character quests, you pay 2 {I} less for the next item you play this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      id: "x5f-2",
      name: "IT WORKS!",
      text: "IT WORKS! Whenever you play an item, you may draw a card.",
      trigger: {
        event: "play",
        on: {
          cardType: "item",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: mauriceWorldfamousInventorI18n,
};
