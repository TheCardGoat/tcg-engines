import { structuredCards } from "@tcg/cyberpunk-cards";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  type PlayerFixture,
  type FixtureCardState,
} from "@tcg/cyberpunk-engine";
import { z } from "zod";

export const CREATOR_STORAGE_KEY = "cyberpunk-creator-setup-v1";
export const zones = ["hand", "deck", "field", "legendArea", "trash"] as const;
export type CreatorZone = (typeof zones)[number];
export const zoneLabels: Record<CreatorZone, string> = {
  hand: "Hand",
  deck: "Deck (top first)",
  field: "Field",
  legendArea: "Legends",
  trash: "Trash",
};
export const creatorCards = structuredCards.filter((card) => !card.id.startsWith("scenario-"));
const cardsById = new Map(creatorCards.map((card) => [card.id, card]));
const cardSchema = z.object({
  id: z.string().refine((id) => cardsById.has(id), "Unknown card"),
  spent: z.boolean(),
  faceDown: z.boolean(),
  damage: z.number().int().min(0).max(999),
  gearIds: z
    .array(z.string().refine((id) => cardsById.get(id)?.type === "gear", "Unknown gear"))
    .max(20),
});
const seatSchema = z.object({
  eddies: z.number().int().min(0).max(999),
  spentEddies: z.number().int().min(0).max(999),
  hand: z.array(cardSchema).max(100),
  deck: z.array(cardSchema).max(100),
  field: z.array(cardSchema).max(50),
  legendArea: z.array(cardSchema).max(20),
  trash: z.array(cardSchema).max(100),
  gigArea: z
    .array(
      z
        .object({
          dieType: z.enum(["d4", "d6", "d8", "d10", "d12", "d20"]),
          faceValue: z.number().int().min(1).max(20),
        })
        .refine((gig) => gig.faceValue <= Number(gig.dieType.slice(1)), "Face exceeds die size"),
    )
    .max(6),
});
export const setupSchema = z
  .object({
    version: z.literal(1),
    name: z.string().max(100),
    activeSide: z.enum(["player", "opponent"]),
    player: seatSchema,
    opponent: seatSchema,
  })
  .superRefine((setup, ctx) => {
    for (const side of ["player", "opponent"] as const) {
      const seat = setup[side];
      if (new Set(seat.gigArea.map((gig) => gig.dieType)).size !== seat.gigArea.length) {
        ctx.addIssue({
          code: "custom",
          path: [side, "gigArea"],
          message: "Use each Gig die size once",
        });
      }
      const legends = zones
        .flatMap((zone) => seat[zone])
        .filter((entry) => cardsById.get(entry.id)?.type === "legend");
      if (legends.length > 3) {
        ctx.addIssue({
          code: "custom",
          path: [side, "legendArea"],
          message: "Each player can have up to three Legends across all zones",
        });
      }
      for (const zone of zones) {
        setup[side][zone].forEach((entry, index) => {
          const type = cardsById.get(entry.id)?.type;
          if (
            (zone === "field" && type !== "unit" && type !== "legend") ||
            (zone === "legendArea" && type !== "legend")
          ) {
            ctx.addIssue({
              code: "custom",
              path: [side, zone, index],
              message: "Card cannot start in this zone",
            });
          }
        });
      }
    }
  });
export type CreatorSetup = z.infer<typeof setupSchema>;
export type CreatorCard = z.infer<typeof cardSchema>;
export type CreatorSeat = z.infer<typeof seatSchema>;
export function emptySetup(): CreatorSetup {
  const seat = (): CreatorSeat => ({
    eddies: 5,
    spentEddies: 0,
    hand: [],
    deck: [],
    field: [],
    legendArea: [],
    trash: [],
    gigArea: [],
  });
  return { version: 1, name: "My scene", activeSide: "player", player: seat(), opponent: seat() };
}
export function buildCreatorEngine(input: CreatorSetup): CyberpunkTestEngine {
  const setup = setupSchema.parse(input);
  const entries = (cards: CreatorCard[]): FixtureCardState[] =>
    cards.map((entry) => {
      const card = cardsById.get(entry.id);
      if (!card) throw new Error("Unknown card");
      return {
        card,
        spent: entry.spent,
        faceDown: entry.faceDown,
        damage: entry.damage,
        attachedGears: entry.gearIds.map((id) => {
          const gear = cardsById.get(id);
          if (!gear) throw new Error("Unknown gear");
          return gear;
        }),
      };
    });
  const fixture = (seat: CreatorSeat): PlayerFixture => ({
    eddies: seat.eddies,
    spentEddies: seat.spentEddies,
    gigArea: seat.gigArea,
    hand: entries(seat.hand),
    deck: entries(seat.deck),
    field: entries(seat.field),
    legendArea: entries(seat.legendArea),
    trash: entries(seat.trash),
  });
  const engine = CyberpunkTestEngine.createWithFixture(
    fixture(setup.player),
    fixture(setup.opponent),
    {
      seed: "creator-scene",
      skipSetup: true,
      gamePhase: "main",
      autoGainGig: false,
      preserveDeckOrder: true,
      activePlayerId: setup.activeSide === "player" ? P1 : P2,
    },
  );
  // The test fixture supplies filler deck cards. A creator scene must contain
  // only the cards the author placed, including an explicitly empty deck.
  const state = structuredClone(engine.getState());
  for (const [side, playerId] of [
    ["player", P1],
    ["opponent", P2],
  ] as const) {
    const player = state.G.players[playerId];
    const filler = player.zones.deck.splice(setup[side].deck.length);
    for (const id of filler) delete state.G.cardIndex[id];
  }
  return CyberpunkTestEngine.fromState(state, { autoGainGig: false });
}

export function captureCreatorSetup(
  state: ReturnType<CyberpunkTestEngine["getState"]>,
  name: string,
): CreatorSetup {
  const setup = emptySetup();
  setup.name = name;
  setup.activeSide = state.G.turnMetadata.activePlayerId === P1 ? "player" : "opponent";
  for (const [side, playerId] of [
    ["player", P1],
    ["opponent", P2],
  ] as const) {
    const player = state.G.players[playerId];
    setup[side].eddies = player.eddies;
    setup[side].spentEddies = player.spentEddies;
    setup[side].gigArea = player.gigArea.map((id) => {
      const die = state.G.gigDice[id];
      return { dieType: die.dieType, faceValue: die.faceValue };
    });
    for (const zone of zones) {
      setup[side][zone] = player.zones[zone].flatMap((id) => {
        const card = state.G.cardIndex[id];
        if (card.meta.attachedToId) return [];
        return [
          {
            id: card.definitionId,
            spent: card.meta.spent,
            faceDown: card.meta.faceDown,
            damage: card.meta.damage,
            gearIds: card.meta.attachedGearIds.map((id) => state.G.cardIndex[id].definitionId),
          },
        ];
      });
    }
  }
  return setupSchema.parse(setup);
}
