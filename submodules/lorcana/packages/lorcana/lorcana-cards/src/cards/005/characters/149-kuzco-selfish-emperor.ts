import type { CharacterCard } from "@tcg/lorcana-types";
import { kuzcoSelfishEmperorI18n } from "./149-kuzco-selfish-emperor.i18n";

export const kuzcoSelfishEmperor: CharacterCard = {
  id: "9lb",
  canonicalId: "ci_9lb",
  reprints: ["set5-149"],
  cardType: "character",
  name: "Kuzco",
  version: "Selfish Emperor",
  inkType: ["sapphire"],
  franchise: "Emperors New Groove",
  set: "005",
  cardNumber: 149,
  rarity: "common",
  cost: 6,
  strength: 3,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_b66ac79061b848eba1c927989cc2fd37",
    tcgPlayer: 561164,
  },
  text: [
    {
      title: "OUTPLACEMENT",
      description:
        "When you play this character, you may put chosen item or location into its player's inkwell facedown and exerted.",
    },
    {
      title: "BY INVITE ONLY 4",
      description: "{I} — Your other characters gain Resist +1 until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "King"],
  abilities: [
    {
      id: "c7f-1",
      text: "OUTPLACEMENT When you play this character, you may put chosen item or location into its player's inkwell facedown and exerted.",
      name: "OUTPLACEMENT",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          exerted: true,
          facedown: true,
          source: "chosen-card-in-play",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["item", "location"],
          },
          type: "put-into-inkwell",
        },
        type: "optional",
      },
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      id: "c7f-2",
      text: "BY INVITE ONLY 4 {I} — Your other characters gain Resist +1 until the start of your next turn.",
      name: "BY INVITE ONLY",
      type: "activated",
      cost: {
        ink: 4,
      },
      effect: {
        duration: "until-start-of-next-turn",
        keyword: "Resist",
        target: {
          cardTypes: ["character"],
          count: "all",
          owner: "you",
          selector: "all",
          zones: ["play"],
          excludeSelf: true,
        },
        type: "gain-keyword",
        value: 1,
      },
    },
  ],
  i18n: kuzcoSelfishEmperorI18n,
};
