import type { ActionCard } from "@tcg/lorcana-types";
import { _99PuppiesI18n } from "./024-99-puppies.i18n";

export const _99Puppies: ActionCard = {
  id: "V75",
  canonicalId: "ci_V75",
  reprints: ["set3-024"],
  cardType: "action",
  name: "99 Puppies",
  inkType: ["amber"],
  franchise: "101 Dalmatians",
  set: "003",
  cardNumber: 24,
  rarity: "uncommon",
  cost: 5,
  inkable: false,
  externalIds: {
    lorcast: "crd_56003cfee81148e9a2ceebe4136e4e06",
    tcgPlayer: 534480,
  },
  text: "Whenever one of your characters quests this turn, gain 1 lore.",
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
            target: "CONTROLLER",
            type: "gain-lore",
          },
        },
      },
    },
  ],
  i18n: _99PuppiesI18n,
};
