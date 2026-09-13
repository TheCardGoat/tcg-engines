import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { enigma } from "../heroes/enigma.ts";
import { dash } from "../heroes/dash.ts";
import { soundTheAlarmRed } from "../actions/sound-the-alarm.ts";
import { heirloomOfRabbitHide } from "./heirloom-of-rabbit-hide.ts";

/**
 * Heirloom of Rabbit Hide — Mystic Illusionist Chest, Cloaked + Ward 4.
 *
 * Printed: "Cloaked / While this is equipped face-down, at the start of your
 * turn, if you have exactly 1{h}, you may turn this face-up. / Ward 4"
 */
describe("Heirloom of Rabbit Hide AAA", () => {
  it("happy: at exactly 1{h} the start-of-turn optional turns the cloaked piece face-up", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: enigma,
        life: 1,
        chest: [{ card: heirloomOfRabbitHide, state: { faceDown: true } }],
        hand: [],
        deck: 6,
      },
    );
    const Enigma = game.as(enigma);
    expectFabCard(Enigma, heirloomOfRabbitHide).toBeFaceDown();

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept" });

    expectFabCard(Enigma, heirloomOfRabbitHide).toBeFaceUp();
    expectFabCard(Enigma, heirloomOfRabbitHide).toBeIn("chest");
  });

  it("boundary: at 2{h} the exactly-1 gate keeps the trigger silent and the piece face-down", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: enigma,
        life: 2,
        chest: [{ card: heirloomOfRabbitHide, state: { faceDown: true } }],
        hand: [],
        deck: 6,
      },
    );
    const Enigma = game.as(enigma);

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept" });

    expectFabCard(Enigma, heirloomOfRabbitHide).toBeFaceDown();
    expectFabCard(Enigma, heirloomOfRabbitHide).toBeIn("chest");
  });

  it("timing: Ward 4 destroys the hide to prevent 4 of a 5-damage hit", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [soundTheAlarmRed], actionPoints: 1, deck: 6 },
      {
        hero: enigma,
        life: 20,
        chest: [{ card: heirloomOfRabbitHide, state: { faceUp: true } }],
        hand: [],
        deck: 6,
      },
    );
    const Enigma = game.as(enigma);

    game.as(dash).playAttack(soundTheAlarmRed, { stopAt: "defend" });
    game.helpers.resolveRestOfCombat();

    // 5 damage − 4 prevented = 1; the ward paid itself (CR 8.3.20).
    expectFabPlayer(Enigma).toHaveLife(19);
    expectFabCard(Enigma, heirloomOfRabbitHide).toBeIn("graveyard");
  });
});
