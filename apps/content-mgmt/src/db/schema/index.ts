/**
 * Content Management Service Database Schema
 *
 * This module exports all database tables and types for the Content Management Service.
 * The schema is self-contained within this service - NO external dependencies.
 *
 * User references (userId, ownerUserId) are stored as text and validated
 * via JWT tokens from the auth service - NOT as foreign keys.
 */

// Comments
export {
  type Comment,
  comments,
  commentsRelations,
  type NewComment,
} from "./comments";
// Contents
export {
  type Content,
  contents,
  contentsRelations,
  type NewContent,
} from "./contents";

// Creators
export {
  type Creator,
  type CreatorGame,
  type CreatorSocial,
  creatorGames,
  creatorGamesRelations,
  creatorSocials,
  creatorSocialsRelations,
  creators,
  creatorsRelations,
  type NewCreator,
  type NewCreatorGame,
  type NewCreatorSocial,
} from "./creators";
// Enums
export {
  contentStatusEnum,
  extractionStatusEnum,
  processingStatusEnum,
  sourceTypeEnum,
  summaryTypeEnum,
} from "./enums";
// Games
export { type Game, games, type NewGame } from "./games";
// Tags
export {
  type ContentTag,
  contentTags,
  contentTagsRelations,
  type NewContentTag,
  type NewTag,
  TAG_CATEGORIES,
  type Tag,
  tags,
  tagsRelations,
} from "./tags";
// Votes
export { type NewVote, type Vote, votes } from "./votes";
