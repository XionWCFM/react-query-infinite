import { useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';

interface PokeType {
  name: string;
  url: string;
}

interface APIType {
  count: number;
  next: string;
  previous: string;
  results: PokeType[];
}

interface PagenationComponentProps {}

const getPagenation = async (page: number = 0) => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${page}`,
  );
  return await response.json();
};

const PagenationComponent = ({}: PagenationComponentProps) => {
  const queryClient = useQueryClient();
  const [page, setPage] = React.useState(20);

  const pagenationQuery = useQuery<APIType>({
    queryKey: ['pagenation', page],
    queryFn: () => getPagenation(page),
    keepPreviousData: true,
    staleTime: 5000,
  });

  React.useEffect(() => {
    if (!pagenationQuery.isPreviousData) {
      queryClient.prefetchQuery({
        queryKey: ['pagenation', page + 20],
        queryFn: () => getPagenation(page + 20),
      });
    }
  }, [pagenationQuery.data, pagenationQuery.isPreviousData, page, queryClient]);
  console.log('어엄', pagenationQuery);

  return (
    <div>
      {pagenationQuery.data?.results.map((poke) => (
        <div key={poke.name}>{poke.name}</div>
      ))}
      <button
        onClick={() => {
          setPage((state) => Math.max(state - 20, 0));
        }}
      >
        prev button
      </button>
      <button
        onClick={() => {
          setPage((state) => state + 20);
        }}
      >
        next button
      </button>
    </div>
  );
};

export default PagenationComponent;
