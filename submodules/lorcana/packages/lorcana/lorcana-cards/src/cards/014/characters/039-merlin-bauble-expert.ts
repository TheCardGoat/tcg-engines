import type { CharacterCard } from "@tcg/lorcana-types";
import { merlinBaubleExpertI18n } from "./039-merlin-bauble-expert.i18n";

export const merlinBaubleExpert: CharacterCard = {
  id: "l5w",
  canonicalId: "ci_l5w",
  slug: "lorcana-ci_l5w",
  printings: [
    {
      id: "set14-039",
      artId: "set14-039",
      setCode: "set14",
      collectorNumber: "39",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-039"],
  cardType: "character",
  name: "Merlin",
  version: "Bauble Expert",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "014",
  cardNumber: 39,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_a2aa87150aae4913b5a8e513098a77b7",
  },
  text: [
    {
      title: "RAW MATERIAL",
      description:
        "When you play this character, if you have a character named Arthur in play, get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Sorcerer"],
  abilities: [
    {
      id: "l5w-1",
      name: "RAW MATERIAL",
      type: "triggered",
      text: "RAW MATERIAL When you play this character, if you have a character named Arthur in play, get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "has-named-character",
        name: "Arthur",
        controller: "you",
      },
      effect: {
        type: "gain-ink-drop",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: merlinBaubleExpertI18n,
};
