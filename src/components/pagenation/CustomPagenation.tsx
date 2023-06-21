import React from 'react';

interface CustomPagenationProps {}

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

const CustomPagenation = ({}: CustomPagenationProps) => {
  return <div>CustomPagenation</div>;
};

export default CustomPagenation;
