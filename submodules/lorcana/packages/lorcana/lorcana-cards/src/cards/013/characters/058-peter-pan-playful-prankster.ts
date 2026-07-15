import type { CharacterCard } from "@tcg/lorcana-types";
import { peterPanPlayfulPranksterI18n } from "./058-peter-pan-playful-prankster.i18n";

export const peterPanPlayfulPrankster: CharacterCard = {
  id: "rpe",
  canonicalId: "ci_rpe",
  slug: "lorcana-ci_rpe",
  printings: [
    {
      id: "set13-058",
      artId: "set13-058",
      setCode: "set13",
      collectorNumber: "58",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-058"],
  cardType: "character",
  name: "Peter Pan",
  version: "Playful Prankster",
  inkType: ["amethyst"],
  franchise: "Peter Pan",
  set: "013",
  cardNumber: 58,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_bba75cf2d3da48a09892b1fce921d9d6",
  },
  text: [
    {
      title: "STAY RIGHT THERE",
      description:
        "When you play this character, chosen opposing character can't ready at the start of their next turn.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "rpe-1",
      name: "STAY RIGHT THERE",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        duration: "their-next-turn",
        target: "CHOSEN_OPPOSING_CHARACTER",
      },
      text: "STAY RIGHT THERE When you play this character, chosen opposing character can't ready at the start of their next turn.",
    },
  ],
  i18n: peterPanPlayfulPranksterI18n,
};
