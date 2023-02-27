export type sortByType = undefined | "recent" | "popular" | "default";

export type filtersType = {
  software: string[];
  plugin: string[];
  category: string[];
};
export type filtersMap = {
  value: string;
  type: "software" | "plugin" | "category";
};
