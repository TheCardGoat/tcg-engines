import type { CharacterCard } from "@tcg/lorcana";

export const kuzcoSelfishEmperor: CharacterCard = {
  id: "c7f",
  cardType: "character",
  name: "Kuzco",
  version: "Selfish Emperor",
  fullName: "Kuzco - Selfish Emperor",
  inkType: ["sapphire"],
  franchise: "Emperors New Groove",
  set: "005",
  text: "OUTPLACEMENT When you play this character, you may put chosen item or location into its player's inkwell facedown and exerted.\nBY INVITE ONLY 4 {I} — Your other characters gain Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
  cost: 6,
  strength: 3,
  willpower: 5,
  lore: 2,
  cardNumber: 149,
  inkable: true,
  externalIds: {
    ravensburger: "2bfe4a1c3dbc8ce3314e8b370ec958cd749dd8e2",
  },
  abilities: [
    {
      id: "c7f-1",
      text: "OUTPLACEMENT When you play this character, you may put chosen item or location into its player's inkwell facedown and exerted.",
      name: "OUTPLACEMENT",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "put-into-inkwell",
          source: "chosen-card-in-play",
          exerted: true,
        },
      },
    },
    {
      id: "c7f-2",
      text: "BY INVITE ONLY {d} {I} — Your other characters gain Resist +{d} until the start of your next turn.",
      name: "BY INVITE ONLY",
      type: "activated",
      cost: {
        ink: 0,
      },
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 0,
        target: {
          controller: "you",
          excludeSelf: true,
        },
        duration: "until-start-of-next-turn",
      },
    },
  ],
  classifications: ["Storyborn", "King"],
};
