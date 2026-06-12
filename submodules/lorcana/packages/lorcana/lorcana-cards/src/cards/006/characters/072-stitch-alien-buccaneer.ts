import type { CharacterCard } from "@tcg/lorcana-types";
import { stitchAlienBuccaneerI18n } from "./072-stitch-alien-buccaneer.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const stitchAlienBuccaneer: CharacterCard = {
  id: "z1V",
  canonicalId: "ci_z1V",
  reprints: ["set6-072"],
  cardType: "character",
  name: "Stitch",
  version: "Alien Buccaneer",
  inkType: ["emerald"],
  franchise: "Lilo and Stitch",
  set: "006",
  cardNumber: 72,
  rarity: "rare",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_efcb250575354ffd8cdce9e8c45d52bf",
    tcgPlayer: 578176,
  },
  text: [
    {
      title: "Shift 3",
    },
    {
      title: "READY FOR ACTION",
      description:
        "When you play this character, if you used Shift to play him, you may put an action card from your discard on the top of your deck.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Alien", "Pirate"],
  abilities: [
    shift(3),
    {
      condition: {
        type: "used-shift",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "return-from-discard",
          cardType: "action",
          destination: "top-of-deck",
          target: "CONTROLLER",
          count: 1,
        },
      },
      id: "19n-2",
      name: "READY FOR ACTION",
      text: "READY FOR ACTION When you play this character, if you used Shift to play him, you may put an action card from your discard on the top of your deck.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: stitchAlienBuccaneerI18n,
};
