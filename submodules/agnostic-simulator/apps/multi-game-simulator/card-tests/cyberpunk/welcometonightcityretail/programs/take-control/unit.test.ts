import { describe, expect, it } from "vite-plus/test";
import { CyberpunkTestEngine, P1, P2, createMockUnit } from "@cyberpunk-engine/testing/index.ts";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailTakeControl,
} from "@tcg/cyberpunk-cards";

const takeControl = welcomeToNightCityRetailTakeControl; // program, cost 2, Quick, sell tag

// A no-op friendly Unit so the rival can declare a direct attack on P1.
const filler = createMockUnit({ id: "tc-filler", name: "Filler", power: 1 });

describe("Take Control", () => {
  describe("[Quick] A rival Unit steals 1 fewer Gig this turn", () => {
    it("reduces the rival's steal by 1 when played as a reaction (10 power → steals 1)", () => {
      // Base rule: a power-10 attacker normally steals 2 (1 + floor(10/10)).
      // Take Control, played as a Quick reaction, must drop that to 1.
      const attacker = createMockUnit({
        id: "tc-attacker-10",
        name: "Ten Power Attacker",
        power: 10,
      });

      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [takeControl],
          field: [filler],
          gigArea: [
            { dieType: "d4", faceValue: 3 },
            { dieType: "d6", faceValue: 3 },
          ],
          eddies: 5,
        },
        { field: [{ card: attacker, spent: false, hasLag: false }], eddies: 5 },
      );

      // Make it P2's turn so P2 can declare a direct attack on P1.
      engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
      engine.attackRival(attacker, { as: P2 });
      engine.resolveAttack({ as: P2 }); // attack → react

      const gigsBefore = engine.getGigCount(P1);

      // P1 plays Take Control as a Quick reaction during the rival's attack.
      expect(engine.playCard(takeControl, { as: P1 })).toMatchObject({ success: true });

      engine.resolveAttack({ as: P1, pass: true }); // react → steal
      engine.resolveAttack({ as: P2 }); // steal resolves (auto-picks available gigs)

      // Only 1 gig was stolen instead of the usual 2.
      const resolved = engine.getLastEvent("attackResolved");
      expect(resolved).toMatchObject({ gigsStolen: 1 });
      expect(engine.getGigCount(P1)).toBe(gigsBefore - 1);
    });

    it("floors at 0 stolen gigs for low-power attackers (5 power normally steals 1)", () => {
      // A power-5 attacker normally steals 1. With Take Control it steals 0,
      // and P1 keeps their gig.
      const attacker = createMockUnit({
        id: "tc-attacker-5",
        name: "Five Power Attacker",
        power: 5,
      });

      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [takeControl],
          field: [filler],
          gigArea: [{ dieType: "d6", faceValue: 3 }],
          eddies: 5,
        },
        { field: [{ card: attacker, spent: false, hasLag: false }], eddies: 5 },
      );

      engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
      engine.attackRival(attacker, { as: P2 });
      engine.resolveAttack({ as: P2 }); // attack → react

      const gigsBefore = engine.getGigCount(P1);
      engine.playCard(takeControl, { as: P1 });
      engine.resolveAttack({ as: P1, pass: true }); // react → steal
      engine.resolveAttack({ as: P2, gigIdsToSteal: [] }); // nothing to steal

      const resolved = engine.getLastEvent("attackResolved");
      expect(resolved).toMatchObject({ gigsStolen: 0 });
      expect(engine.getGigCount(P1)).toBe(gigsBefore);
    });

    it("expires at end of turn so the steal reduction does not persist", () => {
      const attacker = createMockUnit({
        id: "tc-attacker-expire",
        name: "Expire Attacker",
        power: 10,
      });

      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [takeControl],
          field: [filler],
          gigArea: [
            { dieType: "d4", faceValue: 3 },
            { dieType: "d6", faceValue: 3 },
          ],
          eddies: 5,
        },
        { field: [{ card: attacker, spent: false, hasLag: false }], eddies: 5 },
      );

      engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
      engine.attackRival(attacker, { as: P2 });
      engine.resolveAttack({ as: P2 }); // attack → react
      engine.playCard(takeControl, { as: P1 });
      engine.resolveAttack({ as: P1, pass: true }); // react → steal
      engine.resolveAttack({
        as: P2,
        gigIdsToSteal: engine
          .getGigDice(P1)
          .slice(0, 1)
          .map((die) => die.id),
      }); // steal resolves — only 1 gig taken (reduced from 2)

      // While the attack was resolving, Take Control's turn-duration grant is
      // active on the attacker.
      const attackerId = engine.getCard(attacker, "field", P2).instanceId as string;
      const grantBefore = engine
        .getState()
        .G.activeEffects.filter(
          (e) =>
            (e.targetCardId as string) === attackerId &&
            e.kind === "grantRule" &&
            e.rule === "stealsOneFewerGig",
        );
      expect(grantBefore).toHaveLength(1);

      // Ending the turn must clear the turn-duration steal reduction.
      engine.completeTurn({ as: P2 });

      const grantAfter = engine
        .getState()
        .G.activeEffects.filter(
          (e) =>
            (e.targetCardId as string) === attackerId &&
            e.kind === "grantRule" &&
            e.rule === "stealsOneFewerGig",
        );
      expect(grantAfter).toHaveLength(0);
    });
  });

  describe("If that Unit is an AI, DRONE, or VEHICLE, draw 1", () => {
    it("draws 1 when the attacker is a Vehicle", () => {
      const attacker = createMockUnit({
        id: "tc-vehicle-attacker",
        name: "Vehicle Attacker",
        power: 10,
        classifications: ["Vehicle"],
      });

      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [takeControl],
          deck: [welcomeToNightCityRetailCorpoSecurity],
          field: [filler],
          gigArea: [
            { dieType: "d4", faceValue: 3 },
            { dieType: "d6", faceValue: 3 },
          ],
          eddies: 5,
        },
        { field: [{ card: attacker, spent: false, hasLag: false }], eddies: 5 },
      );

      const handBefore = engine.getHandCount(P1);

      engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
      engine.attackRival(attacker, { as: P2 });
      engine.resolveAttack({ as: P2 }); // attack → react
      engine.playCard(takeControl, { as: P1 });

      // Played Take Control (-1) and drew 1 from the Vehicle attacker (+1): net 0.
      expect(engine.getHandCount(P1)).toBe(handBefore);
    });

    it("does not draw when the attacker is not AI/Drone/Vehicle", () => {
      const attacker = createMockUnit({
        id: "tc-ganger-attacker",
        name: "Ganger Attacker",
        power: 10,
        classifications: ["Ganger"],
      });

      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [takeControl],
          deck: [welcomeToNightCityRetailCorpoSecurity],
          field: [filler],
          gigArea: [
            { dieType: "d4", faceValue: 3 },
            { dieType: "d6", faceValue: 3 },
          ],
          eddies: 5,
        },
        { field: [{ card: attacker, spent: false, hasLag: false }], eddies: 5 },
      );

      const handBefore = engine.getHandCount(P1);

      engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
      engine.attackRival(attacker, { as: P2 });
      engine.resolveAttack({ as: P2 }); // attack → react
      engine.playCard(takeControl, { as: P1 });

      // Played Take Control (-1), no draw for a Ganger attacker.
      expect(engine.getHandCount(P1)).toBe(handBefore - 1);
    });
  });
});
