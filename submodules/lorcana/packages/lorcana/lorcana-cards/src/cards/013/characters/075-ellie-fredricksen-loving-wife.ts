import type { CharacterCard } from "@tcg/lorcana-types";
import { ellieFredricksenLovingWifeI18n } from "./075-ellie-fredricksen-loving-wife.i18n";

export const ellieFredricksenLovingWife: CharacterCard = {
  id: "c9O",
  canonicalId: "ci_c9O",
  slug: "lorcana-ci_c9O",
  printings: [
    {
      id: "set13-075",
      artId: "set13-075",
      setCode: "set13",
      collectorNumber: "75",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-075"],
  cardType: "character",
  name: "Ellie Fredricksen",
  version: "Loving Wife",
  inkType: ["emerald"],
  franchise: "Up",
  set: "013",
  cardNumber: 75,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_9e5ec9c5c5ae4ff68ec85f5390ec0e39",
  },
  text: [
    {
      title: "ADVENTUROUS HEART",
      description: "Whenever you play a location, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      type: "triggered",
      name: "ADVENTUROUS HEART",
      text: "ADVENTUROUS HEART Whenever you play a location, gain 1 lore.",
      trigger: {
        event: "play",
        on: "YOUR_LOCATIONS",
        timing: "whenever",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: ellieFredricksenLovingWifeI18n,
};
