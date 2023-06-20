import { useState } from 'react';
import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Loading from './components/Loading';
import React from 'react';
import InfiniteComponent from './components/InfiniteComponent';

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        suspense: true,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <main>
        <React.Suspense fallback={<Loading />}>
          <InfiniteComponent />
        </React.Suspense>
      </main>
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
}

export default App;
