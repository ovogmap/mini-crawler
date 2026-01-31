export const VIEWS_OBJECT = {
  RECIPE_LIST: "recipe_list",
  RECIPE_EDIT: "recipe_edit",
  RECIPE_DETAIL: "recipe_detail",
} as const;

export type ViewType = (typeof VIEWS_OBJECT)[keyof typeof VIEWS_OBJECT];
