import type { CharacterCard } from "@tcg/lorcana-types";
import { jafarStrikingIllusionistI18n } from "./042-jafar-striking-illusionist.i18n";
import { evasive } from "../../../helpers/abilities/evasive";
import { shift } from "../../../helpers/abilities/shift";

export const jafarStrikingIllusionist: CharacterCard = {
  id: "4un",
  canonicalId: "ci_7x1",
  reprints: ["set3-042"],
  cardType: "character",
  name: "Jafar",
  version: "Striking Illusionist",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "003",
  cardNumber: 42,
  rarity: "legendary",
  cost: 7,
  strength: 4,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_3ecab24376cb4cd5989309e000f797c1",
    tcgPlayer: 539158,
  },
  text: [
    {
      title: "Shift 5",
    },
    {
      title: "Evasive",
    },
    {
      title: "POWER BEYOND MEASURE",
      description:
        "During your turn, while this character is exerted, whenever you draw a card, gain 1 lore.",
    },
  ],
  classifications: ["Floodborn", "Villain", "Sorcerer"],
  abilities: [
    shift(5),
    evasive,
    {
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      id: "1nu-3",
      name: "POWER BEYOND MEASURE",
      text: "POWER BEYOND MEASURE During your turn, while this character is exerted, whenever you draw a card, gain 1 lore.",
      condition: {
        target: "SELF",
        type: "exerted",
      },
      trigger: {
        event: "draw",
        on: "YOU",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: jafarStrikingIllusionistI18n,
};
