import { api } from "@/utils/api";
import {
  Container,
  HStack,
  Text,
  VStack,
  Icon,
  Divider,
  Button,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
import SortIcon from "@mui/icons-material/Sort";

import React from "react";
import SearchComponent from "src/components/search/SearchComponent";
import useDebounce from "src/helpers/useDebounce";
import type {
  filtersMap,
  filtersType,
  sortByType,
} from "src/types/filterTypes";
import CategoriesSideBar from "./components/filters/CategoriesSideBar";
import FilterPills from "./components/filters/FilterPills";
import FiltersSideBar from "./components/filters/FiltersSideBar";
import SortFilter from "./components/filters/SortFilter";
import PostList from "./components/PostList";

const View = () => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const {
    isOpen: categoriesIsOpen,
    onToggle: categoriesOnToggle,
    onClose: categoriesOnClose,
  } = useDisclosure();
  const [term, setTerm] = React.useState("");
  const debouncedSearchTerm = useDebounce(term, 700);
  const [sortBy, setSortBy] = React.useState<sortByType>();
  const [filters, setFilters] = React.useState<filtersType>({
    software: [],
    plugin: [],
    category: [],
  });
  const { data, isLoading, isError } = api.posts.getAll.useQuery({
    page: 1,
    searchTerm: debouncedSearchTerm,
    sortBy,
    filters,
  });

  const allFilters = [
    ...filters.software.map((item) => ({ value: item, type: "software" })),
    ...filters.plugin.map((item) => ({ value: item, type: "plugin" })),
    ...filters.category.map((item) => ({ value: item, type: "category" })),
  ] as filtersMap[];

  const handleFilterReset = () => {
    setFilters({
      software: [],
      plugin: [],
      category: [],
    });
    setSortBy(undefined);
  };
  const handleFilterRemove = (
    value: string,
    type: "software" | "plugin" | "category"
  ) => {
    const filtered = filters[type].filter((el) => el !== value);
    setFilters({ ...filters, [type]: filtered });
  };

  return (
    <HStack
      py={10}
      alignItems="flex-start"
      spacing={4}
      justifyContent="space-between"
    >
      <Container
        w="25%"
        h="85vh"
        py={6}
        bgColor={useColorModeValue("white", "gray.800")}
        zIndex={2}
      >
        <VStack alignItems="flex-start" spacing={4}>
          <HStack spacing={2}>
            <Icon as={SortIcon} />
            <Text fontSize="lg" fontWeight="medium">
              Filters
            </Text>
          </HStack>
          <Divider />
          <VStack spacing={2}>
            <Button
              variant="filters"
              color={isOpen ? "brand.primary" : "unset"}
              textDecor={isOpen ? "underline" : "unset"}
              onClick={() => {
                onToggle();
                categoriesOnClose();
              }}
            >
              Technical
            </Button>
            <Button
              variant="filters"
              color={categoriesIsOpen ? "brand.primary" : "unset"}
              textDecor={categoriesIsOpen ? "underline" : "unset"}
              onClick={() => {
                categoriesOnToggle();
                onClose();
              }}
            >
              Categories
            </Button>
          </VStack>
        </VStack>
      </Container>
      <FiltersSideBar
        isOpen={isOpen}
        onClose={onClose}
        filters={filters}
        setFilters={setFilters}
      />
      <CategoriesSideBar
        isOpen={categoriesIsOpen}
        onClose={categoriesOnClose}
        filters={filters}
        setFilters={setFilters}
      />
      <VStack alignItems="flex-start" pt={6} w="full" spacing={6}>
        <HStack justifyContent="space-between" w="full" zIndex={2}>
          <SearchComponent term={term} setTerm={setTerm} />
          <SortFilter sortBy={sortBy} setSortBy={setSortBy} />
        </HStack>
        <FilterPills
          allFilters={allFilters}
          handleFilterRemove={handleFilterRemove}
          handleFilterReset={handleFilterReset}
        />

        <PostList data={data} isLoading={isLoading} isError={isError} />
      </VStack>
    </HStack>
  );
};

export default View;
