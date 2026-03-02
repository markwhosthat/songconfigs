import type { Theme } from '../../core/types';

// DEFAULT_THEME is a fallback - and does not refer to the theme automatically selected when the user
// visits the website. The default setting is defined in index.ts
//
// Set this to a neutral-coloured theme, as it's used as a fallback for styling the results page if
// an album does not have a corresponding theme, or if there's an error that breaks the themed
// styling on the home page. Realistically, you can leave this as the default-styled grey in this example
// for new themes.
export const DEFAULT_THEME: Theme = {
    className: 'theme-default',
};

// The key for each record is the full name of the album, and must match the album
// field in songs.json exactly. Use 'className' to match to a defined css class in
// themes.css, and use 'short_name' to create a short display name for the theme selector
// which is useful for especially long album names.
export const ALBUM_THEMES: Record<string, Theme> = {
    "Taylor Swift": {
        className: 'theme-taylor-swift',
    },
    "Fearless": {
        className: 'theme-fearless',
    },
    "Speak Now": {
        className: 'theme-speak-now',
    },
    "Red": {
        className: 'theme-red',
    },
    "1989": {
        className: 'theme-1989',
    },
    "Reputation": {
        className: 'theme-reputation',
    },
    "Lover": {
        className: 'theme-lover',
    },
    "Folklore": {
        className: 'theme-folklore',
    },
    "Evermore": {
        className: 'theme-evermore',
    },
    "Midnights": {
        className: 'theme-midnights',
    },
    "The Tortured Poets Department": {
        className: 'theme-ttpd',
        short_name: "TTPD",
    },
    "The Life Of A Showgirl": {
        className: 'theme-showgirl',
    },
}
