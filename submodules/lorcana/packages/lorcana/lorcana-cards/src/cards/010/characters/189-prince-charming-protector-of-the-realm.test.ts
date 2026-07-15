import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { princeCharmingProtectorOfTheRealm } from "./189-prince-charming-protector-of-the-realm";
import { webbyVanderquackKnowledgeSeeker } from "./009-webby-vanderquack-knowledge-seeker";
import { flintheartGlomgoldSchemingBillionaire } from "./076-flintheart-glomgold-scheming-billionaire";
import { mickeyMouseDetective } from "./160-mickey-mouse-detective";
import { henWenPropheticPig } from "./138-hen-wen-prophetic-pig";

const attacker1 = createMockCharacter({
  id: "pc-potr-attacker1",
  name: "Attacker 1",
  cost: 2,
  strength: 2,
  willpower: 4,
  lore: 1,
});

const attacker2 = createMockCharacter({
  id: "pc-potr-attacker2",
  name: "Attacker 2",
  cost: 2,
  strength: 2,
  willpower: 4,
  lore: 1,
});

describe("Prince Charming - Protector of the Realm", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [princeCharmingProtectorOfTheRealm], deck: 2 },
      { deck: 2 },
    );

    expect(
      testEngine.asPlayerOne().hasKeyword(princeCharmingProtectorOfTheRealm, "Bodyguard"),
    ).toBe(true);
  });

  describe("PROTECTIVE PRESENCE - Each turn, only one character can challenge", () => {
    it("only allows one challenge per turn when Prince Charming is controlled by the attacking player", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: princeCharmingProtectorOfTheRealm, isDrying: false },
            { card: mickeyMouseDetective, isDrying: false },
            { card: henWenPropheticPig, isDrying: false },
          ],
          deck: 2,
        },
        {
          play: [
            { card: webbyVanderquackKnowledgeSeeker, exerted: true },
            { card: flintheartGlomgoldSchemingBillionaire, exerted: true },
          ],
          deck: 2,
        },
      );

      // First challenge should succeed
      expect(
        testEngine.asPlayerOne().challenge(mickeyMouseDetective, webbyVanderquackKnowledgeSeeker),
      ).toBeSuccessfulCommand();

      // Second challenge attempt by a different character should fail
      expect(
        testEngine
          .asPlayerOne()
          .challenge(henWenPropheticPig, flintheartGlomgoldSchemingBillionaire),
      ).not.toBeSuccessfulCommand();
    });

    it("only allows one challenge per turn when Prince Charming is controlled by the defending player", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: mickeyMouseDetective, isDrying: false },
            { card: henWenPropheticPig, isDrying: false },
          ],
          deck: 2,
        },
        {
          play: [
            { card: princeCharmingProtectorOfTheRealm, isDrying: false },
            { card: webbyVanderquackKnowledgeSeeker, exerted: true },
            { card: flintheartGlomgoldSchemingBillionaire, exerted: true },
          ],
          deck: 2,
        },
      );

      // First challenge should succeed
      expect(
        testEngine.asPlayerOne().challenge(mickeyMouseDetective, webbyVanderquackKnowledgeSeeker),
      ).toBeSuccessfulCommand();

      // Second challenge attempt should fail even though Prince Charming is the opponent's
      expect(
        testEngine
          .asPlayerOne()
          .challenge(henWenPropheticPig, flintheartGlomgoldSchemingBillionaire),
      ).not.toBeSuccessfulCommand();
    });

    it("allows two challenges when Prince Charming is not in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: attacker1, isDrying: false },
            { card: attacker2, isDrying: false },
          ],
          deck: 2,
        },
        {
          play: [
            { card: webbyVanderquackKnowledgeSeeker, exerted: true },
            { card: flintheartGlomgoldSchemingBillionaire, exerted: true },
          ],
          deck: 2,
        },
      );

      // First challenge succeeds
      expect(
        testEngine.asPlayerOne().challenge(attacker1, webbyVanderquackKnowledgeSeeker),
      ).toBeSuccessfulCommand();

      // Second challenge also succeeds without Prince Charming
      expect(
        testEngine.asPlayerOne().challenge(attacker2, flintheartGlomgoldSchemingBillionaire),
      ).toBeSuccessfulCommand();
    });
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it, test } from "@jest/globals";
// Import {
//   FlintheartGlomgoldSchemingBillionaire,
//   HenWenPropheticPig,
//   MickeyMouseDetective,
//   PrinceCharmingProtectorOfTheRealm,
//   WebbyVanderquackKnowledgeSeeker,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Prince Charming - Protector of the Realm", () => {
//   It("Bodyguard", async () => {
//     Const testEngine = new TestEngine({
//       Play: [princeCharmingProtectorOfTheRealm],
//     });
//
//     Const princeCharming = testEngine.getCardModel(
//       PrinceCharmingProtectorOfTheRealm,
//     );
//     Expect(princeCharming.hasBodyguard).toBe(true);
//   });
//
//   Describe("PROTECTIVE PRESENCE Each turn, only one character can challenge", () => {
//     It("player_one has Prince Charming", async () => {
//       Const defenders = [
//         WebbyVanderquackKnowledgeSeeker,
//         FlintheartGlomgoldSchemingBillionaire,
//       ];
//       Const attackers = [mickeyMouseDetective, henWenPropheticPig];
//       Const testEngine = new TestEngine(
//         {
//           Play: [princeCharmingProtectorOfTheRealm, ...attackers],
//         },
//         {
//           Play: defenders,
//         },
//       );
//
//       For (const defender of defenders) {
//         Await testEngine.tapCard(defender);
//       }
//
//       For (let index = 0; index < attackers.length; index++) {
//         Const attacker = attackers[index];
//         Const defender = defenders[index % defenders.length];
//
//         If (!(defender && attacker)) {
//           Throw new Error("Defender not found");
//         }
//
//         Await testEngine.challenge({
//           Attacker,
//           Defender,
//         });
//       }
//
//       Const turn = testEngine.turnEvents("player_one");
//       Expect(turn.challenges).toHaveLength(1);
//     });
//
//     It("player_two has Prince Charming", async () => {
//       Const defenders = [
//         WebbyVanderquackKnowledgeSeeker,
//         FlintheartGlomgoldSchemingBillionaire,
//       ];
//       Const attackers = [mickeyMouseDetective, henWenPropheticPig];
//       Const testEngine = new TestEngine(
//         {
//           Play: attackers,
//         },
//         {
//           Play: [princeCharmingProtectorOfTheRealm, ...defenders],
//         },
//       );
//
//       For (const defender of defenders) {
//         Await testEngine.tapCard(defender);
//       }
//
//       For (let index = 0; index < attackers.length; index++) {
//         Const attacker = attackers[index];
//         Const defender = defenders[index % defenders.length];
//
//         If (!(defender && attacker)) {
//           Throw new Error("Defender not found");
//         }
//
//         Await testEngine.challenge({
//           Attacker,
//           Defender,
//         });
//       }
//
//       Const turn = testEngine.turnEvents("player_one");
//       Expect(turn.challenges).toHaveLength(1);
//     });
//   });
// });
//
