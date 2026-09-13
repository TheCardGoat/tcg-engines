import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { pangTongYoungPhoenix } from "../../SP4/allies/pang-tong-young-phoenix.ts";
import { mnemonicCharm } from "./mnemonic-charm.ts";
import { mandateOfHonor } from "./mandate-of-honor.ts";

/** @covers 5ckzgqa186-a1 */
describe("Mandate of Honor — influence draw lock", () => {
  it("stops an 8-influence player from drawing only while a unique ally is controlled", () => {
    const champion = createClassBonusTestChampion(mandateOfHonor, true, "activation-discount");
    const influence = Array.from({ length: 8 }, () => woodlandSquirrels);
    const payment = [woodlandSquirrels, woodlandSquirrels];
    function setup(uniqueAlly: boolean) {
      return GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: uniqueAlly ? [mandateOfHonor, pangTongYoungPhoenix] : [mandateOfHonor],
            hand: [mnemonicCharm, ...payment],
            memory: influence,
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: { champion },
      });
    }

    const unlocked = setup(false);
    const unlockedPlayer = unlocked.player("player-one");
    const unlockedTop = unlockedPlayer.zone("main-deck")[0]!;
    unlockedPlayer.activate(mnemonicCharm, {
      reservePayment: unlockedPlayer
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
    });
    passEffectsStack(unlocked);
    expect(unlocked.state.objects[unlockedTop.objectId]?.zone).toBe("memory");

    const locked = setup(true);
    const lockedPlayer = locked.player("player-one");
    const lockedTop = lockedPlayer.zone("main-deck")[0]!;
    lockedPlayer.activate(mnemonicCharm, {
      reservePayment: lockedPlayer
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
    });
    passEffectsStack(locked);
    expect(locked.state.objects[lockedTop.objectId]?.zone).toBe("main-deck");
    expect(lockedPlayer.cards(mnemonicCharm, { zone: "field" })).toHaveLength(1);
  });
});
