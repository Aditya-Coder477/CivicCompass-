/**
 * constants.js — Backend shared constants.
 *
 * All static labels, source badges, and status strings are centralized here.
 * Importing from this module eliminates magic strings across all route files,
 * improving consistency and maintainability (Code Quality).
 */

/** Source badge labels shown in every API response. */
const SOURCE_BADGES = {
  ECI_VERIFIED:  'ECI Verified Data',
  ECI_GUIDELINES:'ECI Guidelines',
  ECI_OFFICIAL:  'ECI Official Data',
  SYSTEM_ERROR:  'System Error',
};

/** Supported explanation styles for the Gemini layer. */
const EXPLAIN_STYLES = {
  ELI5:    'eli5',
  SUMMARY: 'summary',
  OFFICIAL:'official',
  TODAY:   'today',
};

/** Supported languages for the Gemini translation layer. */
const LANGUAGES = {
  EN: 'en',
  HI: 'hi',
};

/** Default values for optional request fields. */
const DEFAULTS = {
  LANGUAGE:            LANGUAGES.EN,
  STYLE:               EXPLAIN_STYLES.SUMMARY,
  POLL_PROXIMITY_DAYS: 999,
};

module.exports = { SOURCE_BADGES, EXPLAIN_STYLES, LANGUAGES, DEFAULTS };
