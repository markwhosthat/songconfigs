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

const EXTRAS = ALBUMS.filter(a => a !== 'Other Songs' &&
  songs.some(s => s.album === a && s.variants?.some(v => v === 'Deluxe' || v === 'Bonus')));

// Her five songs on the Charlie's Angels (2019) soundtrack, which she
// executive produced.
const ANGELS_SONGS = [
  "Don't Call Me Angel (with Miley Cyrus & Lana Del Rey)",
  'Bad to You (with Normani & Nicki Minaj)',
  'Nobody (with Chaka Khan)',
  'How I Look on You',
  'Got Her Own (with Victoria Monét)',
];
const charliesAngels = {
  ...keep({ 'Other Songs': ['Soundtrack'] }),
  excludedSongs: songs.filter(s => s.album === 'Other Songs' && !ANGELS_SONGS.includes(s.title)).map(s => s.id),
};

export const ArianaGrandeConfig: ArtistConfig = {
  id: 'ariana-grande',
  name: 'Ariana Grande',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: 'petal',
  storageKey: 'ag-song-sorter-session',
  // Song type switches in the Filters panel; every song is exactly one.
  songTypes: [
    { label: 'Album tracks', variants: [STANDARD_VARIANT] },
    // Deluxe, bonus-track and anniversary editions, and brighter days ahead.
    { label: 'Deluxe', variants: ['Deluxe'] },
    // The Way's Spanglish version, on Yours Truly.
    { label: 'Bonus', variants: ['Bonus'] },
    { label: 'Remix', variants: ['Remix'] },
    { label: 'Soundtrack & singles', variants: ['Soundtrack', 'Singles'] },
    // Christmas Kisses, Christmas & Chill, Santa Tell Me and her duets.
    { label: 'Holiday', variants: ['Holiday'] },
    { label: 'Features', variants: ['Features'] },
    // Her songs as Glinda in Wicked and Wicked: For Good.
    { label: 'Wicked', variants: ['Wicked'] },
    // Her Victorious songs.
    { label: 'Nickelodeon', variants: ['Nickelodeon'] },
    // Live, acoustic, a cappella and string versions of songs already listed.
    { label: 'Live & acoustic', variants: ['Versions'] },
  ],
  // Left out until someone opts in: songs where she is a featured guest, the
  // Wicked and Victorious cast recordings, Christmas songs, and alternate
  // versions of songs already listed.
  defaultExcludedVariants: [
    ...['Features', 'Wicked', 'Nickelodeon', 'Holiday'].map(v => `Other Songs:${v}`),
    ...ALBUMS.filter(a => songs.some(s => s.album === a && s.variants?.includes('Versions'))).map(a => `${a}:Versions`),
  ],
  topSectionName: 'The Top 10',
  topSectionCount: 10,
  seo: {
    description: 'Rank every Ariana Grande song, from Yours Truly and Dangerous Woman to thank u, next, eternal sunshine and petal. Choose between two songs at a time to build your ultimate personal ranking.',
    pages: {
      "Charlie's Angels": {
        title: "Rank Ariana Grande's Charlie's Angels Songs | Ariana Grande Song Sorter",
        description: "Rank the songs Ariana Grande made for Charlie's Angels: Don't Call Me Angel, Bad to You, Nobody, How I Look on You and Got Her Own, two at a time.",
      },
      'Wicked': {
        title: "Rank Ariana Grande's Wicked Songs | Ariana Grande Song Sorter",
        description: 'Rank Ariana Grande\'s songs as Glinda in Wicked and Wicked: For Good, from Popular and What Is This Feeling? to Thank Goodness, The Girl in the Bubble and For Good, two at a time.',
      },
      'Christmas Songs': {
        title: "Rank Ariana Grande's Christmas Songs | Ariana Grande Song Sorter",
        description: 'Rank Ariana Grande\'s Christmas songs: Santa Tell Me, Christmas Kisses, Christmas & Chill and her holiday duets with Mariah Carey, Idina Menzel and Kelly Clarkson, two at a time.',
      },
      'Deluxe & Bonus Tracks': {
        title: 'Rank Ariana Grande Deluxe & Bonus Tracks | Ariana Grande Song Sorter',
        description: 'Rank Ariana Grande\'s deluxe and bonus tracks, from Only 1 and Touch It to Step On Up, test drive, twilight zone and Hampstead, two at a time.',
      },
      'Collaborations': {
        title: 'Rank Ariana Grande Collaborations & Features | Ariana Grande Song Sorter',
        description: 'Rank the songs Ariana Grande features on, from Rain On Me and Save Your Tears (Remix) to Dance to This, Bed and Heatstroke, two at a time.',
      },
      // Filtered copies of the full catalogue stay noindex, but their titles
      // still show in tabs and link previews.
      'Everything': {
        title: 'Rank Every Ariana Grande Song | Ariana Grande Song Sorter',
        description: 'Rank every Ariana Grande song: every album, deluxe and bonus track, remix, single, soundtrack song, Christmas song, feature, Wicked and Victorious song, and live and acoustic version. Choose between two songs at a time.',
      },
      'Standard Tracks': {
        title: 'Rank Ariana Grande Album Tracks Only | Ariana Grande Song Sorter',
        description: "Rank the standard tracklists of Ariana Grande's albums, without deluxe, bonus or remix tracks. Choose between two songs at a time.",
      },
      'Beyond the Albums': {
        title: "Rank Ariana Grande's Non-Album Songs | Ariana Grande Song Sorter",
        description: "Rank the Ariana Grande songs outside her albums, from Focus, boyfriend and Stuck with U to Don't Call Me Angel, Santa Tell Me and her features, two at a time.",
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
      name: 'Deluxe & Bonus Tracks',
      label: 'Deluxe & bonus only',
      group: 'Collections',
      slug: 'deluxe-and-bonus-tracks',
      ...forAlbums(EXTRAS, ['Deluxe', 'Bonus']),
      indexable: true,
    },
    {
      name: 'Beyond the Albums',
      group: 'Beyond',
      slug: 'beyond-the-albums',
      ...keep({ 'Other Songs': variantsOf('Other Songs') }),
    },
    {
      name: "Charlie's Angels",
      group: 'Beyond',
      slug: 'charlies-angels',
      ...charliesAngels,
      themeKey: 'thank u, next',
      // Songs no album page lists on their own - worth a search result.
      indexable: true,
    },
    {
      name: 'Christmas Songs',
      label: 'Christmas',
      group: 'Beyond',
      slug: 'christmas',
      ...keep({ 'Other Songs': ['Holiday'] }),
      indexable: true,
    },
    {
      name: 'Collaborations',
      group: 'Beyond',
      slug: 'collaborations',
      ...keep({ 'Other Songs': ['Features'] }),
      indexable: true,
    },
    {
      name: 'Wicked',
      group: 'Beyond',
      slug: 'wicked',
      ...keep({ 'Other Songs': ['Wicked'] }),
      indexable: true,
    },
  ],
};
