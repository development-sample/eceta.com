'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { brandApplicationSchema, contactSchema, newsletterSchema } from '@/lib/validation/forms';
import { Button, Input, Label, Textarea } from '@/components/ui/primitives';

type Locale = 'ja' | 'en';

type Dictionary = Record<string, any>;

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function BrandApplicationForm({ dictionary, locale }: { dictionary: Dictionary; locale: Locale }) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const form = useForm<z.infer<typeof brandApplicationSchema>>({
    resolver: zodResolver(brandApplicationSchema),
    defaultValues: {
      company: '',
      name: '',
      email: '',
      category: '',
      url: '',
      sku: '',
      timeline: '',
      message: ''
    }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setStatus('idle');
    const response = await fetch('/api/brands/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    });
    if (response.ok) {
      form.reset();
      setStatus('success');
    } else {
      setStatus('error');
    }
  });

  const t = dictionary.form;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label={t.company} error={form.formState.errors.company?.message}>
        <Input {...form.register('company')} placeholder="ECeta Inc." required />
      </Field>
      <Field label={t.name} error={form.formState.errors.name?.message}>
        <Input {...form.register('name')} placeholder={locale === 'ja' ? '山田 花子' : 'Jane Doe'} required />
      </Field>
      <Field label={t.email} error={form.formState.errors.email?.message}>
        <Input {...form.register('email')} type="email" placeholder="team@brand.co" required />
      </Field>
      <Field label={t.category} error={form.formState.errors.category?.message}>
        <Input {...form.register('category')} placeholder={locale === 'ja' ? 'アパレル' : 'Apparel'} required />
      </Field>
      <Field label={t.url} error={form.formState.errors.url?.message}>
        <Input {...form.register('url')} placeholder="https://brand.co" required />
      </Field>
      <Field label={t.sku} error={form.formState.errors.sku?.message}>
        <Input {...form.register('sku')} placeholder="120" required />
      </Field>
      <Field label={t.timeline} error={form.formState.errors.timeline?.message}>
        <Input {...form.register('timeline')} placeholder={locale === 'ja' ? '2025年Q1' : 'Q1 2025'} required />
      </Field>
      <Field label={t.message} error={form.formState.errors.message?.message}>
        <Textarea
          {...form.register('message')}
          placeholder={locale === 'ja' ? '導入背景や目標をご共有ください。' : 'Tell us about your goals.'}
        />
      </Field>
      <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? 'Sending...' : t.submit}
      </Button>
      {status === 'success' && <p className="text-sm text-emerald-600">{dictionary.brandsForm.success}</p>}
      {status === 'error' && <p className="text-sm text-destructive">{dictionary.brandsForm.error}</p>}
    </form>
  );
}

export function ContactForm({ dictionary, locale }: { dictionary: Dictionary; locale: Locale }) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setStatus('idle');
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    });
    if (response.ok) {
      form.reset();
      setStatus('success');
    } else {
      setStatus('error');
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label={dictionary.form.name} error={form.formState.errors.name?.message}>
        <Input {...form.register('name')} placeholder={locale === 'ja' ? '山田 太郎' : 'Alex Kim'} required />
      </Field>
      <Field label={dictionary.form.email} error={form.formState.errors.email?.message}>
        <Input {...form.register('email')} type="email" placeholder="you@example.com" required />
      </Field>
      <Field label={dictionary.contactForm.subject} error={form.formState.errors.subject?.message}>
        <Input {...form.register('subject')} placeholder={locale === 'ja' ? '取材のご依頼' : 'Press inquiry'} required />
      </Field>
      <Field label={dictionary.contactForm.message} error={form.formState.errors.message?.message}>
        <Textarea
          {...form.register('message')}
          placeholder={locale === 'ja' ? 'お問い合わせ内容をご記入ください。' : 'Share your request here.'}
          required
        />
      </Field>
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? 'Sending...' : dictionary.contactForm.button}
      </Button>
      {status === 'success' && <p className="text-sm text-emerald-600">{dictionary.contact.success}</p>}
      {status === 'error' && <p className="text-sm text-destructive">{dictionary.contact.error}</p>}
    </form>
  );
}

export function NewsletterForm({ dictionary }: { dictionary: Dictionary }) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const form = useForm<z.infer<typeof newsletterSchema>>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: '' }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setStatus('idle');
    const response = await fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    });
    if (response.ok) {
      form.reset();
      setStatus('success');
    } else {
      setStatus('error');
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
      <Input type="email" placeholder={dictionary.newsletter.placeholder} {...form.register('email')} required />
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? '...' : dictionary.newsletter.button}
      </Button>
      {status === 'success' && <p className="text-xs text-emerald-600">{dictionary.newsletter.success}</p>}
      {status === 'error' && <p className="text-xs text-destructive">{dictionary.newsletter.error}</p>}
    </form>
  );
}