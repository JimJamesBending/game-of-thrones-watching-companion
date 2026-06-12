import type { CharacterOrigin, HouseId } from './types'

export const originByHouse: Partial<Record<HouseId, CharacterOrigin>> = {
  arryn: origin('The Eyrie', 'The Vale', 57, 47, 'House seat'),
  baratheon: origin("Storm's End", 'The Stormlands', 56, 78, 'House seat'),
  bolton: origin('The Dreadfort', 'The North', 53, 25, 'House seat'),
  clegane: origin('The Westerlands', 'The Westerlands', 37, 63, 'House lands'),
  dothraki: origin('The Dothraki Sea', 'Essos', 88, 55, 'Known homeland'),
  'free-folk': origin('North of the Wall', 'Far North', 48, 8, 'Known homeland'),
  frey: origin('The Twins', 'The Riverlands', 45, 51, 'House seat'),
  greyjoy: origin('Pyke', 'The Iron Islands', 33, 51, 'House seat'),
  karstark: origin('Karhold', 'The North', 52, 23, 'House seat'),
  lannister: origin('Casterly Rock', 'The Westerlands', 36, 62, 'House seat'),
  manderly: origin('White Harbor', 'The North', 53, 34, 'House seat'),
  martell: origin('Sunspear', 'Dorne', 58, 88, 'House seat'),
  mormont: origin('Bear Island', 'The North', 38, 25, 'House seat'),
  'night-watch': origin('The Wall', 'Northern border', 47, 17, 'Sworn order'),
  reed: origin('Greywater Watch', 'The Neck', 44, 43, 'House seat'),
  royce: origin('Runestone', 'The Vale', 58, 47, 'House seat'),
  stark: origin('Winterfell', 'The North', 47, 31, 'House seat'),
  targaryen: origin('Dragonstone', 'The Crownlands', 61, 67, 'Ancestral seat'),
  tarly: origin('Horn Hill', 'The Reach', 46, 82, 'House seat'),
  tyrell: origin('Highgarden', 'The Reach', 43, 78, 'House seat'),
  tully: origin('Riverrun', 'The Riverlands', 44, 57, 'House seat'),
  umber: origin('Last Hearth', 'The North', 49, 22, 'House seat'),
}

function origin(name: string, region: string, x: number, y: number, reason: string): CharacterOrigin {
  return { name, region, x, y, reason }
}
