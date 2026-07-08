export function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const aboutMenuItems = [
  { label: 'Who we are', to: '/about#who-we-are' },
  { label: 'What we do', to: '/projects#what-we-do' },
  { label: 'Mission', to: '/about#mission' },
  { label: 'Founders', to: '/about#founders' },
  { label: 'Team Members', to: '/team-members' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Latest news', to: '/latest-news' }
];

export const projectGroups = [
  {
    group: 'Malaria',
    items: [
      ['Village Mapping', '2017-ongoing', 'group-photo-1'],
      ['G6PD Testing for Malaria Treatment', '2022-ongoing', 'group-photo-2'],
      ['Piloting Village-level Malaria Surveillance in Lama, Bandarban', '2022', 'group-photo-3'],
      ['Malaria API Tracker', '2021', 'malariaTracker'],
      ['Global Fund 2025', '2025', 'fundraising'],
      ['APMEN Knowledge Repository', '2024', 'showcase'],
      ['DQA', '2024', 'showcase'],
      ['CPE', '2024', 'showcase']
    ]
  },
  {
    group: 'Covid-19',
    items: [
      ['Crisis Ready Project (CRP)', '2022', 'showcase'],
      ['Mask Study', '2021', 'covidMask'],
      ['Covid-19 Risk Zoning', '2020', 'showcase'],
      ['Physical Accessibility to COVID-19 Related Health Services Analysis - Bangladesh', '2020', 'showcase'],
      ['Real-time population mapping to assess the impact of travel restrictions and social distancing on COVID-19 spread', '2020', 'showcase']
    ]
  },
  {
    group: 'Dengue',
    items: [
      ['Pre-monsoon Aedes Mosquito Survey', '2021-ongoing', 'group-photo-4'],
      ['Post-monsoon Aedes Mosquito Survey', '2021-ongoing', 'group-photo-4'],
      ['Dengue Risk Tracker', '2021', 'who-we-are'],
      ['Dengue Household Survey', '2019', 'group-photo-4'],
      ['Dengue risk zoning', '2019', 'who-we-are'],
      ['Drone driven imageries to identify breeding space in Dhaka', '2019', 'showcase'],
      ['HOT', '2023', 'showcase']
    ]
  },
  {
    group: 'Rabies',
    items: [
      ['Project Summary', '2018-ongoing', 'rabies'],
      ['Mass Dog Vaccination', '2018-ongoing', 'rabies'],
      ['Digital map making and demarcation of union boundary', '2020', 'rabies'],
      ['CDC Atlanta Training', '2018', 'group-photo-2'],
      ['Four Day Introductory Training on Dog Catching & Vaccination for National Team', '2021', 'group-photo-2']
    ]
  },
  {
    group: 'Filariasis',
    items: [
      ['Survey for assessing the prevalence of Soil-Transmitted Helminths among school-aged children of Bangladesh', '2018', 'showcase']
    ]
  },
  {
    group: 'Non Diseases',
    items: [
      ['The Global Health Facilities Database (GHFD)', '2020-ongoing', 'showcase'],
      ['DSCC Ward 29 Secondary Information', '2023', 'showcase'],
      ['SEACTN', '2024', 'showcase'],
      ['RREP', '2024', 'showcase'],
      ['UNICEF Cambodia', '2024', 'showcase'],
      ['UNFPA 2024-2025', '2024-2025', 'showcase']
    ]
  }
];

export const projects = projectGroups.flatMap((group) =>
  group.items.map(([title, year, imageKey]) => ({
    title,
    year,
    imageKey,
    category: group.group,
    slug: slugify(title),
    summary: `GroupMappers applies geospatial data collection, spatial analysis, mapping, visualization, and stakeholder-ready data sharing to support ${title}.`
  }))
);

export const activityMenuItems = [
  { label: 'Volunteering', to: '/activities#volunteerism-and-support' },
  { label: 'Mapping', to: '/activities#mapping' },
  { label: 'GIS/RS Club Cafes', to: '/activities#gis-rs-club-cafes' },
  { label: 'Fundraising', to: '/donate-us' },
  { label: 'Newsletter Writing', to: '/groupletters' }
];

export const newsItems = [
  ['July 25, 2023', 'GroupMappers, MORU, is featured in celebration of World Malaria Day 2023 by WHO news.'],
  ['July 25, 2023', 'The two week long Diagnostic Network Optimization (DNO) training workshop, funded by FIND.'],
  ['June 19, 2023', 'Update on Monsoon Aedes Mosquito Survey.'],
  ['June 15, 2023', 'NMEP, BRAC, and GroupMappers unite to celebrate The World Malaria Day, 2023.'],
  ['February 26, 2023', 'Workshop on Development of Malaria funding request to Global Fund (GC-7).'],
  ['February 10, 2023', 'Updates on Crisis Ready Project (CRP) workshop!'],
  ['January 11, 2023', 'Implementing village level data collection and surveillance towards malaria elimination.'],
  ['December 15, 2022', 'Assisting in introduction of G6PD testing to improve malaria treatment in Bangladesh.'],
  ['December 5, 2022', 'Mass Dog Vaccination Program (MDV).'],
  ['November 20, 2022', 'Celebrating GIS Day, 2022 with JnU.']
];
