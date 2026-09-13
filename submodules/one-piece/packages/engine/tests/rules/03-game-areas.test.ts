import { describe, expect, test } from "vite-plus/test";
import {
  eb01Blueno033,
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  getCard,
  op01Caribou007,
  op01RoronoaZoro025,
  op02Komille097,
  op03Iceburg058,
  op03Shirley104,
  op03Tilestone064,
  op05FourThousandBrickFist020,
  op05Rebecca091,
  op06GravityBladeRagingTiger058,
  op10CaponeGangBege103,
  op10Urouge101,
  op13BrilliantPunk059,
  op13WindmillVillage022,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../src/index.ts";

const SOUTH_ATTACKS = { firstPlayer: "north", activeSeat: "south" } as const;
const VIEWERS = ["south", "north"] as const;

describe("Comprehensive Rules 3: Game Areas", () => {
  describe("3-1 Areas", () => {
    test("3-1-1 and 3-1-3: each player possesses one of every area", () => {
      const engine = OnePieceTestEngine.create();

      for (const seat of VIEWERS) {
        const player = engine.asSouth().view().players[seat];
        expect(player.leader.cardId).toBe("OP13-001");
        expect(player.characters).toHaveLength(5);
        expect(player.stage).toBeNull();
        expect(player.hand).toHaveLength(0);
        expect(player.trash).toHaveLength(0);
        expect(player.life).toHaveLength(4);
        expect(player.deckCount).toBe(10);
        expect(player.activeDon).toBe(0);
        expect(player.restedDon).toBe(0);
        expect(player.donDeckCount).toBe(10);
      }
    });

    test("3-1-4: the number of cards in each area is open information to both players", () => {
      const engine = OnePieceTestEngine.create(
        { hand: 3, trash: 2, activeDon: 3, restedDon: 1 },
        { hand: 1, deck: 7, life: 2 },
      );

      for (const viewer of VIEWERS) {
        const view = viewer === "south" ? engine.asSouth().view() : engine.asNorth().view();
        expect(view.players.south.handCount).toBe(3);
        expect(view.players.south.deckCount).toBe(10);
        expect(view.players.south.lifeCount).toBe(4);
        expect(view.players.south.trash).toHaveLength(2);
        expect(view.players.south.activeDon).toBe(3);
        expect(view.players.south.restedDon).toBe(1);
        expect(view.players.south.donDeckCount).toBe(10);
        expect(view.players.north.handCount).toBe(1);
        expect(view.players.north.deckCount).toBe(7);
        expect(view.players.north.lifeCount).toBe(2);
      }
    });

    // 3-1-6: moveCard strips modifiers targeting an instance that leaves the
    // field (state.ts), so the bounced-and-replayed Character below loses its
    // +2000 and projects its printed 3000 even though "during this turn" is live.
    test("3-1-6: a power-modified Character bounced to hand and replayed has its printed power", () => {
      const engine = OnePieceTestEngine.create({
        character: [{ card: eb01Doma005, playedOnTurn: 0 }],
        hand: [op05FourThousandBrickFist020, op13BrilliantPunk059],
        activeDon: 7,
      });
      const domaId = engine.asSouth().findOnField(eb01Doma005);

      engine.asSouth().play(op05FourThousandBrickFist020);
      engine.asSouth().choose("effectTargetSelection", [domaId]);
      expect(
        engine
          .asSouth()
          .view()
          .players.south.characters.find((card) => card?.instanceId === domaId)?.power,
      ).toBe((eb01Doma005.power ?? 0) + 2000);

      engine.asSouth().play(op13BrilliantPunk059);
      engine.asSouth().acceptOptional();
      expect(
        engine
          .asSouth()
          .view()
          .players.south.hand.map((card) => card.instanceId),
      ).toContain(domaId);

      engine.asSouth().play(eb01Doma005);
      const replayed = engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === domaId);
      // Same physical card, but the power modifier applied in the Character area
      // did not carry over even though its "during this turn" duration is live.
      expect(replayed?.power).toBe(eb01Doma005.power);
    });

    test("3-1-6: attached DON!! is stripped when a Character moves to another area and returns rested to the cost area", () => {
      const engine = OnePieceTestEngine.create({
        character: [{ card: eb01Doma005, attachedDon: 2, playedOnTurn: 0 }],
        hand: [op13BrilliantPunk059],
        activeDon: 5,
      });
      const domaId = engine.asSouth().findOnField(eb01Doma005);

      engine.asSouth().play(op13BrilliantPunk059);
      engine.asSouth().acceptOptional();

      const view = engine.asSouth().view();
      expect(view.players.south.hand.map((card) => card.instanceId)).toContain(domaId);
      expect(view.players.south.hand.find((card) => card.instanceId === domaId)?.attachedDon).toBe(
        0,
      );
      expect(view.players.south.restedDon).toBe(6);
    });

    test("3-1-7 and 3-2-3: the owner decides the order of simultaneously placed cards, moving them one by one", () => {
      const engine = OnePieceTestEngine.create(
        { hand: [op06GravityBladeRagingTiger058], activeDon: 7 },
        { character: [eb01Doma005, eb01Fourtricks025] },
      );
      const firstId = engine.asNorth().findOnField(eb01Doma005);
      const secondId = engine.asNorth().findOnField(eb01Fourtricks025);

      engine.asSouth().play(op06GravityBladeRagingTiger058);
      engine.asSouth().choose("effectTargetSelection", [firstId, secondId]);

      const chosenOrder = [secondId, firstId];
      engine.asNorth().choose("effectReturnToDeckOwnerOrder", chosenOrder);

      expect(engine.getState().players.north.deck.slice(-2)).toEqual(chosenOrder);
      const moveEvents = engine
        .getState()
        .eventHistory.filter(
          (event) =>
            event.type === "cardMoved" &&
            event.payload.fromZone === "character" &&
            event.payload.toZone === "deck",
        );
      expect(moveEvents).toHaveLength(2);
    });

    test("3-1-8: the opponent cannot confirm the order cards are placed into a secret area", () => {
      const engine = OnePieceTestEngine.create(
        { hand: [op06GravityBladeRagingTiger058], activeDon: 7 },
        { character: [eb01Doma005, eb01Fourtricks025] },
      );
      const firstId = engine.asNorth().findOnField(eb01Doma005);
      const secondId = engine.asNorth().findOnField(eb01Fourtricks025);

      engine.asSouth().play(op06GravityBladeRagingTiger058);
      engine.asSouth().choose("effectTargetSelection", [firstId, secondId]);

      // The ordering decision belongs to the owner alone; nothing is projected
      // to the opponent while the order is being decided.
      expect(engine.asSouth().view().decisions).toHaveLength(0);
      expect(engine.pendingDecision("effectReturnToDeckOwnerOrder", "north").id).toBeTruthy();

      engine.asNorth().orderCards("effectReturnToDeckOwnerOrder", [secondId, firstId]);

      // After the move, the opponent still cannot inspect the deck's contents
      // or the order the cards were placed in.
      const opponentDeckTop = engine.asSouth().view().players.north.deckTop;
      expect(opponentDeckTop).toMatchObject({ cardId: null, hidden: true });
    });
  });

  describe("3-2 Deck", () => {
    test("3-2-1 and 3-2-2: the deck is a secret area; neither player can check its contents", () => {
      const engine = OnePieceTestEngine.create({ deck: 6 }, {});

      for (const viewer of VIEWERS) {
        const view = viewer === "south" ? engine.asSouth().view() : engine.asNorth().view();
        expect(view.players.south.deckCount).toBe(6);
        expect(view.players.south.deckTop).toMatchObject({ cardId: null, hidden: true });
        expect(view.players.north.deckTop).toMatchObject({ cardId: null, hidden: true });
      }
    });
  });

  describe("3-3 DON!! Deck", () => {
    test("3-3-1 and 3-3-2: each player places a DON!! deck; it is an open area whose count both players confirm", () => {
      const engine = OnePieceTestEngine.create({ donDeckCount: 8 }, { donDeckCount: 6 });

      for (const viewer of VIEWERS) {
        const view = viewer === "south" ? engine.asSouth().view() : engine.asNorth().view();
        expect(view.players.south.donDeckCount).toBe(8);
        expect(view.players.north.donDeckCount).toBe(6);
      }
    });
  });

  describe("3-4 Hand", () => {
    test("3-4-1: cards drawn from the deck are placed in the hand", () => {
      const engine = OnePieceTestEngine.create({}, {});

      engine.asSouth().endTurn();

      const view = engine.asNorth().view();
      expect(view.players.north.handCount).toBe(1);
      expect(view.players.north.deckCount).toBe(9);
      expect(view.players.north.hand[0]?.cardId).toBe("OP13-013");
    });

    test("3-4-2: a player can freely view the contents of their own hand", () => {
      const engine = OnePieceTestEngine.create({
        hand: [eb01Doma005, eb01Fourtricks025],
      });

      const hand = engine.asSouth().view().players.south.hand;
      expect(hand.map((card) => card.cardId)).toEqual([eb01Doma005.id, eb01Fourtricks025.id]);
      expect(hand.every((card) => !card.hidden)).toBe(true);
    });

    test("3-4-3: players cannot view the contents of the other player's hand", () => {
      const engine = OnePieceTestEngine.create(
        { hand: [eb01Doma005, eb01Fourtricks025] },
        { hand: [eb01MountainGod018] },
      );

      const opponentHand = engine.asSouth().view().players.north.hand;
      expect(engine.asSouth().view().players.north.handCount).toBe(1);
      expect(opponentHand.every((card) => card.hidden && card.cardId === null)).toBe(true);

      const southHand = engine.asNorth().view().players.south.hand;
      expect(engine.asNorth().view().players.south.handCount).toBe(2);
      expect(southHand.every((card) => card.hidden && card.cardId === null)).toBe(true);
    });
  });

  describe("3-5 Trash", () => {
    test("3-5-1: an Event card that has been activated is placed in the trash", () => {
      const engine = OnePieceTestEngine.create({
        hand: [op05FourThousandBrickFist020],
        activeDon: 2,
      });

      engine.asSouth().play(op05FourThousandBrickFist020);
      engine.asSouth().chooseNoTargets();

      expect(
        engine
          .asSouth()
          .view()
          .players.south.trash.map((card) => card.cardId),
      ).toContain(op05FourThousandBrickFist020.id);
    });

    test("3-5-1: a Character card that has been K.O.'d is placed in the trash", () => {
      const engine = OnePieceTestEngine.create(
        { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
        { character: [{ card: eb01Doma005, rested: true, playedOnTurn: 0 }] },
        SOUTH_ATTACKS,
      );
      const attackerId = engine.asSouth().findOnField(eb01MountainGod018);
      const domaId = engine.asNorth().findOnField(eb01Doma005);

      engine.asSouth().attack(attackerId, domaId);

      const view = engine.asSouth().view();
      expect(view.players.north.trash.map((card) => card.instanceId)).toContain(domaId);
      expect(view.players.north.characters.some((card) => card?.instanceId === domaId)).toBe(false);
    });

    test("3-5-2: the trash is an open area; both players can view its contents and order", () => {
      const engine = OnePieceTestEngine.create({}, { trash: [eb01Doma005, eb01Fourtricks025] });

      for (const viewer of VIEWERS) {
        const trash = (viewer === "south" ? engine.asSouth().view() : engine.asNorth().view())
          .players.north.trash;
        expect(trash.map((card) => card.cardId)).toEqual([eb01Doma005.id, eb01Fourtricks025.id]);
        expect(trash.every((card) => !card.hidden)).toBe(true);
      }
    });
  });

  describe("3-6 Leader Area", () => {
    test("3-6-1 and 3-6-2: the Leader is placed face-up in an open area", () => {
      const engine = OnePieceTestEngine.create();

      for (const viewer of VIEWERS) {
        const view = viewer === "south" ? engine.asSouth().view() : engine.asNorth().view();
        for (const seat of VIEWERS) {
          expect(view.players[seat].leader).toMatchObject({ cardId: "OP13-001", hidden: false });
        }
      }
    });

    test("3-6-3: a Leader cannot be moved from the Leader area by card effects", () => {
      const engine = OnePieceTestEngine.create(
        { hand: [op06GravityBladeRagingTiger058], activeDon: 7 },
        { character: [eb01Doma005] },
      );
      const southLeaderId = engine.leader("south");
      const northLeaderId = engine.leader("north");
      const domaId = engine.asNorth().findOnField(eb01Doma005);

      engine.asSouth().play(op06GravityBladeRagingTiger058);
      const decision = engine.pendingDecision("effectTargetSelection", "south");
      const step = decision.steps[0];
      if (step?.kind !== "selectEntity") throw new Error("Expected a Character return choice.");
      expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([domaId]);
      expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(southLeaderId);
      expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(northLeaderId);

      engine.expectFailure({
        type: "resolvePrompt",
        seat: "south",
        promptId: decision.id,
        selectedIds: [northLeaderId],
      });
      engine.asSouth().chooseNoTargets();

      expect(engine.asSouth().view().players.north.leader.instanceId).toBe(northLeaderId);
    });
  });

  describe("3-7 Character Area", () => {
    test("3-7-2: the Character area is an open area", () => {
      const engine = OnePieceTestEngine.create({}, { character: [eb01Doma005] });

      const character = engine
        .getView("south")
        .players.north.characters.find((card) => card !== null);
      expect(character).toMatchObject({ cardId: eb01Doma005.id, hidden: false });
    });

    test("3-7-4: a Character cannot attack on the turn in which it is played", () => {
      const engine = OnePieceTestEngine.create(
        { hand: [eb01MountainGod018], activeDon: eb01MountainGod018.cost },
        {},
        SOUTH_ATTACKS,
      );

      engine.asSouth().play(eb01MountainGod018);
      const attackerId = engine.asSouth().findOnField(eb01MountainGod018);

      const failure = engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId,
        targetId: engine.leader("north"),
      });
      expect(failure.reason).toBe("The selected attacker cannot attack.");
    });

    test("3-7-4: a Character can attack from the next turn onward", () => {
      const engine = OnePieceTestEngine.create(
        { hand: [eb01MountainGod018], activeDon: eb01MountainGod018.cost },
        {},
        SOUTH_ATTACKS,
      );

      engine.asSouth().play(eb01MountainGod018);
      const attackerId = engine.asSouth().findOnField(eb01MountainGod018);
      engine.asSouth().endTurn();
      engine.asNorth().endTurn();

      engine.asSouth().attack(attackerId, engine.asNorth().leader());
      expect(
        engine
          .getView("south")
          .players.south.characters.find((card) => card?.instanceId === attackerId)?.rested,
      ).toBe(true);
    });

    test("3-7-4: [Rush] is the printed exception; a Rush Character can attack on the turn it is played", () => {
      const engine = OnePieceTestEngine.create(
        { hand: [op01RoronoaZoro025], activeDon: op01RoronoaZoro025.cost },
        {},
        SOUTH_ATTACKS,
      );

      engine.asSouth().play(op01RoronoaZoro025);
      const zoroId = engine.asSouth().findOnField(op01RoronoaZoro025);
      engine.asSouth().attack(zoroId, engine.asNorth().leader());

      expect(
        engine
          .asSouth()
          .view()
          .players.south.characters.find((card) => card?.instanceId === zoroId)?.rested,
      ).toBe(true);
    });

    test("3-7-5: Characters are played active unless otherwise specified", () => {
      const engine = OnePieceTestEngine.create({
        hand: [eb01Doma005],
        activeDon: eb01Doma005.cost,
      });

      engine.asSouth().play(eb01Doma005);

      const character = engine
        .getView("south")
        .players.south.characters.find((card) => card?.cardId === eb01Doma005.id);
      expect(character?.rested).toBe(false);
    });

    test("3-7-6: up to 5 Character cards can be placed in the Character area", () => {
      const engine = OnePieceTestEngine.create({
        character: [
          eb01MountainGod018,
          eb01MountainGod018,
          eb01MountainGod018,
          eb01MountainGod018,
          eb01MountainGod018,
        ],
        hand: [eb01MountainGod018],
        activeDon: eb01MountainGod018.cost,
      });

      // The area is capped at 5: a sixth Character cannot simply be added, so
      // the play pauses for the 3-7-6-1 replacement choice instead.
      engine.asSouth().play(eb01MountainGod018);
      const decision = engine.pendingDecision("playCharacterReplacement", "south");

      const trashedId = engine
        .getView("south")
        .players.south.characters.flatMap((card) =>
          card?.instanceId ? [card.instanceId] : [],
        )[0]!;
      engine.asSouth().choose("playCharacterReplacement", [trashedId]);

      expect(decision.actorId).toBe("south");
      expect(
        engine
          .asSouth()
          .view()
          .players.south.characters.filter((card) => card !== null),
      ).toHaveLength(5);
    });

    test("3-7-6-1: with 5 Characters in play, playing a new Character trashes 1 first", () => {
      const engine = OnePieceTestEngine.create({
        character: [
          eb01MountainGod018,
          eb01MountainGod018,
          eb01MountainGod018,
          eb01MountainGod018,
          eb01MountainGod018,
        ],
        hand: [eb01MountainGod018],
        activeDon: eb01MountainGod018.cost,
      });
      const playedId = engine.asSouth().findInZone("hand", eb01MountainGod018);
      const fieldIds = engine
        .getView("south")
        .players.south.characters.flatMap((card) => (card?.instanceId ? [card.instanceId] : []));

      engine.asSouth().play(eb01MountainGod018);

      // The played card is revealed, then the player chooses 1 of their 5
      // Characters to trash before the play completes.
      expect(
        engine
          .getView("north")
          .logs.some(
            (entry) => entry.message.includes("reveals") && entry.sourceInstanceId === playedId,
          ),
      ).toBe(true);
      const decision = engine.pendingDecision("playCharacterReplacement", "south");
      expect(decision.actorId).toBe("south");
      const step = decision.steps[0]!;
      expect(step.kind).toBe("selectEntity");
      if (step.kind === "selectEntity") {
        expect(step.min).toBe(1);
        expect(step.max).toBe(1);
        expect(
          step.candidates.map((candidate) => candidate.ref.id).sort((a, b) => a.localeCompare(b)),
        ).toEqual([...fieldIds].sort((a, b) => a.localeCompare(b)));
      }
      expect(engine.asSouth().view().players.south.restedDon).toBe(0);

      const trashedId = fieldIds[0]!;
      engine.asSouth().choose("playCharacterReplacement", [trashedId]);

      const view = engine.asSouth().view();
      const characters = view.players.south.characters.filter((card) => card !== null);
      expect(characters).toHaveLength(5);
      expect(characters.some((card) => card?.instanceId === playedId)).toBe(true);
      expect(view.players.south.trash.map((card) => card.instanceId)).toEqual([trashedId]);
      expect(view.players.south.restedDon).toBe(eb01MountainGod018.cost);
    });

    test("3-7-6-1: trashed Character returns attached DON!! to the cost area", () => {
      const engine = OnePieceTestEngine.create({
        character: [
          { card: eb01MountainGod018, attachedDon: 2, playedOnTurn: 0 },
          eb01MountainGod018,
          eb01MountainGod018,
          eb01MountainGod018,
          eb01MountainGod018,
        ],
        hand: [eb01MountainGod018],
        activeDon: eb01MountainGod018.cost,
      });
      const fieldIds = engine
        .getView("south")
        .players.south.characters.flatMap((card) => (card?.instanceId ? [card.instanceId] : []));
      const trashedId = fieldIds[0]!;

      engine.asSouth().play(eb01MountainGod018);
      engine.asSouth().choose("playCharacterReplacement", [trashedId]);

      const view = engine.asSouth().view();
      expect(view.players.south.trash.map((card) => card.instanceId)).toEqual([trashedId]);
      // The trashed Character had 2 attached DON!!; those return rested to the
      // cost area before the new Character's cost is paid.
      expect(view.players.south.restedDon).toBe(eb01MountainGod018.cost + 2);
      expect(
        view.players.south.trash.find((card) => card.instanceId === trashedId)?.attachedDon,
      ).toBe(0);
    });

    test("3-7-6-1: an effect playing a Character into a full Character area offers the replacement choice", () => {
      const engine = OnePieceTestEngine.create(
        {
          leaderCardId: op03Iceburg058,
          character: [op01Caribou007, eb01MountainGod018, eb01MountainGod018, eb01MountainGod018],
          hand: [eb01Blueno033],
          trash: [op03Tilestone064],
          activeDon: 5,
        },
        // Doma is a legal target for Caribou's [On K.O.], so any K.O. trigger
        // would surface as a prompt.
        { character: [eb01Doma005] },
      );
      const caribouId = engine.asSouth().findOnField(op01Caribou007);
      const tilestoneId = engine.asSouth().findInZone("trash", op03Tilestone064);

      // Playing Blueno fills the fifth slot; his [On Play] then plays a
      // [Water Seven] cost-5 Character from the trash — an effect-driven play
      // into the full Character area.
      engine.asSouth().play(eb01Blueno033);
      const southView = engine.asSouth().view();
      const fieldIds = southView.players.south.characters.flatMap((card) =>
        card?.instanceId ? [card.instanceId] : [],
      );
      const caribouSlot = southView.players.south.characters.findIndex(
        (card) => card?.instanceId === caribouId,
      );
      engine.asSouth().choose("effectCostReturnDon", ["active-don:0"]);
      engine.asSouth().choose("effectPlaySelection", [tilestoneId]);

      // 3-7-6-1: instead of fizzling, the effect pauses for the playing
      // player's mandatory replacement choice between their 5 Characters.
      const decision = engine.pendingDecision("effectPlayCharacterReplacement", "south");
      expect(decision.actorId).toBe("south");
      const step = decision.steps[0]!;
      if (step.kind !== "selectEntity") throw new Error("Expected the replacement choice.");
      expect(step.min).toBe(1);
      expect(step.max).toBe(1);
      expect(
        step.candidates.map((candidate) => candidate.ref.id).sort((a, b) => a.localeCompare(b)),
      ).toEqual([...fieldIds].sort((a, b) => a.localeCompare(b)));

      engine.asSouth().choose("effectPlayCharacterReplacement", [caribouId]);

      const view = engine.asSouth().view();
      const characters = view.players.south.characters;
      expect(characters.filter((card) => card !== null)).toHaveLength(5);
      // The effect play completes into the slot the trashed Character freed.
      expect(characters[caribouSlot]?.instanceId).toBe(tilestoneId);
      expect(view.players.south.trash.map((card) => card.instanceId)).toContain(caribouId);
      // Blueno's effect does not say rested, so the Character enters active
      // (3-7-5).
      expect(characters[caribouSlot]?.rested).toBe(false);
      // 3-7-6-1-1 / 10-2-1-3: the trash processes a rule, so Caribou's
      // [On K.O.] never fires — no prompt appears and the opponent's
      // Character stays in play.
      expect(view.prompts).toHaveLength(0);
      expect(view.players.north.characters.some((card) => card?.cardId === eb01Doma005.id)).toBe(
        true,
      );
    });

    test("3-7-6-1: an effect that plays a Character rested keeps the rested placement", () => {
      const engine = OnePieceTestEngine.create({
        character: [eb01MountainGod018, eb01MountainGod018, eb01MountainGod018, eb01MountainGod018],
        hand: [op05Rebecca091, op02Komille097],
        activeDon: op05Rebecca091.cost,
      });
      const komilleId = engine.asSouth().findInZone("hand", op02Komille097);
      const fieldIds = engine
        .getView("south")
        .players.south.characters.flatMap((card) => (card?.instanceId ? [card.instanceId] : []));

      // Rebecca's [On Play] plays up to 1 black cost-3-or-less Character from
      // the hand rested; playing Rebecca herself fills the fifth slot.
      engine.asSouth().play(op05Rebecca091);
      engine.asSouth().choose("effectPlaySelection", [komilleId]);

      const trashedId = fieldIds[0]!;
      const trashedSlot = engine
        .getView("south")
        .players.south.characters.findIndex((card) => card?.instanceId === trashedId);
      engine.asSouth().choose("effectPlayCharacterReplacement", [trashedId]);

      const view = engine.asSouth().view();
      const characters = view.players.south.characters;
      expect(characters.filter((card) => card !== null)).toHaveLength(5);
      expect(characters[trashedSlot]?.instanceId).toBe(komilleId);
      // The effect says rested, so the replacement play enters rested.
      expect(characters[trashedSlot]?.rested).toBe(true);
      expect(view.players.south.trash.map((card) => card.instanceId)).toEqual([trashedId]);
      expect(view.prompts).toHaveLength(0);
    });
  });

  describe("3-8 Stage Area", () => {
    test("3-8-2 and 3-8-4: Stages are played active in an open area", () => {
      const engine = OnePieceTestEngine.create({
        hand: [op13WindmillVillage022],
        activeDon: op13WindmillVillage022.cost,
      });

      engine.asSouth().play(op13WindmillVillage022);

      expect(engine.asSouth().view().players.south.stage).toMatchObject({
        cardId: op13WindmillVillage022.id,
        rested: false,
        hidden: false,
      });
      expect(engine.asNorth().view().players.south.stage?.cardId).toBe(op13WindmillVillage022.id);
    });

    test("3-8-5 and 3-8-5-1: playing a new Stage trashes the 1 Stage already in the Stage area", () => {
      const engine = OnePieceTestEngine.create({
        hand: [op13WindmillVillage022, op13WindmillVillage022],
        activeDon: 2,
      });
      const firstStageId = engine.asSouth().findInZone("hand", op13WindmillVillage022);

      engine.asSouth().play(op13WindmillVillage022);
      const secondStageId = engine.asSouth().findInZone("hand", op13WindmillVillage022);
      engine.asSouth().play(op13WindmillVillage022);

      expect(engine.asSouth().view().players.south.stage?.instanceId).toBe(secondStageId);
      expect(
        engine
          .asSouth()
          .view()
          .players.south.trash.map((card) => card.instanceId),
      ).toContain(firstStageId);
    });
  });

  describe("3-9 Cost Area", () => {
    test("3-9-2: the cost area is an open area; both players can view its contents", () => {
      const engine = OnePieceTestEngine.create({ activeDon: 3, restedDon: 2 }, {});

      for (const viewer of VIEWERS) {
        const view = viewer === "south" ? engine.asSouth().view() : engine.asNorth().view();
        expect(view.players.south.activeDon).toBe(3);
        expect(view.players.south.restedDon).toBe(2);
      }
    });

    test("3-9-3: DON!! cards are placed in the cost area as active", () => {
      const engine = OnePieceTestEngine.create({}, {});

      engine.asSouth().endTurn();

      const view = engine.asNorth().view();
      expect(view.players.north.activeDon).toBe(2);
      expect(view.players.north.restedDon).toBe(0);
      expect(view.players.north.donDeckCount).toBe(8);
    });
  });

  describe("3-10 Life Area", () => {
    test("3-10-1: each player's Life cards match their Leader's printed Life", () => {
      const engine = OnePieceTestEngine.create();
      const leader = getCard("OP13-001");
      if (leader.cardType !== "leader") throw new Error("Expected a Leader card.");

      expect(engine.asSouth().view().players.south.lifeCount).toBe(leader.life);
      expect(engine.asSouth().view().players.north.lifeCount).toBe(leader.life);
    });

    test("3-10-2: the Life area is a secret area; neither player can check face-down Life cards", () => {
      const engine = OnePieceTestEngine.create({ life: [eb01Doma005, eb01Fourtricks025] }, {});

      for (const viewer of VIEWERS) {
        const life = (viewer === "south" ? engine.asSouth().view() : engine.asNorth().view())
          .players.south.life;
        expect(life).toHaveLength(2);
        expect(life.every((card) => card.hidden && card.cardId === null)).toBe(true);
      }
    });

    test("3-10-2: the card at the top of the Life cards is moved first", () => {
      const engine = OnePieceTestEngine.create(
        { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
        { life: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018] },
        SOUTH_ATTACKS,
      );
      const attackerId = engine.asSouth().findOnField(eb01MountainGod018);
      const topLifeId = engine.asNorth().findInZone("life", eb01Doma005);
      const secondLifeId = engine.asNorth().findInZone("life", eb01Fourtricks025);

      engine.asSouth().attack(attackerId, engine.asNorth().leader());

      // The physical top Life card moved to the owner's hand; the second card
      // is now at the top. Raw state is used only for hidden-zone identity.
      const northView = engine.asNorth().view();
      expect(northView.players.north.hand.map((card) => card.instanceId)).toContain(topLifeId);
      expect(northView.players.north.lifeCount).toBe(2);
      expect(engine.getState().players.north.life[0]).toBe(secondLifeId);

      // The moved card stays hidden from the opponent in its new secret area.
      const southView = engine.asSouth().view();
      expect(southView.players.north.handCount).toBe(1);
      expect(
        southView.players.north.hand.every((card) => card.hidden && card.cardId === null),
      ).toBe(true);
    });

    test("3-10-2-1: a card added to the Life area face-up is treated as an open card", () => {
      const engine = OnePieceTestEngine.create({
        hand: [op10CaponeGangBege103, op10Urouge101],
        life: [eb01Doma005, eb01Doma005],
        activeDon: 1,
      });
      const urougeId = engine.asSouth().findInZone("hand", op10Urouge101);

      engine.asSouth().play(op10CaponeGangBege103);
      engine.asSouth().acceptOptional();
      engine.asSouth().chooseOption("effectCostAddLifeToHand", "top");
      engine.asSouth().choose("effectTargetSelection", [urougeId]);

      for (const viewer of VIEWERS) {
        expect(
          (viewer === "south" ? engine.asSouth().view() : engine.asNorth().view()).players.south
            .life[0],
        ).toMatchObject({
          instanceId: urougeId,
          cardId: op10Urouge101.id,
          hidden: false,
        });
      }
    });

    test("3-10-3: looking at face-down Life cards leaves them face-down after the effect", () => {
      const engine = OnePieceTestEngine.create({
        hand: [op03Shirley104],
        life: [eb01Doma005, eb01Fourtricks025],
        activeDon: op03Shirley104.cost,
      });
      const topLifeId = engine.asSouth().findInZone("life", eb01Doma005);

      engine.asSouth().play(op03Shirley104);
      engine.asSouth().chooseOption("effectLookAtLifeOwner", "self");
      engine.asSouth().chooseOption("effectLookAtLifePosition", "bottom");

      expect(engine.getState().players.south.life.at(-1)).toBe(topLifeId);
      for (const viewer of VIEWERS) {
        const life = (viewer === "south" ? engine.asSouth().view() : engine.asNorth().view())
          .players.south.life;
        expect(life.every((card) => card.hidden && card.cardId === null)).toBe(true);
      }
    });

    test("3-10-3: looking at a face-up Life card leaves it face-up after the effect", () => {
      const engine = OnePieceTestEngine.create({
        hand: [op03Shirley104],
        life: [{ card: eb01Fourtricks025, faceUp: true, publicKnowledge: true }, eb01Doma005],
        activeDon: op03Shirley104.cost,
      });
      const faceUpLifeId = engine.asSouth().findInZone("life", eb01Fourtricks025);

      engine.asSouth().play(op03Shirley104);
      engine.asSouth().chooseOption("effectLookAtLifeOwner", "self");
      engine.asSouth().chooseOption("effectLookAtLifePosition", "bottom");

      for (const viewer of VIEWERS) {
        const life = (viewer === "south" ? engine.asSouth().view() : engine.asNorth().view())
          .players.south.life;
        expect(life.at(-1)).toMatchObject({
          instanceId: faceUpLifeId,
          cardId: eb01Fourtricks025.id,
          hidden: false,
        });
        expect(life[0]).toMatchObject({ cardId: null, hidden: true });
      }
    });
  });
});
