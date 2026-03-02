import type { ArtistConfig } from '../../core/types';
import songs from './songs.json';
import { ALBUM_THEMES, DEFAULT_THEME } from './themes';

export const TaylorSwiftConfig: ArtistConfig = {
  id: 'taylor-swift',
  name: 'Taylor Swift',
  songs,
  themes: ALBUM_THEMES,
  defaultTheme: DEFAULT_THEME,
  defaultThemeKey: 'Midnights',
  storageKey: 'ts-song-sorter-session',
  settingsKey: 'ts-song-sorter-settings',
  topSectionName: 'The Top 13',
  topSectionCount: 13,
};
