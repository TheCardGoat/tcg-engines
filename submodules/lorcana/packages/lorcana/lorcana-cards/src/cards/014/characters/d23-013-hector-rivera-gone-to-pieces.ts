import type { CharacterCard } from "@tcg/lorcana-types";
import { hctorRiveraGoneToPiecesD23I18n } from "./d23-013-hector-rivera-gone-to-pieces.i18n";
import { singer } from "../../../helpers/abilities/singer";

// D23 promo reprint of 014-121 Héctor Rivera - Gone to Pieces.
// Per G-07 the abilities are copied verbatim from the base card.

export const hctorRiveraGoneToPiecesD23: CharacterCard = {
  id: "j1u",
  canonicalId: "ci_72S",
  slug: "lorcana-ci_72S",
  printings: [
    {
      id: "set14-d23-013",
      artId: "set14-d23-013",
      setCode: "set14",
      collectorNumber: "13",
      rarity: "special",
      imageUrl: "",
    },
  ],
  reprints: ["set14-d23-013", "set14-121"],
  cardType: "character",
  name: "Héctor Rivera",
  version: "Gone to Pieces",
  inkType: ["ruby"],
  franchise: "D23",
  set: "014",
  cardNumber: 13,
  rarity: "special",
  cost: 4,
  strength: 5,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_5f7b5237476649afba3b201770efe75f",
  },
  text: [
    {
      title: "Singer 6",
    },
    {
      title: "Feel the Music",
      description:
        "While you have a song card in your discard, this character gets +1 {L} and gains Evasive.",
    },
  ],
  classifications: ["Storyborn", "Mentor"],
  abilities: [
    singer(6),
    {
      id: "72S-1",
      name: "Feel the Music",
      type: "static",
      text: "Feel the Music While you have a song card in your discard, this character gets +1 {L}.",
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["discard"],
          cardType: "action",
          filters: [
            {
              type: "is-song",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
      },
    },
    {
      id: "72S-2",
      name: "Feel the Music",
      type: "static",
      text: "Feel the Music While you have a song card in your discard, this character gains Evasive.",
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["discard"],
          cardType: "action",
          filters: [
            {
              type: "is-song",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
      },
    },
  ],
  i18n: hctorRiveraGoneToPiecesD23I18n,
};
