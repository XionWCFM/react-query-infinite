import { useInfiniteQuery } from '@tanstack/react-query';

interface InfiniteComponentProps {}

const getPoke = async (offset: number = 0) => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`,
  );
  return await response.json();
};

const InfiniteComponent = ({}: InfiniteComponentProps) => {
  const { data, fetchNextPage } = useInfiniteQuery(
    ['poke'],
    ({ pageParam = '' }) => getPoke(pageParam),
    {
      getNextPageParam: (lastPage) => {
        const lastOffset =
          lastPage.results[lastPage.results.length - 1].url.split('/')[6];
        console.log('라스트페이지', lastPage);
        console.log('라스트오프셋', lastOffset);
        if (lastOffset > 1118) return undefined;
        return lastOffset;
      },
      staleTime: 1000,
    },
  );
  return (
    <>
      <ul>
        {data?.pages.map((page) =>
          page.results.map((poke: any) => (
            <li key={poke.name} style={{ padding: '20px', fontWeight: 'bold' }}>
              {poke.name}
            </li>
          )),
        )}
      </ul>
      <button onClick={() => fetchNextPage()}>Load more</button>
    </>
  );
};

export default InfiniteComponent;
