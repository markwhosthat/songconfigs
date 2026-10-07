import { type ArtistConfig, STANDARD_VARIANT } from '../../core/types';
import songs from './songs.json';
import { ALBUM_THEMES } from './themes';

// Builds a preset's filters from what it keeps: these albums, and in each
// only the listed variants (Standard for its untagged main tracks).
const ALBUMS = [...new Set(songs.map(s => s.album))];
const variantsOf = (album: string) =>
  [STANDARD_VARIANT, ...new Set(songs.filter(s => s.album === album).flatMap(s => s.variants ?? []))];
const keep = (spec: Record<string, string[]>) => ({
  excludedAlbums: ALBUMS.filter(a => !(a in spec)),
  excludedVariants: Object.entries(spec).flatMap(([album, kept]) =>
    variantsOf(album).filter(v => !kept.includes(v)).map(v => `${album}:${v}`)),
});
const forAlbums = (albums: string[], kept: string[]) =>
  keep(Object.fromEntries(albums.map(a => [a, kept])));

// Her studio albums, without The Love Club EP and Te Ao Mārama (Solar
// Power's songs, sung in te reo Māori).
const STUDIO_ALBUMS = ['Pure Heroine', 'Melodrama', 'Solar Power', 'Virgin'];

export const LordeConfig: ArtistConfig = {
  id: 'lorde',
  name: 'Lorde',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: 'Virgin',
  storageKey: 'lorde-song-sorter-session',
  // Song type switches in the Filters panel; every song is exactly one.
  songTypes: [
    { label: 'Album tracks', variants: [STANDARD_VARIANT] },
    // Solar Power's bonus tracks, Helen of Troy and Hold No Grudge.
    { label: 'Deluxe', variants: ['Deluxe'] },
    { label: 'Singles', variants: ['Singles'] },
    { label: 'Soundtracks', variants: ['Soundtracks'] },
    { label: 'Features', variants: ['Features'] },
  ],
  // Songs where she shares the billing on someone else's record.
  defaultExcludedVariants: ['Other Songs:Features'],
  topSectionName: 'The Top 10',
  topSectionCount: 10,
  seo: {
    description: 'Rank every Lorde song, from The Love Club EP and Pure Heroine to Melodrama, Solar Power and Virgin. Choose between two songs at a time to build your ultimate personal ranking.',
    pages: {
      'The Studio Albums': {
        title: 'Rank Every Lorde Album Song | Lorde Song Sorter',
        description: 'Rank the songs from Pure Heroine, Melodrama, Solar Power and Virgin together, deluxe tracks included, two at a time.',
      },
      // Filtered copies of the full catalogue stay noindex, but their titles
      // still show in tabs and link previews.
      'Everything': {
        title: 'Rank Every Lorde Song | Lorde Song Sorter',
        description: 'Rank every Lorde song: every album, EP and deluxe track, single, soundtrack song and feature. Choose between two songs at a time.',
      },
      'Standard Tracks': {
        title: 'Rank Lorde Album Tracks Only | Lorde Song Sorter',
        description: "Rank the standard tracklists of Lorde's albums and EPs, without deluxe tracks. Choose between two songs at a time.",
      },
      'Beyond the Albums': {
        title: "Rank Lorde's Non-Album Songs | Lorde Song Sorter",
        description: 'Rank the Lorde songs outside her records, from Yellow Flicker Beat and No Better to Magnets and Girl, so confusing, two at a time.',
      },
    },
  },
  // Listed under their group in the Filters panel ("Start from"), after the
  // default; `label` is the button's name where the page's name is longer.
  filterPresets: [
    {
      name: 'Everything',
      slug: 'everything',
      excludedAlbums: [],
      excludedVariants: [],
    },
    {
      name: 'Standard Tracks',
      label: 'Album tracks only',
      slug: 'standard-tracks',
      // Exactly the Album tracks song type on its own.
      ...forAlbums(ALBUMS, [STANDARD_VARIANT]),
    },
    {
      name: 'The Studio Albums',
      label: 'Studio albums',
      group: 'Collections',
      slug: 'studio-albums',
      ...forAlbums(STUDIO_ALBUMS, [STANDARD_VARIANT, 'Deluxe']),
      indexable: true,
    },
    {
      name: 'Beyond the Albums',
      group: 'Beyond',
      slug: 'beyond-the-albums',
      ...keep({ 'Other Songs': variantsOf('Other Songs') }),
    },
  ],
};
