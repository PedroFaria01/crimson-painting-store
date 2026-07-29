-- Seed data migrated from the old src/data/products.js prototype.
-- Safe to re-run: it clears and re-inserts the catalog tables only.

truncate table product_images, products, categories restart identity cascade;

insert into categories (key, label, sort_order) values
  ('ready', 'Ready-Made Miniatures', 1),
  ('kits', 'Kits to Paint', 2),
  ('custom', 'Custom Order', 3),
  ('actionfigures', 'Action Figures', 4);

with cat as (
  select key, id from categories
)
insert into products (
  slug, name, category_id, price_cents, price_prefix, price_suffix,
  short_description, long_description, stock, is_featured
)
select v.slug, v.name, cat.id, v.price_cents, v.price_prefix, v.price_suffix,
       v.short_description, v.long_description, v.stock, v.is_featured
from (values
  ('ancient-red-dragon', 'Ancient Red Dragon', 'ready', 3490, null, null,
   'Resin print, 32mm scale, base included.',
   'Ancient red dragon miniature printed in high-definition resin, 32mm scale. Ready to paint yourself, or available pre-painted to order. Terrain base included.',
   25, true),
  ('painted-dwarf-warrior', 'Painted Dwarf Warrior', 'actionfigures', 4490, null, null,
   'Hand-painted, ready for display.',
   'Dwarf warrior fully hand-painted with layering and shading techniques, ready for display or tabletop use. Protective matte finish.',
   15, true),
  ('starter-hero-kit', 'Starter Hero Kit (5 minis)', 'kits', 1690, null, null,
   'Five classic archetypes for your party.',
   'Kit with five classic archetype miniatures (warrior, wizard, rogue, cleric, and archer) printed in resin, ready to paint. Ideal for starting your group.',
   40, true),
  ('standard-tabletop-painting', 'Standard Tabletop Painting', 'custom', 850, 'from', '/mini',
   'Send us your miniature, we paint it.',
   'Standard tabletop painting service: solid colors, basic shading, and essential details. Send your own miniature or choose one from our catalog. Average turnaround of 10 business days.',
   999, true),
  ('lich-necromancer', 'Lich Necromancer', 'ready', 2890, null, null,
   '32mm scale, robe and staff detailing.',
   'Lich necromancer printed in resin, 32mm scale, with fine detailing on robe, staff, and ritualistic base. Perfect as a campaign villain.',
   20, false),
  ('beholder-terror-of-the-deep', 'Beholder, Terror of the Deep', 'ready', 3890, null, null,
   'Large piece, multiple articulated eyes.',
   'Large-scale beholder miniature with multiple deep-relief eyes and organic texture. High-resolution print for maximum detail.',
   12, false),
  ('dungeon-villains-kit', 'Dungeon Villains Kit (4 minis)', 'kits', 1890, null, null,
   'Four antagonists ready to paint.',
   'Kit with four classic dungeon villain miniatures, ready to paint, 32mm scale. Perfect for encounters and secondary bosses.',
   30, false),
  ('premium-diorama-painting', 'Premium Diorama Painting', 'custom', 3290, 'from', '/mini',
   'Detailed painting with themed base.',
   'Premium painting service with multiple layers, freehand work, special effects (fire, ice, blood), and a themed diorama base. Average turnaround of 25 business days.',
   999, false),
  ('silver-paladin', 'Silver Paladin', 'actionfigures', 4790, null, null,
   'Silver-toned armor, premium paint job.',
   'Paladin fully painted with silver-toned armor and gold detailing, premium finish with realistic light and shadow effects.',
   10, false),
  ('elven-archer', 'Elven Archer', 'ready', 2490, null, null,
   'Dynamic pose, 32mm scale.',
   'Elven archer in a dynamic firing pose, printed in resin, 32mm scale, with removable bow and quiver.',
   18, false)
) as v(slug, name, category_key, price_cents, price_prefix, price_suffix, short_description, long_description, stock, is_featured)
join cat on cat.key = v.category_key;
