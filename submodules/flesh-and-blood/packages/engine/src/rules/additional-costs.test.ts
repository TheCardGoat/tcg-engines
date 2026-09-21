import { describe, expect, it } from "vite-plus/test";
import { alphaRampageRed } from "../../../cards/src/cards/actions/alpha-rampage.ts";
import { boneyardMarauderRed } from "../../../cards/src/cards/actions/boneyard-marauder.ts";
import { blizzardBlue } from "../../../cards/src/cards/instants/blizzard.ts";
import { bonebreakerBellowRed } from "../../../cards/src/cards/actions/bonebreaker-bellow.ts";
import { crossTheLineYellow } from "../../../cards/src/cards/actions/cross-the-line.ts";
import { demolitionCrewRed } from "../../../cards/src/cards/actions/demolition-crew.ts";
import { elementalStrikeRed } from "../../../cards/src/cards/actions/elemental-strike.ts";
import { entwineIceRed } from "../../../cards/src/cards/actions/entwine-ice.ts";
import { hadronColliderRed } from "../../../cards/src/cards/actions/hadron-collider.ts";
import { hurlRed } from "../../../cards/src/cards/actions/hurl.ts";
import { nimbleStrikeRed } from "../../../cards/src/cards/actions/nimble-strike.ts";
import { nimblismBlue as authoredNimblismBlue } from "../../../cards/src/cards/actions/nimblism.ts";
import { scrapTraderRed } from "../../../cards/src/cards/actions/scrap-trader.ts";
import { zeroToSixtyRed } from "../../../cards/src/cards/actions/zero-to-sixty.ts";
import { rhinar } from "../../../cards/src/cards/heroes/rhinar.ts";
import { seedsOfTomorrowBlue } from "../../../cards/src/cards/instants/seeds-of-tomorrow.ts";
import { listLegalCommands } from "../automation/legal-commands.ts";
import { expectFabCard, expectFabUnplayable } from "../testing/fluent-assert.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import { bravo, cintariSellsword, dash, snatchRed } from "./fixtures.ts";
import { quoteFabPlay } from "./legality-quotes.ts";

/**
 * Public command-contract coverage for CR 5.1.3b and 5.4.4a.
 *
 * Card behavior stays in each authored card suite. This file owns how the
 * legal-command surface distinguishes optional declarations from mandatory
 * costs and how those commands enter the play procedure.
 */
describe("FAB additional-cost legal commands", () => {
  describe("optional additional costs", () => {
    it("offers Boost as a separate legal play declaration only when its deck cost is payable", () => {
      const payable = FabTestEngine.start(
        { hero: dash, hand: [zeroToSixtyRed], deck: [snatchRed] },
        { hero: bravo, hand: [], deck: 4 },
      );
      const actorId = payable.as(dash).id;
      const commands = listLegalCommands(payable.getRuntime(), actorId).filter(
        (command) =>
          command.move === "begin-play" &&
          command.payload.instanceId === payable.as(dash).findCardInZone("hand", zeroToSixtyRed),
      );

      expect(commands).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            label: "Play Zero To Sixty → Bravo",
            payload: expect.objectContaining({ target: "player-2" }),
          }),
          expect.objectContaining({
            label: "Play Zero To Sixty with Boost → Bravo",
            payload: expect.objectContaining({ target: "player-2", boost: true }),
          }),
        ]),
      );

      const emptyDeck = FabTestEngine.start(
        { hero: dash, hand: [zeroToSixtyRed], deck: [] },
        { hero: bravo, hand: [], deck: 4 },
      );
      const emptyDeckCommands = listLegalCommands(emptyDeck.getRuntime(), emptyDeck.as(dash).id);
      expect(emptyDeckCommands.some((command) => command.payload.boost === true)).toBe(false);
    });

    it("offers Fusion with its exact authored hand reveal and omits it when no reveal can pay the cost", () => {
      const payable = FabTestEngine.start(
        { hero: dash, hand: [entwineIceRed, blizzardBlue], deck: 4 },
        { hero: bravo, hand: [], deck: 4 },
      );
      const actorId = payable.as(dash).id;
      const entwineId = payable.as(dash).findCardInZone("hand", entwineIceRed);
      const blizzardId = payable.as(dash).findCardInZone("hand", blizzardBlue);
      const commands = listLegalCommands(payable.getRuntime(), actorId).filter(
        (command) => command.move === "begin-play" && command.payload.instanceId === entwineId,
      );

      expect(commands).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            label: "Play Entwine Ice with Fusion (reveal Blizzard) → Bravo",
            payload: expect.objectContaining({
              target: "player-2",
              fuse: true,
              fuseInstanceIds: [blizzardId],
            }),
          }),
        ]),
      );

      const noIceInHand = FabTestEngine.start(
        { hero: dash, hand: [entwineIceRed, snatchRed], deck: 4 },
        { hero: bravo, hand: [], deck: 4 },
      );
      const noIceCommands = listLegalCommands(noIceInHand.getRuntime(), noIceInHand.as(dash).id);
      expect(noIceCommands.some((command) => command.payload.fuse === true)).toBe(false);
    });

    it("offers Beat Chest with each legal 6-power discard and preserves the decline declaration", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [bonebreakerBellowRed, alphaRampageRed, snatchRed], deck: 4 },
        { hero: dash, hand: [], deck: 4 },
      );
      const Bravo = game.as(bravo);
      const bellowId = Bravo.findCardInZone("hand", bonebreakerBellowRed);
      const alphaId = Bravo.findCardInZone("hand", alphaRampageRed);
      const commands = listLegalCommands(game.getRuntime(), Bravo.id).filter(
        (command) => command.move === "begin-play" && command.payload.instanceId === bellowId,
      );

      expect(commands).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            label: "Play Bonebreaker Bellow",
            payload: expect.objectContaining({ instanceId: bellowId }),
          }),
          expect.objectContaining({
            label: "Play Bonebreaker Bellow with Beat Chest with Alpha Rampage",
            payload: expect.objectContaining({
              instanceId: bellowId,
              beatChest: true,
              beatChestInstanceId: alphaId,
            }),
          }),
        ]),
      );
      expect(commands.some((command) => command.payload.beatChestInstanceId === undefined)).toBe(
        true,
      );
      expect(
        commands.some(
          (command) =>
            command.payload.beatChestInstanceId === Bravo.findCardInZone("hand", snatchRed),
        ),
      ).toBe(false);
    });

    it("offers Scrap, Charge, and graveyard-banish declarations only for legal real cards", () => {
      const scrapGame = FabTestEngine.start(
        { hero: dash, hand: [scrapTraderRed], graveyard: [hadronColliderRed, snatchRed], deck: 4 },
        { hero: bravo, hand: [], deck: 4 },
      );
      const ScrapDash = scrapGame.as(dash);
      const scrapId = ScrapDash.findCardInZone("hand", scrapTraderRed);
      const hadronId = ScrapDash.findCardInZone("graveyard", hadronColliderRed);
      const scrapCommands = listLegalCommands(scrapGame.getRuntime(), ScrapDash.id).filter(
        (command) => command.move === "begin-play" && command.payload.instanceId === scrapId,
      );
      expect(scrapCommands).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            payload: expect.objectContaining({ instanceId: scrapId }),
          }),
          expect.objectContaining({
            payload: expect.objectContaining({
              scrap: true,
              scrapInstanceId: hadronId,
            }),
          }),
        ]),
      );
      expect(
        scrapCommands.some(
          (command) =>
            command.payload.scrapInstanceId === ScrapDash.findCardInZone("graveyard", snatchRed),
        ),
      ).toBe(false);

      const chargeGame = FabTestEngine.start(
        { hero: bravo, hand: [crossTheLineYellow, snatchRed], deck: 4 },
        { hero: dash, hand: [], deck: 4 },
      );
      const ChargeBravo = chargeGame.as(bravo);
      const chargeAttackId = ChargeBravo.findCardInZone("hand", crossTheLineYellow);
      const chargeCardId = ChargeBravo.findCardInZone("hand", snatchRed);
      expect(
        listLegalCommands(chargeGame.getRuntime(), ChargeBravo.id).some(
          (command) =>
            command.move === "begin-play" &&
            command.payload.instanceId === chargeAttackId &&
            command.payload.chargeInstanceId === chargeCardId,
        ),
      ).toBe(true);

      const banishGame = FabTestEngine.start(
        {
          hero: bravo,
          hand: [nimbleStrikeRed],
          graveyard: [authoredNimblismBlue, snatchRed],
          deck: 4,
        },
        { hero: dash, hand: [], deck: 4 },
      );
      const BanishBravo = banishGame.as(bravo);
      const nimbleStrikeId = BanishBravo.findCardInZone("hand", nimbleStrikeRed);
      const nimblismId = BanishBravo.findCardInZone("graveyard", authoredNimblismBlue);
      const banishCommands = listLegalCommands(banishGame.getRuntime(), BanishBravo.id).filter(
        (command) => command.move === "begin-play" && command.payload.instanceId === nimbleStrikeId,
      );
      expect(
        banishCommands.some((command) => command.payload.banishCostInstanceId === nimblismId),
      ).toBe(true);
      expect(
        banishCommands.some(
          (command) =>
            command.payload.banishCostInstanceId ===
            BanishBravo.findCardInZone("graveyard", snatchRed),
        ),
      ).toBe(false);
    });

    it("offers authored generic optional additional costs as explicit pay or decline declarations", () => {
      const game = FabTestEngine.start(
        { hero: cintariSellsword, hand: [hurlRed, snatchRed], deck: 4 },
        { hero: bravo, hand: [], deck: 4 },
      );
      const actor = game.as(cintariSellsword);
      const hurlId = actor.findCardInZone("hand", hurlRed);
      const commands = listLegalCommands(game.getRuntime(), actor.id).filter(
        (command) => command.move === "begin-play" && command.payload.instanceId === hurlId,
      );

      expect(commands).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            label: "Play Hurl → Bravo",
            payload: expect.objectContaining({
              declaredOptionalCostAbilityIds: [
                "D9hnm7hf7fWbFWtqKbKFb:playResourcesGrantPropertyTriggeredAttackSequenceDealDamageConditionalBindingNumericSetStatusHitDestroyPermanent",
              ],
            }),
          }),
          expect.objectContaining({
            label: "Play Hurl with Pay 1 resource → Bravo",
            payload: expect.objectContaining({
              declaredOptionalCostAbilityIds: [
                "D9hnm7hf7fWbFWtqKbKFb:playResourcesGrantPropertyTriggeredAttackSequenceDealDamageConditionalBindingNumericSetStatusHitDestroyPermanent",
              ],
              paidOptionalCostAbilityIds: [
                "D9hnm7hf7fWbFWtqKbKFb:playResourcesGrantPropertyTriggeredAttackSequenceDealDamageConditionalBindingNumericSetStatusHitDestroyPermanent",
              ],
            }),
          }),
        ]),
      );

      const paid = commands.find((command) => command.payload.paidOptionalCostAbilityIds);
      if (!paid) throw new Error("Missing Hurl's paid optional-cost declaration.");
      expect(game.getRuntime().dispatch(paid.move, actor.id, paid.payload)).toMatchObject({
        accepted: true,
        state: {
          decision: {
            kind: "payment",
          },
        },
      });
    });

    it("offers only the decline declaration when Hurl's optional resource cost cannot be paid", () => {
      const game = FabTestEngine.start(
        { hero: cintariSellsword, hand: [hurlRed], resourcePoints: 0, deck: 4 },
        { hero: bravo, hand: [], deck: 4 },
      );
      const actor = game.as(cintariSellsword);
      const hurlId = actor.findCardInZone("hand", hurlRed);
      const commands = listLegalCommands(game.getRuntime(), actor.id).filter(
        (command) => command.move === "begin-play" && command.payload.instanceId === hurlId,
      );

      expect(commands).toHaveLength(1);
      expect(commands[0]).toMatchObject({
        label: "Play Hurl → Bravo",
        payload: {
          instanceId: hurlId,
          declaredOptionalCostAbilityIds: [expect.any(String)],
        },
      });
      expect(commands[0]?.payload).not.toHaveProperty("paidOptionalCostAbilityIds");
    });
  });

  describe("mandatory additional costs", () => {
    it("offers one Alpha Rampage play line with no decline declaration when its random discard is payable", () => {
      const game = FabTestEngine.start(
        {
          hero: rhinar,
          hand: [alphaRampageRed, authoredNimblismBlue],
          resourcePoints: 3,
          deck: 4,
        },
        { hero: dash, hand: [], deck: 4 },
      );
      const actor = game.as(rhinar);
      const alphaId = actor.findCardInZone("hand", alphaRampageRed);
      const commands = listLegalCommands(game.getRuntime(), actor.id).filter(
        (command) => command.move === "begin-play" && command.payload.instanceId === alphaId,
      );

      expect(commands).toHaveLength(1);
      expect(commands[0]).toMatchObject({
        label: "Play Alpha Rampage → Dash",
        payload: { instanceId: alphaId },
      });
      expect(commands[0]?.payload).not.toHaveProperty("declaredOptionalCostAbilityIds");
      expect(
        quoteFabPlay(game.getState(), {
          actorId: actor.id,
          instanceId: alphaId,
          from: "hand",
          attackTargetId: game.as(dash).id,
        }),
      ).toMatchObject({
        allowed: true,
        additionalCosts: [expect.any(String)],
      });
    });

    it("omits Alpha Rampage from legal commands when its mandatory discard cannot be paid", () => {
      const game = FabTestEngine.start(
        {
          hero: rhinar,
          hand: [alphaRampageRed],
          resourcePoints: 3,
          deck: 4,
        },
        { hero: dash, hand: [], deck: 4 },
      );
      const actor = game.as(rhinar);
      const alphaId = actor.findCardInZone("hand", alphaRampageRed);
      expect(
        quoteFabPlay(game.getState(), {
          actorId: actor.id,
          instanceId: alphaId,
          from: "hand",
          attackTargetId: game.as(dash).id,
        }),
      ).toMatchObject({
        allowed: false,
        reasonCode: "additional_cost_unpayable",
        reason: "A mandatory additional cost cannot be paid.",
      });
      expect(
        listLegalCommands(game.getRuntime(), actor.id).some(
          (candidate) =>
            candidate.move === "begin-play" && candidate.payload.instanceId === alphaId,
        ),
      ).toBe(false);
    });

    it.each([
      {
        label: "banish 3 cards from graveyard",
        card: boneyardMarauderRed,
        isAttack: true,
      },
      {
        label: "banish a card from hand",
        card: elementalStrikeRed,
        isAttack: true,
      },
      {
        label: "reveal a qualifying card from hand",
        card: demolitionCrewRed,
        isAttack: true,
        otherHand: [snatchRed],
      },
      {
        label: "put an arsenal card on the bottom of the deck",
        card: seedsOfTomorrowBlue,
        isAttack: false,
      },
    ])(
      "omits a play whose mandatory cost is unpayable: $label",
      ({ card, isAttack, otherHand = [] }) => {
        const game = FabTestEngine.start(
          {
            hero: rhinar,
            hand: [card, ...otherHand],
            resourcePoints: 20,
            deck: 4,
          },
          { hero: dash, hand: [], deck: 4 },
        );
        const actor = game.as(rhinar);
        const instanceId = actor.findCardInZone("hand", card);
        const quote = quoteFabPlay(game.getState(), {
          actorId: actor.id,
          instanceId,
          from: "hand",
          ...(isAttack ? { attackTargetId: game.as(dash).id } : {}),
        });

        expect(quote).toMatchObject({
          allowed: false,
          reasonCode: "additional_cost_unpayable",
          reason: "A mandatory additional cost cannot be paid.",
        });
        expect(
          listLegalCommands(game.getRuntime(), actor.id).some(
            (candidate) =>
              candidate.move === "begin-play" && candidate.payload.instanceId === instanceId,
          ),
        ).toBe(false);
      },
    );
  });
});

/**
 * Player-visible receipt coverage for the same rules contract.
 *
 * These assertions deliberately use the production narrative renderer: card
 * suites own the resulting effects, while this suite owns whether accepting or
 * rejecting an additional cost is represented truthfully in the game log.
 */
describe("FAB additional-cost player logs", () => {
  describe("optional additional costs", () => {
    it("logs Beat Chest only when the player chooses and pays it", () => {
      const declinedGame = FabTestEngine.start(
        {
          hero: rhinar,
          hand: [bonebreakerBellowRed, alphaRampageRed],
          resourcePoints: 1,
          deck: 4,
        },
        { hero: dash, hand: [], deck: 4 },
      );
      const DecliningRhinar = declinedGame.as(rhinar);

      DecliningRhinar.play(bonebreakerBellowRed);
      declinedGame.helpers.resolveUntilIdle();

      expect(declinedGame.renderedPlayerNarrative(DecliningRhinar.id)).toContain(
        "You played Bonebreaker Bellow.",
      );
      expect(declinedGame.renderedPlayerNarrative(DecliningRhinar.id)).not.toEqual(
        expect.arrayContaining([expect.stringContaining("beat your chest")]),
      );
      expectFabCard(DecliningRhinar, alphaRampageRed).toBeIn("hand");

      const paidGame = FabTestEngine.start(
        {
          hero: rhinar,
          hand: [bonebreakerBellowRed, alphaRampageRed],
          resourcePoints: 1,
          deck: 4,
        },
        { hero: dash, hand: [], deck: 4 },
      );
      const PayingRhinar = paidGame.as(rhinar);
      const discardedId = PayingRhinar.findCardInZone("hand", alphaRampageRed);

      PayingRhinar.play(bonebreakerBellowRed, {
        beatChest: true,
        beatChestInstanceId: discardedId,
      });
      paidGame.helpers.resolveUntilIdle();

      expect(paidGame.renderedPlayerNarrative(PayingRhinar.id)).toEqual(
        expect.arrayContaining([
          "You played Bonebreaker Bellow.",
          "You beat your chest and discarded Alpha Rampage.",
        ]),
      );
      expectFabCard(PayingRhinar, alphaRampageRed).toBeIn("graveyard");
    });
  });

  describe("mandatory additional costs", () => {
    it("logs the paid random discard alongside an accepted Alpha Rampage play", () => {
      const game = FabTestEngine.start(
        {
          hero: rhinar,
          hand: [alphaRampageRed, authoredNimblismBlue],
          resourcePoints: 3,
          deck: 4,
        },
        { hero: dash, hand: [], deck: 4 },
      );
      const Rhinar = game.as(rhinar);

      Rhinar.playAttack(alphaRampageRed, { stopAt: "on-attack" });

      expect(game.renderedPlayerNarrative(Rhinar.id)).toEqual(
        expect.arrayContaining(["You played Alpha Rampage.", "You discarded Nimblism at random."]),
      );
      expectFabCard(Rhinar, authoredNimblismBlue).toBeIn("graveyard");
    });

    it("does not play or log Alpha Rampage when its mandatory discard cannot be paid", () => {
      const game = FabTestEngine.start(
        {
          hero: rhinar,
          hand: [alphaRampageRed],
          resourcePoints: 3,
          deck: 4,
        },
        { hero: dash, hand: [], deck: 4 },
      );
      const Rhinar = game.as(rhinar);

      expectFabUnplayable(() => Rhinar.playAttack(alphaRampageRed, { stopAt: "on-attack" }));

      expect(game.renderedPlayerNarrative(Rhinar.id)).toEqual([]);
      expectFabCard(Rhinar, alphaRampageRed).toBeIn("hand");
    });
  });
});
