import type { CharacterCard } from "@tcg/lorcana-types";
import { lumpyHunnyDruidI18n } from "./042-lumpy-hunny-druid.i18n";

export const lumpyHunnyDruid: CharacterCard = {
  id: "K9Q",
  canonicalId: "ci_K9Q",
  slug: "lorcana-ci_K9Q",
  printings: [
    {
      id: "set13-042",
      artId: "set13-042",
      setCode: "set13",
      collectorNumber: "42",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-042"],
  cardType: "character",
  name: "Lumpy",
  version: "Hunny Druid",
  inkType: ["amethyst"],
  franchise: "Winnie the Pooh",
  set: "013",
  cardNumber: 42,
  rarity: "uncommon",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_57a4d6e90d224dd7923ff2d0c1acee92",
  },
  text: [
    {
      title: "WELCOME HEALING",
      description:
        "When you play this character, you may move up to 2 damage from chosen character to chosen opposing character.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Hunny"],
  abilities: [
    {
      type: "triggered",
      name: "WELCOME HEALING",
      text: "WELCOME HEALING When you play this character, you may move up to 2 damage from chosen character to chosen opposing character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "move-damage",
          amount: { type: "up-to", value: 2 },
          from: "CHOSEN_CHARACTER",
          to: "CHOSEN_OPPOSING_CHARACTER",
        },
      },
    },
  ],
  i18n: lumpyHunnyDruidI18n,
};
