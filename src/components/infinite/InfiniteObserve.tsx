import { useInfiniteQuery } from '@tanstack/react-query';
import React from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

interface PokemonProps {}

const getPoke = async (offset: number = 0) => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`,
  );
  return await response.json();
};

const InfiniteObserve = ({}: PokemonProps) => {
  const { data, hasNextPage, fetchNextPage } = useInfiniteQuery(
    ['pokemon'],
    ({ pageParam = '' }) => getPoke(pageParam),
    {
      getNextPageParam: (lastPage) => {
        const lastOffset =
          lastPage.results[lastPage.results.length - 1].url.split('/')[6];
        if (lastOffset > 1118) {
          return undefined;
        }
        return lastOffset;
      },
      staleTime: 3000,
    },
  );

  const loadMoreButtonRef = React.useRef<HTMLDivElement | null>(null);

  useIntersectionObserver({
    root: null,
    target: loadMoreButtonRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  });

  return (
    <>
      <ul>
        {data?.pages.map((page) =>
          page.results.map((poke: any) => <li key={poke.name}>{poke.name}</li>),
        )}
        <button onClick={() => fetchNextPage()}>Load more</button>
        <div ref={loadMoreButtonRef}></div>
      </ul>
    </>
  );
};

export default InfiniteObserve;
