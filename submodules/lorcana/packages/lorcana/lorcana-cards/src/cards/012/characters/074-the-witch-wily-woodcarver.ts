import type { CharacterCard } from "@tcg/lorcana-types";
import { theWitchWilyWoodcarverI18n } from "./074-the-witch-wily-woodcarver.i18n";

export const theWitchWilyWoodcarver: CharacterCard = {
  id: "S7a",
  canonicalId: "ci_S7a",
  slug: "lorcana-ci_S7a",
  printings: [
    {
      id: "set12-074",
      artId: "set12-074",
      setCode: "set12",
      collectorNumber: "74",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set12-074"],
  cardType: "character",
  name: "The Witch",
  version: "Wily Woodcarver",
  inkType: ["emerald"],
  franchise: "Brave",
  set: "012",
  cardNumber: 74,
  rarity: "common",
  cost: 5,
  strength: 4,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_897e8937b42e46a5b0a3710a1d7617d5",
    tcgPlayer: "690534",
  },
  text: [
    {
      title: "UNSATISFIED CUSTOMERS",
      description: "Whenever this character is challenged, each opponent loses 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Sorcerer"],
  abilities: [
    {
      effect: {
        amount: 1,
        target: "EACH_OPPONENT",
        type: "lose-lore",
      },
      id: "s7a-1",
      name: "UNSATISFIED CUSTOMERS",
      text: "UNSATISFIED CUSTOMERS Whenever this character is challenged, each opponent loses 1 lore.",
      trigger: {
        event: "challenged",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: theWitchWilyWoodcarverI18n,
};
