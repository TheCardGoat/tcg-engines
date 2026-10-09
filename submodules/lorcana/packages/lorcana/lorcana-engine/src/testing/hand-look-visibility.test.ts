import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO, createMockCharacter } from ".";

describe("hand inspection visibility", () => {
  for (const visibility of [undefined, "all", "controller"] as const) {
    it(`uses ${visibility ?? "default public"} visibility without moving hand cards`, () => {
      const source = createMockCharacter({
        id: `hand-inspector-${visibility}`,
        name: "Inspector",
        cost: 1,
        abilities: [
          {
            type: "triggered",
            trigger: { event: "play", on: "SELF", timing: "when" },
            effect: {
              type: "reveal-hand",
              target: "OPPONENT",
              ...(visibility ? { visibility } : {}),
            },
          },
        ],
      });
      const secret = createMockCharacter({ id: "hand-secret", name: "Secret", cost: 1 });
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        { hand: [source], inkwell: 1 },
        { hand: [secret] },
      );
      expect(g.asPlayerOne().playCard(source)).toBeSuccessfulCommand();
      const ids = g.getCardInstanceIdsInZone("hand", PLAYER_TWO);
      const windows = g.getAuthoritativeState().ctx.zones.reveals.active;
      expect(windows).toHaveLength(1);
      expect(windows[0]?.visibleTo).toEqual(visibility === "controller" ? [PLAYER_ONE] : "all");
      expect(windows[0]?.cardIDs).toEqual(ids);
      expect(g.asPlayerTwo().getCardZone(secret)).toBe("hand");
      expect(g.getAuthoritativeState().ctx.zones.private.cardMeta[ids[0]!]?.revealed === true).toBe(
        visibility !== "controller",
      );
    });
  }
});
