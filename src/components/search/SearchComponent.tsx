import { Search2Icon } from "@chakra-ui/icons";
import {
  Box,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";

interface Props {
  term: string;
  setTerm: React.Dispatch<React.SetStateAction<string>>;
}

const SearchComponent = ({ term, setTerm }: Props) => (
  <Box>
    <InputGroup size="lg">
      <InputLeftElement>
        <Icon
          as={Search2Icon}
          w={4}
          h={4}
          color={useColorModeValue("blackAlpha.700", "whiteAlpha.700")}
        />
      </InputLeftElement>
      <Input
        placeholder="Search..."
        type="search"
        borderRadius="full"
        bgColor={useColorModeValue("gray.100", "gray.900")}
        border="none"
        color={useColorModeValue("blackAlpha.700", "white")}
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
    </InputGroup>
  </Box>
);

export default SearchComponent;
