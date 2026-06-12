import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { atlanticaConcertHall } from "@tcg/lorcana-cards/cards/009";

describe("ATLANTICA - Concert Hall - Songs cost 2 more to sing for all players while a character is here.", () => {
  // Effect type(s): move-cost-reduction, grant-abilities-while-here
  //
  // Test cases to cover:
  // 1. move-cost-reduction: reduces the ink cost to move characters to this location
  // 2. grant-abilities-while-here: grants abilities to all characters while they're at this location
  // 3. Abilities granted are active as long as a character is at the location
  // 4. Abilities are removed when the character leaves the location
  // 5. Multiple characters at the location all benefit simultaneously
  // 6. Location banished: all granted abilities and cost reductions immediately end
  // 7. Newly moved character immediately gains the location's granted abilities

  it.todo("It should apply bonuses or modifications to characters while they are at this location", () => {});
});
