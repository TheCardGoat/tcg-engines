import type {
  Ability,
  CardClassification,
  CardColor,
  CardKeyword,
  CardSet,
  GearCardDefinition,
  LegendCardDefinition,
  ProgramCardDefinition,
  StructuredCardData,
  StructuredCardDefinition,
  TimingTrigger,
  UnitCardDefinition,
} from "@tcg/cyberpunk-types";

/**
 * Structured-card variants — narrowed to a single card type but with the
 * `abilities` / `reminderText` / `attachment` fields {@link StructuredCardData}
 * adds. These are what the engine consumes and what fixtures accept.
 */
export type StructuredUnitCard = UnitCardDefinition & StructuredCardData;
export type StructuredProgramCard = ProgramCardDefinition & StructuredCardData;
export type StructuredGearCard = GearCardDefinition & StructuredCardData;
export type StructuredLegendCard = LegendCardDefinition & StructuredCardData;

/**
 * Mock card factories for engine tests. Sensible defaults so tests only
 * specify what they care about — patterned after Lorcana's `createMock*`
 * helpers. The returned objects are real {@link StructuredCardDefinition}s,
 * fully usable wherever the engine accepts a card definition.
 *
 * Notes:
 * - Mock cards live in a synthetic `"mock"` set so they never collide with
 *   `@tcg/cyberpunk-cards` ids.
 * - Slugs default to a `mock_<n>` counter — pass `id`/`slug` to override
 *   when you need stable ids across tests (e.g. for direct refs).
 * - Abilities are passed as the engine's real ability shape; there is no
 *   simplified DSL on top. This is deliberate: one grammar, not two.
 *
 * Use these from new tests. Existing tests that import real cards from
 * `@tcg/cyberpunk-cards` are not affected and don't need to be migrated.
 */

let mockCounter = 0;

function nextMockId(): string {
  mockCounter += 1;
  return `mock_${mockCounter.toString().padStart(6, "0")}`;
}

const MOCK_SET: CardSet = { code: "alpha", name: "Mock Test Set" };

interface BaseMockParams {
  id?: string;
  slug?: string;
  name?: string;
  color?: CardColor;
  classifications?: CardClassification[];
  ram?: number;
  keywords?: CardKeyword[];
  timingTriggers?: TimingTrigger[];
  abilities?: Ability[];
  hasSellTag?: boolean;
  rulesText?: string | null;
  flavorText?: string | null;
}

type CommonFields = Omit<StructuredCardDefinition, "type" | "cost" | "power">;

function commonFields(params: BaseMockParams): CommonFields {
  const id = params.id ?? nextMockId();
  const slug = params.slug ?? id;
  const name = params.name ?? `Mock Card ${id}`;
  return {
    id,
    externalId: `mock:${slug}`,
    slug,
    name,
    subname: null,
    displayName: name,
    rulesText: params.rulesText ?? null,
    flavorText: params.flavorText ?? null,
    color: params.color ?? "blue",
    classifications: params.classifications ?? [],
    set: MOCK_SET,
    printNumber: "MOCK001",
    printings: [],
    selectedPrintingId: null,
    artist: "Mock Artist",
    imageUrl: "",
    sourceImageUrl: "",
    rarity: null,
    legality: "legal",
    hasSellTag: params.hasSellTag ?? false,
    ram: params.ram ?? 1,
    timingTriggers: params.timingTriggers ?? [],
    keywords: params.keywords ?? [],
    abilities: params.abilities ?? [],
    reminderText: [],
    attachment: null,
  };
}

export interface MockUnitParams extends BaseMockParams {
  cost?: number;
  power?: number;
}

/**
 * Mock unit card with sensible defaults: cost 2, power 3, blue, no abilities,
 * no keywords. Override anything that matters to the specific test.
 */
export function createMockUnit(params: MockUnitParams = {}): StructuredUnitCard {
  return {
    ...commonFields(params),
    type: "unit",
    cost: params.cost ?? 2,
    power: params.power ?? 3,
  };
}

export interface MockProgramParams extends BaseMockParams {
  cost?: number;
}

/**
 * Mock program card (one-shot effect). Power is always `null` per the program
 * type contract. Default cost 1.
 */
export function createMockProgram(params: MockProgramParams = {}): StructuredProgramCard {
  return {
    ...commonFields(params),
    type: "program",
    cost: params.cost ?? 1,
    power: null,
  };
}

export interface MockGearParams extends BaseMockParams {
  cost?: number;
  power?: number;
}

/**
 * Mock gear card (attaches to a friendly unit). Default cost 1, power 1.
 */
export function createMockGear(params: MockGearParams = {}): StructuredGearCard {
  return {
    ...commonFields(params),
    type: "gear",
    cost: params.cost ?? 1,
    power: params.power ?? 1,
  };
}

export interface MockLegendParams extends BaseMockParams {
  cost?: number | null;
  power?: number | null;
}

/**
 * Mock legend card. Legends start face-down in the legend area and are spent
 * for 1 eddie or called for 2 eddies. Cost / power default to `null` (no
 * in-hand cast cost).
 */
export function createMockLegend(params: MockLegendParams = {}): StructuredLegendCard {
  return {
    ...commonFields(params),
    type: "legend",
    cost: params.cost ?? null,
    power: params.power ?? null,
  };
}

/** Reset the global mock-id counter. Call between test files if you need
 *  deterministic ids across runs. Not normally required — every fixture
 *  build registers cards in its own catalog scope. */
export function _resetMockCounter(): void {
  mockCounter = 0;
}

export type MockCard = StructuredCardDefinition;
