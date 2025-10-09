import type { UnitCardDefinition } from "../../card-types";

export const DracSleeves: UnitCardDefinition = {
  id: "st03-005",
  name: "Dra-C (Sleeves)",
  cardNumber: "ST03-005",
  setCode: "ST03",
  cardType: "UNIT",
  rarity: "common",
  color: "red",
  level: 1,
  cost: 1,
  text: "-",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST03-005.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: 1,
  hp: 2,
  zones: ["space"],
  traits: ["neo", "zeon"],
  linkRequirements: ["-"],
  abilities: [
    {
      description: "-",
      effect: {
        type: "UNKNOWN",
        rawText: "-",
      },
    },
  ],
};
