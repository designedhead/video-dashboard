import React from "react";

// exported component
const useCloudinaryUploadWidget = ({ onClose, onChange, options = {} }) => {
  // state for containing cloudinay component
  const fileUploader = React.useRef();

  // storage for images retuned from the widget, required since...
  // the uploadWidget only uploads one image at a time with a callback
  const [video, setVideo] = React.useState();
  const videoRef = React.useRef([]);
  videoRef.current = video;

  // Function for callback when images changes (assuming uploads are complete)
  React.useEffect(() => {
    if (typeof onChange === "function" && video) {
      onChange({ video });
    }
  }, [video, onChange]);

  // Function for callback when the modal is closed or errors.
  const handleClose = React.useCallback(() => {
    if (typeof onClose === "function") {
      onClose({ images: videoRef.current });
    }
    // reset images
    // setVideo();
  }, [onClose]);

  // effect for initialising the widget
  React.useEffect(() => {
    const cloudinaryOptions = {
      cloudName: "dclgfkzkq",
      uploadPreset: "cqwsol1y",
      sources: ["google_drive", "local"],
      sourceKeys: {
        google_drive: process.env.NEXT_PUBLIC_GOOGLE_ID,
      },
      singleUploadAutoClose: false,
      multiple: false,
      resourceType: "video",
      clientAllowedFormats: ["mp4", "mov", "avi", "wmv", "flv", "webm"],
      ...options,
      styles: {
        ...options.styles,
        palette: {
          window: "#000",
          windowBorder: "#90A0B3",
          tabIcon: "#fff",
          menuIcons: "#fff",
          textDark: "#000000",
          textLight: "#909090",
          link: "#fff",
          action: "#fff",
          inactiveTabIcon: "#ccc",
          error: "#F44235",
          inProgress: "#0078FF",
          complete: "#20B832",
          sourceBg: "#fff",
          ...options.palette,
        },
        frame: {
          ...options.frame,
          background: "#0E2F5B99",
        },
      },
    };

    const cloudinaryWidget = window.cloudinary.createUploadWidget(
      cloudinaryOptions,
      (error, result) => {
        if (!error && result?.event === "close") {
          handleClose();
        }

        if (!error && result?.event === "success") {
          const rawFile = result.info;
          setVideo(rawFile);
        }
      }
    );

    fileUploader.current = cloudinaryWidget;
  }, [handleClose, options]);

  // function for clearing out old images
  const resetImages = () => setVideo();

  // interface to cloudinaryWidget
  const cloudinaryInterface = {
    open: () => fileUploader?.current?.open(),
    close: () => fileUploader?.current?.close(),
    destroy: () => fileUploader?.current?.destroy(),
    hide: () => fileUploader?.current?.hide(),
    isDestroyed: () => fileUploader?.current?.isDestroyed(),
    isMinimized: () => fileUploader?.current?.isMinimized(),
    isShowing: () => fileUploader?.current?.isShowing(),
    minimize: () => fileUploader?.current?.minimize(),
    show: () => fileUploader?.current?.show(),
    update: () => fileUploader?.current?.update(),
  };

  // returned state.
  return {
    fileUploader: cloudinaryInterface,
    resetImages,
    videoFile: video,
    thumbnail: "",
  };
};

export default useCloudinaryUploadWidget;
