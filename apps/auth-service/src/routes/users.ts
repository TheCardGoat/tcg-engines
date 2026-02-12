import { Elysia, t } from "elysia";
import { betterAuthMacro, requireAuth } from "../plugins/auth";
import { userRateLimiter } from "../plugins/rate-limit";
import {
  getDigestPreferences,
  getUserSubscriptions,
  updateDigestPreferences,
} from "../services/subscriptions";
import { getUserById, updateUserProfile } from "../services/users";

/**
 * User routes for the Auth Service
 *
 * All routes require authentication.
 */
const rateLimiter = userRateLimiter();

export const usersRoutes = new Elysia({ prefix: "/users" })
  // Apply Better Auth macro for auth context
  .use(betterAuthMacro)
  // Apply user rate limiting if enabled
  .use(rateLimiter ?? new Elysia())

  /**
   * GET /v1/users/me - Get current user profile
   */
  .get(
    "/me",
    async ({ user, set }) => {
      const authenticatedUser = requireAuth(user, set);

      const fullUser = await getUserById(authenticatedUser.id);
      if (!fullUser) {
        set.status = 404;
        return {
          error: "NOT_FOUND",
          message: "User not found",
        };
      }

      return {
        createdAt: fullUser.createdAt,
        displayUsername: fullUser.displayUsername,
        email: fullUser.email,
        emailVerified: fullUser.emailVerified,
        id: fullUser.id,
        image: fullUser.image,
        name: fullUser.name,
        subscriptionExpiresAt: fullUser.subscriptionExpiresAt,
        subscriptionTier: fullUser.subscriptionTier,
        updatedAt: fullUser.updatedAt,
        username: fullUser.username,
      };
    },
    { auth: true },
  )

  /**
   * PUT /v1/users/me - Update current user profile
   */
  .put(
    "/me",
    async ({ user, set, body }) => {
      const authenticatedUser = requireAuth(user, set);

      const updatedUser = await updateUserProfile(authenticatedUser.id, body);
      if (!updatedUser) {
        set.status = 404;
        return {
          error: "NOT_FOUND",
          message: "User not found",
        };
      }

      return {
        createdAt: updatedUser.createdAt,
        displayUsername: updatedUser.displayUsername,
        email: updatedUser.email,
        emailVerified: updatedUser.emailVerified,
        id: updatedUser.id,
        image: updatedUser.image,
        name: updatedUser.name,
        subscriptionExpiresAt: updatedUser.subscriptionExpiresAt,
        subscriptionTier: updatedUser.subscriptionTier,
        updatedAt: updatedUser.updatedAt,
        username: updatedUser.username,
      };
    },
    {
      auth: true,
      body: t.Object({
        displayUsername: t.Optional(t.String({ maxLength: 50, minLength: 1 })),
        image: t.Optional(t.String({ format: "uri" })),
        name: t.Optional(t.String({ maxLength: 100, minLength: 1 })),
        username: t.Optional(t.String({ maxLength: 30, minLength: 3 })),
      }),
    },
  )

  /**
   * GET /v1/users/me/subscriptions - Get user's creator subscriptions
   */
  .get(
    "/me/subscriptions",
    async ({ user, set }) => {
      const authenticatedUser = requireAuth(user, set);

      const subscriptions = await getUserSubscriptions(authenticatedUser.id);

      return {
        count: subscriptions.length,
        subscriptions: subscriptions.map((sub) => ({
          createdAt: sub.createdAt,
          creatorId: sub.creatorId,
          gameId: sub.gameId,
          id: sub.id,
        })),
      };
    },
    { auth: true },
  )

  /**
   * GET /v1/users/me/digest - Get user's digest preferences
   */
  .get(
    "/me/digest",
    async ({ user, set }) => {
      const authenticatedUser = requireAuth(user, set);

      const preferences = await getDigestPreferences(authenticatedUser.id);

      if (!preferences) {
        // Return default preferences if none exist
        return {
          createdAt: null,
          deliveryTime: "09:00:00",
          frequency: "daily",
          isActive: false,
          updatedAt: null,
        };
      }

      return {
        createdAt: preferences.createdAt,
        deliveryTime: preferences.deliveryTime,
        frequency: preferences.frequency,
        isActive: preferences.isActive,
        updatedAt: preferences.updatedAt,
      };
    },
    { auth: true },
  )

  /**
   * PUT /v1/users/me/digest - Update user's digest preferences
   */
  .put(
    "/me/digest",
    async ({ user, set, body }) => {
      const authenticatedUser = requireAuth(user, set);

      const preferences = await updateDigestPreferences(authenticatedUser.id, body);

      return {
        createdAt: preferences.createdAt,
        deliveryTime: preferences.deliveryTime,
        frequency: preferences.frequency,
        isActive: preferences.isActive,
        updatedAt: preferences.updatedAt,
      };
    },
    {
      auth: true,
      body: t.Object({
        deliveryTime: t.Optional(
          t.String({
            pattern: "^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$",
          }),
        ),
        frequency: t.Optional(t.Union([t.Literal("daily"), t.Literal("weekly")])),
        isActive: t.Optional(t.Boolean()),
      }),
    },
  );
