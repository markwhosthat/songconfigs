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
// Every album's `Album:Variant` for these variants, wherever they occur.
const everywhere = (variants: string[]) =>
  ALBUMS.flatMap(a => variantsOf(a).filter(v => variants.includes(v)).map(v => `${a}:${v}`));

// Her studio albums, without the dont smile at me EP.
const STUDIO_ALBUMS = ['WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?', 'Happier Than Ever', 'HIT ME HARD AND SOFT'];

export const BillieEilishConfig: ArtistConfig = {
  id: 'billie-eilish',
  name: 'Billie Eilish',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: 'HIT ME HARD AND SOFT',
  storageKey: 'billie-eilish-song-sorter-session',
  // Song type switches in the Filters panel; every song is exactly one.
  songTypes: [
    { label: 'Album tracks', variants: [STANDARD_VARIANT] },
    // dont smile at me's &burn, added to the EP after its release.
    { label: 'Bonus', variants: ['Bonus'] },
    { label: 'Remix', variants: ['Remix'] },
    { label: 'Singles', variants: ['Singles'] },
    { label: 'Features', variants: ['Features'] },
  ],
  // Her guest spot, and the remixes - mostly other producers' takes, which
  // would put Ocean Eyes in a sort five times.
  defaultExcludedVariants: ['Other Songs:Features', ...everywhere(['Remix'])],
  topSectionName: 'The Top 10',
  topSectionCount: 10,
  seo: {
    description: 'Rank every Billie Eilish song, from dont smile at me and WHEN WE ALL FALL ASLEEP, WHERE DO WE GO? to Happier Than Ever and HIT ME HARD AND SOFT. Choose between two songs at a time to build your ultimate personal ranking.',
    pages: {
      'The Studio Albums': {
        title: 'Rank Every Billie Eilish Album Song | Billie Eilish Song Sorter',
        description: 'Rank the songs from WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?, Happier Than Ever and HIT ME HARD AND SOFT together, two at a time.',
      },
      // Filtered copies of the full catalogue stay noindex, but their titles
      // still show in tabs and link previews.
      'Everything': {
        title: 'Rank Every Billie Eilish Song | Billie Eilish Song Sorter',
        description: 'Rank every Billie Eilish song: every album and EP track, single, remix and feature. Choose between two songs at a time.',
      },
      'Standard Tracks': {
        title: 'Rank Billie Eilish Album Tracks Only | Billie Eilish Song Sorter',
        description: "Rank the standard tracklists of Billie Eilish's albums and the dont smile at me EP, without singles or remixes. Choose between two songs at a time.",
      },
      'Beyond the Albums': {
        title: "Rank Billie Eilish's Non-Album Songs | Billie Eilish Song Sorter",
        description: 'Rank the Billie Eilish songs outside her albums, from lovely, everything i wanted and No Time To Die to TV and What Was I Made For?, two at a time.',
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
      ...forAlbums(STUDIO_ALBUMS, [STANDARD_VARIANT]),
      indexable: true,
    },
    {
      name: 'Beyond the Albums',
      group: 'Beyond',
      slug: 'beyond-the-albums',
      ...keep({ 'Other Songs': ['Singles', 'Features'] }),
    },
  ],
};
