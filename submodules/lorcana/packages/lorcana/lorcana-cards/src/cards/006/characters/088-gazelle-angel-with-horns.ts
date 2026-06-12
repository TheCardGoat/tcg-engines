import type { CharacterCard } from "@tcg/lorcana-types";
import { gazelleAngelWithHornsI18n } from "./088-gazelle-angel-with-horns.i18n";

export const gazelleAngelWithHorns: CharacterCard = {
  id: "pGq",
  canonicalId: "ci_pGq",
  reprints: ["set6-088"],
  cardType: "character",
  name: "Gazelle",
  version: "Angel with Horns",
  inkType: ["emerald"],
  franchise: "Zootropolis",
  set: "006",
  cardNumber: 88,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c53a704a909445f5b2837b51f29faa47",
    tcgPlayer: 591117,
  },
  text: [
    {
      title: "YOU ARE A REALLY HOT DANCER",
      description:
        "When you play this character, chosen character gains Evasive until the start of your next turn.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [
    {
      effect: {
        keyword: "Evasive",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
      },
      id: "1b1-1",
      name: "YOU ARE A REALLY HOT DANCER",
      text: "YOU ARE A REALLY HOT DANCER When you play this character, chosen character gains Evasive until the start of your next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: gazelleAngelWithHornsI18n,
};
