import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <div className="h-screen bg-gray-900 text-white flex">{children}</div>;
}
