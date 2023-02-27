import { CloseIcon } from "@chakra-ui/icons";
import { Checkbox, Spinner, Stack, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "@/utils/api";
import type { filtersType } from "src/types/filterTypes";

interface Props {
  isOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  onClose: () => void;
  filters: filtersType;
  setFilters: React.Dispatch<React.SetStateAction<filtersType>>;
}

const CategoriesSideBar = ({ isOpen, onClose, filters, setFilters }: Props) => {
  const { data, isLoading, isError } = api.categories.getAll.useQuery();

  const handlefilterSelection = (value: string, checked: boolean) => {
    if (checked) {
      // eslint-disable-next-line security/detect-object-injection
      setFilters({ ...filters, category: [...filters.category, value] });
    } else {
      // eslint-disable-next-line security/detect-object-injection
      const filtered = filters.category.filter((el) => el !== value);
      setFilters({ ...filters, category: filtered });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          animate={{
            width: "30%",
            x: 0,
            opacity: 1,
            transition: { type: "spring", duration: 0.5, bounce: 0.4 },
          }}
          style={{ position: "relative" }}
          initial={{ x: -200, width: 0, opacity: 0 }}
          exit={{
            x: -200,
            width: 0,
            opacity: 0,
            transition: { type: "spring", duration: 0.7 },
          }}
        >
          <CloseIcon pos="absolute" top={3} right={3} w={3} onClick={onClose} />
          <VStack py={6} borderRadius="lg" spacing={10} alignItems="flex-start">
            <VStack alignItems="flex-start" spacing={4}>
              <Text fontSize="md" fontWeight="bold">
                Options
              </Text>
              {isLoading ? (
                <Spinner />
              ) : (
                <Stack spacing={[1, 5]} direction="column">
                  {isError && <Text>Something went wrong</Text>}
                  {data?.map((category) => {
                    const checked = filters?.category?.includes(category.value);
                    return (
                      <Checkbox
                        key={category.id}
                        value={category.value}
                        isChecked={checked}
                        onChange={(e) =>
                          handlefilterSelection(
                            category.value,
                            e.target.checked
                          )
                        }
                      >
                        {category.value}
                      </Checkbox>
                    );
                  })}
                </Stack>
              )}
            </VStack>
          </VStack>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CategoriesSideBar;
