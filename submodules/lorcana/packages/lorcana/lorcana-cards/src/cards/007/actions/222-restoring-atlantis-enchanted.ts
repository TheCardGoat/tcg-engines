import type { ActionCard } from "@tcg/lorcana-types";
import { restoringAtlantisEnchantedI18n } from "./222-restoring-atlantis-enchanted.i18n";

export const restoringAtlantisEnchanted: ActionCard = {
  id: "eyb",
  canonicalId: "ci_ndm",
  slug: "lorcana-ci_ndm",
  printings: [
    {
      id: "set7-222-enchanted",
      artId: "ci_ndm-enchanted",
      setCode: "set7",
      collectorNumber: "222",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set7-201"],
  cardType: "action",
  name: "Restoring Atlantis",
  inkType: ["steel"],
  franchise: "Atlantis",
  set: "007",
  cardNumber: 222,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 5,
  inkable: false,
  externalIds: {
    lorcast: "crd_ad5f241dfb68479189af1ac3802327d7",
    tcgPlayer: "619750",
  },
  text: "Your characters can't be challenged until the start of your next turn.",
  abilities: [
    {
      effect: {
        duration: "until-start-of-next-turn",
        restriction: "cant-be-challenged",
        target: "CONTROLLER",
        type: "restriction",
      },
      id: "g4p-1",
      text: "Your characters can't be challenged until the start of your next turn.",
      type: "action",
    },
  ],
  i18n: restoringAtlantisEnchantedI18n,
};
