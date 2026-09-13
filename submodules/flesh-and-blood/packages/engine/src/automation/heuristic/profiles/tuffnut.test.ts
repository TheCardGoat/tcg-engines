import { describe, expect, it } from "vite-plus/test";
import { dash } from "../../../../../cards/src/cards/heroes/dash.ts";
import { tuffnutBumblingHulkster } from "../../../../../cards/src/cards/heroes/tuffnut-bumbling-hulkster.ts";
import { digInYellow } from "../../../../../cards/src/cards/actions/dig-in.ts";
import { wreckerRompBlue } from "../../../../../cards/src/cards/actions/wrecker-romp.ts";
import { unmovableRed } from "../../../../../cards/src/cards/defense-reactions/unmovable.ts";
import { snatchRed } from "../../../../../cards/src/cards/actions/snatch.ts";
import { decodeFabCommand } from "../../../moves.ts";
import { expectFabPlayer, FabTestEngine } from "../../../testing/index.ts";
import { listLegalCommands } from "../../legal-commands.ts";
import { heroProfileStrategy } from "./dispatch.ts";

function applyChoice(
  game: FabTestEngine,
  actorId: string,
  choice: NonNullable<ReturnType<typeof heroProfileStrategy>>,
): void {
  const command = decodeFabCommand(choice.move, choice.payload);
  if (!command) throw new Error(`Bot choice ${choice.move} did not decode.`);
  expect(game.getRuntime().applyCommand(actorId, command).success).toBe(true);
}

function chooseTuffnut(game: FabTestEngine) {
  const actor = game.as(tuffnutBumblingHulkster);
  return heroProfileStrategy(
    game.getRuntime(),
    actor.id,
    listLegalCommands(game.getRuntime(), actor.id),
  );
}

describe("Tuffnut Bumbling Hulkster bot profile", () => {
  it("uses its pitch instant before attacking on its own turn", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnutBumblingHulkster,
        hand: [wreckerRompBlue],
        deckTop: [snatchRed],
        resourcePoints: 0,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false, firstPlayer: tuffnutBumblingHulkster },
    );
    const Tuffnut = game.as(tuffnutBumblingHulkster);

    const choice = chooseTuffnut(game);

    expect(choice?.move).toBe("activate");
    applyChoice(game, Tuffnut.id, choice!);
    game.untilIdle();
    expectFabPlayer(Tuffnut).toHaveResourceCount(1);
  });

  it("passes on an opponent turn before a defensive need exists", () => {
    const game = FabTestEngine.start(
      { hero: tuffnutBumblingHulkster, hand: [], deckTop: [snatchRed] },
      { hero: dash, hand: [snatchRed], deck: 6 },
      { autoPassPriority: false, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Tuffnut = game.as(tuffnutBumblingHulkster);

    Dash.pass();
    const choice = chooseTuffnut(game);

    expect(choice?.move).toBe("pass");
    applyChoice(game, Tuffnut.id, choice!);
  });

  it("does not activate while defending when its block has no resource spend", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      {
        hero: tuffnutBumblingHulkster,
        hand: [wreckerRompBlue],
        deckTop: [snatchRed],
        resourcePoints: 0,
      },
      { autoPassPriority: false, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Tuffnut = game.as(tuffnutBumblingHulkster);

    Dash.playAttack(snatchRed);
    Tuffnut.defendWith(wreckerRompBlue);
    game.toReaction("defender");
    const choice = chooseTuffnut(game);

    expect(choice?.move).not.toBe("activate");
    applyChoice(game, Tuffnut.id, choice!);
  });

  it("activates on defense when Dig In needs resources for its paid trigger", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      {
        hero: tuffnutBumblingHulkster,
        hand: [digInYellow],
        deckTop: [snatchRed],
        resourcePoints: 0,
      },
      { autoPassPriority: false, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Tuffnut = game.as(tuffnutBumblingHulkster);

    Dash.playAttack(snatchRed);
    Tuffnut.defendWith(digInYellow);
    game.toReaction("defender");
    const choice = chooseTuffnut(game);

    expect(choice?.move).toBe("activate");
    applyChoice(game, Tuffnut.id, choice!);
    game.untilIdle();
    expectFabPlayer(Tuffnut).toHaveResourceCount(1);
  });

  it("activates on defense when a paid defense reaction is resource-short", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      {
        hero: tuffnutBumblingHulkster,
        hand: [unmovableRed],
        deckTop: [snatchRed],
        resourcePoints: 0,
      },
      { autoPassPriority: false, firstPlayer: dash },
    );
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.toReaction("defender");
    const choice = chooseTuffnut(game);

    expect(choice?.move).toBe("activate");
  });
});
