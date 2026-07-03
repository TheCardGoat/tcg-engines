import type { CharacterCard } from "@tcg/lorcana-types";
import { drBushrootEvilBotanistI18n } from "./092-dr-bushroot-evil-botanist.i18n";

import { ward } from "../../../helpers/abilities/ward";

export const drBushrootEvilBotanist: CharacterCard = {
  id: "GWn",
  canonicalId: "ci_GWn",
  slug: "lorcana-ci_GWn",
  printings: [
    {
      id: "set13-092",
      artId: "set13-092",
      setCode: "set13",
      collectorNumber: "92",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-092"],
  cardType: "character",
  name: "Dr. Bushroot",
  version: "Evil Botanist",
  inkType: ["emerald"],
  franchise: "Darkwing Duck",
  set: "013",
  cardNumber: 92,
  rarity: "rare",
  cost: 5,
  strength: 4,
  willpower: 3,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_d156ffc335d648a88f4ee299595188e3",
  },
  text: [
    {
      title: "Ward",
    },
    {
      title: "FAIR IS FAIR",
      description:
        "Whenever this character is challenged, chosen opponent chooses and discards a card.",
    },
  ],
  classifications: ["Storyborn", "Super", "Villain"],
  abilities: [
    ward,
    {
      type: "triggered",
      name: "FAIR IS FAIR",
      text: "Whenever this character is challenged, chosen opponent chooses and discards a card.",
      trigger: {
        event: "challenged",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "discard",
        amount: 1,
        from: "hand",
        target: "OPPONENT",
        chosenBy: "TARGET",
      },
    },
  ],
  i18n: drBushrootEvilBotanistI18n,
};
