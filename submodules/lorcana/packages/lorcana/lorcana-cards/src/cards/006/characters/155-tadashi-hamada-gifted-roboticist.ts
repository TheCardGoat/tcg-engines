import type { CharacterCard } from "@tcg/lorcana-types";
import { tadashiHamadaGiftedRoboticistI18n } from "./155-tadashi-hamada-gifted-roboticist.i18n";

export const tadashiHamadaGiftedRoboticist: CharacterCard = {
  id: "dkB",
  canonicalId: "ci_dkB",
  reprints: ["set6-155"],
  cardType: "character",
  name: "Tadashi Hamada",
  version: "Gifted Roboticist",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  cardNumber: 155,
  rarity: "rare",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_d27f3196f81b4b17a0134b39608aefe7",
    tcgPlayer: 588328,
  },
  text: [
    {
      title: "SOMEONE HAS TO HELP",
      description:
        "During an opponent's turn, when this character is banished, you may put the top card of your deck into your inkwell facedown. Then, put this card into your inkwell facedown.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Inventor"],
  abilities: [
    {
      effect: {
        type: "sequence",
        effects: [
          {
            chooser: "CONTROLLER",
            effect: {
              facedown: true,
              source: "top-of-deck",
              target: "CONTROLLER",
              type: "put-into-inkwell",
            },
            type: "optional",
          },
          {
            facedown: true,
            source: "this-card",
            target: "CONTROLLER",
            type: "put-into-inkwell",
          },
        ],
      },
      id: "36l-1",
      name: "SOMEONE HAS TO HELP",
      text: "SOMEONE HAS TO HELP During an opponent’s turn, when this character is banished, you may put the top card of your deck into your inkwell facedown. Then, put this card into your inkwell facedown.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
        restrictions: [
          {
            type: "during-turn",
            whose: "opponent",
          },
        ],
      },
      type: "triggered",
    },
  ],
  i18n: tadashiHamadaGiftedRoboticistI18n,
};
