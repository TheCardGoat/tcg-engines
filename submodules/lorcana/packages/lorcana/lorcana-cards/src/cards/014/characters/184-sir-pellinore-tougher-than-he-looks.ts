import type { CharacterCard } from "@tcg/lorcana-types";
import { challenger } from "../../../helpers/abilities";
import { sirPellinoreTougherThanHeLooksI18n } from "./184-sir-pellinore-tougher-than-he-looks.i18n";

export const sirPellinoreTougherThanHeLooks: CharacterCard = {
  id: "JzV",
  canonicalId: "ci_JzV",
  slug: "lorcana-ci_JzV",
  printings: [
    {
      id: "set14-184",
      artId: "set14-184",
      setCode: "set14",
      collectorNumber: "184",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-184"],
  cardType: "character",
  name: "Sir Pellinore",
  version: "Tougher Than He Looks",
  inkType: ["steel"],
  franchise: "Sword in the Stone",
  set: "014",
  cardNumber: 184,
  rarity: "uncommon",
  cost: 3,
  strength: 1,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_990ee1aefecf44a4bf36d98ed5b82fab",
  },
  text: [
    {
      title: "Challenger +2",
    },
    {
      title: "SPOILS OF VICTORY",
      description:
        "During your turn, whenever this character banishes another character in a challenge, get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
    },
  ],
  classifications: ["Dreamborn", "Knight"],
  abilities: [
    challenger(2),
    {
      id: "pellinore-1",
      name: "SPOILS OF VICTORY",
      type: "triggered",
      text: "SPOILS OF VICTORY During your turn, whenever this character banishes another character in a challenge, get 1 ink drop.",
      trigger: {
        event: "banish-in-challenge",
        on: "SELF",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      effect: {
        type: "gain-ink-drop",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: sirPellinoreTougherThanHeLooksI18n,
};
