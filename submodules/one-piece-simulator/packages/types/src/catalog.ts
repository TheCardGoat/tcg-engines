export interface CardCatalog<T> {
  readonly ref: string;
  get(id: string): T | undefined;
  has(id: string): boolean;
  all(): T[];
}

export class RecordCardCatalog<T> implements CardCatalog<T> {
  readonly ref: string;
  readonly #definitions: Record<string, T>;

  constructor(ref: string, definitions: Record<string, T>) {
    this.ref = ref;
    this.#definitions = definitions;
  }

  get(id: string): T | undefined {
    return this.#definitions[id];
  }

  has(id: string): boolean {
    return id in this.#definitions;
  }

  all(): T[] {
    return Object.values(this.#definitions);
  }
}
