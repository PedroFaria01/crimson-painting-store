export const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'ready', label: 'Ready-Made Miniatures' },
  { key: 'kits', label: 'Kits to Paint' },
  { key: 'custom', label: 'Custom Order' },
  { key: 'actionfigures', label: 'Action Figures' },
]

export const PRODUCTS = [
  {
    id: 'p1',
    name: 'Ancient Red Dragon',
    category: 'ready',
    categoryLabel: 'Ready-Made 3D Miniature',
    price: '€34.90',
    priceNum: 34.9,
    desc: 'Resin print, 32mm scale, base included.',
    longDesc:
      'Ancient red dragon miniature printed in high-definition resin, 32mm scale. Ready to paint yourself, or available pre-painted to order. Terrain base included.',
    placeholder: 'photo: Ancient Red Dragon',
    featured: true,
  },
  {
    id: 'p2',
    name: 'Painted Dwarf Warrior',
    category: 'actionfigures',
    categoryLabel: 'Painted Action Figure',
    price: '€44.90',
    priceNum: 44.9,
    desc: 'Hand-painted, ready for display.',
    longDesc:
      'Dwarf warrior fully hand-painted with layering and shading techniques, ready for display or tabletop use. Protective matte finish.',
    placeholder: 'photo: Painted Dwarf Warrior',
    featured: true,
  },
  {
    id: 'p3',
    name: 'Starter Hero Kit (5 minis)',
    category: 'kits',
    categoryLabel: 'Kit to Paint',
    price: '€16.90',
    priceNum: 16.9,
    desc: 'Five classic archetypes for your party.',
    longDesc:
      'Kit with five classic archetype miniatures (warrior, wizard, rogue, cleric, and archer) printed in resin, ready to paint. Ideal for starting your group.',
    placeholder: 'photo: Starter Hero Kit',
    featured: true,
  },
  {
    id: 'p4',
    name: 'Standard Tabletop Painting',
    category: 'custom',
    categoryLabel: 'Custom Order',
    price: 'from €8.50/mini',
    priceNum: 8.5,
    desc: 'Send us your miniature, we paint it.',
    longDesc:
      'Standard tabletop painting service: solid colors, basic shading, and essential details. Send your own miniature or choose one from our catalog. Average turnaround of 10 business days.',
    placeholder: 'photo: standard painting example',
    featured: true,
  },
  {
    id: 'p5',
    name: 'Lich Necromancer',
    category: 'ready',
    categoryLabel: 'Ready-Made 3D Miniature',
    price: '€28.90',
    priceNum: 28.9,
    desc: '32mm scale, robe and staff detailing.',
    longDesc:
      'Lich necromancer printed in resin, 32mm scale, with fine detailing on robe, staff, and ritualistic base. Perfect as a campaign villain.',
    placeholder: 'photo: Lich Necromancer',
    featured: false,
  },
  {
    id: 'p6',
    name: 'Beholder, Terror of the Deep',
    category: 'ready',
    categoryLabel: 'Ready-Made 3D Miniature',
    price: '€38.90',
    priceNum: 38.9,
    desc: 'Large piece, multiple articulated eyes.',
    longDesc:
      'Large-scale beholder miniature with multiple deep-relief eyes and organic texture. High-resolution print for maximum detail.',
    placeholder: 'photo: Beholder',
    featured: false,
  },
  {
    id: 'p7',
    name: 'Dungeon Villains Kit (4 minis)',
    category: 'kits',
    categoryLabel: 'Kit to Paint',
    price: '€18.90',
    priceNum: 18.9,
    desc: 'Four antagonists ready to paint.',
    longDesc:
      'Kit with four classic dungeon villain miniatures, ready to paint, 32mm scale. Perfect for encounters and secondary bosses.',
    placeholder: 'photo: Dungeon Villains Kit',
    featured: false,
  },
  {
    id: 'p8',
    name: 'Premium Diorama Painting',
    category: 'custom',
    categoryLabel: 'Custom Order',
    price: 'from €32.90/mini',
    priceNum: 32.9,
    desc: 'Detailed painting with themed base.',
    longDesc:
      'Premium painting service with multiple layers, freehand work, special effects (fire, ice, blood), and a themed diorama base. Average turnaround of 25 business days.',
    placeholder: 'photo: premium painting example',
    featured: false,
  },
  {
    id: 'p9',
    name: 'Silver Paladin',
    category: 'actionfigures',
    categoryLabel: 'Painted Action Figure',
    price: '€47.90',
    priceNum: 47.9,
    desc: 'Silver-toned armor, premium paint job.',
    longDesc:
      'Paladin fully painted with silver-toned armor and gold detailing, premium finish with realistic light and shadow effects.',
    placeholder: 'photo: Silver Paladin',
    featured: false,
  },
  {
    id: 'p10',
    name: 'Elven Archer',
    category: 'ready',
    categoryLabel: 'Ready-Made 3D Miniature',
    price: '€24.90',
    priceNum: 24.9,
    desc: 'Dynamic pose, 32mm scale.',
    longDesc:
      'Elven archer in a dynamic firing pose, printed in resin, 32mm scale, with removable bow and quiver.',
    placeholder: 'photo: Elven Archer',
    featured: false,
  },
]

export function formatEUR(n) {
  return '€' + n.toFixed(2)
}

export function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id)
}
