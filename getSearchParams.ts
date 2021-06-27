import qs from "qs";

export const getSearchParams = (search: string) =>
  qs.parse(search.replace("?", "")) || {};
