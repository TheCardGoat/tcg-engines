// CR 4.7.2: a character at a location can move only to another location.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "../../../../testing";
const origin = createMockLocation({ id: "move-origin", name: "Origin", cost: 0 });
const destination = createMockLocation({ id: "move-destination", name: "Destination", cost: 0 });
const guest = createMockCharacter({ id: "move-guest", name: "Guest", cost: 0, lore: 1 });
const pairMover = createMockCharacter({
  id: "pair-mover",
  name: "Pair Mover",
  cost: 0,
  abilities: [
    {
      type: "triggered",
      trigger: { event: "play", on: "SELF", timing: "when" },
      effect: {
        type: "optional",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "move-to-location",
              character: "ANOTHER_CHOSEN_CHARACTER_OF_YOURS",
              location: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["location"],
              },
              cost: "free",
            },
            {
              type: "move-to-location",
              character: "SELF",
              location: { ref: "previous-target" },
              cost: "free",
            },
            {
              type: "modify-stat",
              stat: "lore",
              modifier: 1,
              duration: "this-turn",
              target: { reference: "selected-first" },
            },
          ],
        },
      },
    },
  ],
});
describe("move-to-location", () => {
  for (const staged of [false, true]) {
    it(`rejects an unchanged destination before movement or bonus; staged=${staged}`, () => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [origin, destination, { card: guest, atLocation: origin }],
        hand: [pairMover],
      });
      expect(game.asPlayerOne().playCard(pairMover)).toBeSuccessfulCommand();
      if (staged)
        expect(
          game.asPlayerOne().resolvePendingByCard(pairMover, { resolveOptional: true }),
        ).toBeSuccessfulCommand();
      const rejected = game
        .asPlayerOne()
        .resolvePendingByCard(pairMover, { resolveOptional: true, targets: [guest, origin] });
      expect(rejected).not.toBeSuccessfulCommand();
      if (rejected.success) throw new Error("Current location must not be a movement destination");
      expect(rejected.errorCode).toBe("INVALID_MOVEMENT_DESTINATION");
      expect(game.asPlayerOne()).toBeAtLocation({ card: guest, location: origin });
      expect(game.asPlayerOne().getCardLocationId(pairMover)).toBeUndefined();
      expect(game.asPlayerOne().getCardLore(guest)).toBe(1);
      expect(
        game.asPlayerOne().resolvePendingByCard(pairMover, {
          resolveOptional: true,
          targets: [guest, destination],
        }),
      ).toBeSuccessfulCommand();
      expect(game.asPlayerOne()).toBeAtLocation({ card: guest, location: destination });
      expect(game.asPlayerOne()).toBeAtLocation({ card: pairMover, location: destination });
      expect(game.asPlayerOne().getCardLore(guest)).toBe(2);
    });
  }
  it("an automatic same-location effect produces no move event or per-move reward", () => {
    const arrival = createMockLocation({
      id: "arrival",
      name: "Arrival",
      cost: 0,
      abilities: [
        {
          type: "triggered",
          trigger: { event: "move", on: "CHARACTERS_HERE", timing: "whenever" },
          effect: { type: "gain-lore", amount: 10, target: "CONTROLLER" },
        },
      ],
    });
    const fixed = createMockCharacter({
      id: "fixed-mover",
      name: "Fixed Mover",
      cost: 0,
      abilities: [
        {
          type: "activated",
          cost: {},
          effect: {
            type: "move-to-location",
            character: "SELF",
            location: "YOUR_LOCATIONS",
            cost: "free",
            forEach: [{ type: "gain-lore", amount: 1, target: "CONTROLLER" }],
          },
        },
      ],
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [arrival, { card: fixed, atLocation: arrival }],
    });
    expect(game.asPlayerOne().activateAbility(fixed)).toBeSuccessfulCommand();
    expect(game.asPlayerOne()).toBeAtLocation({ card: fixed, location: arrival });
    expect(game.getLore("player_one")).toBe(0);
    expect(game.asPlayerOne().getBagCount()).toBe(0);
    expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });
});
