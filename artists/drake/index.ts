import type { ArtistConfig } from '../../core/types';
import songs from './songs.json';
import { ALBUM_THEMES } from './themes';

export const DrakeConfig: ArtistConfig = {
  id: 'drake',
  name: 'Drake',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: 'Take Care',
  storageKey: 'drake-song-sorter-session',
  topSectionName: 'The 6',
  topSectionCount: 6,
};
