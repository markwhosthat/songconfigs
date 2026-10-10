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

const EXTRAS = ALBUMS.filter(a => songs.some(s => s.album === a && s.variants?.includes('Deluxe')));

export const DuaLipaConfig: ArtistConfig = {
  id: 'dua-lipa',
  name: 'Dua Lipa',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: 'Future Nostalgia',
  storageKey: 'dua-lipa-song-sorter-session',
  // Song type switches in the Filters panel; every song is exactly one.
  songTypes: [
    { label: 'Album tracks', variants: [STANDARD_VARIANT] },
    // Dua Lipa's Deluxe and Complete Edition songs, and Future Nostalgia's
    // Fever and The Moonlight Edition's songs.
    { label: 'Deluxe', variants: ['Deluxe'] },
    // Swan Song (Alita: Battle Angel) and Dance The Night (Barbie).
    { label: 'Soundtracks', variants: ['Soundtracks'] },
    { label: 'Features', variants: ['Features'] },
  ],
  // Left out until someone opts in: the songs where she shares the billing
  // on someone else's record.
  defaultExcludedVariants: ['Other Songs:Features'],
  topSectionName: 'The Top 10',
  topSectionCount: 10,
  seo: {
    description: 'Rank every Dua Lipa song, from Dua Lipa and Future Nostalgia to Radical Optimism. Choose between two songs at a time to build your ultimate personal ranking.',
    pages: {
      'Deluxe Tracks': {
        title: 'Rank Dua Lipa Deluxe Tracks | Dua Lipa Song Sorter',
        description: "Rank Dua Lipa's deluxe tracks, from Dreams, Want To and Kiss and Make Up to Fever, We're Good and That Kind of Woman, two at a time.",
      },
      'Collaborations': {
        title: 'Rank Dua Lipa Collaborations & Features | Dua Lipa Song Sorter',
        description: 'Rank the songs Dua Lipa features on, from No Lie and One Kiss to Prisoner, Cold Heart and Sweetest Pie, two at a time.',
      },
      // Filtered copies of the full catalogue stay noindex, but their titles
      // still show in tabs and link previews.
      'Everything': {
        title: 'Rank Every Dua Lipa Song | Dua Lipa Song Sorter',
        description: 'Rank every Dua Lipa song: every album and deluxe track, soundtrack song and feature. Choose between two songs at a time.',
      },
      'Standard Tracks': {
        title: 'Rank Dua Lipa Album Tracks Only | Dua Lipa Song Sorter',
        description: "Rank the standard tracklists of Dua Lipa's albums, without deluxe tracks. Choose between two songs at a time.",
      },
      'Beyond the Albums': {
        title: "Rank Dua Lipa's Non-Album Songs | Dua Lipa Song Sorter",
        description: 'Rank the Dua Lipa songs outside her albums, Swan Song and Dance The Night, plus her features, from One Kiss to Cold Heart, two at a time.',
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
    {
      name: 'Collaborations',
      group: 'Beyond',
      slug: 'collaborations',
      ...keep({ 'Other Songs': ['Features'] }),
      indexable: true,
    },
  ],
};
