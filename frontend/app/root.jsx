import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation
} from '@remix-run/react'
import { useEffect } from 'react'

import * as gtag from '~/utils/gtags.client'

// Load the GA tracking id from the .env
export const loader = async () => {
  return process.env.GA_TRACKING_ID
}

export const meta = () => ({
  charset: 'utf-8',
  title: 'Recommend-o-tron Books',
  viewport: 'width=device-width,initial-scale=1'
})

export default function App() {
  const location = useLocation()
  const GA_TRACKING_ID = useLoaderData(loader)

  useEffect(() => {
    if (GA_TRACKING_ID?.length) {
      gtag.pageview(location.pathname, GA_TRACKING_ID)
    }
  }, [location, GA_TRACKING_ID])

  return (
    <html lang="pt">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {process.env.NODE_ENV === 'development' || !GA_TRACKING_ID ? null : (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            />
            <script
              async
              id="gtag-init"
              dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                  cookie_domain: window.location.hostname,
                  cookie_flags: "SameSite=None;Secure",
                });
              `
              }}
            />
          </>
        )}
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
