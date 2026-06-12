import { describe, expect, it } from "bun:test";
import { snugglyDucklingDisreputablePub } from "./135-snuggly-duckling-disreputable-pub";
import { snugglyDucklingDisreputablePubEnchanted } from "./216-snuggly-duckling-disreputable-pub-enchanted";
import { arielsGrottoASecretPlace } from "./169-ariels-grotto-a-secret-place";
import { arielsGrottoASecretPlaceEnchanted } from "./219-ariels-grotto-a-secret-place-enchanted";
import { theWallBorderFortress } from "./203-the-wall-border-fortress";
import { theWallBorderFortressEnchanted } from "./222-the-wall-border-fortress-enchanted";

describe("set 004 location enchanted parity", () => {
  it("matches Snuggly Duckling enchanted parity", () => {
    expect(snugglyDucklingDisreputablePubEnchanted.canonicalId).toBe(
      snugglyDucklingDisreputablePub.canonicalId,
    );
    expect(snugglyDucklingDisreputablePubEnchanted.missingImplementation).toBe(
      snugglyDucklingDisreputablePub.missingImplementation,
    );
    expect(snugglyDucklingDisreputablePubEnchanted.missingTests).toBe(
      snugglyDucklingDisreputablePub.missingTests,
    );
    expect(snugglyDucklingDisreputablePubEnchanted.abilities).toEqual(
      snugglyDucklingDisreputablePub.abilities,
    );
  });

  it("matches Ariel's Grotto enchanted parity", () => {
    expect(arielsGrottoASecretPlaceEnchanted.canonicalId).toBe(
      arielsGrottoASecretPlace.canonicalId,
    );
    expect(arielsGrottoASecretPlaceEnchanted.missingImplementation).toBe(
      arielsGrottoASecretPlace.missingImplementation,
    );
    expect(arielsGrottoASecretPlaceEnchanted.missingTests).toBe(
      arielsGrottoASecretPlace.missingTests,
    );
    expect(arielsGrottoASecretPlaceEnchanted.abilities).toEqual(arielsGrottoASecretPlace.abilities);
  });

  it("matches The Wall enchanted parity", () => {
    expect(theWallBorderFortressEnchanted.canonicalId).toBe(theWallBorderFortress.canonicalId);
    expect(theWallBorderFortressEnchanted.missingImplementation).toBe(
      theWallBorderFortress.missingImplementation,
    );
    expect(theWallBorderFortressEnchanted.missingTests).toBe(theWallBorderFortress.missingTests);
    expect(theWallBorderFortressEnchanted.abilities).toEqual(theWallBorderFortress.abilities);
  });
});
