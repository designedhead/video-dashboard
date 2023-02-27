import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  Button,
  MenuItem,
  MenuList,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import type { sortByType } from "src/types/filterTypes";

const SortValues = {
  recent: "Newest",
  popular: "Most Popular",
  default: "Default",
};

const SortFilter = ({
  sortBy,
  setSortBy,
}: {
  sortBy: sortByType;
  setSortBy: React.Dispatch<React.SetStateAction<sortByType>>;
}) => (
  <Menu>
    <MenuButton
      as={Button}
      rightIcon={<ChevronDownIcon />}
      color={useColorModeValue("blackAlpha.700", "whiteAlpha.800")}
    >
      {
        // eslint-disable-next-line security/detect-object-injection
        !sortBy ? "Sort by" : SortValues[sortBy]
      }
    </MenuButton>
    <MenuList>
      <MenuItem onClick={() => setSortBy("default")}>Default</MenuItem>
      <MenuItem onClick={() => setSortBy("recent")}>Newest</MenuItem>
      <MenuItem onClick={() => setSortBy("popular")}>Most Popular</MenuItem>
    </MenuList>
  </Menu>
);

export default SortFilter;
