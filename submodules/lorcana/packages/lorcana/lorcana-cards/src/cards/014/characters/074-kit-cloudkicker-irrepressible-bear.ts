import type { CharacterCard } from "@tcg/lorcana-types";
import { kitCloudkickerIrrepressibleBearI18n } from "./074-kit-cloudkicker-irrepressible-bear.i18n";

export const kitCloudkickerIrrepressibleBear: CharacterCard = {
  id: "bVP",
  canonicalId: "ci_bVP",
  slug: "lorcana-ci_bVP",
  printings: [
    {
      id: "set14-074",
      artId: "set14-074",
      setCode: "set14",
      collectorNumber: "74",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-074"],
  cardType: "character",
  name: "Kit Cloudkicker",
  version: "Irrepressible Bear",
  inkType: ["emerald"],
  franchise: "Talespin",
  set: "014",
  cardNumber: 74,
  rarity: "common",
  cost: 3,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_cd8368bcf3054b2992392cb7b63d5a5f",
  },
  text: [
    {
      title: "LUCKY DAY",
      description:
        "When you play this character, you and another chosen player each get 1 ink drop. (Each ink drop may be removed to pay 1 {I}.)",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "bVP-1",
      name: "LUCKY DAY",
      type: "triggered",
      text: "LUCKY DAY When you play this character, you and another chosen player each get 1 ink drop. (Each ink drop may be removed to pay 1 {I}.)",
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
  i18n: kitCloudkickerIrrepressibleBearI18n,
};
