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

// Her studio albums, without the minor and This Is What It Feels Like EPs.
const STUDIO_ALBUMS = ['Good Riddance', 'The Secret of Us', 'Daughter from Hell'];
const EXTRAS = ALBUMS.filter(a => songs.some(s => s.album === a && s.variants?.includes('Deluxe')));

export const GracieAbramsConfig: ArtistConfig = {
  id: 'gracie-abrams',
  name: 'Gracie Abrams',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: 'Daughter from Hell',
  storageKey: 'gracie-abrams-song-sorter-session',
  // Song type switches in the Filters panel; every song is exactly one.
  songTypes: [
    { label: 'Album tracks', variants: [STANDARD_VARIANT] },
    { label: 'Deluxe', variants: ['Deluxe'] },
    // The Secret of Us deluxe's three Live From Vevo recordings.
    { label: 'Live', variants: ['Live'] },
    { label: 'Singles', variants: ['Singles'] },
    { label: 'Features', variants: ['Features'] },
  ],
  // Songs where she shares the billing on someone else's single, and the
  // live takes of songs already in the sort.
  defaultExcludedVariants: ['Other Songs:Features', 'The Secret of Us:Live'],
  topSectionName: 'The Top 10',
  topSectionCount: 10,
  seo: {
    description: 'Rank every Gracie Abrams song, from minor and This Is What It Feels Like to Good Riddance, The Secret of Us and Daughter from Hell. Choose between two songs at a time to build your ultimate personal ranking.',
    pages: {
      'The Studio Albums': {
        title: 'Rank Every Gracie Abrams Album Song | Gracie Abrams Song Sorter',
        description: 'Rank the songs from Good Riddance, The Secret of Us and Daughter from Hell together, deluxe tracks included, two at a time.',
      },
      'Deluxe Tracks': {
        title: 'Rank Gracie Abrams Deluxe Tracks | Gracie Abrams Song Sorter',
        description: "Rank Gracie Abrams' deluxe tracks, from Block me out and 405 to That's So True, I Told You Things and Packing It Up, two at a time.",
      },
      // Filtered copies of the full catalogue stay noindex, but their titles
      // still show in tabs and link previews.
      'Everything': {
        title: 'Rank Every Gracie Abrams Song | Gracie Abrams Song Sorter',
        description: 'Rank every Gracie Abrams song: every album, EP and deluxe track, live recording, single and feature. Choose between two songs at a time.',
      },
      'Standard Tracks': {
        title: 'Rank Gracie Abrams Album Tracks Only | Gracie Abrams Song Sorter',
        description: "Rank the standard tracklists of Gracie Abrams' albums and EPs, without deluxe tracks. Choose between two songs at a time.",
      },
      'Beyond the Albums': {
        title: "Rank Gracie Abrams' Non-Album Songs | Gracie Abrams Song Sorter",
        description: 'Rank the Gracie Abrams songs outside her records, from Mean It, Stay and Mess It Up to her songs with benny blanco and Noah Kahan, two at a time.',
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
      name: 'Deluxe Tracks',
      label: 'Deluxe only',
      group: 'Collections',
      slug: 'deluxe-tracks',
      ...forAlbums(EXTRAS, ['Deluxe']),
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
