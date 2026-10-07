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

// Her studio albums, without The One Day LP (her early singles, collected)
// and the all the things i never said and TOO YOUNG TO BE SAD EPs.
const STUDIO_ALBUMS = ['i used to think i could fly', 'THINK LATER', 'So Close To What'];

export const TateMcRaeConfig: ArtistConfig = {
  id: 'tate-mcrae',
  name: 'Tate McRae',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: 'So Close To What',
  storageKey: 'tate-mcrae-song-sorter-session',
  // Song type switches in the Filters panel; every song is exactly one.
  songTypes: [
    { label: 'Album tracks', variants: [STANDARD_VARIANT] },
    // SO CLOSE TO WHAT??? (deluxe)'s new songs, Siren sounds and TIT FOR TAT.
    { label: 'Deluxe', variants: ['Deluxe'] },
    { label: 'Singles', variants: ['Singles'] },
    { label: 'Features', variants: ['Features'] },
  ],
  // Songs where she shares the billing on someone else's single.
  defaultExcludedVariants: ['Other Songs:Features'],
  topSectionName: 'The Top 10',
  topSectionCount: 10,
  seo: {
    description: 'Rank every Tate McRae song, from The One Day LP and TOO YOUNG TO BE SAD to i used to think i could fly, THINK LATER and So Close To What. Choose between two songs at a time to build your ultimate personal ranking.',
    pages: {
      'The Studio Albums': {
        title: 'Rank Every Tate McRae Album Song | Tate McRae Song Sorter',
        description: 'Rank the songs from i used to think i could fly, THINK LATER and So Close To What together, deluxe tracks included, two at a time.',
      },
      // Filtered copies of the full catalogue stay noindex, but their titles
      // still show in tabs and link previews.
      'Everything': {
        title: 'Rank Every Tate McRae Song | Tate McRae Song Sorter',
        description: 'Rank every Tate McRae song: every album, EP and deluxe track, single and feature. Choose between two songs at a time.',
      },
      'Standard Tracks': {
        title: 'Rank Tate McRae Album Tracks Only | Tate McRae Song Sorter',
        description: "Rank the standard tracklists of Tate McRae's albums and EPs, without deluxe tracks. Choose between two songs at a time.",
      },
      'Beyond the Albums': {
        title: "Rank Tate McRae's Non-Album Songs | Tate McRae Song Sorter",
        description: 'Rank the Tate McRae songs outside her records, from Kids Are Alright and working to 10:35 and What I Want, two at a time.',
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
