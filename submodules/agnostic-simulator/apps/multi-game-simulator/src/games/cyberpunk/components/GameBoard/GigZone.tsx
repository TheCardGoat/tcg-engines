import { CardSlot } from "./CardSlot";
import { ZoneLabel } from "./ZoneLabel";
import classes from "./GigZone.module.css";

interface GigZoneProps {
  variant: "rival" | "friendly";
  cards?: Array<{ imageUrl: string; name: string }>;
}

export function GigZone({ variant, cards = [] }: GigZoneProps) {
  const label = variant === "rival" ? "Rival Gigs" : "Friendly Gigs";
  const card = cards[0];

  return (
    <div className={`${classes.zone} ${classes[variant]}`}>
      <div className={classes.slots}>
        <CardSlot imageUrl={card?.imageUrl} label={card?.name} size="lg" dashed={!card} />
      </div>
      <ZoneLabel variant={variant === "friendly" ? "primary" : "dim"}>{label}</ZoneLabel>
    </div>
  );
}
