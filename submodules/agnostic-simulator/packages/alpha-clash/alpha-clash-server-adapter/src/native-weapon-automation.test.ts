import { expect, it } from "vite-plus/test";
import { getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";

const WarLegionCommander = getCard("ac-ac2-098");
const WarSGauntlets = getCard("ac-sotv-043");

const context = { gameId: "native-weapon-automation", sourceAuthority: "server" as const };
const seats = { human: "player-one", bot: "player-two" } as const;

function fixture() {
  const game = Spec.fromFixture({
    activePlayer: "player-two",
    turnNumber: 6,
    phase: { name: "primary" },
    playerOne: { contender: WarLegionCommander, deck: 8 },
    playerTwo: {
      contender: WarLegionCommander,
      accessory: [WarSGauntlets],
      resource: Array.from({ length: 4 }, () => WarSGauntlets),
      deck: 8,
    },
  });
  const weaponId = game.playerTwo.at(WarSGauntlets, "accessory").instanceId;
  const targetId = game.state.players["player-two"].contenderId;
  return { engine: new AlphaClashServerEngine(game.state, seats), weaponId, targetId };
}

it("the recommended bot attaches War's Gauntlets through the live adapter", () => {
  const { engine, weaponId, targetId } = fixture();
  let attached = false;
  for (let actions = 0; actions < 30 && !attached; actions++) {
    const result = engine.takeAutomatedAction({ strategyId: "meta-v1" }, context);
    expect(result.finalResult.success, JSON.stringify(result)).toBe(true);
    attached = result.selectedCandidate?.family === "attachWeapon";
  }
  expect(attached).toBe(true);
  expect(engine.state.cards[weaponId].attachedTo).toBe(targetId);
});

it.each(["weaponId", "cardId"])(
  "accepts %s for native and interaction weapon commands",
  (field) => {
    const { engine, weaponId, targetId } = fixture();
    const before = engine.getStateID();
    expect(
      engine.dispatch("attachWeapon", "bot", { [field]: weaponId, targetId }, context).success,
    ).toBe(true);
    expect(engine.state.cards[weaponId].attachedTo).toBe(targetId);
    expect(engine.dispatch("detachWeapon", "bot", { [field]: weaponId }, context).success).toBe(
      true,
    );
    expect(engine.state.cards[weaponId].attachedTo).toBeUndefined();
    expect(engine.getStateID()).toBe(before + 2);
  },
);
