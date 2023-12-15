"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

export interface QueryContextProps {
  children: React.ReactNode;
}

export default function QueryContext({ children }: QueryContextProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
