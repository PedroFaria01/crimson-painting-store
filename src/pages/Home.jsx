import { Link } from 'react-router-dom'
import Button from '../components/Button'
import ProductCard from '../components/ProductCard'
import PlaceholderImage from '../components/PlaceholderImage'
import { useProducts } from '../context/ProductsContext'

const STEPS = [
  {
    n: 1,
    title: 'Send or Choose',
    desc: 'Send us your miniature or choose a kit from our catalog.',
  },
  {
    n: 2,
    title: 'Pick a Style',
    desc: 'Standard, premium, or themed diorama — you decide the level of detail.',
  },
  {
    n: 3,
    title: 'Follow the Process',
    desc: 'Progress photos sent while your piece is being painted.',
  },
  {
    n: 4,
    title: 'Receive at Home',
    desc: 'Finished piece, packaged and ready for the table.',
  },
]

const TESTIMONIALS = [
  {
    quote:
      "I had my whole party painted and the result was better than I imagined. Incredible detail.",
    name: 'Rafael M.',
    role: 'RPG Game Master',
  },
  {
    quote:
      'The ready-made miniatures arrived quickly with flawless finishing. I’m a regular customer now.',
    name: 'Carla T.',
    role: 'Collector',
  },
  {
    quote:
      'The custom painting service saved my campaign before a special session. Highly recommend.',
    name: 'Diego S.',
    role: 'D&D Player',
  },
]

export default function Home() {
  const { products, loading } = useProducts()
  const featuredProducts = products.filter((p) => p.featured)

  return (
    <div className="animate-cp-fade">
      {/* Hero — Style C (centered/banner), the variant selected for production */}
      <div className="relative px-10 pt-20 pb-[90px] border-b border-cp-border overflow-hidden">
        <div className="max-w-[820px] mx-auto text-center pt-5">
          <div className="border-t-2 border-b-2 border-cp-gold-dim py-3.5 mb-[34px]">
            <div className="font-cinzel text-[13px] tracking-[4px] text-cp-gold uppercase">
              Forged in the Fire of Creativity
            </div>
          </div>
          <h1 className="font-cinzel font-bold text-[50px] leading-[1.15] mb-[22px] text-cp-cream-bright">
            3D miniatures and custom painting for your adventures
          </h1>
          <p className="text-[19px] leading-relaxed text-cp-muted max-w-[600px] mx-auto mb-[34px]">
            From ready-made prints to hand-painted pieces, a shop dedicated to
            those who live the world of Dungeons &amp; Dragons at the table.
          </p>
          <div className="flex gap-4 justify-center mb-11">
            <Button as={Link} to="/catalog" variant="solid">
              View Catalog
            </Button>
            <Button as={Link} to="/catalog?category=custom" variant="outline">
              Custom Order
            </Button>
          </div>
          <PlaceholderImage
            label="photo: group of painted miniatures in a scene"
            rounded
            className="w-full h-[380px] rounded-lg"
          />
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-[1200px] mx-auto px-10 py-20">
        <div className="flex items-baseline justify-between mb-9">
          <h2 className="font-cinzel font-bold text-3xl text-cp-cream-bright">
            Featured Products
          </h2>
          <Link
            to="/catalog"
            className="font-cinzel text-[13px] tracking-wide uppercase text-cp-gold hover:text-cp-gold-bright"
          >
            View all &rarr;
          </Link>
        </div>
        {loading ? (
          <p className="text-cp-muted-2 text-center py-16">Loading products…</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* How the Custom Order Service Works */}
      <div className="bg-cp-surface border-t border-b border-cp-border px-10 py-20">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="font-cinzel font-bold text-3xl text-center mb-3 text-cp-cream-bright">
            How the Custom Order Service Works
          </h2>
          <p className="text-center text-cp-muted-2 text-[17px] max-w-[600px] mx-auto mb-12">
            Send us your miniature or choose a kit — we take care of the
            painting, start to finish.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {STEPS.map((s) => (
              <div key={s.n} className="text-center">
                <div className="w-14 h-14 rounded-full border border-cp-gold-dim flex items-center justify-center mx-auto mb-[18px] font-cinzel text-xl text-cp-gold">
                  {s.n}
                </div>
                <div className="font-cinzel text-base font-semibold mb-2.5 text-cp-cream">
                  {s.title}
                </div>
                <div className="text-[15px] text-cp-muted-2 leading-relaxed">
                  {s.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-[1200px] mx-auto px-10 py-20">
        <h2 className="font-cinzel font-bold text-3xl text-center mb-10 text-cp-cream-bright">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="flex flex-col gap-4 bg-cp-surface border border-cp-border rounded-md p-7"
            >
              <div className="text-base leading-relaxed italic text-cp-muted">
                &ldquo;{t.quote}&rdquo;
              </div>
              <div className="flex items-center gap-3 mt-auto">
                <PlaceholderImage
                  label="photo"
                  className="w-11 h-11 rounded-full shrink-0"
                />
                <div>
                  <div className="font-semibold text-sm text-cp-cream">{t.name}</div>
                  <div className="text-xs text-cp-muted-2">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About the Studio */}
      <div className="bg-cp-surface border-t border-cp-border px-10 py-20">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-[60px] items-center">
          <PlaceholderImage
            label="photo: artist painting a miniature in the studio"
            rounded
            className="w-full h-[360px] rounded-lg"
          />
          <div>
            <div className="font-cinzel text-[13px] tracking-[3px] text-cp-gold uppercase mb-4">
              About the Studio
            </div>
            <h2 className="font-cinzel font-bold text-[32px] mb-5 text-cp-cream-bright">
              Professional painting for those who live the hobby
            </h2>
            <p className="text-[17px] leading-[1.7] text-cp-muted">
              Crimson Painting was born from a passion for tabletop RPGs and
              miniatures. We print in high-definition resin and hand-paint every
              piece, using layering, shading, and wash techniques favored by
              award-winning painters. We work with RPG groups, collectors, and
              stores looking for display-quality pieces.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
