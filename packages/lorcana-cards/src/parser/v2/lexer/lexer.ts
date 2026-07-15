/**
 * Chevrotain lexer instance for tokenizing Lorcana ability text.
 */

import { Lexer } from "chevrotain";
import { allTokens } from "./tokens";

export const LorcanaLexer = new Lexer(allTokens);
