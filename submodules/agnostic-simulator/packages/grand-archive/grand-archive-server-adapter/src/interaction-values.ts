import type { InteractionInput } from "@tcg/protocol";

/** Exact serialization also identifies legal options; array order must remain significant here. */
export function stableDeclarationValue(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableDeclarationValue).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => `${JSON.stringify(key)}:${stableDeclarationValue(entry)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value) ?? "undefined";
}

function selectionValue(value: unknown): string {
  // Sort a copy and retain multiplicity: duplicates must not become a valid set.
  return Array.isArray(value)
    ? stableDeclarationValue(value.map(stableDeclarationValue).sort())
    : stableDeclarationValue(value);
}

/** Match legal candidates using the same ordering semantics published to the picker. */
export function interactionValueMatches(
  input: InteractionInput,
  submitted: unknown,
  expected: unknown,
): boolean {
  switch (input.kind) {
    case "entity-selection":
      return input.ordered
        ? stableDeclarationValue(submitted) === stableDeclarationValue(expected)
        : selectionValue(submitted) === selectionValue(expected);
    case "option-selection":
      return selectionValue(submitted) === selectionValue(expected);
    case "entity-partition": {
      if (
        !submitted ||
        !expected ||
        typeof submitted !== "object" ||
        typeof expected !== "object" ||
        Array.isArray(submitted) ||
        Array.isArray(expected)
      )
        return false;
      const actualRoutes = Object.entries(submitted);
      const expectedRoutes = Object.entries(expected);
      if (actualRoutes.length !== expectedRoutes.length) return false;
      return actualRoutes.every(([id, value]) => {
        const route = input.routes.find((candidate) => candidate.id === id);
        const other = expectedRoutes.find(([key]) => key === id);
        if (!route || !other) return false;
        return route.ordered
          ? stableDeclarationValue(value) === stableDeclarationValue(other[1])
          : selectionValue(value) === selectionValue(other[1]);
      });
    }
    case "ordering":
    case "boolean":
    case "number":
    case "entity-allocation":
      return stableDeclarationValue(submitted) === stableDeclarationValue(expected);
    default: {
      const exhaustive: never = input;
      return exhaustive;
    }
  }
}
