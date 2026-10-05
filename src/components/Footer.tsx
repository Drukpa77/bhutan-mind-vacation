import { contact } from '@/content';
import TLink from './TLink';
import s from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.grid}>
        <div className={s.brandCol}>
          <div className={s.title}>Bhutan Mind<br /><em>Vacation</em></div>
          <p className={s.about}>BMV Tours &amp; Treks. A Bhutanese family-owned and operated company, Thimphu.</p>
        </div>
        <nav className={s.col} aria-label="Explore">
          <span className={s.colHead}>EXPLORE</span>
          <TLink href="/destinations">Destinations</TLink><TLink href="/interactive-map">Interactive map</TLink><TLink href="/journeys">Journeys</TLink><TLink href="/festivals">Festivals</TLink><TLink href="/stories">Stories</TLink>
        </nav>
        <nav className={s.col} aria-label="Plan">
          <span className={s.colHead}>PLAN</span>
          <TLink href="/plan">Plan your trip</TLink><TLink href="/plan/visa">Visa &amp; SDF</TLink><TLink href="/build-your-journey">Build your journey</TLink><TLink href="/about">About us</TLink>
        </nav>
        <div className={s.col}>
          <span className={s.colHead}>CONTACT</span>
          <a href={`tel:${contact.whatsapp}`}>{contact.phone}</a><a href={`https://wa.me/${contact.whatsapp.replace('+', '')}`}>WhatsApp</a><a href={`mailto:${contact.email}`}>{contact.email}</a>
          <address className={s.addr}>PHA-1-38, Babesa<br />Thimphu 11001</address>
        </div>
      </div>
      <div className={s.bottom}>
        <span>© 2026 BMV TOURS AND TREKS</span>
        <span aria-hidden="true">27.4716° N · 89.6386° E</span>
        <div className={s.social}>
          <a href="https://www.instagram.com/bmvtours">INSTAGRAM</a><a href="https://www.facebook.com/Bhutanmindvacation">FACEBOOK</a><a href="https://www.tripadvisor.com.sg/Attraction_Review-g293845-d14803907-Reviews-Bhutan_Mind_Vacation_Tours-Thimphu_Thimphu_District.html">TRIPADVISOR</a>
        </div>
      </div>
    </footer>
  );
}
