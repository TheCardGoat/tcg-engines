/**
 * Split the printed hero alternatives carried by a Specialization keyword.
 *
 * CR 8.3.7 permits one of the printed hero monikers. Multi-hero cards encode
 * that printed list as `"Dromai or Fai"`, so consumers must compare each
 * moniker independently rather than treating the whole label as one name.
 */
export function specializationHeroNames(hero: string): readonly string[] {
  return hero
    .split(/\s+or\s+/i)
    .map((name) => name.trim())
    .filter(Boolean);
}
