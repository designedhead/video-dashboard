import React from "react";
import {
  MultiSelect,
  useMultiSelect,
  type SelectOnChange,
  type Option,
} from "chakra-multiselect";
import {
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
} from "@chakra-ui/react";

type Category = {
  label: string;
  value: string;
};
interface Props {
  data: Category[];
  isLoading: boolean;
  isError: boolean;
  // eslint-disable-next-line no-unused-vars
  onChangeForm: (e: string[]) => void;
  defaultValues: string[];
}

const Multiselect = ({
  data,
  isLoading,
  isError,
  onChangeForm,
  defaultValues,
}: Props) => {
  const { value, options, onChange } = useMultiSelect({
    value: defaultValues,
    options: data,
  }) as {
    value: string | string[] | undefined;
    options: Option[];
    onChange: SelectOnChange;
  };

  const handleOnChange = (v: string[]) => {
    onChange(v);
    onChangeForm(v);
  };

  if (isLoading) {
    return (
      <InputGroup>
        <Input placeholder="Loading..." />
        <InputRightElement>
          <Spinner color="green.500" />
        </InputRightElement>
      </InputGroup>
    );
  }
  if (!isLoading && isError) {
    return <Text>Something went wrong, please refresh page.</Text>;
  }

  return (
    <MultiSelect
      options={options}
      value={value}
      onChange={handleOnChange as SelectOnChange}
      create
      style={{ zIndex: 10 }}
    />
  );
};

export default Multiselect;
