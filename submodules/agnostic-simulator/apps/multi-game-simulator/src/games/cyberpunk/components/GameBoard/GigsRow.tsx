import { CardSlot } from "./CardSlot";
import { ZoneLabel } from "./ZoneLabel";
import classes from "./GigsRow.module.css";

interface GigsRowProps {
  rivalCards?: Array<{ imageUrl: string; name: string }>;
  friendlyCards?: Array<{ imageUrl: string; name: string }>;
}

export function GigsRow({ rivalCards = [], friendlyCards = [] }: GigsRowProps) {
  const rival = rivalCards[0];
  const friendly = friendlyCards[0];

  return (
    <div className={classes.zone}>
      <div className={classes.side}>
        <div className={classes.slots}>
          <CardSlot
            imageUrl={rival?.imageUrl}
            label={rival?.name}
            size="fillHeight"
            dashed={!rival}
          />
        </div>
        <ZoneLabel variant="dim">Rival Gigs</ZoneLabel>
      </div>
      <div className={classes.divider} />
      <div className={classes.side}>
        <div className={classes.slots}>
          <CardSlot
            imageUrl={friendly?.imageUrl}
            label={friendly?.name}
            size="fillHeight"
            dashed={!friendly}
          />
        </div>
        <ZoneLabel>Friendly Gigs</ZoneLabel>
      </div>
    </div>
  );
}
