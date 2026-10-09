import type { CharacterCard } from "@tcg/lorcana-types";
import { horaceClumsyClodI18n } from "./082-horace-clumsy-clod.i18n";

export const horaceClumsyClod: CharacterCard = {
  id: "lBa",
  canonicalId: "ci_lBa",
  slug: "lorcana-ci_lBa",
  printings: [
    {
      id: "set14-082",
      artId: "set14-082",
      setCode: "set14",
      collectorNumber: "82",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-082"],
  cardType: "character",
  name: "Horace",
  version: "Clumsy Clod",
  inkType: ["emerald"],
  franchise: "101 Dalmatians",
  set: "014",
  cardNumber: 82,
  rarity: "common",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e633f88196544f4885ad5bc2403e00f3",
  },
  text: [
    {
      title: "BUNGLED IT",
      description:
        "When you play this character, deal 1 damage to chosen opposing damaged character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "lBa-1",
      name: "BUNGLED IT",
      type: "triggered",
      text: "BUNGLED IT When you play this character, deal 1 damage to chosen opposing damaged character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "deal-damage",
        amount: 1,
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
          filters: [{ type: "status", status: "damaged" }],
        },
      },
    },
  ],
  i18n: horaceClumsyClodI18n,
};
