import { SmallCloseIcon } from "@chakra-ui/icons";
import { Button, Flex, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { filtersMap } from "src/types/filterTypes";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  handleFilterRemove: (
    // eslint-disable-next-line no-unused-vars
    value: string,
    // eslint-disable-next-line no-unused-vars
    type: "software" | "plugin" | "category"
  ) => void;
  handleFilterReset: () => void;
  allFilters: filtersMap[];
}

const FilterPills = ({
  allFilters,
  handleFilterRemove,
  handleFilterReset,
}: Props) => {
  const two = 2;
  return (
    <Flex wrap="wrap" direction="row" gap={2}>
      <AnimatePresence>
        {allFilters.map((item) => (
          <motion.div
            key={item.value}
            animate={{
              width: "auto",
              opacity: 1,
              transition: { type: "spring", duration: 0.5, bounce: 0.4 },
            }}
            initial={{ width: 0, opacity: 0 }}
            exit={{
              width: 0,
              opacity: 0,
              transition: { type: "spring", duration: 0.5, bounce: 0.4 },
            }}
          >
            <Button
              rightIcon={<SmallCloseIcon />}
              variant="outline"
              onClick={() => handleFilterRemove(item.value, item.type)}
              // eslint-disable-next-line react-hooks/rules-of-hooks
              color={useColorModeValue("blackAlpha.700", "whiteAlpha.700")}
            >
              {item.value}
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>
      <AnimatePresence>
        {!!allFilters.length && (
          <motion.div
            animate={{
              width: "auto",
              opacity: 1,
              transition: { type: "spring", duration: 0.5, bounce: 0.4 },
            }}
            initial={{ width: 0, opacity: 0 }}
            exit={{
              width: 0,
              opacity: 0,
              transition: { type: "spring", duration: 0.5, bounce: 0.4 },
            }}
          >
            <Button
              variant="link"
              px={4}
              h="full"
              onClick={handleFilterReset}
              // eslint-disable-next-line react-hooks/rules-of-hooks
              color={useColorModeValue("blackAlpha.700", "whiteAlpha.700")}
            >
              Clear all
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Flex>
  );
};

export default FilterPills;
