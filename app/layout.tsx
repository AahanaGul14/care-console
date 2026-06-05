'use client';
import { ApolloProvider } from '@apollo/client';
import { client } from '@/lib/apollo';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './globals.css';

function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/',           label: '🏠 Home'      },
    { href: '/register',   label: '📋 Register'  },
    { href: '/paramedic',  label: '🚑 Paramedic' },
    { href: '/doctor',     label: '👨‍⚕️ Doctor'   },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-6 sticky top-0 z-50">
      <span className="font-semibold text-gray-800 mr-4">Care Console</span>
      {links.map(link => (
        <Link
          key={link.href}
          href={link.href}
          className={`text-sm transition ${
            pathname === link.href
              ? 'text-blue-600 font-medium'
              : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <ApolloProvider client={client}>
          <Navbar />
          {children}
        </ApolloProvider>
      </body>
    </html>
  );
}