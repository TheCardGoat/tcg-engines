import { expect, test } from "bun:test";
import { createRegressionTestEngine } from "./create-regression-test-engine.js";
import { mulanEntryDamageRegression } from "@/features/simulator-devtools/fixtures/regressions/mulan-entry-damage.js";
import { mickeyMouseBraveLittleTailor } from "@tcg/lorcana-cards/cards/001";
import { mulanInjuredSoldier } from "@tcg/lorcana-cards/cards/009";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";

test("Mulan's entry damage does not affect an opposing entrant", () => {
  const engine = createRegressionTestEngine(mulanEntryDamageRegression);
  expect(engine.asPlayerOne().playCard(mickeyMouseBraveLittleTailor)).toBeSuccessfulCommand();
  expect(engine.asPlayerOne()).toHaveDamage({ card: mickeyMouseBraveLittleTailor, value: 0 });
  expect(engine.asPlayerTwo()).toHaveDamage({ card: mulanInjuredSoldier, value: 2 });
});

test("an entering Mulan receives only her own two damage", () => {
  const engine = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [mulanInjuredSoldier], inkwell: 1 },
    { play: [{ card: mulanInjuredSoldier, damage: 2 }] },
  );
  const player = engine.asPlayerOne();
  const mulanId = player.getBoard().players.player_one!.hand[0]!;
  expect(player.playCard(mulanId)).toBeSuccessfulCommand();
  expect(player).toHaveDamage({ card: mulanId, value: 2 });
  expect(player.getCardZone(mulanId)).toBe("play");
});
