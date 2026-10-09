import type { ActionCard } from "@tcg/lorcana-types";
import { inkExplosionI18n } from "./198-ink-explosion.i18n";

export const inkExplosion: ActionCard = {
  id: "Ati",
  canonicalId: "ci_Ati",
  slug: "lorcana-ci_Ati",
  printings: [
    {
      id: "set14-198",
      artId: "set14-198",
      setCode: "set14",
      collectorNumber: "198",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-198"],
  cardType: "action",
  name: "Ink Explosion",
  inkType: ["steel"],
  franchise: "Lorcana",
  set: "014",
  cardNumber: 198,
  rarity: "common",
  cost: 4,
  inkable: false,
  text: "Deal 4 damage to chosen character. Get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
  abilities: [
    {
      type: "action",
      text: "Deal 4 damage to chosen character. Get 1 ink drop.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "deal-damage",
            amount: 4,
            target: "CHOSEN_CHARACTER",
          },
          {
            type: "gain-ink-drop",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
    },
  ],
  i18n: inkExplosionI18n,
};
