import { deleteCookie, getCookie, setCookie } from "cookies-next";
import type { authResult } from "react-google-drive-picker/dist/typeDefs";

interface localAuthResult extends authResult {
  expires_at: number;
}

export const setDriveCookies = (token: authResult | undefined) => {
  if (token) {
    setCookie(
      "driveJWT",
      JSON.stringify({
        ...token,
        expires_at: Date.now() + token.expires_in * 1000,
      })
    );
    return "sucess";
  }
  return "No token";
};

export const getDriveCookies = () => {
  const rawCookie = getCookie("driveJWT") as string;
  if (!rawCookie) return null;

  const parsedCookie = JSON.parse(rawCookie) as unknown as localAuthResult;
  if (parsedCookie.expires_at < Date.now()) {
    deleteCookie("driveJWT");
    return null;
  }
  return parsedCookie;
};
