import { BrandLogo } from "@/components/brand-logo";
import { PhotoPlaceholder } from "@/components/photo-placeholder";
import { publicAssetPath } from "@/lib/paths";
import { addOns, drinkPhotos, flavors, packages, site, verses } from "@/lib/site";

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function formatPrice(amount: number) {
  return `₱${amount.toLocaleString("en-PH")}`;
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="site-header wrap">
        <a className="wordmark" href="#home" aria-label={`${site.name} home`}>
          <BrandLogo />
          <span>TIO PHILO<span className="wordmark-caption">COFFEE CORNER</span></span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#service">Our service</a>
          <a href="#flavors">Flavors</a>
          <a href="#packages">Packages</a>
          <a className="nav-book" href="#contact">Book an event <Arrow /></a>
        </nav>
      </header>

      <main id="main">
        <section className="hero wrap" id="home" aria-labelledby="hero-heading">
          <div className="hero-copy">
            <p className="eyebrow">COFFEE FOR YOUR SPECIAL OCCASIONS</p>
            <h1 id="hero-heading">Make every<br />celebration<br /><em>Brew-tiful.</em></h1>
            <p className="hero-description">
              Great coffee, warm service, and a little extra love.
              Bring Tio Philo Coffee Corner to your next celebration.
            </p>
            <div className="hero-actions">
              <a className="button" href="#packages">Explore our packages <Arrow /></a>
              <a className="text-link" href={publicAssetPath(site.flyer)} target="_blank" rel="noopener noreferrer">View our flyer <Arrow /></a>
            </div>
          </div>
          <div className="hero-emblem">
            <BrandLogo large />
            <p className="brand-message"><em>{site.tagline}</em></p>
          </div>
        </section>

        <section className="service-section wrap" id="service" aria-labelledby="service-heading">
          <div className="section-heading">
            <p className="eyebrow">OUR SERVICE</p>
            <h2 id="service-heading">A coffee corner for<br /><em>your kind of celebration.</em></h2>
          </div>
          <div className="service-copy">
            <p>
              From intimate gatherings to grand celebrations, we bring quality
              coffee and a warm, inviting atmosphere to your special occasions.
              Freshly prepared and served with care, one cup at a time.
            </p>
            <p>
              Enjoy quality coffee beans, premium syrups and sauces, and your
              choice of creamy Oatside or rich full-cream milk.
            </p>
            <div className="service-details">
              <span><strong>12 oz</strong> iced drinks</span>
              <span><strong>8 oz</strong> hot drinks</span>
              <span><strong>Oatside</strong> or full-cream milk</span>
            </div>
          </div>
        </section>

        <section className="flavors-section wrap section-space" id="flavors" aria-labelledby="flavors-heading">
          <div className="section-heading section-heading-inline">
            <div>
              <p className="eyebrow">OUR FLAVORS</p>
              <h2 id="flavors-heading">A favorite <em>for everyone.</em></h2>
            </div>
            <p>Coffee lovers and refresher lovers,<br />there’s a cup for you.</p>
          </div>
          <div className="flavor-lists">
            {flavors.map((group) => (
              <div className="flavor-group" key={group.category}>
                <h3>{group.category}</h3>
                <ul>
                  {group.items.map((name) => <li key={name}>{name}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="photo-gallery" aria-label="Drink photos">
            {drinkPhotos.map((photo) => <PhotoPlaceholder key={photo.label} photo={photo} />)}
          </div>
        </section>

        <section className="packages-section" id="packages" aria-labelledby="packages-heading">
          <div className="wrap section-space">
            <div className="section-heading section-heading-inline">
              <div>
                <p className="eyebrow">OUR PACKAGES</p>
                <h2 id="packages-heading">Good coffee.<br /><em>A celebration to remember.</em></h2>
              </div>
              <p>From 50 to 250 cups.<br />A free Love Wall with every package.</p>
            </div>
            <div className="package-layout">
              <table className="package-table">
                <caption className="visually-hidden">Event coffee packages and prices in Philippine pesos</caption>
                <thead><tr><th scope="col">Package</th><th scope="col">Price (PHP)</th></tr></thead>
                <tbody>
                  {packages.map((item) => (
                    <tr key={item.cups}>
                      <th scope="row"><span>{item.cups}</span> cups</th>
                      <td>{formatPrice(item.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="package-extras">
                <h3>The little extras</h3>
                <dl>
                  {addOns.map((item) => (
                    <div key={item.name}><dt>{item.name}</dt><dd>{item.detail}</dd></div>
                  ))}
                </dl>
                <p className="package-note">Planning an event outside Cavite? Get in touch for the transportation fee.</p>
                <a className="button" href="#contact">Let’s plan your event <Arrow /></a>
              </div>
            </div>
          </div>
        </section>

        <section className="love-section wrap section-space" aria-labelledby="love-heading">
          <div className="love-note" aria-hidden="true">
            <span className="note-heart">♡</span>
            <p>A little note.<br />A lot of love.</p>
            <span className="note-signature">A keepsake from your special day</span>
          </div>
          <div className="love-copy">
            <p className="eyebrow">COMPLIMENTARY WITH EVERY PACKAGE</p>
            <h2 id="love-heading">More than coffee.<br /><em>A little extra love.</em></h2>
            <p>
              Our <b>free Love Wall</b> gives your guests a place to leave heartfelt
              notes, sweet messages, and words of encouragement.
            </p>
            <p>
              After your event, we collect the notes in a special bottle for the
              celebrant. A keepsake filled with love and memories to take home.
            </p>
          </div>
        </section>

        <section className="faith-section" aria-labelledby="faith-heading">
          <div className="wrap faith-inner">
            <span className="faith-heart" aria-hidden="true">♡</span>
            <h2 id="faith-heading">{site.faithMessage}</h2>
            <div className="verse-grid">
              {verses.map((verse) => (
                <figure className="verse" key={verse.reference}>
                  <blockquote><p>“{verse.text}”</p></blockquote>
                  <figcaption><cite>{verse.reference}</cite> ({verse.translation})</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-heading">
          <div className="contact-inner wrap">
            <div>
              <p className="eyebrow">LET’S MAKE IT BREW-TIFUL</p>
              <h2 id="contact-heading">Book us for<br /><em>your next event.</em></h2>
              <p>Tell us your event date, venue, and preferred cup package.<br />We’ll take it from there.</p>
            </div>
            <div className="contact-details">
              <p className="eyebrow">CALL OR TEXT</p>
              {site.phones.map((phone) => (
                <a className="phone-link" href={phone.href} key={phone.href}>{phone.label} <Arrow /></a>
              ))}
              {site.facebookUrl ? (
                <a className="facebook-link" href={site.facebookUrl} target="_blank" rel="noopener noreferrer">Message {site.facebookName} on Facebook <Arrow /></a>
              ) : (
                <p className="facebook-label">You can also message our <strong>{site.facebookName}</strong> Facebook page.</p>
              )}
              <p className="contact-location">Free transportation to all areas in Cavite.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer wrap">
        <p>© {site.name}</p>
        <p>{site.tagline}</p>
        <a href="#home">Back to top ↑</a>
      </footer>
    </>
  );
}
