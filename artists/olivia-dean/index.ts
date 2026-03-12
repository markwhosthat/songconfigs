import type { ArtistConfig } from '../../core/types';
import songs from './songs.json';
import { ALBUM_THEMES } from './themes';

export const OliviaDeanConfig: ArtistConfig = {
  id: 'olivia-dean',
  name: 'Olivia Dean',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: 'Messy',
  storageKey: 'od-song-sorter-session',
};
