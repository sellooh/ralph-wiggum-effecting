import { Atom } from "@effect-atom/atom-react";
import type { TransformationType } from "@echo-lab/shared";

/**
 * Atom for the input text in the transform card textarea.
 * Used by TransformCard for user input and useTransform for API calls.
 */
export const inputTextAtom = Atom.make<string>("");

/**
 * Atom for the currently selected transformation type.
 * Defaults to "uppercase" as a sensible starting value.
 */
export const selectedTransformationAtom = Atom.make<TransformationType>("uppercase");

/**
 * Atom for controlling the history panel visibility.
 * When true, the history panel is shown.
 */
export const isHistoryOpenAtom = Atom.make<boolean>(false);
