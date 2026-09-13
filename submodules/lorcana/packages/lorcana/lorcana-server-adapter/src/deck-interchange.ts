import { defineGameDeckInterchangeAdapter } from "@tcg/shared/game-adapter";
import type { LorcanaFormatId } from "@tcg/lorcana-types";

function format(id: LorcanaFormatId, label: string) {
  return {
    id,
    label,
    sections: [
      {
        id: "main" as const,
        label: "Main Deck",
        roles: ["validation", "runtime"] as const,
        required: true,
        minimumCards: 60,
      },
    ],
  };
}

export const lorcanaDeckInterchangeAdapter = defineGameDeckInterchangeAdapter({
  game: "lorcana",
  defaultFormatId: "infinity",
  migrateV1: true,
  formats: {
    infinity: format("infinity", "Infinity"),
    "core-constructed": format("core-constructed", "Core Constructed"),
    "attack-of-the-vine": format("attack-of-the-vine", "Attack of the Vine"),
    "shimmering-skies": format("shimmering-skies", "Shimmering Skies"),
    "azurite-sea": format("azurite-sea", "Azurite Sea"),
    "archazias-island": format("archazias-island", "Archazia's Island"),
  } satisfies Record<LorcanaFormatId, ReturnType<typeof format>>,
});
