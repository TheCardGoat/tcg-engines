/** Compile-time boundary: display catalog records cannot become rules inputs. */
import type { FleshAndBloodCatalogCard } from "./catalog-types.ts";

type Expect<Condition extends true> = Condition;
type Lacks<Key extends PropertyKey> = Key extends keyof FleshAndBloodCatalogCard ? false : true;

type CatalogHasNoRuntimeStats = Expect<Lacks<"pitch">>;
type CatalogHasNoExecutableVocabulary = Expect<Lacks<"types">>;

export type CatalogBoundaryContract = CatalogHasNoRuntimeStats;
