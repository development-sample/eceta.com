'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes/dist/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Moon, Sun } from 'lucide-react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import type { SiteCopy } from '@/lib/cms/types';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import { locales, type Locale } from '@/lib/i18n/config';
import { Button, Sheet, SheetContent, SheetTrigger } from '@/components/ui/primitives';
import { cn } from '@/lib/utils';

interface SiteContextValue {
  copy: SiteCopy;
  dictionary: Dictionary;
  locale: Locale;
}

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({ value, children }: { value: SiteContextValue; children: React.ReactNode }) {
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSiteContext() {
  const value = useContext(SiteContext);
  if (!value) {
    throw new Error('SiteContext missing');
  }
  return value;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider attribute="data-theme" defaultTheme="system" enableSystem {...props}>
      {children}
    </NextThemesProvider>
  );
}

export function PwaRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((error) => console.error('Service worker registration failed', error));
    }
  }, []);
  return null;
}

const COOKIE_STORAGE_KEY = 'eceta-cookie-consent';

export function CookieBanner({ locale }: { locale: Locale }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = window.localStorage.getItem(COOKIE_STORAGE_KEY);
    if (!consent) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const copy =
    locale === 'ja'
      ? { message: '当サイトでは体験向上のためCookieを最小限利用します。', accept: '了解' }
      : { message: 'We use minimal cookies to improve your experience.', accept: 'Got it' };

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 mx-auto w-[95%] max-w-xl rounded-2xl border border-border bg-background/95 p-4 shadow-xl backdrop-blur">
      <p className="text-sm text-muted-foreground">{copy.message}</p>
      <div className="mt-3 flex justify-end">
        <Button
          size="sm"
          onClick={() => {
            window.localStorage.setItem(COOKIE_STORAGE_KEY, 'true');
            setVisible(false);
          }}
        >
          {copy.accept}
        </Button>
      </div>
    </div>
  );
}

function LanguageSwitcher({ label }: { label: string }) {
  const pathname = usePathname();
  const segments = pathname?.split('/') ?? [];
  const currentLocale = (segments[1] as Locale) ?? 'ja';
  const rest = segments.slice(2).join('/');

  return (
    <div className="flex items-center gap-1 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex rounded-full border border-border p-1">
        {locales.map((locale) => {
          const href = `/${locale}/${rest}`.replace(/\/+$|\/\//g, '/');
          const active = currentLocale === locale;
          return (
            <Link
              key={locale}
              href={href === '/' ? `/${locale}` : href}
              scroll={false}
              className={cn(
                'rounded-full px-2 py-1 transition',
                active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {locale.toUpperCase()}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function ThemeToggle({ labelLight, labelDark, labelSystem }: { labelLight: string; labelDark: string; labelSystem: string }) {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const icon = theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />;
  const label = theme === 'dark' ? labelDark : theme === 'light' ? labelLight : labelSystem;

  return (
    <Button variant="ghost" size="sm" onClick={cycleTheme} aria-label={label} className="gap-2 text-xs">
      {icon}
      <span>{label}</span>
    </Button>
  );
}

export function SiteHeader({ copy, locale, dictionary }: { copy: SiteCopy; locale: Locale; dictionary: Dictionary }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-2 text-sm font-semibold">
          <span className="rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">ECeta</span>
          <span className="hidden text-muted-foreground sm:inline">
            {locale === 'ja' ? 'スマホ発メタバースEC' : 'Metaverse commerce, mobile-first'}
          </span>
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {copy.navigation.map((item) => (
            <Link key={item.href} href={item.href.replace('%locale%', locale)} className="text-sm text-muted-foreground transition hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher label={dictionary.language} />
          <ThemeToggle labelLight={dictionary.light} labelDark={dictionary.dark} labelSystem={dictionary.system} />
          <Button asChild size="sm">
            <Link href={`/${locale}/for-brands`}>{copy.hero.primaryCta}</Link>
          </Button>
        </div>
        <div className="lg:hidden">
          <MobileNav copy={copy} locale={locale} dictionary={dictionary} />
        </div>
      </div>
    </header>
  );
}

function MobileNav({ copy, locale, dictionary }: { copy: SiteCopy; locale: Locale; dictionary: Dictionary }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open navigation">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <div className="flex items-center justify-between">
          <LanguageSwitcher label={dictionary.language} />
          <ThemeToggle labelLight={dictionary.light} labelDark={dictionary.dark} labelSystem={dictionary.system} />
        </div>
        <ul className="mt-6 space-y-3 text-sm">
          {copy.navigation.map((item) => (
            <li key={item.href}>
              <Link href={item.href.replace('%locale%', locale)} className={cn('block rounded-xl px-3 py-2 hover:bg-muted')}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <Button asChild className="mt-6 w-full">
          <Link href={`/${locale}/for-brands`}>{copy.hero.primaryCta}</Link>
        </Button>
      </SheetContent>
    </Sheet>
  );
}

export function SiteFooter({ copy, locale, dictionary }: { copy: SiteCopy; locale: Locale; dictionary: Dictionary }) {
  return (
    <footer className="border-t border-border/40 bg-muted/20">
      <div className="container grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h4 className="font-semibold">ECeta</h4>
          <p className="mt-2 text-sm text-muted-foreground">{copy.footer.cta}</p>
        </div>
        <div>
          <h4 className="font-semibold">{locale === 'ja' ? 'メニュー' : 'Menu'}</h4>
          <ul className="mt-2 space-y-2 text-sm">
            {copy.navigation.map((item) => (
              <li key={item.href}>
                <Link className="text-muted-foreground transition hover:text-foreground" href={item.href.replace('%locale%', locale)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">{locale === 'ja' ? '連絡先' : 'Contact'}</h4>
          <p className="mt-2 text-sm text-muted-foreground">{copy.footer.address}</p>
          <Link className="mt-2 inline-flex text-sm text-primary" href="mailto:hello@eceta.com">
            hello@eceta.com
          </Link>
        </div>
        <div>
          <h4 className="font-semibold">{locale === 'ja' ? 'ポリシー' : 'Policies'}</h4>
          <ul className="mt-2 space-y-2 text-sm">
            <li>
              <Link className="text-muted-foreground transition hover:text-foreground" href={`/${locale}/legal/privacy`}>
                {locale === 'ja' ? 'プライバシー' : 'Privacy'}
              </Link>
            </li>
            <li>
              <Link className="text-muted-foreground transition hover:text-foreground" href={`/${locale}/legal/terms`}>
                {locale === 'ja' ? '利用規約' : 'Terms'}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40 py-6">
        <div className="container flex flex-col gap-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            {copy.footer.copyright}
            {new Date().getFullYear()} ECeta. {dictionary.footer.rights}
          </p>
          <div className="flex gap-4">
            {copy.footer.links.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}