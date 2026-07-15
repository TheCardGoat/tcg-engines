import type { ActionCard } from "@tcg/lorcana-types";
import { lookWhatYouveDoneI18n } from "./200-look-what-youve-done.i18n";

export const lookWhatYouveDone: ActionCard = {
  id: "3rW",
  canonicalId: "ci_3rW",
  slug: "lorcana-ci_3rW",
  printings: [
    {
      id: "set13-200",
      artId: "set13-200",
      setCode: "set13",
      collectorNumber: "200",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-200"],
  cardType: "action",
  name: "Look What You've Done",
  inkType: ["steel"],
  franchise: "Tangled",
  set: "013",
  cardNumber: 200,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_73a3b09749fa4a318ee0432abc9da30a",
  },
  text: "Deal 2 damage to chosen character. During your turn, when you discard this card, you may play it from your discard. (You pay all costs.)",
  abilities: [
    {
      type: "action",
      text: "Deal 2 damage to chosen character.",
      effect: {
        type: "deal-damage",
        amount: 2,
        target: "CHOSEN_CHARACTER",
      },
    },
    {
      type: "triggered",
      sourceZones: ["discard"],
      name: "DURING YOUR TURN",
      text: "During your turn, when you discard this card, you may play it from your discard. (You pay all costs.)",
      trigger: {
        event: "discard",
        on: "SELF",
        timing: "when",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      autoResolve: true,
      effect: {
        type: "enable-play-from-discard",
        source: "trigger-subject",
        duration: "this-turn",
        cardType: "action",
      },
    },
  ],
  i18n: lookWhatYouveDoneI18n,
};
