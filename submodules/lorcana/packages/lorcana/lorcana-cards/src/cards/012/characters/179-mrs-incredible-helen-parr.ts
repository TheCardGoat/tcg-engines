import type { CharacterCard } from "@tcg/lorcana-types";
import { mrsIncredibleHelenParrI18n } from "./179-mrs-incredible-helen-parr.i18n";

export const mrsIncredibleHelenParr: CharacterCard = {
  id: "I8E",
  canonicalId: "ci_I8E",
  slug: "lorcana-ci_I8E",
  printings: [
    {
      id: "set12-179",
      artId: "set12-179",
      setCode: "set12",
      collectorNumber: "179",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set12-179"],
  cardType: "character",
  name: "Mrs. Incredible",
  version: "Helen Parr",
  inkType: ["steel"],
  franchise: "Incredibles",
  set: "012",
  cardNumber: 179,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_0aa8e64527f24ea78b59afcd62f71a4b",
    tcgPlayer: "692195",
  },
  text: [
    {
      title: "PEP TALK",
      description:
        "When you play this character, chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
    },
  ],
  classifications: ["Storyborn", "Super", "Hero"],
  abilities: [
    {
      id: "I8E-1",
      name: "PEP TALK",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        value: 2,
        duration: "this-turn",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
  i18n: mrsIncredibleHelenParrI18n,
};
