import type { CharacterCard } from "@tcg/lorcana-types";
import { jasperCommonCrookI18n } from "./081-jasper-common-crook.i18n";

export const jasperCommonCrook: CharacterCard = {
  id: "gsE",
  canonicalId: "ci_gsE",
  reprints: ["set1-081"],
  cardType: "character",
  name: "Jasper",
  version: "Common Crook",
  inkType: ["emerald"],
  franchise: "101 Dalmatians",
  set: "001",
  cardNumber: 81,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_1dd05220d5994e3181153d33340718fc",
    tcgPlayer: 507498,
  },
  text: [
    {
      title: "PUPPYNAPPING",
      description:
        "Whenever this character quests, chosen opposing character can't quest during their next turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "gsE-1",
      name: "PUPPYNAPPING",
      text: "PUPPYNAPPING Whenever this character quests, chosen opposing character can't quest during their next turn.",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "restriction",
        duration: "next-turn",
        restriction: "cant-quest",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
  i18n: jasperCommonCrookI18n,
};
