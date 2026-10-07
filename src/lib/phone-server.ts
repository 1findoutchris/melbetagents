import "server-only";
import * as max from "libphonenumber-js/max";
import examples from "libphonenumber-js/mobile/examples";
import type { CallingCodeOption, PhoneLib } from "@/lib/phone";

export const serverPhoneLib: PhoneLib = max;

/** Every country with a calling code, named for the locale, with a sample mobile number. */
export function callingCodeOptions(locale: string): CallingCodeOption[] {
  let names: Intl.DisplayNames | null = null;
  try {
    names = new Intl.DisplayNames([locale, "en"], { type: "region" });
  } catch {
    names = null;
  }
  return max
    .getCountries()
    .map((code) => {
      const name = names?.of(code);
      const example = max.getExampleNumber(code, examples);
      return {
        code,
        name: name && name !== code ? name : "",
        dial: max.getCountryCallingCode(code),
        example: example?.formatNational() ?? null,
      };
    })
    .filter((option) => option.name)
    .sort((a, b) => a.name.localeCompare(b.name, locale));
}
