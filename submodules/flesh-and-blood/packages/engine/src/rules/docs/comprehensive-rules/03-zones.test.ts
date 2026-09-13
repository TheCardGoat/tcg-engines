/**
 * CR Chapter 3 — Zones (defining sections).
 * 3.0 visibility, 3.3 arsenal, 3.6 combat chain, 3.7 deck, 3.9 hand, 3.14 pitch, equipment.
 */
import { describe, expect, it } from "vite-plus/test";
import { FAB_FACE_DOWN, FabTestEngine } from "../../../index.ts";
import {
  bravo,
  aurumAegis,
  dash,
  nimblismBlue,
  pummelRed,
  parryBlade,
  regurgitatingSlogRed,
  scabskinLeathers,
  scourTheBattlescapeRed,
  snatchRed,
  unmovableRed,
} from "../../fixtures.ts";

describe("CR 3 — Zones", () => {
  it("3.0 / 3.7 / 3.9: deck order hidden; own hand visible; opponent hand face-down", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, hand: [nimblismBlue], deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const view = game.getView({ role: "player", actorId: game.as(bravo).id });
    expect(view.players[game.as(bravo).id]!.zones.deck.every((id) => id === FAB_FACE_DOWN)).toBe(
      true,
    );
    expect(view.players[game.as(bravo).id]!.zones.hand.some((id) => id !== FAB_FACE_DOWN)).toBe(
      true,
    );
    expect(view.players[game.as(dash).id]!.zones.hand.every((id) => id === FAB_FACE_DOWN)).toBe(
      true,
    );
  });

  it("3.14: pitch zone is public to opponents", () => {
    // Seed pitch zone (cards enter pitch via payment or effects in real play).
    const game = FabTestEngine.start(
      { hero: bravo, pitch: [nimblismBlue], deck: 4 },
      { hero: dash, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const pitchId = game.findCardInZone(game.as(bravo).id, "pitch", nimblismBlue);
    const view = game.getView({ role: "player", actorId: game.as(dash).id });
    expect(view.players[game.as(bravo).id]!.zones.pitch).toContain(pitchId);
  });

  /**
   * CR 3.6 Combat Chain — public shared zone; open during combat, closed otherwise.
   * Objects on the chain: attacking cards, defending cards, defense reactions.
   * Closing (CR 7.7) clears non-equipment objects to the graveyard.
   */
  describe("3.6 Combat Chain", () => {
    it("holds attacking and defending cards while open (hand block)", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [snatchRed], deck: 6 },
        { hero: dash, hand: [nimblismBlue], deck: 6 },
        // Walks priority/pitch timing by hand - opt out of the smart defaults.
        { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
      );
      game.as(bravo).attackWith(snatchRed);
      game.as(dash).blockWith(nimblismBlue);
      expect(game.combat()?.open).toBe(true);
      expect(game.as(bravo).zone("combatChain")).toContain(snatchRed.canonicalId);
      expect(game.as(dash).zone("combatChain")).toContain(nimblismBlue.canonicalId);
      game.helpers.resolveRestOfCombat();
      expect(game.as(bravo).zone("graveyard")).toContain(snatchRed.canonicalId);
    });

    it("3.6.1 / 3.0.4a: combat chain is a public zone (opponent can see cards on it)", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [snatchRed], deck: 6 },
        { hero: dash, hand: [nimblismBlue], deck: 6 },
        // Walks priority/pitch timing by hand - opt out of the smart defaults.
        { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
      );
      game.as(bravo).attackWith(snatchRed);
      game.as(dash).blockWith(nimblismBlue);
      const attackId = game.findCardInZone(game.as(bravo).id, "combatChain", snatchRed);
      const blockId = game.findCardInZone(game.as(dash).id, "combatChain", nimblismBlue);
      // Opponent view still sees both sides' chain objects (public zone).
      const viewDash = game.getView({ role: "player", actorId: game.as(dash).id });
      expect(viewDash.players[game.as(bravo).id]!.zones.combatChain).toContain(attackId);
      expect(viewDash.players[game.as(dash).id]!.zones.combatChain).toContain(blockId);
    });

    it("3.6.1 / 3.3: a card played from arsenal is face-up on the public combat chain", () => {
      const game = FabTestEngine.start(
        { hero: bravo, arsenal: [scourTheBattlescapeRed], deck: 6 },
        { hero: dash, deck: 6 },
        { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
      );
      const Bravo = game.as(bravo);
      const Dash = game.as(dash);
      const attackId = Bravo.findCardInZone("arsenal", scourTheBattlescapeRed);

      expect(game.getView({ role: "player", actorId: Bravo.id }).faceDownInstanceIds).toContain(
        attackId,
      );

      Bravo.attackWith(scourTheBattlescapeRed, { from: "arsenal" });

      const opponentView = game.getView({ role: "player", actorId: Dash.id });
      expect(opponentView.players[Bravo.id]!.zones.combatChain).toContain(attackId);
      expect(opponentView.faceDownInstanceIds).not.toContain(attackId);
    });

    it("does not close mid-combat: cards remain on the chain through Defend / Reaction / Damage", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [snatchRed], deck: 6 },
        { hero: dash, life: 20, hand: [nimblismBlue], deck: 6 },
        // Walks priority/pitch timing by hand - opt out of the smart defaults.
        { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
      );
      const Bravo = game.as(bravo);
      const Dash = game.as(dash);

      Bravo.play(snatchRed);
      expect(game.combat()).toMatchObject({ open: true, step: "layer" });
      expect(game.getState().rulesStack.at(-1)).toMatchObject({ kind: "card", role: "attack" });
      // The attack opens Layer immediately; after Layer → Attack, the card is
      // on the combat chain.
      game.passBoth(); // → attack
      expect(game.combat()?.open).toBe(true);
      expect(game.combat()?.step).toBe("attack");
      expect(Bravo.zone("combatChain")).toContain(snatchRed.canonicalId);
      expect(Bravo.zone("graveyard")).not.toContain(snatchRed.canonicalId);

      game.passBoth(); // → defend
      expect(game.combat()?.step).toBe("defend");
      Dash.blockWith(nimblismBlue);
      expect(Dash.zone("combatChain")).toContain(nimblismBlue.canonicalId);
      // Still open — chain not closed by declaring defenders.
      expect(game.combat()?.open).toBe(true);
      expect(Bravo.zone("graveyard")).not.toContain(snatchRed.canonicalId);
      expect(Dash.zone("graveyard")).not.toContain(nimblismBlue.canonicalId);

      Bravo.pass();
      Dash.pass();
      expect(game.combat()?.step).toBe("reaction");
      expect(game.combat()?.open).toBe(true);
      expect(Bravo.zone("combatChain")).toContain(snatchRed.canonicalId);
      expect(Dash.zone("combatChain")).toContain(nimblismBlue.canonicalId);

      game.passBoth(); // → damage
      expect(game.combat()?.step).toBe("damage");
      expect(game.combat()?.open).toBe(true);
      // Damage does not clear the chain (CR 7.5 → 7.6 → 7.7).
      expect(Bravo.zone("combatChain")).toContain(snatchRed.canonicalId);
      expect(Dash.zone("combatChain")).toContain(nimblismBlue.canonicalId);
      expect(Dash.life()).toBe(18); // 4 − 2
    });

    it("closes the chain: Clear Step empties combatChain and sends non-equipment to GY", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [snatchRed], deck: 6 },
        { hero: dash, life: 20, hand: [nimblismBlue], deck: 6 },
        // Walks priority/pitch timing by hand - opt out of the smart defaults.
        { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
      );
      const Bravo = game.as(bravo);
      const Dash = game.as(dash);

      Bravo.attackWith(snatchRed);
      Dash.blockWith(nimblismBlue);
      expect(game.combat()?.open).toBe(true);
      expect(Bravo.zone("combatChain")).toContain(snatchRed.canonicalId);
      expect(Dash.zone("combatChain")).toContain(nimblismBlue.canonicalId);

      game.helpers.resolveRestOfCombat();

      // 3.6.4: chain is closed outside combat.
      expect(game.combat()).toBeNull();
      expect(Bravo.zone("combatChain")).toEqual([]);
      expect(Dash.zone("combatChain")).toEqual([]);
      // CR 7.7.5: attack + hand defender clear to graveyard.
      expect(Bravo.zone("graveyard")).toContain(snatchRed.canonicalId);
      expect(Dash.zone("graveyard")).toContain(nimblismBlue.canonicalId);
      expect(Dash.life()).toBe(18);
    });

    it("does not close when players leave combat mid-link (still open after partial passes)", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [snatchRed], deck: 6 },
        { hero: dash, life: 20, hand: [], deck: 6 },
        // Walks priority/pitch timing by hand - opt out of the smart defaults.
        { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
      );
      game.as(bravo).attackWith(snatchRed);
      // Defend step: pass blocks only — do not advance further.
      expect(game.combat()?.step).toBe("defend");
      expect(game.combat()?.open).toBe(true);
      expect(game.as(bravo).zone("combatChain")).toContain(snatchRed.canonicalId);
      expect(game.as(bravo).zone("graveyard")).not.toContain(snatchRed.canonicalId);
      // One priority pass is not enough to close combat.
      game.as(dash).defendWith([]);
      game.as(bravo).pass();
      expect(game.combat()?.open).toBe(true);
      expect(game.as(bravo).zone("combatChain")).toContain(snatchRed.canonicalId);
    });

    it("chain with defense reaction: DR joins the combat chain while open, then clears on close", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [snatchRed], deck: 6 },
        {
          hero: dash,
          life: 20,
          hand: [unmovableRed, nimblismBlue],
          deck: 6,
        },
        // Walks priority/pitch timing by hand - opt out of the smart defaults.
        { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
      );
      const Bravo = game.as(bravo);
      const Dash = game.as(dash);

      Bravo.attackWith(snatchRed);
      // No hand block → reaction step.
      Dash.defendWith([]);
      Bravo.pass();
      Dash.pass();
      expect(game.combat()?.step).toBe("reaction");
      expect(Bravo.zone("combatChain")).toContain(snatchRed.canonicalId);

      // Reaction priority starts with turn player.
      Bravo.pass();
      Dash.play(unmovableRed, { pitch: nimblismBlue });
      game.passBoth();

      // Defense reaction is on the combat chain (public zone) as a defending card.
      expect(game.combat()?.open).toBe(true);
      expect(Dash.zone("combatChain")).toContain(unmovableRed.canonicalId);
      expect(
        Object.values(game.combat()?.activeLink?.defendingInstanceIdsByTarget ?? {}).flat().length,
      ).toBe(1);
      // Attack still on chain; DR not yet in GY.
      expect(Bravo.zone("combatChain")).toContain(snatchRed.canonicalId);
      expect(Dash.zone("graveyard")).not.toContain(unmovableRed.canonicalId);

      game.helpers.resolveRestOfCombat();
      expect(game.combat()).toBeNull();
      expect(Bravo.zone("combatChain")).toEqual([]);
      expect(Dash.zone("combatChain")).toEqual([]);
      expect(Bravo.zone("graveyard")).toContain(snatchRed.canonicalId);
      expect(Dash.zone("graveyard")).toContain(unmovableRed.canonicalId);
      // Unmovable def 7 > Snatch power 4 → no damage.
      expect(Dash.life()).toBe(20);
    });

    it("chain with attack reaction: attack stays on combat chain while AR resolves (Pummel)", () => {
      const game = FabTestEngine.start(
        {
          hero: bravo,
          // Slog cost 2 / power 6; Pummel cost 2 needs two pitch cards.
          hand: [regurgitatingSlogRed, nimblismBlue, pummelRed, nimblismBlue, nimblismBlue],
          deck: 6,
        },
        { hero: dash, life: 20, hand: [], deck: 6 },
        // Walks priority/pitch timing by hand - opt out of the smart defaults.
        { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
      );
      const Bravo = game.as(bravo);
      const Dash = game.as(dash);

      Bravo.play(regurgitatingSlogRed, { pitch: [nimblismBlue] });
      game.passBoth(); // layer → attack
      game.passBoth(); // attack → defend
      Dash.defendWith([]);
      Bravo.pass();
      Dash.pass();
      expect(game.combat()?.step).toBe("reaction");
      expect(game.combat()?.open).toBe(true);
      expect(Bravo.zone("combatChain")).toContain(regurgitatingSlogRed.canonicalId);

      // Attack reaction (Pummel +4, hit-hero mode).
      Bravo.play(pummelRed, {
        modeIds: [`${pummelRed.canonicalId}:chooseMode:hitHero`],
        pitch: [nimblismBlue, nimblismBlue],
      });
      game.passBoth();
      // Attack remains on the combat chain; AR is recorded on the active link.
      expect(game.combat()?.open).toBe(true);
      expect(Bravo.zone("combatChain")).toContain(regurgitatingSlogRed.canonicalId);
      expect(game.combat()?.activeLink?.attackPower).toBe(10); // 6 + 4
      // Pummel itself resolves off-chain into GY in this engine slice (not a defending object).
      expect(Bravo.zone("graveyard")).toContain(pummelRed.canonicalId);
      expect(Bravo.zone("hand")).not.toContain(pummelRed.canonicalId);

      // Still open — not closed by playing an AR.
      game.helpers.resolveRestOfCombat();
      expect(game.combat()).toBeNull();
      expect(Bravo.zone("combatChain")).toEqual([]);
      expect(Bravo.zone("graveyard")).toContain(regurgitatingSlogRed.canonicalId);
      expect(Dash.life()).toBe(10); // 20 − 10
    });

    it("chain with both attack reaction and defense reaction", () => {
      const game = FabTestEngine.start(
        {
          hero: bravo,
          hand: [regurgitatingSlogRed, nimblismBlue, pummelRed, nimblismBlue, nimblismBlue],
          deck: 6,
        },
        {
          hero: dash,
          life: 20,
          hand: [unmovableRed, nimblismBlue],
          deck: 6,
        },
        // Walks priority/pitch timing by hand - opt out of the smart defaults.
        { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
      );
      const Bravo = game.as(bravo);
      const Dash = game.as(dash);

      Bravo.play(regurgitatingSlogRed, { pitch: [nimblismBlue] });
      game.passBoth();
      game.passBoth();
      // No hand block.
      Dash.defendWith([]);
      Bravo.pass();
      Dash.pass();
      expect(game.combat()?.step).toBe("reaction");

      // Attacker AR first (priority starts with turn player).
      Bravo.play(pummelRed, {
        modeIds: [`${pummelRed.canonicalId}:chooseMode:hitHero`],
        pitch: [nimblismBlue, nimblismBlue],
      });
      game.passBoth();
      expect(game.combat()?.activeLink?.attackPower).toBe(10);
      expect(Bravo.zone("combatChain")).toContain(regurgitatingSlogRed.canonicalId);

      // After AR, pass priority to the defending hero so they can play a DR.
      Bravo.pass();
      expect(Dash.hasPriority()).toBe(true);
      Dash.play(unmovableRed, { pitch: nimblismBlue });
      game.passBoth();
      expect(Dash.zone("combatChain")).toContain(unmovableRed.canonicalId);
      expect(game.combat()?.open).toBe(true);
      // Both attack and DR still on chain until close.
      expect(Bravo.zone("combatChain")).toContain(regurgitatingSlogRed.canonicalId);
      expect(Dash.zone("combatChain")).toContain(unmovableRed.canonicalId);

      game.helpers.resolveRestOfCombat();
      expect(game.combat()).toBeNull();
      expect(Bravo.zone("combatChain")).toEqual([]);
      expect(Dash.zone("combatChain")).toEqual([]);
      // 10 power − 7 defense = 3 damage.
      expect(Dash.life()).toBe(17);
    });

    it("multi-link: go again first attack closes link 1; second attack reopens combat chain", () => {
      const game = FabTestEngine.start(
        { hero: bravo, arsenal: [scourTheBattlescapeRed], hand: [snatchRed], deck: 8 },
        { hero: dash, life: 20, deck: 8 },
        // Walks priority/pitch timing by hand - opt out of the smart defaults.
        { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
      );
      const Bravo = game.as(bravo);
      const Dash = game.as(dash);

      // ── Link 1: Scour the Battlescape (go again from arsenal) ─────────────
      Bravo.attackWith(scourTheBattlescapeRed, { from: "arsenal" });
      expect(game.combat()?.step).toBe("defend");
      expect(game.combat()?.open).toBe(true);
      expect(game.combat()?.chainLinkNumber ?? 1).toBe(1);
      expect(Bravo.zone("combatChain")).toContain(scourTheBattlescapeRed.canonicalId);
      // No blocks — leave open through reaction then resolve.
      Dash.defendWith([]);
      Bravo.pass();
      Dash.pass();
      expect(game.combat()?.step).toBe("reaction");
      expect(game.combat()?.open).toBe(true);
      expect(Bravo.zone("combatChain")).toContain(scourTheBattlescapeRed.canonicalId);

      game.helpers.resolveRestOfCombat();
      // First link fully closed → chain cleared; go again grants 1 AP.
      expect(game.combat()).toBeNull();
      expect(Bravo.zone("combatChain")).toEqual([]);
      expect(Bravo.zone("graveyard")).toContain(scourTheBattlescapeRed.canonicalId);
      expect(Bravo.actionPoints()).toBe(1);
      expect(Dash.life()).toBe(17); // 20 − 3

      // ── Link 2: second attack reopens the combat chain ────────────────────
      Bravo.play(snatchRed);
      expect(game.combat()).toMatchObject({ open: true, step: "layer" });
      expect(game.getState().rulesStack.at(-1)).toMatchObject({ kind: "card", role: "attack" });
      game.passBoth();
      expect(game.combat()?.step).toBe("attack");
      // The current runtime closes the chain between go-again attacks, so the
      // next attack begins a fresh authoritative combat record.
      expect(game.combat()?.chainLinkNumber).toBe(1);
      expect(Bravo.zone("combatChain")).toContain(snatchRed.canonicalId);
      // Prior link's attack is not still on the chain (cleared at close).
      expect(Bravo.zone("combatChain")).not.toContain(scourTheBattlescapeRed.canonicalId);

      game.helpers.resolveRestOfCombat();
      expect(game.combat()).toBeNull();
      expect(Bravo.zone("combatChain")).toEqual([]);
      expect(Bravo.zone("graveyard")).toContain(snatchRed.canonicalId);
      expect(Dash.life()).toBe(13); // 17 − 4
    });

    it("multi-link with blocks: each link holds its own defending cards only while open", () => {
      const game = FabTestEngine.start(
        { hero: bravo, arsenal: [scourTheBattlescapeRed], hand: [snatchRed], deck: 8 },
        {
          hero: dash,
          life: 20,
          hand: [nimblismBlue, snatchRed],
          deck: 8,
        },
        // Walks priority/pitch timing by hand - opt out of the smart defaults.
        { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
      );
      const Bravo = game.as(bravo);
      const Dash = game.as(dash);

      // Link 1: block Scour with blue.
      Bravo.attackWith(scourTheBattlescapeRed, { from: "arsenal" });
      expect(game.combat()?.step).toBe("defend");
      Dash.blockWith(nimblismBlue);
      expect(Bravo.zone("combatChain")).toContain(scourTheBattlescapeRed.canonicalId);
      expect(Dash.zone("combatChain")).toContain(nimblismBlue.canonicalId);
      game.helpers.resolveRestOfCombat();
      expect(game.combat()).toBeNull();
      expect(Dash.zone("combatChain")).toEqual([]);
      expect(Dash.zone("graveyard")).toContain(nimblismBlue.canonicalId);
      // 3 − 2 = 1 damage.
      expect(Dash.life()).toBe(19);
      expect(Bravo.actionPoints()).toBe(1);

      // Link 2: block Snatch with a second card.
      Bravo.attackWith(snatchRed);
      Dash.blockWith(snatchRed);
      expect(Bravo.zone("combatChain")).toContain(snatchRed.canonicalId);
      expect(Dash.zone("combatChain")).toContain(snatchRed.canonicalId);
      // First-link objects must not reappear on the reopened chain.
      expect(Bravo.zone("combatChain")).not.toContain(scourTheBattlescapeRed.canonicalId);
      expect(Dash.zone("combatChain")).not.toContain(nimblismBlue.canonicalId);
      game.helpers.resolveRestOfCombat();
      expect(game.combat()).toBeNull();
      expect(Dash.life()).toBe(17); // 19 − (4 − 2)
    });

    it("equipment defender is on the combat chain while open and returns to equip zone on close", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [snatchRed], deck: 6 },
        { hero: dash, life: 20, legs: [scabskinLeathers], deck: 6 },
        // Walks priority/pitch timing by hand - opt out of the smart defaults.
        { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
      );
      const Dash = game.as(dash);
      const eqId = Dash.findCardInZone("legs", scabskinLeathers);

      game.as(bravo).attackWith(snatchRed);
      Dash.exec({ move: "defend", payload: { instanceIds: [eqId] } });
      expect(game.combat()?.open).toBe(true);
      expect(Dash.zone("combatChain")).toContain(scabskinLeathers.canonicalId);
      expect(Dash.zone("legs")).not.toContain(scabskinLeathers.canonicalId);

      game.helpers.resolveRestOfCombat();
      expect(game.combat()).toBeNull();
      expect(Dash.zone("combatChain")).toEqual([]);
      // CR 7.7.5: equipment returns; not cleared to GY.
      expect(Dash.zone("legs")).toContain(scabskinLeathers.canonicalId);
      expect(Dash.zone("graveyard")).not.toContain(scabskinLeathers.canonicalId);
    });

    it("a real zero-defense weapon has the defense property and may defend", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [snatchRed], deck: 6 },
        { hero: dash, life: 20, weapon1: [parryBlade], deck: 6 },
        // Walks priority/pitch timing by hand - opt out of the smart defaults.
        { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
      );
      const Dash = game.as(dash);
      const weaponId = Dash.findCardInZone("weapon1", parryBlade);

      game.as(bravo).attackWith(snatchRed);
      Dash.exec({ move: "defend", payload: { instanceIds: [weaponId] } });

      expect(Dash.zone("combatChain")).toContain(parryBlade.canonicalId);
      expect(game.combat()?.activeLink?.defendingOrigins[weaponId]).toEqual({
        kind: "equipment",
        zone: "weapon1",
      });
    });

    it("restores an off-hand defender to its exact second weapon slot", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [snatchRed], deck: 6 },
        { hero: dash, life: 20, weapon2: [aurumAegis], deck: 6 },
        // Walks priority/pitch timing by hand - opt out of the smart defaults.
        { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
      );
      const Dash = game.as(dash);
      const offHandId = Dash.findCardInZone("weapon2", aurumAegis);

      game.as(bravo).attackWith(snatchRed);
      Dash.exec({ move: "defend", payload: { instanceIds: [offHandId] } });
      expect(Dash.zone("weapon2")).not.toContain(aurumAegis.canonicalId);

      game.helpers.resolveRestOfCombat();
      expect(Dash.zone("weapon1")).not.toContain(aurumAegis.canonicalId);
      expect(Dash.zone("weapon2")).toContain(aurumAegis.canonicalId);
    });
  });

  it("3.3: end-turn may put a card into arsenal; arsenal is owner-private", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed, nimblismBlue], deck: 8 },
      { hero: dash, deck: 8 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    Bravo.endTurnWithArsenal(snatchRed);
    expect(Bravo.zone("arsenal")).toContain(snatchRed.canonicalId);

    const arsenalId = game.findCardInZone(Bravo.id, "arsenal", snatchRed);
    const ownerView = game.getView({ role: "player", actorId: Bravo.id });
    expect(ownerView.faceDownInstanceIds).toContain(arsenalId);

    const opponentView = game.getView({ role: "player", actorId: game.as(dash).id });
    expect(opponentView.players[Bravo.id]!.zones.arsenal).toEqual([FAB_FACE_DOWN]);
    expect(opponentView.faceDownInstanceIds).not.toContain(arsenalId);

    game.setObjectFaceDown(arsenalId, false);
    expect(game.getView({ role: "player", actorId: Bravo.id }).faceDownInstanceIds).not.toContain(
      arsenalId,
    );
    const viewOpp = game.getView({ role: "player", actorId: game.as(dash).id });
    expect(viewOpp.players[Bravo.id]!.zones.arsenal.every((id) => id === FAB_FACE_DOWN)).toBe(true);
  });

  it("3.2–3.12 equipment: legs zone seats equipment for defend; returns equipped after close", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, life: 20, legs: [scabskinLeathers], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    expect(game.as(dash).zone("legs")).toContain(scabskinLeathers.canonicalId);
    game.as(bravo).attackWith(snatchRed);
    // Defend with equipped legs (defense 2).
    const eqId = game.findCardInZone(game.as(dash).id, "legs", scabskinLeathers);
    game.as(dash).exec({ move: "defend", payload: { instanceIds: [eqId] } });
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(18);
    // Equipment returns to legs (CR 7.7.5) — not cleared to GY.
    expect(game.as(dash).zone("legs")).toContain(scabskinLeathers.canonicalId);
    expect(game.as(dash).zone("graveyard")).not.toContain(scabskinLeathers.canonicalId);
  });
});

function _declineCurrentBoolean(game: FabTestEngine): void {
  const decision = game.getState().decision;
  if (!decision || decision.kind !== "boolean") {
    throw new Error("Expected the persisted optional-effect decision.");
  }
  game.exec({
    move: "answer-decision",
    actorId: decision.actorId,
    payload: {
      decisionId: decision.decisionId,
      stateVersion: decision.stateVersion,
      answer: { kind: "boolean", value: false },
    },
  });
}
