import { useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';

const getPagenation = async (page: number = 0) => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${page}`,
  );
  return await response.json();
};

const usePagenationQuery = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = React.useState(20);
  const pagenationQuery = useQuery({
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

  return <div>usePagenationQuery</div>;
};

export default usePagenationQuery;
