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

const FiltersSideBar = ({ isOpen, onClose, filters, setFilters }: Props) => {
  const {
    data: softwareList,
    isLoading: softwareLoading,
    isError: softwareError,
  } = api.softwares.getAll.useQuery();

  const {
    data: pluginList,
    isLoading: pluginLoading,
    isError: pluginError,
  } = api.plugins.getAll.useQuery();

  const handlefilterSelection = (
    value: string,
    checked: boolean,
    type: "software" | "plugin"
  ) => {
    if (checked) {
      // eslint-disable-next-line security/detect-object-injection
      setFilters({ ...filters, [type]: [...filters[type], value] });
    } else {
      // eslint-disable-next-line security/detect-object-injection
      const filtered = filters[type].filter((el) => el !== value);
      setFilters({ ...filters, [type]: filtered });
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
                Software
              </Text>
              {softwareLoading ? (
                <Spinner />
              ) : (
                <Stack spacing={[1, 5]} direction="column">
                  {softwareError && <Text>Something went wrong</Text>}
                  {softwareList?.map((software) => {
                    const checked = filters?.software?.includes(software.value);
                    return (
                      <Checkbox
                        key={software.id}
                        value={software.value}
                        isChecked={checked}
                        onChange={(e) =>
                          handlefilterSelection(
                            software.value,
                            e.target.checked,
                            "software"
                          )
                        }
                      >
                        {software.value}
                      </Checkbox>
                    );
                  })}
                </Stack>
              )}
            </VStack>
            <VStack alignItems="flex-start" spacing={4}>
              <Text fontSize="md" fontWeight="bold">
                Plugin
              </Text>
              {pluginLoading ? (
                <Spinner />
              ) : (
                <Stack spacing={[1, 5]} direction={["column", "row"]}>
                  {pluginError && <Text>Something went wrong</Text>}
                  {pluginList?.map((plugin) => {
                    const checked = filters?.plugin?.includes(plugin.value);
                    return (
                      <Checkbox
                        key={plugin.id}
                        value={plugin.value}
                        isChecked={checked}
                        onChange={(e) =>
                          handlefilterSelection(
                            plugin.value,
                            e.target.checked,
                            "plugin"
                          )
                        }
                      >
                        {plugin.value}
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

export default FiltersSideBar;
