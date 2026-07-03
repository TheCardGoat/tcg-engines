import type { CharacterCard } from "@tcg/lorcana-types";
import { scarVengefulLionEnchantedI18n } from "./212-scar-vengeful-lion-enchanted.i18n";

import { ward } from "../../../helpers/abilities/ward";

export const scarVengefulLionEnchanted: CharacterCard = {
  id: "nHT",
  canonicalId: "ci_f3P",
  slug: "lorcana-ci_f3P",
  printings: [
    {
      id: "set5-212-enchanted",
      artId: "ci_f3P-enchanted",
      setCode: "set5",
      collectorNumber: "212",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set5-093"],
  cardType: "character",
  name: "Scar",
  version: "Vengeful Lion",
  inkType: ["emerald"],
  franchise: "Lion King",
  set: "005",
  cardNumber: 212,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 4,
  strength: 4,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e382f2cee40343d7ae3faed897045a66",
    tcgPlayer: "561980",
  },
  text: [
    {
      title: "Ward",
    },
    {
      title: "LIFE'S NOT FAIR, IS IT?",
      description:
        "Whenever one of your characters challenges a damaged character, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    ward,
    {
      id: "15b-2",
      name: "LIFE'S NOT FAIR, IS IT?",
      text: "LIFE'S NOT FAIR, IS IT? Whenever one of your characters challenges a damaged character, you may draw a card.",
      type: "triggered",
      trigger: {
        event: "challenge",
        timing: "whenever",
        on: "YOUR_CHARACTERS",
        defender: {
          filters: [{ type: "damaged" }],
        },
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
    },
  ],
  i18n: scarVengefulLionEnchantedI18n,
};
