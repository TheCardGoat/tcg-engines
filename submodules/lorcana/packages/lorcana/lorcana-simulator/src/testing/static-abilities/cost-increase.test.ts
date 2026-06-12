import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { gantuExperiencedEnforcer } from "@tcg/lorcana-cards/cards/007";

describe("DON'T GET ANY IDEAS - Gantu, Experienced Enforcer - Each player pays 2 {I} more to play actions or items. (This doesn't apply to singing songs.)", () => {
  // Test cases to cover:
  // 1. Your own actions cost 2 more to play while Gantu is in play
  // 2. Your own items cost 2 more to play while Gantu is in play
  // 3. Opponent's actions and items also cost 2 more (affects EACH player, not just opponent)
  // 4. Character cards are NOT affected (only actions and items)
  // 5. Songs played via singing (exerting a singer) are NOT affected (explicit exemption)
  // 6. When Gantu is banished, the cost increase is immediately removed
  // 7. Two Gantus in play stack the increase (+4 per action/item)

  it.todo("It should make each player pay 2 more ink to play actions or items", () => {});
});
