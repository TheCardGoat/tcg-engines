import type { CharacterCard } from "@tcg/lorcana-types";

export const kuzcoSelfishEmperor: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "put-into-inkwell",
          source: "chosen-card-in-play",
          exerted: true,
        },
      },
      id: "c7f-1",
      name: "OUTPLACEMENT",
      text: "OUTPLACEMENT When you play this character, you may put chosen item or location into its player's inkwell facedown and exerted.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
    {
      cost: {
        ink: 0,
      },
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 0,
        target: {
          selector: "all",
          count: "all",
          filter: [{ type: "owner", owner: "you" }],
          excludeSelf: true,
        },
        duration: "until-start-of-next-turn",
      },
      id: "c7f-2",
      name: "BY INVITE ONLY",
      text: "BY INVITE ONLY {d} {I} — Your other characters gain Resist +{d} until the start of your next turn.",
      type: "activated",
    },
  ],
  cardNumber: 149,
  cardType: "character",
  classifications: ["Storyborn", "King"],
  cost: 6,
  externalIds: {
    ravensburger: "2bfe4a1c3dbc8ce3314e8b370ec958cd749dd8e2",
  },
  franchise: "Emperors New Groove",
  fullName: "Kuzco - Selfish Emperor",
  id: "c7f",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  name: "Kuzco",
  set: "005",
  strength: 3,
  text: "OUTPLACEMENT When you play this character, you may put chosen item or location into its player's inkwell facedown and exerted.\nBY INVITE ONLY 4 {I} — Your other characters gain Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
  version: "Selfish Emperor",
  willpower: 5,
};
