import type { ArtistConfig } from '../../core/types';
import songs from './songs.json';
import { ALBUM_THEMES } from './themes';

export const OliviaRodrigoConfig: ArtistConfig = {
  id: 'olivia-rodrigo',
  name: 'Olivia Rodrigo',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: 'SOUR',
  storageKey: 'or-song-sorter-session',
  topSectionName: 'The Top Picks',
  topSectionCount: 10,
};
