# Artist Configuration Guide

To add a new artist or modify an existing one, follow the structure below. Each artist has its own directory in `src/artists/`.

## Directory Structure

An artist folder should contain the following files:

- `index.ts`: The main entry point for the artist's configuration.
- `songs.json`: A JSON file containing the list of songs.
- `themes.ts`: A TypeScript file defining the themes (usually by album).
- `themes.css`: A CSS file containing the styles for each theme.

## Configuration Details

### 1. `index.ts`

This file exports an `ArtistConfig` object.

```typescript
import type { ArtistConfig } from '../../core/types';
import songs from './songs.json';
import { ALBUM_THEMES } from './themes';

export const ArtistNameConfig: ArtistConfig = {
  // Unique internal ID
  id: 'artist-id',
  // Display name for the artist
  name: 'Artist Name',
  // Imported song data
  songs,
  // Mapping of album keys to theme objects
  themes: ALBUM_THEMES,
  // Key of the default theme to start with
  defaultThemeKey: 'DefaultAlbum',
  // Unique localStorage key for this artist's session
  storageKey: 'artist-session-key',
  // (Optional) Label for the top results section
  topSectionName: 'Top 10 Songs',
  // (Optional) Number of songs to show in the top results section
  topSectionCount: 10,
};
```

### 2. `songs.json`

The song list is an array of objects:

```json
[
  {
    "id": 1,
    "title": "Song Title",
    "album": "Album Name"
  }
]
```

- **`id`**: Unique numeric ID for each song.
- **`title`**: Display name of the song.
- **`album`**: The album name. This should match with an album in Themes. If it does not match, the results for this song will use the fallback theme. It's typically fine to have one "Other songs" option that is not themed, but the "other" string should match across all songs that do not belong to an album.

### 3. `themes.ts`

Maps album names to theme metadata. The key used here (e.g., `"Album Name"`) MUST exactly match the corresponding `album` property of the songs in `songs.json`.

```typescript
import type { Theme } from '../../core/types';

export const ALBUM_THEMES: Record<string, Theme> = {
  // Key matches the 'album' field in songs.json
  "Album Name": {
    // CSS class defined in themes.css
    className: 'theme-album-class',
    // (Optional) Name displayed in the Theme Selector UI
    short_name: "Short Name",
  },
};
```

For any songs with an album that does not have a corresponding theme, the theme will fallback to a default
site-wide fallback styling.

### 4. `themes.css`

Styles are scoped by the `className` defined in `themes.ts`. Use these CSS variables to customize the UI:

```css
.theme-album-class {
  /* Colors */
  --album-color-primary: #hex;      /* Main accent color (buttons, progress bar) */
  --album-color-secondary: #hex;    /* Background color for the app */
  --text-color: #hex;               /* Color for general body text */

  /* Typography */
  --album-font: 'font-name';        /* Font for headers and song titles */
  --text-font: 'font-name';         /* Font for instructions and UI labels */
  --album-font-weight: bold;        /* Weight for album headers */

  /* Tip: Recommended that you use the built-in variables:
     var(--default-font)    => Sans Serif text stack
     var(--serif-text-font) => Serif text stack
  */
  --album-text-transform: none;     /* e.g., uppercase, lowercase */
  --album-letter-spacing: normal;   /* e.g., 0.05em, -2px */

  /* Fine-tuning the Theme Selector */
  --album-font-size-item: 1rem;     /* Adjust if the font is naturally too big/small */
}

/* Optional: If you use uppercase, apply it to the theme selector preview too */
.theme-album-class.theme-item {
  text-transform: uppercase;
}
```

#### Custom Fonts
If using custom fonts, you can include `@font-face` declarations at the top of your `themes.css` or import them from a CDN. Ensure font files are placed in the `public/` directory if hosting them locally.
