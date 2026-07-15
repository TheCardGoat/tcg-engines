/**
 * Base visitor class for CST traversal.
 * This is generated from the parser instance.
 */

import { LorcanaAbilityParser } from "../grammar";

const parserInstance = new LorcanaAbilityParser();

export const BaseVisitor = parserInstance.getBaseCstVisitorConstructor();
