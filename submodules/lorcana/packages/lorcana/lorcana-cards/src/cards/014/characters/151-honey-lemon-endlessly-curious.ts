import type { CharacterCard } from "@tcg/lorcana-types";
import { honeyLemonEndlesslyCuriousI18n } from "./151-honey-lemon-endlessly-curious.i18n";

export const honeyLemonEndlesslyCurious: CharacterCard = {
  id: "sMn",
  canonicalId: "ci_sMn",
  slug: "lorcana-ci_sMn",
  printings: [
    {
      id: "set14-151",
      artId: "set14-151",
      setCode: "set14",
      collectorNumber: "151",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-151"],
  cardType: "character",
  name: "Honey Lemon",
  version: "Endlessly Curious",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "014",
  cardNumber: 151,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_616a995dbb1f4084beb40ed36986b1e1",
  },
  text: [
    {
      title: "SHOCKING BREAKTHROUGH",
      description:
        "Whenever this character quests, you pay 1 {I} less for the next item you play this turn.",
    },
  ],
  classifications: ["Storyborn", "Super", "Hero", "Inventor"],
  abilities: [
    {
      id: "honey-lemon-curious-1",
      name: "SHOCKING BREAKTHROUGH",
      type: "triggered",
      text: "SHOCKING BREAKTHROUGH Whenever this character quests, you pay 1 {I} less for the next item you play this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "cost-reduction",
        amount: 1,
        cardType: "item",
        duration: "next-play-this-turn",
        target: "CONTROLLER",
      },
    },
  ],
  i18n: honeyLemonEndlesslyCuriousI18n,
};
