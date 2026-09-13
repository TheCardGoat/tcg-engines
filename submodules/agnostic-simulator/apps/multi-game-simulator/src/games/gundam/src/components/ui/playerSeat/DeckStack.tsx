import { DeckStackZone } from "@tcg/simulator-ui";

import { toSimulatorZone } from "../card/to-simulator-entity.ts";
import { RESOURCE_ROW_EMPTY_PILE_CLASS, RESOURCE_ROW_PILE_CLASS } from "./resource-row-geometry.ts";

interface DeckStackProps {
  readonly count: number;
  readonly label: string;
  readonly zoneId?: string;
}

export function DeckStack({ count, label, zoneId }: DeckStackProps) {
  const zone = toSimulatorZone(zoneId, label, [], {
    role: "deck",
    visibility: "secret",
    count,
    layoutHint: "stack",
  });

  return (
    <DeckStackZone
      zone={zone}
      entities={[]}
      entityCount={count}
      label={label}
      density="mini"
      className={`gundam-zone-primitive gundam-deck-stack ${RESOURCE_ROW_PILE_CLASS} ${count === 0 ? RESOURCE_ROW_EMPTY_PILE_CLASS : ""} [&_.tabletop-pile-count]:!bottom-[20px] [&_.tabletop-pile-count]:pointer-events-none [&_.tabletop-pile-count]:font-mono [&_.tabletop-pile-count]:opacity-0 [&_.tabletop-pile-count]:transition-opacity [&_.tabletop-pile-count]:duration-150 hover:[&_.tabletop-pile-count]:opacity-100 focus-within:[&_.tabletop-pile-count]:opacity-100 [&_.tabletop-pile-label]:font-mono`}
    />
  );
}
