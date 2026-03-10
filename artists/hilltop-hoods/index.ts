import type { ArtistConfig } from '../../core/types';
import songs from './songs.json';
import { ALBUM_THEMES } from './themes';
import './themes.css';

export const HilltopHoodsConfig: ArtistConfig = {
  id: 'hilltop-hoods',
  name: 'Hilltop Hoods',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: 'The Calling',
  storageKey: 'hh-song-sorter-session',
  topSectionName: 'The Top 10',
  topSectionCount: 10,
};
