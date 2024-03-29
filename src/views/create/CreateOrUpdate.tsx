/* eslint-disable @typescript-eslint/no-misused-promises */
import { api } from "@/utils/api";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
  Textarea,
  VStack,
} from "@chakra-ui/react";

import React from "react";
import { type ParsedPost } from "src/types/postTypes";
import { type VideoObject } from "src/types/VideoTypes";

import { Controller, useForm } from "react-hook-form";

import useGetCategories from "src/hooks/api/categories/queries/useGetCategories";
import useCreatePost from "src/hooks/api/posts/mutations/useCreatePost";

import FileSelect from "./components/FileSelect";
import Multiselect from "./components/Multiselect";
import VideUpload from "./components/VideUpload";

type FormDataType = {
  name: string;
  categories: string[];
  softwares: string[];
  plugins: string[];
  video: VideoObject;
  download: string;
  description?: string | undefined;
};

interface Props {
  // eslint-disable-next-line react/require-default-props
  existingData?: ParsedPost;
}

const CreateOrUpdate = ({ existingData }: Props) => {
  const defaultCategories =
    existingData?.categories?.map((category) => category.value) || [];
  const defaultSoftwares =
    existingData?.softwareType?.map((software) => software.value) || [];
  const defaultPlugins =
    existingData?.plugins?.map((plugin) => plugin.value) || [];

  const { data, isLoading, isError } = useGetCategories();
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

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    mode: "all",
    defaultValues: {
      name: existingData?.title || "",
      description: existingData?.description || "",
      video: existingData?.preview_url
        ? {
            secure_url: existingData?.preview_url,
            original_filename: existingData?.title,
          }
        : "",
      download: existingData?.url || "",
      categories: defaultCategories || [],
      softwares: defaultSoftwares || "",
      plugins: defaultPlugins || "",
    },
  });

  const { mutate, createLoading } = useCreatePost();

  const onSubmit = (formData: FormDataType) => {
    mutate({
      name: formData.name,
      categories: formData.categories,
      video: formData.video.secure_url,
      download: formData.download,
      description: formData.description,
      softwares: formData.softwares || [],
      plugins: formData.plugins || [],
      ...(existingData != null && { id: existingData.id }),
    });
  };
  return (
    <Box w={{ base: "94%", md: "70%" }} my={10} mx={{ base: 4, md: 0 }}>
      {/* @ts-expect-error formdata */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={8}>
          <FormControl isInvalid={!!errors.name} isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              {...register("name", { required: "Name is required." })}
            />
            {errors?.name && (
              <FormErrorMessage color="red">
                {errors?.name?.message as string}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={!!errors.categories} isRequired>
            <FormLabel>Categories</FormLabel>
            {data != null && (
              <Controller
                control={control}
                name="categories"
                rules={{ required: "Select at least 1 category." }}
                render={({ field: { onChange } }) => (
                  <Multiselect
                    defaultValues={defaultCategories}
                    data={data}
                    isLoading={isLoading}
                    isError={isError}
                    onChangeForm={onChange}
                  />
                )}
              />
            )}
            <FormHelperText>
              Pro tip, you can select many and add new ones.
            </FormHelperText>
            {errors?.categories && (
              <FormErrorMessage color="red">
                {errors?.categories?.message as string}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={!!errors.video} isRequired>
            <FormLabel>Preview Video</FormLabel>
            <Controller
              control={control}
              name="video"
              rules={{
                required: "Select a preview video from your Google Drive.",
              }}
              render={({ field: { onChange, value } }) => (
                <VideUpload setVideo={onChange} video={value as VideoObject} />
              )}
            />
            <FormHelperText>
              This will be the preview video, please choose something light.
            </FormHelperText>
            {errors?.video && (
              <FormErrorMessage color="red">
                {errors?.video?.message as string}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={!!errors.download} isRequired>
            <FormLabel>Google Drive URL</FormLabel>
            <Controller
              control={control}
              name="download"
              rules={{
                required: "Select a download link.",
              }}
              render={({ field: { onChange, value } }) => (
                <FileSelect setFile={onChange} file={value as null | string} />
              )}
            />
            {errors?.download && (
              <FormErrorMessage color="red">
                {errors?.download?.message as string}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea {...register("description")} />
          </FormControl>
          <Stack
            w="full"
            justifyContent="space-between"
            spacing={4}
            direction={{ base: "column", md: "row" }}
          >
            <FormControl>
              <FormLabel>Software</FormLabel>
              {softwareList != null && (
                <Controller
                  control={control}
                  name="softwares"
                  render={({ field: { onChange } }) => (
                    <Multiselect
                      defaultValues={defaultSoftwares}
                      data={
                        softwareList.map((item) => ({
                          value: item.value,
                          label: item.value,
                        })) || []
                      }
                      isLoading={softwareLoading}
                      isError={softwareError}
                      onChangeForm={onChange}
                    />
                  )}
                />
              )}
              <FormHelperText>Pick the software(s) used.</FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Plugins</FormLabel>
              {pluginList != null && (
                <Controller
                  control={control}
                  name="plugins"
                  render={({ field: { onChange } }) => (
                    <Multiselect
                      defaultValues={defaultPlugins}
                      data={
                        pluginList.map((item) => ({
                          value: item.value,
                          label: item.value,
                        })) || []
                      }
                      isLoading={pluginLoading}
                      isError={pluginError}
                      onChangeForm={onChange}
                    />
                  )}
                />
              )}
              <FormHelperText>Pick aditional plugins used.</FormHelperText>
              {errors?.categories && (
                <FormErrorMessage color="red">
                  {errors?.categories?.message as string}
                </FormErrorMessage>
              )}
            </FormControl>
          </Stack>
          <Button
            w="full"
            type="submit"
            isDisabled={!isValid || createLoading}
            isLoading={createLoading}
          >
            {existingData == null ? "Create" : "Update"}
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CreateOrUpdate;
