import type { CharacterCard } from "@tcg/lorcana-types";
import { belleOfTheBallI18n } from "./158-belle-of-the-ball.i18n";
import { ward } from "../../../helpers/abilities/ward";

export const belleOfTheBall: CharacterCard = {
  id: "rlF",
  canonicalId: "ci_rlF",
  reprints: ["set5-158"],
  cardType: "character",
  name: "Belle",
  version: "Of the Ball",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "005",
  cardNumber: 158,
  rarity: "rare",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_d5087e3422e74e3585a2a323b4a06ee7",
    tcgPlayer: 561651,
  },
  text: [
    {
      title: "Ward",
    },
    {
      title: "USHERED INTO THE PARTY",
      description:
        "When you play this character, your other characters gain Ward until the start of your next turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
  abilities: [
    ward,
    {
      effect: {
        keyword: "Ward",
        target: "YOUR_OTHER_CHARACTERS",
        duration: "until-start-of-next-turn",
        type: "gain-keyword",
      },
      id: "1j3-2",
      name: "USHERED INTO THE PARTY",
      text: "USHERED INTO THE PARTY When you play this character, your other characters gain Ward until the start of your next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: belleOfTheBallI18n,
};
