import type { CharacterCard } from "@tcg/lorcana-types";
import { mollyCunninghamRemembersToShareI18n } from "./073-molly-cunningham-remembers-to-share.i18n";

export const mollyCunninghamRemembersToShare: CharacterCard = {
  id: "gvL",
  canonicalId: "ci_gvL",
  slug: "lorcana-ci_gvL",
  printings: [
    {
      id: "set14-073",
      artId: "set14-073",
      setCode: "set14",
      collectorNumber: "73",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-073"],
  cardType: "character",
  name: "Molly Cunningham",
  version: "Remembers to Share",
  inkType: ["emerald"],
  franchise: "Talespin",
  set: "014",
  cardNumber: 73,
  rarity: "uncommon",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_998f0f99449b4903983d5f12f7eb3fde",
  },
  text: [
    {
      title: "SO FUN!",
      description:
        "When you play this character, you and another chosen player each get 1 ink drop. (Each ink drop may be removed to pay 1 {I}.)",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "gvL-1",
      name: "SO FUN!",
      type: "triggered",
      text: "SO FUN! When you play this character, you and another chosen player each get 1 ink drop. (Each ink drop may be removed to pay 1 {I}.)",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "gain-ink-drop",
            amount: 1,
            target: "CONTROLLER",
          },
          {
            type: "gain-ink-drop",
            amount: 1,
            target: { selector: "chosen", count: 1, excludeSelf: true },
          },
        ],
      },
    },
  ],
  i18n: mollyCunninghamRemembersToShareI18n,
};
