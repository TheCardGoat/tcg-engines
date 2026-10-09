import type { ItemCard } from "@tcg/lorcana-types";
import { jukeboxI18n } from "./134-jukebox.i18n";

export const jukebox: ItemCard = {
  id: "uvh",
  canonicalId: "ci_uvh",
  slug: "lorcana-ci_uvh",
  printings: [
    {
      id: "set14-134",
      artId: "set14-134",
      setCode: "set14",
      collectorNumber: "134",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-134"],
  cardType: "item",
  name: "Jukebox",
  inkType: ["ruby"],
  franchise: "Lorcana",
  set: "014",
  cardNumber: 134,
  rarity: "rare",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_5dc5db4d928b415e92f2202aa861f8bf",
  },
  text: [
    {
      title: "ON REPEAT",
      description:
        "Once during your turn, whenever you play a song, if it has the same name as another card in your discard, you may ready chosen character. If you do, they can't quest for the rest of this turn.",
    },
  ],
  abilities: [
    {
      id: "jukebox-1",
      name: "ON REPEAT",
      type: "triggered",
      text: "ON REPEAT Once during your turn, whenever you play a song, if it has the same name as another card in your discard, you may ready chosen character. If you do, they can't quest for the rest of this turn.",
      condition: {
        type: "played-card-name",
        zone: "discard",
        excludeSelf: true,
      },
      trigger: {
        event: "play",
        on: {
          cardType: "song",
          controller: "you",
        },
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
          {
            type: "once-per-turn",
          },
        ],
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "ready",
              target: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["character"],
              },
            },
            {
              type: "conditional",
              condition: { type: "if-you-do" },
              then: {
                type: "restriction",
                restriction: "cant-quest",
                target: { ref: "previous-target" },
                duration: "this-turn",
              },
            },
          ],
        },
      },
    },
  ],
  i18n: jukeboxI18n,
};
