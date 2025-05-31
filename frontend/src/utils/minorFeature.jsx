import { LANGUAGE_TO_FLAG } from "../constants";
export function getLanguageFlag(language) {
  if (!language) return null; // Default icon if no language is provided
  const langInLowercase = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langInLowercase];
  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        className="h-3 mr-1 inline-block"
        alt={`${language} flag`}
      />
    );
  }
  return null;
}
