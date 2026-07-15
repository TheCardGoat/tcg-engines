import { describe, expect, it } from "bun:test";
import type { CardInstanceId } from "#core";
import type { LorcanaCardDefinition } from "@tcg/lorcana-types";
import { mickeyMouseArtfulRogue } from "../../../../lorcana-cards/src/cards/001/characters/088-mickey-mouse-artful-rogue";
import { getShiftRules, resolveShiftTargetCandidates } from "./play-card-rules";

describe("getShiftRules", () => {
  it("ignores unrelated non-keyword ability text when resolving bare Shift name targets", () => {
    expect(getShiftRules(mickeyMouseArtfulRogue)?.targetMode).toEqual({
      type: "name",
      name: "Mickey Mouse",
    });
  });

  it("lets advanced mimicry satisfy classification-based Shift targets", () => {
    const morph = "morph" as CardInstanceId;
    const ordinaryAlly = "ordinary-ally" as CardInstanceId;
    const definitions = {
      [morph]: {
        id: "morph",
        cardType: "character",
        name: "Morph",
        cost: 1,
        strength: 1,
        willpower: 1,
        lore: 1,
        inkable: true,
        classifications: ["Storyborn", "Ally", "Alien"],
        abilities: [
          {
            type: "static",
            name: "ADVANCED MIMICRY",
            text: "ADVANCED MIMICRY You can shift any character on top of this character.",
            effect: {
              chooser: "CONTROLLER",
              effect: {
                from: "hand",
                type: "play-card",
              },
              type: "optional",
            },
          },
        ],
      },
      [ordinaryAlly]: {
        id: "ordinary-ally",
        cardType: "character",
        name: "Ordinary Ally",
        cost: 1,
        strength: 1,
        willpower: 1,
        lore: 1,
        inkable: true,
        classifications: ["Storyborn", "Ally"],
      },
    };

    expect(
      resolveShiftTargetCandidates(
        { targetMode: { type: "classification", classification: "Madrigal" }, inkCost: 3 },
        [morph, ordinaryAlly],
        (id) => definitions[id] as LorcanaCardDefinition | undefined,
      ),
    ).toEqual([morph]);
  });
});
