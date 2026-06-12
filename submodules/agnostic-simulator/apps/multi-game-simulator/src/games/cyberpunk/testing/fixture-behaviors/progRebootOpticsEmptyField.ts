import { CYBERPUNK_P1 } from "../cyberpunk-simulator-pom";
import {
  expectDefined,
  expectEqual,
  type CyberpunkFixtureBehavior,
} from "./cyberpunk-fixture-behavior";

export const progRebootOpticsEmptyFieldBehavior: CyberpunkFixtureBehavior = {
  scenarioId: "progRebootOpticsEmptyField",
  label: "Reboot Optics - no friendly units",
  references: ["packages/engine/src/cards/alpha/programs/reboot-optics.test.ts"],
  async run(pom) {
    await pom.expectFieldSize(CYBERPUNK_P1, 0);
    const program = expectDefined(
      "Reboot Optics in hand",
      (await pom.getCardsInZone("hand", CYBERPUNK_P1))[0],
    );

    await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
    expectEqual(
      "Reboot Optics empty-field eligible count",
      (await pom.getEligibleTargetIds(CYBERPUNK_P1)).length,
      0,
    );
    await pom.expectFieldSize(CYBERPUNK_P1, 0);
    await pom.expectHandSize(CYBERPUNK_P1, 0);
    await pom.expectTrashSize(CYBERPUNK_P1, 1);
    await pom.expectEddies(CYBERPUNK_P1, 1);
  },
};
