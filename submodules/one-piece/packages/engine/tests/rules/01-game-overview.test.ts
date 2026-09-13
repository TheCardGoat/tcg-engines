import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb01TonyTonyChopper006,
  eb03Camie015,
  op01RoundTable027,
  op03Kaya044,
  op03OneTwoJango039,
  op03SoapSheep095,
  op04Sasaki048,
  op04Sugar024,
  op05Inazuma003,
  op05ItSAWasteOfHumanLife058,
  op09GolDRoger118,
  op10Scotch008,
  op13Higuma013,
  op13NicoRobin032,
  op13Otama043,
} from "@tcg/op-cards";

import {
  createMatch,
  createSt01MirrorPracticeConfig,
  getLegalCommands,
  OnePieceTestEngine,
} from "../../src/index.ts";

const SOUTH_ATTACKS = { firstPlayer: "north", activeSeat: "south" } as const;
const NORTH_ATTACKS = { firstPlayer: "south", activeSeat: "north" } as const;

describe("Comprehensive Rules 1: Game Overview", () => {
  test("1-1-1: a match is played head-to-head by exactly two players", () => {
    const engine = OnePieceTestEngine.create();
    const south = engine.asSouth();
    const north = engine.asNorth();

    expect(south.view().status).toBe("active");
    expect(south.view().players.south.leader?.cardId).toBeTruthy();
    expect(north.view().players.north.leader?.cardId).toBeTruthy();
  });

  test("1-2-1: reducing Life to 0 does not end the match (south damages north 1→0)", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: 1, deck: 4 },
      SOUTH_ATTACKS,
    );
    const south = engine.asSouth();
    const north = engine.asNorth();

    expect(north.view().players.north.lifeCount).toBe(1);
    south.attack(eb01MountainGod018, north.leader());
    if (north.hasPendingChoice()) {
      north.chooseCounter();
    }

    const view = south.view();
    expect(view.players.north.lifeCount).toBe(0);
    expect(view.status).toBe("active");
    expect(view.winner).toBeNull();
    expect(view.finishReason).toBeNull();
  });

  test("1-2-1: reducing Life to 0 does not end the match (north damages south 1→0)", () => {
    const engine = OnePieceTestEngine.create(
      { life: 1, deck: 4 },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      NORTH_ATTACKS,
    );
    const south = engine.asSouth();
    const north = engine.asNorth();

    expect(south.view().players.south.lifeCount).toBe(1);
    north.attack(eb01MountainGod018, south.leader());
    if (south.hasPendingChoice()) {
      south.chooseCounter();
    }

    const view = north.view();
    expect(view.players.south.lifeCount).toBe(0);
    expect(view.status).toBe("active");
    expect(view.winner).toBeNull();
    expect(view.finishReason).toBeNull();
  });

  test("1-2-1-1-1 and 1-2-2-1: Leader damage at 0 Life ends the game (south wins)", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [], deck: 4 },
      SOUTH_ATTACKS,
    );
    const south = engine.asSouth();
    const north = engine.asNorth();

    south.attack(eb01MountainGod018, north.leader());

    const view = south.view();
    expect(view.players.north.lifeCount).toBe(0);
    expect(view.status).toBe("finished");
    expect(view.winner).toBe("south");
    expect(view.finishReason).toBe("leaderDamage");
  });

  test("1-2-1-1-1 and 1-2-2-1: Leader damage at 0 Life ends the game (north wins)", () => {
    const engine = OnePieceTestEngine.create(
      { life: [], deck: 4 },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      NORTH_ATTACKS,
    );
    const south = engine.asSouth();
    const north = engine.asNorth();

    north.attack(eb01MountainGod018, south.leader());

    const view = north.view();
    expect(view.players.south.lifeCount).toBe(0);
    expect(view.status).toBe("finished");
    expect(view.winner).toBe("north");
    expect(view.finishReason).toBe("leaderDamage");
  });

  test("1-2-1: Life to 0 then Leader damage at 0 Life finishes in one sequence", () => {
    // Boundary chain: damage that empties Life keeps the match active; the next
    // Leader hit at 0 Life is the defeat condition (1-2-1). Use two 7000-power
    // attackers so both hits actually deal Leader damage.
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
        ],
      },
      { life: 1, deck: 4 },
      SOUTH_ATTACKS,
    );
    const south = engine.asSouth();
    const north = engine.asNorth();

    const firstAttacker = south.findOnField(eb01MountainGod018);
    south.attack(firstAttacker, north.leader());
    if (north.hasPendingChoice()) {
      north.chooseCounter();
    }
    expect(south.view().status).toBe("active");
    expect(south.view().players.north.lifeCount).toBe(0);

    // Second copy still active on the field (same catalog id, different instance).
    const secondAttacker = south
      .view()
      .players.south.characters.find(
        (card) =>
          card?.cardId === eb01MountainGod018.id &&
          card.instanceId !== firstAttacker &&
          !card.rested,
      )?.instanceId;
    expect(secondAttacker).toBeTruthy();
    south.attack(secondAttacker!, north.leader());
    if (north.hasPendingChoice()) {
      north.chooseCounter();
    }

    const view = south.view();
    expect(view.status).toBe("finished");
    expect(view.winner).toBe("south");
    expect(view.finishReason).toBe("leaderDamage");
  });

  test("1-2-2: drawing the last deck card ends the game (south loses on Refresh draw)", () => {
    const engine = OnePieceTestEngine.create({ life: 3, deck: 1 }, { life: 4, deck: 6 });
    const south = engine.asSouth();
    const north = engine.asNorth();

    south.endTurn();
    north.endTurn();

    const view = south.view();
    expect(view.players.south.deckCount).toBe(0);
    expect(view.status).toBe("finished");
    expect(view.winner).toBe("north");
    expect(view.finishReason).toBe("emptyDeck");
  });

  test("1-2-2: drawing the last deck card ends the game (north loses on Refresh draw)", () => {
    // South ends turn; north's Refresh draws the sole deck card → empty-deck loss.
    const engine = OnePieceTestEngine.create(
      { life: 4, deck: 6 },
      { life: 3, deck: 1 },
      { firstPlayer: "south", activeSeat: "south" },
    );
    const south = engine.asSouth();

    south.endTurn();

    const view = south.view();
    expect(view.players.north.deckCount).toBe(0);
    expect(view.status).toBe("finished");
    expect(view.winner).toBe("south");
    expect(view.finishReason).toBe("emptyDeck");
  });

  test("1-2-2: deck of 1 after Refresh is still active (at-limit boundary)", () => {
    // deck 2 → draw 1 leaves deck 1; defeat is only at 0 cards.
    const engine = OnePieceTestEngine.create({ life: 3, deck: 2 }, { life: 4, deck: 6 });
    const south = engine.asSouth();
    const north = engine.asNorth();

    south.endTurn();
    north.endTurn();

    const view = south.view();
    expect(view.players.south.deckCount).toBe(1);
    expect(view.status).toBe("active");
    expect(view.winner).toBeNull();
    expect(view.finishReason).toBeNull();
  });

  test("1-2-2: an effect that draws past the last card loses mid-resolution (Kaya On Play)", () => {
    // Kaya draws 2; with deck size 2 the second draw empties the deck and rule
    // processing ends the game before later effect steps run.
    const engine = OnePieceTestEngine.create({
      hand: [op03Kaya044, op13Higuma013],
      activeDon: 1,
      deck: 2,
    });
    const south = engine.asSouth();

    south.play(op03Kaya044);

    const view = south.view();
    expect(view.players.south.deckCount).toBe(0);
    expect(view.status).toBe("finished");
    expect(view.winner).toBe("north");
    expect(view.finishReason).toBe("emptyDeck");
  });

  test("1-2-2: an effect draw that leaves deck at 1 keeps the match active", () => {
    // Kaya draws 2 from deck 3 → deck 1 remaining; no empty-deck defeat.
    const engine = OnePieceTestEngine.create({
      hand: [op03Kaya044, op13Higuma013],
      activeDon: 1,
      deck: [eb01Doma005, eb01TonyTonyChopper006, op13Higuma013],
    });
    const south = engine.asSouth();

    south.play(op03Kaya044);
    // Trash two hand cards to finish Kaya's ordered effect (draw then trash).
    south.trashFromHand(eb01Doma005, eb01TonyTonyChopper006);

    const view = south.view();
    expect(view.players.south.deckCount).toBe(1);
    expect(view.status).toBe("active");
    expect(view.winner).toBeNull();
    expect(view.finishReason).toBeNull();
  });

  test("1-2-5: a card effect that says a player wins ends the game (south wins via Roger)", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op09GolDRoger118, playedOnTurn: 0 }],
        life: [eb01Doma005],
        deck: 4,
      },
      {
        character: [op10Scotch008],
        life: [],
        deck: 4,
      },
      SOUTH_ATTACKS,
    );
    const south = engine.asSouth();
    const north = engine.asNorth();

    south.attack(op09GolDRoger118, north.leader());
    north.chooseBlocker(op10Scotch008);

    const view = south.view();
    expect(view.status).toBe("finished");
    expect(view.winner).toBe("south");
    expect(view.finishReason).toBe("effectWin");
  });

  test("1-2-5: a card effect that says a player wins ends the game (north wins via Roger)", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op10Scotch008],
        life: [],
        deck: 4,
      },
      {
        character: [{ card: op09GolDRoger118, playedOnTurn: 0 }],
        life: [eb01Doma005],
        deck: 4,
      },
      NORTH_ATTACKS,
    );
    const south = engine.asSouth();
    const north = engine.asNorth();

    north.attack(op09GolDRoger118, south.leader());
    south.chooseBlocker(op10Scotch008);

    const view = north.view();
    expect(view.status).toBe("finished");
    expect(view.winner).toBe("north");
    expect(view.finishReason).toBe("effectWin");
  });

  test("1-2-3: north may concede and south wins immediately", () => {
    const engine = OnePieceTestEngine.create({ life: 4, deck: 6 }, { life: 4, deck: 6 });
    const south = engine.asSouth();
    const north = engine.asNorth();

    north.concede();

    const view = south.view();
    expect(view.status).toBe("finished");
    expect(view.winner).toBe("south");
    expect(view.finishReason).toBe("concession");
    // Concession is terminal: no further command is legal, not even conceding
    // back.
    expect(south.expectFailure({ type: "concede" }).reason).toBe("The match is already finished.");
  });

  test("1-2-3: south may concede and north wins immediately", () => {
    const engine = OnePieceTestEngine.create({ life: 4, deck: 6 }, { life: 4, deck: 6 });
    const south = engine.asSouth();
    const north = engine.asNorth();

    south.concede();

    const view = north.view();
    expect(view.status).toBe("finished");
    expect(view.winner).toBe("north");
    expect(view.finishReason).toBe("concession");
    expect(north.expectFailure({ type: "concede" }).reason).toBe("The match is already finished.");
  });

  test("1-2-3: concession is legal mid-battle while a prompt is pending", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { character: [op10Scotch008], life: 4, deck: 6 },
      SOUTH_ATTACKS,
    );
    const south = engine.asSouth();
    const north = engine.asNorth();

    south.attack(eb01MountainGod018, north.leader());
    // The defender's Blocker decision is pending; concession is still legal.
    expect(north.pendingDecision("battleBlocker")).toBeTruthy();

    north.concede();

    const view = south.view();
    expect(view.status).toBe("finished");
    expect(view.winner).toBe("south");
    expect(view.finishReason).toBe("concession");
    // The concession abandons the battle and cancels the pending prompt
    // instead of waiting for the Blocker decision.
    expect(view.battle).toBeNull();
    expect(view.prompts).toHaveLength(0);
    expect(view.decisions).toHaveLength(0);
  });

  test("1-2-3: concession is legal during setup, before the game starts", () => {
    const engine = OnePieceTestEngine.fromState(
      createMatch(createSt01MirrorPracticeConfig({ firstPlayer: "south" })),
    );
    const south = engine.asSouth();
    const north = engine.asNorth();

    expect(south.view().status).toBe("setup");
    // Concede is offered as a legal command even before Jo Ken Po resolves.
    expect(
      getLegalCommands(engine.getState(), "north").some(
        (descriptor) => descriptor.type === "concede",
      ),
    ).toBe(true);

    north.concede();

    const view = south.view();
    expect(view.status).toBe("finished");
    expect(view.winner).toBe("south");
    expect(view.finishReason).toBe("concession");
  });

  test("1-2-4: concession is not affected by cards and cannot be replaced by replacement effects", () => {
    // South fields OP09-118 Gol.D.Roger, whose replacement effect wins the
    // game instead of losing when its controller has 0 Life and the opponent
    // activates a Blocker. Concession must bypass that machinery entirely.
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op09GolDRoger118, playedOnTurn: 0 }],
        life: [],
        deck: 4,
      },
      { character: [op10Scotch008], life: 4, deck: 6 },
      SOUTH_ATTACKS,
    );
    const south = engine.asSouth();

    south.concede();

    const view = south.view();
    // Roger's replacement never engages: no prompt appears, and the
    // concession defeat stands with the opponent as winner.
    expect(view.prompts).toHaveLength(0);
    expect(view.status).toBe("finished");
    expect(view.winner).toBe("north");
    expect(view.finishReason).toBe("concession");
    // No winnerDeclared domain event is dispatched for a concession.
    expect(engine.getState().eventHistory.some((event) => event.type === "winnerDeclared")).toBe(
      false,
    );
  });

  // Keyword precedence matrix (other keywords) lives under tests/rules/10-keywords*.
  // Chapter 1 keeps one Rush sample proving card text overrides the general rule.
  test("1-3-1: card text takes precedence over the rules — [Rush] attacks on the turn it is played", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        hand: [op05Inazuma003, eb01Doma005],
        activeDon: 4,
      },
      { life: 4, deck: 6 },
      SOUTH_ATTACKS,
    );
    const south = engine.asSouth();
    const north = engine.asNorth();

    south.play(op05Inazuma003);
    south.play(eb01Doma005);
    const inazumaId = south.findOnField(op05Inazuma003);
    const domaId = south.findOnField(eb01Doma005);

    // Without card text, a Character cannot attack on the turn it is played.
    expect(
      south.expectFailure({
        type: "declareAttack",
        attackerId: domaId,
        targetId: north.leader(),
      }).reason,
    ).toBe("The selected attacker cannot attack.");

    // Inazuma's printed [Rush] overrides that rule: the attack is legal and
    // rests Inazuma as it is declared.
    south.attack(op05Inazuma003, north.leader());
    expect(
      south.view().players.south.characters.find((card) => card?.instanceId === inazumaId)?.rested,
    ).toBe(true);
  });

  // Expanded targeting matrix: tests/rules/topics/targeting.test.ts
  test("1-3-2: an impossible action is skipped while the rest of the effect is performed", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        hand: [op03OneTwoJango039],
        activeDon: 1,
      },
      { character: [op04Sugar024] },
    );
    const south = engine.asSouth();
    const mountainGodId = south.findOnField(eb01MountainGod018);

    south.play(op03OneTwoJango039);
    // The printed rest has no legal target (Sugar costs 2), so it is skipped
    // and resolution continues to the printed power boost.
    south.chooseTargets(eb01MountainGod018);

    const view = south.view();
    expect(
      view.players.south.characters.find((card) => card?.instanceId === mountainGodId)?.power,
    ).toBe(8000);
    expect(view.players.north.characters.every((card) => !card || !card.rested)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  // Already-in-state / no-op expansions: topics/targeting.test.ts + topics/effect-resolution.test.ts
  test("1-3-2-1: changing an object to a state it is already in is not performed", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        hand: [op03OneTwoJango039],
        activeDon: 1,
      },
      { character: [{ card: op13Otama043, rested: true }, op04Sugar024] },
    );
    const south = engine.asSouth();
    const north = engine.asNorth();
    const mountainGodId = south.findOnField(eb01MountainGod018);
    const otamaId = north.findOnField(op13Otama043);

    south.play(op03OneTwoJango039);
    // Otama is the only Character with a cost of 1 or less, but she is already
    // rested, so the rest action offers no candidates and cannot be performed.
    const decision = south.pendingDecision("effectTargetSelection");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected a target decision.");
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(otamaId);
    south.chooseNoTargets();
    south.chooseTargets(eb01MountainGod018);

    const northView = north.view();
    expect(
      northView.players.north.characters.find((card) => card?.instanceId === otamaId)?.rested,
    ).toBe(true);
    expect(south.view().prompts).toHaveLength(0);
    expect(mountainGodId).toBeTruthy();
  });

  test("1-3-2-2: an action required 0 times is not carried out", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op04Sasaki048],
      activeDon: 3,
      deck: 4,
    });
    const south = engine.asSouth();

    south.play(op04Sasaki048);

    // With an empty hand, Sasaki returns 0 cards and draws 0 cards; the game
    // continues normally instead of drawing or milling anything.
    const view = south.view();
    expect(view.players.south.hand).toHaveLength(0);
    expect(view.players.south.deckCount).toBe(4);
    expect(view.status).toBe("active");
  });

  // Broader prohibition families: tests/rules/topics/prohibitions.test.ts
  test("1-3-3: a prohibiting effect takes precedence over an action an effect requires", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op13NicoRobin032], activeDon: 7 },
      { character: [eb03Camie015] },
      SOUTH_ATTACKS,
    );
    const south = engine.asSouth();
    const north = engine.asNorth();
    const camieId = north.findOnField(eb03Camie015);

    south.play(op13NicoRobin032);
    south.chooseTargets(eb03Camie015);
    south.endTurn();

    // Camie's activation requires resting her, which Nico Robin prohibits.
    expect(
      north.expectFailure({
        type: "activateEffect",
        sourceInstanceId: camieId,
        trigger: "activateMain",
      }).reason,
    ).toBe("The activation costs cannot be paid.");
  });

  test("1-3-4 and 1-3-10: when both players must act at the same time, the turn player acts first", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [
          op05ItSAWasteOfHumanLife058,
          op13Higuma013,
          op13Higuma013,
          op13Higuma013,
          op13Higuma013,
          op13Higuma013,
          op13Higuma013,
        ],
        activeDon: 8,
      },
      { hand: 7 },
    );
    const south = engine.asSouth();
    const north = engine.asNorth();

    south.play(op05ItSAWasteOfHumanLife058);

    // The turn player trashes down to 5 hand cards first.
    expect(north.view().decisions).toHaveLength(0);
    south.trashFromHand(op13Higuma013);

    // Only then does the non-turn player make their choice.
    const northHandIds = north
      .view()
      .players.north.hand.map((card) => card.instanceId)
      .filter((instanceId): instanceId is string => Boolean(instanceId));
    expect(northHandIds).toHaveLength(7);
    north.choose("effectTrashFromHandSelection", northHandIds.slice(0, 2));

    const view = south.view();
    expect(view.players.south.hand).toHaveLength(5);
    expect(view.players.north.handCount).toBe(5);
  });

  // Numeric amount suite: tests/rules/topics/amounts.test.ts
  test("1-3-5-1: an 'up to' choice without a minimum may choose 0", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        hand: [op03OneTwoJango039],
        activeDon: 1,
      },
      { character: [op13Otama043] },
    );
    const south = engine.asSouth();
    const north = engine.asNorth();
    const mountainGodId = south.findOnField(eb01MountainGod018);
    const otamaId = north.findOnField(op13Otama043);

    south.play(op03OneTwoJango039);
    const decision = south.pendingDecision("effectTargetSelection");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected a target decision.");
    expect(step.candidates.map((candidate) => candidate.ref.id)).toContain(otamaId);
    south.chooseNoTargets();
    south.chooseTargets(eb01MountainGod018);

    expect(
      north.view().players.north.characters.find((card) => card?.instanceId === otamaId)?.rested,
    ).toBe(false);
    expect(mountainGodId).toBeTruthy();
  });

  test("1-3-6-1 and 1-3-6-1-1: power may become negative, and the card is not trashed for it (1-3-6)", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op01RoundTable027], activeDon: 4 },
      { character: [eb01MountainGod018] },
    );
    const south = engine.asSouth();
    const north = engine.asNorth();
    const mountainGodId = north.findOnField(eb01MountainGod018);

    south.play(op01RoundTable027);
    south.chooseTargets(eb01MountainGod018);

    const view = north.view();
    const mountainGod = view.players.north.characters.find(
      (card) => card?.instanceId === mountainGodId,
    );
    expect(mountainGod?.power).toBe(7000 - 10000);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(mountainGodId);
  });

  // Cost / cost-reduction suite: tests/rules/topics/costs.test.ts
  test("1-3-6-2: a cost that becomes negative is treated as 0 outside calculations", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op03SoapSheep095], activeDon: 1 },
      { character: [op13Otama043] },
    );
    const south = engine.asSouth();
    const north = engine.asNorth();
    const otamaId = north.findOnField(op13Otama043);

    south.play(op03SoapSheep095);
    south.chooseTargets(op13Otama043);

    // Otama's printed cost of 1 minus 2 is -1, which is treated as 0.
    expect(
      north.view().players.north.characters.find((card) => card?.instanceId === otamaId)?.cost,
    ).toBe(0);
  });

  // Effect order expansions: tests/rules/topics/effect-resolution.test.ts
  test("1-3-7: effect actions are carried out in the order described on the card", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op03Kaya044, op13Higuma013],
      activeDon: 1,
      deck: [eb01Doma005, eb01TonyTonyChopper006, op13Higuma013, op13Higuma013],
    });
    const south = engine.asSouth();

    south.play(op03Kaya044);

    // Kaya draws 2 cards before trashing 2, so the just-drawn cards are in
    // hand and legal selections for the trash that follows.
    const drawnDomaId = south.findInZone("hand", eb01Doma005);
    const drawnChopperId = south.findInZone("hand", eb01TonyTonyChopper006);
    south.trashFromHand(eb01Doma005, eb01TonyTonyChopper006);

    const view = south.view();
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([
      south.findInZone("hand", op13Higuma013),
    ]);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([drawnDomaId, drawnChopperId]),
    );
  });

  // Play + activation cost suite: tests/rules/topics/costs.test.ts
  test("1-3-9-1: playing a card requires paying the cost written in its upper left corner", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb01MountainGod018],
      activeDon: 5,
    });
    const south = engine.asSouth();

    south.play(eb01MountainGod018);

    const view = south.view();
    expect(view.players.south.restedDon).toBe(5);
    expect(view.players.south.activeDon).toBe(0);
  });

  test("1-3-9-2: activating a card's effect requires paying its activation cost", () => {
    const engine = OnePieceTestEngine.create({ character: [eb03Camie015] }, {});
    const south = engine.asSouth();
    const camieId = south.findOnField(eb03Camie015);

    south.activateMain(eb03Camie015);
    south.acceptOptional();

    expect(
      south.view().players.south.characters.find((card) => card?.instanceId === camieId)?.rested,
    ).toBe(true);
  });
});
