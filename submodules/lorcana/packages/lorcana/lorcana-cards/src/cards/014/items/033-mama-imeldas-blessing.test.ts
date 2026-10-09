// Rules grounding: Mamá Imelda's Blessing (set14-033).
// FAMILIAL DUTY {E}, 1 {I} — Chosen character gets -1 {S} and can't {E} to
// sing songs until the start of your next turn.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockSong,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { mamImeldasBlessing } from "./033-mama-imeldas-blessing";

const blessedTarget = createMockCharacter({
  id: "imelda-target",
  name: "Blessed Target",
  cost: 4,
  strength: 4,
  willpower: 5,
  abilities: [
    {
      id: "imelda-target-singer",
      type: "keyword",
      keyword: "Singer",
      value: 4,
      text: "Singer 4",
    },
  ],
});

const matchingSong = createMockSong({
  id: "imelda-song",
  name: "Imelda Song",
  cost: 4,
  text: "A test song.",
});

describe("Mamá Imelda's Blessing", () => {
  it("gives chosen character -1 {S} and stops them singing until your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [matchingSong],
      inkwell: 1,
      play: [mamImeldasBlessing, { card: blessedTarget, isDrying: false }],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(mamImeldasBlessing, {
        ability: "FAMILIAL DUTY",
        targets: [blessedTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCard(blessedTarget).strength).toBe(3);
    expect(testEngine.asPlayerOne().singSong(matchingSong, blessedTarget).success).toBe(false);
    const messages = testEngine
      .asServer()
      .getMoveLogHistory()
      .flatMap((log) => log.public);
    const sourceId = testEngine.findCardInstanceId(mamImeldasBlessing, "play");
    const targetId = testEngine.findCardInstanceId(blessedTarget, "play");
    expect(messages).toContainEqual({
      key: "lorcana.outcome.strengthModified",
      values: { sourceId, targetId, modifier: -1 },
    });
    expect(messages).toContainEqual({
      key: "lorcana.outcome.singingBlockedUntilNextStart",
      values: { sourceId, targetId, playerId: PLAYER_ONE },
    });
  });

  it("the penalty and singing ban end at the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [matchingSong],
        inkwell: 1,
        play: [mamImeldasBlessing, { card: blessedTarget, isDrying: false }],
        deck: 6,
      },
      { deck: 6 },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(mamImeldasBlessing, {
        ability: "FAMILIAL DUTY",
        targets: [blessedTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCard(blessedTarget).strength).toBe(4);
    expect(testEngine.asPlayerOne().singSong(matchingSong, blessedTarget)).toBeSuccessfulCommand();
  });

  it("negative — FAMILIAL DUTY requires 1 ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [mamImeldasBlessing, { card: blessedTarget, isDrying: false }],
    });

    const result = testEngine.asPlayerOne().activateAbility(mamImeldasBlessing, {
      ability: "FAMILIAL DUTY",
      targets: [blessedTarget],
    });

    expect(result.success).toBe(false);
    expect(testEngine.asPlayerOne().isExerted(mamImeldasBlessing)).toBe(false);
    expect(testEngine.asPlayerOne().getCard(blessedTarget).strength).toBe(4);
  });
});

describe("Mamá Imelda's Blessing limits", () => {
  it("uses player two's next start for expiry and blocks a character singing by printed cost without Singer", () => {
    const plain = createMockCharacter({
      id: "imelda-plain-singer",
      name: "Plain Singer",
      cost: 4,
      strength: 4,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: plain, isDrying: false }], hand: [matchingSong], deck: 6 },
      { play: [mamImeldasBlessing], inkwell: 1, deck: 6 },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      engine.asPlayerTwo().activateAbility(mamImeldasBlessing, {
        ability: "FAMILIAL DUTY",
        targets: [plain],
      }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(engine.asPlayerTwo().isExerted(mamImeldasBlessing)).toBe(true);
    const sourceId = engine.findCardInstanceId(mamImeldasBlessing, "play", PLAYER_TWO);
    const targetId = engine.findCardInstanceId(plain, "play");
    const messages = engine
      .asServer()
      .getMoveLogHistory()
      .flatMap((log) => log.public);
    expect(messages).toContainEqual({
      key: "lorcana.outcome.strengthModified",
      values: { sourceId, targetId, modifier: -1 },
    });
    expect(messages).toContainEqual({
      key: "lorcana.outcome.singingBlockedUntilNextStart",
      values: { sourceId, targetId, playerId: PLAYER_TWO },
    });
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCard(plain).strength).toBe(3);
    expect(engine.asPlayerOne().singSong(matchingSong, plain)).not.toBeSuccessfulCommand();
    expect(engine.asPlayerOne().isExerted(plain)).toBe(false);
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCard(plain).strength).toBe(4);
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().singSong(matchingSong, plain)).toBeSuccessfulCommand();
  });

  it("targets an opponent and blocks single and group singing throughout their turn", () => {
    const groupSong = createMockSong({
      id: "imelda-group-song",
      name: "Group Song",
      cost: 4,
      text: "A group song.",
      abilities: [{ type: "keyword", keyword: "SingTogether", value: 4 }],
    });
    const helper = createMockCharacter({ id: "imelda-helper", name: "Helper", cost: 1 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [mamImeldasBlessing], inkwell: 1, deck: 5 },
      {
        play: [
          { card: blessedTarget, isDrying: false },
          { card: helper, isDrying: false },
        ],
        hand: [matchingSong, groupSong],
        deck: 5,
      },
    );
    expect(
      engine.asPlayerOne().activateAbility(mamImeldasBlessing, {
        ability: "FAMILIAL DUTY",
        targets: [blessedTarget],
      }),
    ).toBeSuccessfulCommand();
    expect(engine.isExerted(mamImeldasBlessing)).toBe(true);
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getCard(blessedTarget).strength).toBe(3);
    expect(engine.asPlayerTwo().singSong(matchingSong, blessedTarget)).not.toBeSuccessfulCommand();
    expect(
      engine.asPlayerTwo().playSongTogether(groupSong, [blessedTarget, helper]),
    ).not.toBeSuccessfulCommand();
    expect(engine.isExerted(blessedTarget)).toBe(false);
    expect(engine.isExerted(helper)).toBe(false);
    expect(engine.asPlayerTwo().quest(blessedTarget)).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getCard(blessedTarget).strength).toBe(4);
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      engine.asPlayerTwo().playSongTogether(groupSong, [blessedTarget, helper]),
    ).toBeSuccessfulCommand();
  });

  it("cannot target an item or activate again while exerted", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [mamImeldasBlessing, blessedTarget],
      inkwell: 2,
    });
    expect(
      engine.asPlayerOne().activateAbility(mamImeldasBlessing, {
        ability: "FAMILIAL DUTY",
        targets: [mamImeldasBlessing],
      }),
    ).not.toBeSuccessfulCommand();
    expect(engine.isExerted(mamImeldasBlessing)).toBe(false);
    expect(
      engine.asPlayerOne().activateAbility(mamImeldasBlessing, {
        ability: "FAMILIAL DUTY",
        targets: [blessedTarget],
      }),
    ).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().activateAbility(mamImeldasBlessing, {
        ability: "FAMILIAL DUTY",
        targets: [blessedTarget],
      }),
    ).not.toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCard(blessedTarget).strength).toBe(3);
  });
});
