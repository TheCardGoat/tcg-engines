import type { CharacterCard } from "@tcg/lorcana-types";
import { lionheartIncumbentMayorI18n } from "./018-lionheart-incumbent-mayor.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const lionheartIncumbentMayor: CharacterCard = {
  id: "eff",
  canonicalId: "ci_eff",
  slug: "lorcana-ci_eff",
  printings: [
    {
      id: "set14-018",
      artId: "set14-018",
      setCode: "set14",
      collectorNumber: "18",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-018"],
  cardType: "character",
  name: "Lionheart",
  version: "Incumbent Mayor",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "014",
  cardNumber: 18,
  rarity: "rare",
  cost: 6,
  strength: 4,
  willpower: 7,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_7cedada74484495e959d935b6a17b138",
  },
  text: [
    {
      title: "Bodyguard",
    },
    {
      title: "APPROVAL RATING",
      description: "When you play this character, up to 2 chosen characters get +1 {L} this turn.",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    bodyguard,
    {
      id: "eff-2",
      name: "APPROVAL RATING",
      type: "triggered",
      text: "APPROVAL RATING When you play this character, up to 2 chosen characters get +1 {L} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        duration: "this-turn",
        target: {
          selector: "chosen",
          count: { upTo: 2 },
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
  i18n: lionheartIncumbentMayorI18n,
};
