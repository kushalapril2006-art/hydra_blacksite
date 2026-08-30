import worker from '../../runtime/server/index.js';

export default function ctfGate(request) {
  const env = {
    TURNSTILE_SITE_KEY: Netlify.env.get('TURNSTILE_SITE_KEY') || '',
    TURNSTILE_SECRET_KEY: Netlify.env.get('TURNSTILE_SECRET_KEY') || '',
    TURNSTILE_COOKIE_SECRET: Netlify.env.get('TURNSTILE_COOKIE_SECRET') || '',
  };

  return worker.fetch(request, env);
}
