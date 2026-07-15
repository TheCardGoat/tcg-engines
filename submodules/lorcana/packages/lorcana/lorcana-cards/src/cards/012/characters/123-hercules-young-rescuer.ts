import type { CharacterCard } from "@tcg/lorcana-types";
import { herculesYoungRescuerI18n } from "./123-hercules-young-rescuer.i18n";

export const herculesYoungRescuer: CharacterCard = {
  id: "osI",
  canonicalId: "ci_osI",
  slug: "lorcana-ci_osI",
  printings: [
    {
      id: "set12-123",
      artId: "set12-123",
      setCode: "set12",
      collectorNumber: "123",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set12-123"],
  cardType: "character",
  name: "Hercules",
  version: "Young Rescuer",
  inkType: ["ruby"],
  franchise: "Hercules",
  set: "012",
  cardNumber: 123,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_f3c83bbcb8b9497d84c5a04aa767c0fb",
    tcgPlayer: "692175",
  },
  text: [
    {
      title: "HEROIC SACRIFICE",
      description:
        "When you play this character, you may discard your hand. If you do, return a card from your discard to your hand.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
  abilities: [
    {
      id: "osI-1",
      name: "Heroic Sacrifice",
      type: "triggered",
      text: "Heroic Sacrifice When you play this character, you may discard your hand. If you do, return a card from your discard to your hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "discard",
              amount: "all",
              target: "CONTROLLER",
            },
            {
              type: "return-from-discard",
              target: "CONTROLLER",
              count: 1,
            },
          ],
        },
      },
    },
  ],
  i18n: herculesYoungRescuerI18n,
};
