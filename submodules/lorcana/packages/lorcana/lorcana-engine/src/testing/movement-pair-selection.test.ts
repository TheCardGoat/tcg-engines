// CR 4.7.1 and 6.7.2: resolve each required typed movement choice before acting.
import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter, createMockLocation } from "./index";
const source = createMockCharacter({
  id: "movement-source",
  name: "Mover",
  cost: 1,
  abilities: [
    {
      type: "triggered",
      trigger: { event: "play", on: "SELF", timing: "when" },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
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
const ally = createMockCharacter({ id: "movement-ally", name: "Ally", cost: 1, lore: 1 });
const destination = createMockLocation({
  id: "movement-location",
  name: "Destination",
  cost: 1,
  moveCost: 5,
});
const second = createMockLocation({ id: "movement-second", name: "Second", cost: 1, moveCost: 5 });
describe("movement choice requires each typed slot", () => {
  for (const deferred of [false, true])
    for (const duplicate of [false, true])
      it(`locations alone cannot move the source (pending ${deferred}; duplicate ${duplicate})`, () => {
        const game = LorcanaMultiplayerTestEngine.createWithFixture({
          hand: [source],
          play: [ally, destination, second],
          inkwell: 1,
        });
        expect(game.asPlayerOne().playCard(source)).toBeSuccessfulCommand();
        if (deferred)
          expect(
            game.asPlayerOne().resolvePendingByCard(source, { resolveOptional: true }),
          ).toBeSuccessfulCommand();
        expect(
          game.asPlayerOne().resolvePendingByCard(source, {
            resolveOptional: true,
            targets: [destination, duplicate ? destination : second],
          }),
        ).not.toBeSuccessfulCommand();
        expect(game.asPlayerOne().getCardLocationId(source)).toBeUndefined();
        expect(game.asPlayerOne().getCardLocationId(ally)).toBeUndefined();
        expect(game.asPlayerOne().getCardLore(ally)).toBe(1);
        expect(
          game.asPlayerOne().getPendingEffects().length + game.asPlayerOne().getBagEffects().length,
        ).toBeGreaterThan(0);
        expect(
          game
            .asPlayerOne()
            .resolvePendingByCard(source, { resolveOptional: true, targets: [ally, destination] }),
        ).toBeSuccessfulCommand();
        expect(game.asPlayerOne()).toBeAtLocation({ card: source, location: destination });
        expect(game.asPlayerOne()).toBeAtLocation({ card: ally, location: destination });
        expect(game.asPlayerOne().getCardLore(ally)).toBe(2);
      });
});
