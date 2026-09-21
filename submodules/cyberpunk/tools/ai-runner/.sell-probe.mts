import { structuredCards } from "@tcg/cyberpunk-cards";
for (const target of ["Pyramid Song", "Towerfall", "Trust No One", "Chrome Reverie", "Floor It", "Les Élémens", "Reboot Optics"]) {
  const c = (structuredCards as any[]).find((x) => x.displayName === target);
  console.log(`${target.padEnd(16)} cost=${String(c.cost).padEnd(2)} timingTriggers=${c.timingTriggers?.length ?? 0} abilities=${c.abilities?.length ?? 0} sell=${c.hasSellTag}`);
}
