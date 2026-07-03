import type { BaseCardDefinition } from "@tcg/card-model";

type CardPublicId = string;
type RecordLike<T> = Record<string, T> | Readonly<Record<string, T>>;

/**
 * A read-only, definition-keyed catalog over a game's native card type.
 *
 * `TCardDefinition` is constrained to {@link BaseCardDefinition} because every
 * native game card type now literally `extends BaseCardDefinition`
 * (RFC §7 / ADR-11): a Lorcana / Cyberpunk / Gundam / One Piece / SWU card
 * IS-A {@link BaseCardDefinition} and flows through the catalog unchanged.
 *
 * There is no read-time projection layer and no projection indirection. The
 * unified identity fields (`canonicalId`, `slug`, `name`, `printings[]`,
 * optional `externalIds`) are readable off any entry directly through the base
 * type, while game-native fields stay available through the concrete
 * `TCardDefinition`. Shared and platform code consumes native card types
 * directly through this facade.
 *
 * Uniqueness lives on identity, not the catalog key: the canonical anchor is
 * `(gameSlug, canonicalId)` and the printing anchor is `(gameSlug,
 * printing.id)` — see {@link BaseCardDefinition}.
 */
export interface CardCatalog<TCardDefinition extends BaseCardDefinition = BaseCardDefinition> {
  readonly ref: string;
  get(definitionId: CardPublicId): TCardDefinition | undefined;
  has(definitionId: CardPublicId): boolean;
}

class RecordCardCatalog<
  TCardDefinition extends BaseCardDefinition,
> implements CardCatalog<TCardDefinition> {
  readonly ref: string;
  readonly #definitions: RecordLike<TCardDefinition>;

  constructor(ref: string, definitions: RecordLike<TCardDefinition>) {
    this.ref = ref;
    this.#definitions = definitions;
  }

  get(definitionId: string): TCardDefinition | undefined {
    return this.#definitions[definitionId];
  }

  has(definitionId: string): boolean {
    return definitionId in this.#definitions;
  }
}

export function createRecordCardCatalog<TCardDefinition extends BaseCardDefinition>(
  ref: string,
  definitions: RecordLike<TCardDefinition>,
): CardCatalog<TCardDefinition> {
  return new RecordCardCatalog(ref, definitions);
}
