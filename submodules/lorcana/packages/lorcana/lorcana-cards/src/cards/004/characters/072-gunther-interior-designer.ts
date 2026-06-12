import type { CharacterCard } from "@tcg/lorcana-types";
import { guntherInteriorDesignerI18n } from "./072-gunther-interior-designer.i18n";

export const guntherInteriorDesigner: CharacterCard = {
  id: "2U5",
  canonicalId: "ci_2U5",
  reprints: ["set4-072"],
  cardType: "character",
  name: "Gunther",
  version: "Interior Designer",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "004",
  cardNumber: 72,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_96a14bbf788e4a138b05f46f08c0fa47",
    tcgPlayer: 547774,
  },
  text: [
    {
      title: "SAD-EYED PUPPY",
      description:
        "When this character is challenged and banished, each opponent chooses one of their characters and returns that card to their hand.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [
    {
      id: "2U5-1",
      name: "SAD-EYED PUPPY",
      type: "triggered",
      sourceZones: ["play", "discard"],
      trigger: {
        challengeContext: { role: "defender" },
        event: "challenged-and-banished",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "return-to-hand",
        chosenBy: "opponent",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "SAD-EYED PUPPY When this character is challenged and banished, each opponent chooses one of their characters and returns that card to their hand.",
    },
  ],
  i18n: guntherInteriorDesignerI18n,
};
