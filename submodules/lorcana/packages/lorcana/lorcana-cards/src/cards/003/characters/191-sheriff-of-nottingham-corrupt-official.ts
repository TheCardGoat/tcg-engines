import type { CharacterCard } from "@tcg/lorcana-types";
import { sheriffOfNottinghamCorruptOfficialI18n } from "./191-sheriff-of-nottingham-corrupt-official.i18n";

export const sheriffOfNottinghamCorruptOfficial: CharacterCard = {
  id: "0k3",
  canonicalId: "ci_0k3",
  reprints: ["set3-191"],
  cardType: "character",
  name: "Sheriff of Nottingham",
  version: "Corrupt Official",
  inkType: ["steel"],
  franchise: "Robin Hood",
  set: "003",
  cardNumber: 191,
  rarity: "common",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_989b5642c80e4a999f54f75e02a2fb13",
    tcgPlayer: 537942,
  },
  text: [
    {
      title: "TAXES SHOULD HURT",
      description:
        "Whenever you discard a card, you may deal 1 damage to chosen opposing character.",
    },
  ],
  classifications: ["Dreamborn", "Villain"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CHOSEN_OPPOSING_CHARACTER",
          type: "deal-damage",
        },
        type: "optional",
      },
      id: "0k3-1",
      name: "TAXES SHOULD HURT",
      text: "TAXES SHOULD HURT Whenever you discard a card, you may deal 1 damage to chosen opposing character.",
      trigger: {
        event: "discard",
        on: "CONTROLLER",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: sheriffOfNottinghamCorruptOfficialI18n,
};
