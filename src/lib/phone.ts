/**
 * Phone-number helpers built on libphonenumber-js. The browser passes the
 * compact metadata build ("min") for live feedback; the server passes the full
 * build ("max") so the final check uses each country's complete numbering plan.
 */
import type * as Lib from "libphonenumber-js/min";

export type PhoneLib = Pick<typeof Lib, "parsePhoneNumberFromString" | "getCountryCallingCode" | "isSupportedCountry">;

export type CallingCodeOption = {
  /** ISO 3166-1 alpha-2 */
  code: string;
  name: string;
  /** Calling code without "+", e.g. "254" */
  dial: string;
  /** Example number in national format, e.g. "0712 123456" */
  example: string | null;
};
