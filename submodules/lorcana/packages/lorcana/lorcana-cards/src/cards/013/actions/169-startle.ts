import type { ActionCard } from "@tcg/lorcana-types";
import { startleI18n } from "./169-startle.i18n";

export const startle: ActionCard = {
  id: "beG",
  canonicalId: "ci_beG",
  slug: "lorcana-ci_beG",
  printings: [
    {
      id: "set13-169",
      artId: "set13-169",
      setCode: "set13",
      collectorNumber: "169",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-169"],
  cardType: "action",
  name: "Startle",
  inkType: ["sapphire"],
  franchise: "Aladdin",
  set: "013",
  cardNumber: 169,
  rarity: "common",
  cost: 1,
  inkable: true,
  text: "Chosen character gets -3 {S} this turn.",
  abilities: [
    {
      type: "action",
      text: "Chosen character gets -3 {S} this turn.",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -3,
        duration: "this-turn",
        target: "CHOSEN_CHARACTER",
      },
    },
  ],
  i18n: startleI18n,
};
