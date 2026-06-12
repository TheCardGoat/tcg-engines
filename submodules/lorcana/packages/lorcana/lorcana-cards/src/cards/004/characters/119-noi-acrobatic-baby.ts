import type { CharacterCard } from "@tcg/lorcana-types";
import { noiAcrobaticBabyI18n } from "./119-noi-acrobatic-baby.i18n";

export const noiAcrobaticBaby: CharacterCard = {
  id: "9pN",
  canonicalId: "ci_9pN",
  reprints: ["set4-119"],
  cardType: "character",
  name: "Noi",
  version: "Acrobatic Baby",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "004",
  cardNumber: 119,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_eb12e8151688469f9b259778c64812ca",
    tcgPlayer: 550596,
  },
  text: [
    {
      title: "FANCY FOOTWORK",
      description:
        "Whenever you play an action, this character takes no damage from challenges this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "9pN-1",
      type: "triggered",
      name: "FANCY FOOTWORK",
      text: "FANCY FOOTWORK Whenever you play an action, this character takes no damage from challenges this turn.",
      trigger: {
        event: "play",
        on: {
          cardType: "action",
          controller: "you",
        },
        timing: "whenever",
      },
      effect: {
        type: "grant-ability",
        ability: "takes-no-damage-from-challenges",
        duration: "this-turn",
        target: "SELF",
      },
    },
  ],
  i18n: noiAcrobaticBabyI18n,
};
