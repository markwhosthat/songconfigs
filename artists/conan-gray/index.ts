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

// His studio albums; the Sunset Season EP stands apart.
const STUDIO_ALBUMS = ['Kid Krow', 'Superache', 'Found Heaven', 'Wishbone'];

export const ConanGrayConfig: ArtistConfig = {
  id: 'conan-gray',
  name: 'Conan Gray',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: 'Wishbone',
  storageKey: 'conan-gray-song-sorter-session',
  // Song type switches in the Filters panel; every song is exactly one.
  songTypes: [
    { label: 'Album tracks', variants: [STANDARD_VARIANT] },
    // Bed Rest from Kid Krow, Decomposed and Wishbone Deluxe's five songs.
    { label: 'Deluxe', variants: ['Deluxe'] },
    { label: 'Singles', variants: ['Singles'] },
    // Fake, with Lauv.
    { label: 'Features', variants: ['Features'] },
  ],
  topSectionName: 'The Top 10',
  topSectionCount: 10,
  seo: {
    description: 'Rank every Conan Gray song, from Sunset Season and Kid Krow to Superache, Found Heaven and Wishbone. Choose between two songs at a time to build your ultimate personal ranking.',
    pages: {
      'The Studio Albums': {
        title: 'Rank Every Conan Gray Album Song | Conan Gray Song Sorter',
        description: 'Rank the songs from Kid Krow, Superache, Found Heaven and Wishbone together, deluxe tracks included, two at a time.',
      },
      // Filtered copies of the full catalogue stay noindex, but their titles
      // still show in tabs and link previews.
      'Everything': {
        title: 'Rank Every Conan Gray Song | Conan Gray Song Sorter',
        description: 'Rank every Conan Gray song: every album, EP and deluxe track, single and feature. Choose between two songs at a time.',
      },
      'Standard Tracks': {
        title: 'Rank Conan Gray Album Tracks Only | Conan Gray Song Sorter',
        description: "Rank the standard tracklists of Conan Gray's albums and EP, without deluxe tracks. Choose between two songs at a time.",
      },
      'Beyond the Albums': {
        title: "Rank Conan Gray's Non-Album Songs | Conan Gray Song Sorter",
        description: 'Rank the Conan Gray songs outside his records, from Grow, The Other Side and The King to Overdrive, Telepath, Holidays and Fake, two at a time.',
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
