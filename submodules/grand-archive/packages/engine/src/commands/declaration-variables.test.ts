import { expect, it } from "vitest";
import { spiritOfWater } from "@tcg/grand-archive-cards";
import type { GrandArchiveCard, GrandArchiveExecutableAbility } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "../testing/test-engine.ts";
import {
  describeGrandArchiveDeclarationVariables,
  listGrandArchiveLegalCommands,
} from "./legal-commands.ts";

const zeroBound: GrandArchiveCard<GrandArchiveExecutableAbility> = {
  canonicalId: "zero-bound",
  slug: "zero-bound",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zero-bound:face:default",
      catalogId: "zero-bound",
      name: "Zero Bound",
      cost: { kind: "reserve", amount: 0 },
      typeLine: {
        types: ["ACTION"],
        supertypes: [],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SKILL"],
      },
      elements: ["NORM"],
      stats: {},
      speed: "fast",
      rulesText: "Choose X. X must be 0.",
      abilities: [
        {
          id: "zero-bound-a1",
          kind: "card-resolution",
          text: "Choose X. X must be 0.",
          variables: [{ symbol: "X", kind: "chosen", minimum: 0, maximum: 0 }],
          effect: { kind: "no-op" },
        },
      ],
    },
  },
};

it("treats a literal maximum of zero as a bound in forms, automation and public actions", () => {
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: { champion: spiritOfWater, zones: { hand: [zeroBound] } },
    playerTwo: { champion: spiritOfWater },
  });
  const player = game.player("player-one");
  const cardId = player.card(zeroBound).objectId;
  expect(
    describeGrandArchiveDeclarationVariables(game.program, game.state, player.id, {
      move: "activate-card",
      cardId,
      variables: { X: 0 },
    }),
  ).toEqual([{ symbol: "X", minimum: 0, maximum: 0 }]);
  const commands = listGrandArchiveLegalCommands(game.program, game.state, player.id).flatMap(
    ({ command }) =>
      command.move === "activate-card" && command.cardId === cardId ? [command] : [],
  );
  expect(commands).toHaveLength(1);
  expect(commands[0]?.variables).toEqual({ X: 0 });
  const before = game.state;
  expect(() => player.activate(zeroBound, { variables: { X: 1 } })).toThrow(/legally declared/);
  expect(game.state).toBe(before);
  player.activate(zeroBound, { variables: { X: 0 } });
  expect(game.state.stack.at(-1)?.variables.X).toBe(0);
});
