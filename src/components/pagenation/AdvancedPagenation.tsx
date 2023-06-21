import { useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';

interface AdvancedPagenationProps {}
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

interface PageOptionType {
  listSize: number;
  activePage: number;
  buttonCount: number;
}

const getPagenation = async (queryKey: PageOptionType) => {
  const offset = queryKey.activePage * queryKey.listSize;
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`,
  );
  return await response.json();
};
const AdvancedPagenation = ({}: AdvancedPagenationProps) => {
  const queryClient = useQueryClient();
  const [pageOption, setPageOption] = React.useState<PageOptionType>({
    listSize: 20,
    activePage: 0,
    buttonCount: 10,
  });

  const firstNum =
    pageOption.activePage - (pageOption.activePage % pageOption.buttonCount);

  const pagenationQuery = useQuery<APIType>({
    queryKey: ['pagenation', pageOption],
    queryFn: () => getPagenation(pageOption),
    keepPreviousData: true,
    staleTime: 5000,
  });

  React.useEffect(() => {
    const prefetchQuerykey = {
      ...pageOption,
      activePage: pageOption.activePage + 1,
    };
    if (!pagenationQuery.isPreviousData) {
      queryClient.prefetchQuery({
        queryKey: ['pagenation', prefetchQuerykey],
        queryFn: () => getPagenation(prefetchQuerykey),
      });
    }
  }, [
    pagenationQuery.data,
    pagenationQuery.isPreviousData,
    pageOption,
    queryClient,
  ]);

  return (
    <div>
      {pagenationQuery.data?.results.map((poke) => (
        <div key={poke.name}>{poke.name}</div>
      ))}
      <button
        onClick={() =>
          setPageOption((state) => ({
            ...state,
            activePage: Math.max(firstNum - state.buttonCount, 0),
          }))
        }
      >
        Prev Button
      </button>
      {Array.from({ length: pageOption.buttonCount }).map((e, i) => (
        <button
          key={i}
          onClick={() =>
            setPageOption((state) => {
              return { ...state, activePage: firstNum + i };
            })
          }
        >
          {firstNum + i + 1}
        </button>
      ))}
      <button
        onClick={() =>
          setPageOption((state) => ({
            ...state,
            activePage: Math.min(
              pagenationQuery.data?.count as number,
              firstNum + pageOption.buttonCount,
            ),
          }))
        }
      >
        Next Button
      </button>
    </div>
  );
};

export default AdvancedPagenation;
