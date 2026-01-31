export const VIEWS_OBJECT = {
  RECIPE_LIST: "RECIPE_LIST",
  RECIPE_EDIT: "RECIPE_EDIT",
  RECIPE_DETAIL: "RECIPE_DETAIL",
} as const;

export type ViewType = (typeof VIEWS_OBJECT)[keyof typeof VIEWS_OBJECT];

type ActionType = "click" | "extract";

export interface Step {
  id: string;
  action: ActionType;
  selector: string;
  description?: string;
  label?: string;
}
