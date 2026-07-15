import { DeckStackZone } from "@tcg/simulator-ui";

import { toSimulatorZone } from "../card/to-simulator-entity.ts";

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
      className="gundam-zone-primitive [&_.tabletop-pile-count]:font-mono [&_.tabletop-pile-label]:font-mono"
    />
  );
}
