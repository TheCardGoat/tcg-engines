import { describe, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  expectFailure,
  createMockUnit,
  activeResources,
  expectCardInTrash,
  markAsLinkUnit,
} from "@tcg/gundam-engine";
import { gd02SisterlyCare113 } from "./113-sisterly-care.ts";

describe("Sisterly Care (GD02-113)", () => {
  describe("precondition: friendly (Teiwaz) Link Unit in play", () => {
    it("rejects play when no friendly Teiwaz Link Unit is in play", () => {
      const enemy = createMockUnit({ ap: 2, hp: 3 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd02SisterlyCare113],
          resourceArea: activeResources(4),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectFailure(p1.playCommand(gd02SisterlyCare113, { targets: [enemyId!] }));
    });

    it("rejects play when friendly unit has Teiwaz trait but is not a Link Unit", () => {
      const friendly = createMockUnit({ traits: ["teiwaz"] });
      const enemy = createMockUnit({ ap: 2, hp: 3 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd02SisterlyCare113],
          play: [friendly],
          resourceArea: activeResources(4),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectFailure(p1.playCommand(gd02SisterlyCare113, { targets: [enemyId!] }));
    });
  });

  describe("【Main】/【Action】Choose 1 enemy Unit with 2 or less AP. Destroy it.", () => {
    it("destroys an enemy unit with 2 or less AP", () => {
      const friendly = createMockUnit({ traits: ["teiwaz"] });
      const enemy = createMockUnit({ ap: 2, hp: 3 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd02SisterlyCare113],
          play: [friendly],
          resourceArea: activeResources(4),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [friendlyId] = p1.getCardsInZone("battleArea");
      markAsLinkUnit(engine, friendlyId!);
      const [enemyId] = p2.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(gd02SisterlyCare113, { targets: [enemyId!] }));

      expectCardInTrash(engine, enemyId!, p2.playerId);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });

    it("cannot target an enemy unit with more than 2 AP", () => {
      const friendly = createMockUnit({ traits: ["teiwaz"] });
      const enemy = createMockUnit({ ap: 3, hp: 3 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd02SisterlyCare113],
          play: [friendly],
          resourceArea: activeResources(4),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [friendlyId] = p1.getCardsInZone("battleArea");
      markAsLinkUnit(engine, friendlyId!);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectFailure(p1.playCommand(gd02SisterlyCare113, { targets: [enemyId!] }));
    });
  });
});
