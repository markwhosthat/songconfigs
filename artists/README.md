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
  // (Optional) Label for the top results section. Defaults to 'The Top 10'
  topSectionName: 'The Top 10',
  // (Optional) Number of songs to show in the top results section. Defaults to 10
  topSectionCount: 10,
  // (Optional) Pre-defined filters that users can select
  filterPresets: [
    {
      name: 'Standard Tracks Only',
      slug: 'standard',
      excludedAlbums: ['Other Songs'],
      excludedVariants: ['Album Name:Deluxe', 'Album Name:Remix']
    }
  ],
  // (Optional) SEO metadata for the artist's page
  seo: {
    title: 'Custom Page Title',
    description: 'Custom meta description',
    keywords: 'list, of, keywords'
  }
};
```

### 2. `songs.json`

The song list is an array of objects:

```json
[
  {
    "id": 1,
    "title": "Song Title",
    "album": "Album Name",
    "variants": ["deluxe"]
  }
]
```

- **`id`**: Unique numeric ID for each song.
- **`title`**: Display name of the song.
- **`album`**: The album name. This should match a key in `ALBUM_THEMES` within `themes.ts` if it is to have a matching theme. A standard "Other Songs" album title can be used and should not be themed.
- **`variants`** (Optional): An array of strings representing subsets of the album (e.g., `["deluxe"]`, `["from the vault"]`). These appear in the Filters menu as "variant tracks" that can be toggled independently of the base album.

### 3. Filter Presets & URL Slugs

Filter presets allow you to define common configurations for users to choose from. They appear as options in the UI and control which songs are included in the sorting session.

#### URL Structure
Filtered sessions are accessible via a specific URL pattern:
`/:artistId/:presetSlug`

- **`:artistId`**: The `id` string defined in your `index.ts` file (e.g., `taylor-swift`).
- **`:presetSlug`**: A secondary slug that determines the active filter. It can be:
  - **A Custom Preset Slug**: Defined in the `filterPresets` array (e.g., `standard-tracks`). **Note:** This slug MUST NOT overlap with any existing album slug, as album slugs are automatically reserved.
  - **An Album Slug**: Automatically generated for every album by converting the album name to kebab-case (lowercase, alphanumeric only, spaces replaced with hyphens). For example, "The Tortured Poets Department" becomes `the-tortured-poets-department`.
  - **`all-songs`**: A reserved slug that includes the entire discography (default).

#### Filter Preset Syntax (`index.ts`)
```typescript
filterPresets: [
  {
    name: 'Standard Tracks Only', // Display name in the UI
    slug: 'standard',             // Becomes /artist-id/standard
    excludedAlbums: ['Other Songs'], // List of album names to hide
    excludedVariants: [
      'Midnights:Remix', // Syntax: "Album Name:Variant Name"
      'Red:Acoustic'
    ]
  }
]
```

- **`excludedAlbums`**: Must exactly match the `album` string used in `songs.json`.
- **`excludedVariants`**: Uses the syntax `"Album Name:Variant Name"`.
  - A song is excluded if **any** of its variants match a variant in the exclusion list for that specific album.
  - For example, if a song has `"album": "Midnights"` and `"variants": ["Remix", "Standard"]`, it will be excluded if `"Midnights:Remix"` is in the list.
  - Songs without any variants are only filtered by the `excludedAlbums` list.

### 4. `themes.ts`

Maps album names to theme metadata. The key used here (e.g., `"Album Name"`) MUST exactly match the `album` property of the songs in `songs.json`.

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

### 5. `themes.css`

Styles are scoped by the `className` defined in `themes.ts`. Use these CSS variables to customize the UI:

```css
.theme-album-class {
  /* Colors */
  --album-color-primary: #hex;        /* Main accent color (buttons, progress bar) */
  --album-color-secondary: #hex;      /* Background color for the app */
  --text-color: #hex;                 /* Color for general body text */

  /* Typography */
  --album-font: 'font-name';          /* Font for headers and song titles */
  --text-font: 'font-name';           /* Font for instructions and UI labels */
  --album-font-weight: bold;          /* Weight for album headers */
  --album-text-transform: uppercase;  /* (Optional) Text transform for headers */
  --album-letter-spacing: 1px;        /* (Optional) Letter spacing for headers */
}
```

### 6. SEO & Metadata (Optional)

The `seo` object in `index.ts` allows you to customize the metadata for each artist's page. This is used to update the document title and meta tags dynamically.

- **`title`**: The browser tab title.
- **`description`**: The meta description for search engines.
- **`keywords`**: A comma-separated list of keywords.

If not provided, the site will use default values based on the artist's name.

#### Custom Fonts
> **Warning:** Custom fonts are considered an advanced feature. They require proper `@font-face` declarations and font file hosting, which involves additional setup effort. Avoid using custom fonts unless explicitly approved for the artist.

If using custom fonts, you can include `@font-face` declarations at the top of your `themes.css` or import them from a CDN. Ensure font files are placed in the `public/` directory if hosting them locally.

