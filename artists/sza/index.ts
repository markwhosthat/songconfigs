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

export const SzaConfig: ArtistConfig = {
  id: 'sza',
  name: 'SZA',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: 'SOS',
  storageKey: 'sza-song-sorter-session',
  // Song type switches in the Filters panel; every song is exactly one.
  songTypes: [
    { label: 'Album tracks', variants: [STANDARD_VARIANT] },
    // Ctrl's deluxe songs (2AM, Miles, Percolator, Tread Carefully, Awkward
    // and Jodie). Lana, SOS's deluxe, stands as its own album.
    { label: 'Deluxe', variants: ['Deluxe'] },
    // Hit Different.
    { label: 'Singles', variants: ['Singles'] },
    // Quicksand, All The Stars, Power is Power, The Other Side, The Anonymous
    // Ones and Save The Day.
    { label: 'Soundtracks', variants: ['Soundtracks'] },
    { label: 'Features', variants: ['Features'] },
  ],
  // Left out until someone opts in: the songs where she shares the billing
  // on someone else's record.
  defaultExcludedVariants: ['Other Songs:Features'],
  topSectionName: 'The Top 10',
  topSectionCount: 10,
  seo: {
    description: 'Rank every SZA song, from Z and Ctrl to SOS and Lana. Choose between two songs at a time to build your ultimate personal ranking.',
    pages: {
      'SOS + Lana': {
        title: 'Rank SOS + Lana | SZA Song Sorter',
        description: 'Rank SOS and its deluxe, Lana, together, from Kill Bill, Snooze and Good Days to Saturn, 30 For 30 and Drive, two at a time.',
      },
      'Collaborations': {
        title: 'Rank SZA Collaborations & Features | SZA Song Sorter',
        description: 'Rank the songs SZA features on, from Consideration and What Lovers Do to Kiss Me More, Slime You Out and girl, get up., two at a time.',
      },
      // Filtered copies of the full catalogue stay noindex, but their titles
      // still show in tabs and link previews.
      'Everything': {
        title: 'Rank Every SZA Song | SZA Song Sorter',
        description: 'Rank every SZA song: every album and deluxe track, single, soundtrack song and feature. Choose between two songs at a time.',
      },
      'Standard Tracks': {
        title: 'Rank SZA Album Tracks Only | SZA Song Sorter',
        description: "Rank the standard tracklists of SZA's records, without deluxe tracks. Choose between two songs at a time.",
      },
      'Beyond the Albums': {
        title: "Rank SZA's Non-Album Songs | SZA Song Sorter",
        description: 'Rank the SZA songs outside her records, from Quicksand and All The Stars to Hit Different, The Other Side and Save The Day, plus her features, two at a time.',
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
      name: 'SOS + Lana',
      group: 'Collections',
      slug: 'sos-and-lana',
      ...forAlbums(['SOS', 'Lana'], [STANDARD_VARIANT]),
      themeKey: 'Lana',
      // A pairing no album page covers - worth a search result.
      indexable: true,
    },
    {
      name: 'Beyond the Albums',
      group: 'Beyond',
      slug: 'beyond-the-albums',
      ...keep({ 'Other Songs': variantsOf('Other Songs') }),
    },
    {
      name: 'Collaborations',
      group: 'Beyond',
      slug: 'collaborations',
      ...keep({ 'Other Songs': ['Features'] }),
      indexable: true,
    },
  ],
};
