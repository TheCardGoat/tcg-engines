import {
  spiritOfWind,
  spiritOfFire,
  raiSpellcrafter,
  raiArchmage,
  lorraineWanderingWarrior,
  woodlandSquirrels,
  impassionedTutor,
} from "@tcg/grand-archive-cards";
import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "../../testing/test-engine.ts";

// Champion / General Rules 3, 7; Leveling Up 2–3; Lineage keyword 1.
describe("Champion progression without implicit name restrictions", () => {
  it("retains the Spirit's Fire access after materializing Rai and reaching main phase", () => {
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: {
        champion: spiritOfFire,
        zones: {
          "material-deck": [raiSpellcrafter],
          memory: [woodlandSquirrels],
          hand: [impassionedTutor, woodlandSquirrels, woodlandSquirrels],
          "main-deck": [woodlandSquirrels],
        },
      },
      playerTwo: { champion: spiritOfWind },
    });
    const player = game.player("player-one");
    player.materialize(raiSpellcrafter);
    for (let step = 0; step < 12 && game.state.turn.phase !== "main"; step++) {
      const actor = [player, game.player("player-two")].find((candidate) =>
        candidate.legalCommands().some(({ command }) => command.move === "pass"),
      );
      expect(actor).toBeDefined();
      actor!.pass();
    }
    expect(game.state.turn.phase).toBe("main");
    const tutor = player.card(impassionedTutor, { zone: "hand" });
    expect(
      player
        .legalCommands()
        .some(
          ({ command }) => command.move === "activate-card" && command.cardId === tutor.objectId,
        ),
    ).toBe(true);
    player.activate(tutor, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 2)
        .map((card) => ({ kind: "card", cardId: card.objectId })),
    });
    player.pass();
    game.player("player-two").pass();
    expect(player.cards(impassionedTutor, { zone: "field" })).toHaveLength(1);
  });
  for (const spirit of [spiritOfWind, spiritOfFire]) {
    for (const destination of [raiSpellcrafter, lorraineWanderingWarrior]) {
      it(`${spirit.slug} materializes ${destination.slug} and resolves its On Enter`, () => {
        const game = GrandArchiveTestEngine.startFixture({
          phase: "materialize",
          playerOne: {
            champion: spirit,
            zones: { "material-deck": [destination], memory: [woodlandSquirrels] },
          },
          playerTwo: { champion: spiritOfWind },
        });
        const player = game.player("player-one");
        const card = player.card(destination, { zone: "material-deck" });
        const champion = player.card(spirit, { zone: "field" });
        expect(
          player
            .legalCommands()
            .some(
              ({ command }) => command.move === "materialize" && command.cardId === card.objectId,
            ),
        ).toBe(true);
        player.materialize(card);
        player.pass();
        game.player("player-two").pass();
        expect(game.state.objects[champion.objectId]?.activeDefinitionId).toBe(
          destination.canonicalId,
        );
        expect(player.zone("banishment")).toHaveLength(1);
        // Both champions have an On Enter ability: another pair of passes resolves it.
        player.pass();
        game.player("player-two").pass();
        if (destination === raiSpellcrafter) {
          expect(game.state.objects[champion.objectId]?.counters.enlighten).toBe(2);
        }
        expect(game.state.stack).toHaveLength(0);
      });
    }
  }

  it("rejects level zero, skipped levels, and an explicit mismatched Lineage", () => {
    for (const lineage of [[], [lorraineWanderingWarrior]]) {
      const game = GrandArchiveTestEngine.startFixture({
        phase: "materialize",
        playerOne: {
          champion: spiritOfWind,
          lineage,
          zones: {
            "material-deck": [spiritOfFire, raiArchmage],
            memory: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: { champion: spiritOfWind },
      });
      const player = game.player("player-one");
      for (const destination of [spiritOfFire, raiArchmage]) {
        const card = player.card(destination, { zone: "material-deck" });
        expect(
          player
            .legalCommands()
            .some(
              ({ command }) => command.move === "materialize" && command.cardId === card.objectId,
            ),
        ).toBe(false);
        const before = game.state;
        expect(() => player.materialize(card)).toThrow();
        expect(game.state).toEqual(before);
      }
    }
  });

  it("materializes the next named champion when its explicit Lineage matches", () => {
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: {
        champion: spiritOfWind,
        lineage: [raiSpellcrafter],
        zones: { "material-deck": [raiArchmage], memory: [woodlandSquirrels, woodlandSquirrels] },
      },
      playerTwo: { champion: spiritOfWind },
    });
    const player = game.player("player-one");
    const champion = player.card(spiritOfWind, { zone: "field" });
    player.materialize(raiArchmage);
    player.pass();
    game.player("player-two").pass();
    expect(game.state.objects[champion.objectId]?.activeDefinitionId).toBe(raiArchmage.canonicalId);
  });
});
