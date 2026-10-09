import type { CharacterCard } from "@tcg/lorcana-types";
import { taVictoriaDisapprovingAncestorI18n } from "./042-tia-victoria-disapproving-ancestor.i18n";

export const taVictoriaDisapprovingAncestor: CharacterCard = {
  id: "q7N",
  canonicalId: "ci_q7N",
  slug: "lorcana-ci_q7N",
  printings: [
    {
      id: "set14-042",
      artId: "set14-042",
      setCode: "set14",
      collectorNumber: "42",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-042"],
  cardType: "character",
  name: "Tía Victoria",
  version: "Disapproving Ancestor",
  inkType: ["amethyst"],
  franchise: "Coco",
  set: "014",
  cardNumber: 42,
  rarity: "common",
  cost: 6,
  strength: 4,
  willpower: 7,
  lore: 2,
  inkable: true,
  text: [
    {
      title: "Withering Glare",
      description:
        "When you play this character, chosen opposing character can't ready at the start of their next turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "q7N-1",
      name: "Withering Glare",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "restriction",
        restriction: "cant-ready-at-start-of-turn",
        duration: "their-next-turn",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "opponent",
          selector: "chosen",
          zones: ["play"],
        },
      },
      text: "Withering Glare When you play this character, chosen opposing character can't ready at the start of their next turn.",
    },
  ],
  i18n: taVictoriaDisapprovingAncestorI18n,
};
