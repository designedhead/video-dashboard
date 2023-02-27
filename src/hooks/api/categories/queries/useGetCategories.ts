import { api } from "@/utils/api";

const useGetCategories = () => {
  const { data, isLoading, isError } = api.categories.getAll.useQuery();

  return { data, isLoading, isError };
};

export default useGetCategories;
