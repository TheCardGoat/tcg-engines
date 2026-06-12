import type { CharacterCard } from "@tcg/lorcana-types";
import { almaMadrigalAcceptingGrandmotherI18n } from "./034-alma-madrigal-accepting-grandmother.i18n";

export const almaMadrigalAcceptingGrandmother: CharacterCard = {
  id: "s3D",
  canonicalId: "ci_s3D",
  reprints: ["set8-034"],
  cardType: "character",
  name: "Alma Madrigal",
  version: "Accepting Grandmother",
  inkType: ["amber", "amethyst"],
  franchise: "Encanto",
  set: "008",
  cardNumber: 34,
  rarity: "uncommon",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_387766e68940442bb6c5b7e29d18626f",
    tcgPlayer: 631374,
  },
  text: [
    {
      title: "THE MIRACLE IS YOU",
      description:
        "Once during your turn, whenever one or more of your characters sings a song, you may ready those characters.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Madrigal"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "all",
            count: "all",
            reference: "singers",
          },
          type: "ready",
        },
        type: "optional",
      },
      id: "1sw-1",
      name: "THE MIRACLE IS YOU Once",
      text: "THE MIRACLE IS YOU Once during your turn, whenever one or more of your characters sings a song, you may ready those characters.",
      trigger: {
        event: "sing",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
        restrictions: [
          {
            type: "once-per-turn",
          },
        ],
      },
      type: "triggered",
    },
  ],
  i18n: almaMadrigalAcceptingGrandmotherI18n,
};
