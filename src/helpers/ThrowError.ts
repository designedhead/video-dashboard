const ThrowError = (e: unknown) => {
  if (typeof e === "string") {
    throw new Error(e);
  } else if (e instanceof Error) {
    throw new Error(e.message);
  }
};

export default ThrowError;
