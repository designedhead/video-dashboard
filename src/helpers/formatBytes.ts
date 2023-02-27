export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, security/detect-object-injection
  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}
