import type { ActionCard } from "@tcg/lorcana-types";
import { stealFromTheRichI18n } from "./097-steal-from-the-rich.i18n";

export const stealFromTheRich: ActionCard = {
  id: "mkJ",
  canonicalId: "ci_mkJ",
  reprints: ["set1-097"],
  cardType: "action",
  name: "Steal from the Rich",
  inkType: ["emerald"],
  franchise: "Robin Hood",
  set: "001",
  cardNumber: 97,
  rarity: "rare",
  cost: 5,
  inkable: false,
  externalIds: {
    lorcast: "crd_cc2d13ea26124968b44151ab66a7a343",
    tcgPlayer: 508773,
  },
  text: "Whenever one of your characters quests this turn, each opponent loses 1 lore.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "create-triggered-ability",
        lifecycle: {
          kind: "floating",
          duration: "this-turn",
        },
        ability: {
          trigger: {
            event: "quest",
            on: "YOUR_CHARACTERS",
            timing: "whenever",
          },
          effect: {
            amount: 1,
            target: "EACH_OPPONENT",
            type: "lose-lore",
          },
        },
      },
    },
  ],
  i18n: stealFromTheRichI18n,
};
