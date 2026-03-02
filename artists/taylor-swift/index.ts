import type { ArtistConfig } from '../../core/types';
import songs from './songs.json';
import { ALBUM_THEMES, DEFAULT_THEME } from './themes';

export const TaylorSwiftConfig: ArtistConfig = {
  // Unique identifier for artist
  id: 'taylor-swift',
  // Name of the artist to display in the title on the website
  name: 'Taylor Swift',
  // These two values link to the local files - no need to change.
  songs,
  themes: ALBUM_THEMES,
  defaultTheme: DEFAULT_THEME,
  // The default selected theme
  defaultThemeKey: 'Midnights',
  // These keys must be unique amongst all artists.
  storageKey: 'ts-song-sorter-session',
  settingsKey: 'ts-song-sorter-settings',
  // Title for the final result selection.
  topSectionName: 'The Top 13',
  // The number of top songs to highlight in the results.
  topSectionCount: 13,
};
