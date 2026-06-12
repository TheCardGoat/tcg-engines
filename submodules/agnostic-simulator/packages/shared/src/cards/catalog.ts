export type SharedCardDefinition = object;

type CardPublicId = string;
type RecordLike<T> = Record<string, T> | Readonly<Record<string, T>>;

export interface CardCatalog<TCardDefinition extends SharedCardDefinition = SharedCardDefinition> {
  readonly ref: string;
  get(definitionId: CardPublicId): TCardDefinition | undefined;
  has(definitionId: CardPublicId): boolean;
}

class RecordCardCatalog<
  TCardDefinition extends SharedCardDefinition,
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

export function createRecordCardCatalog<TCardDefinition extends SharedCardDefinition>(
  ref: string,
  definitions: RecordLike<TCardDefinition>,
): CardCatalog<TCardDefinition> {
  return new RecordCardCatalog(ref, definitions);
}
