import type { ArtistConfig } from '../../core/types';
import songs from './songs.json';
import { ALBUM_THEMES } from './themes';

export const TheWeekndConfig: ArtistConfig = {
  id: 'the-weeknd',
  name: 'The Weeknd',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: 'Starboy',
  storageKey: 'tw-song-sorter-session',
  topSectionName: 'The XO 10',
  topSectionCount: 10,
};
