
import * as React from 'react';
import { TilesList } from '../../TilesList';
import { autobind } from '../../../Utilities';

type IAspectRatioByProbability = { [probability: string]: number; };

const PROBABILITIES: IAspectRatioByProbability = {
  '0.95': 3,
  '0.90': 1 / 3,
  '0.80': 16 / 9,
  '0.70': 9 / 16,
  '0.40': 4 / 3,
  '0.10': 3 / 4,
  '0.00': 1
};

const ENTRIES = Object.keys(PROBABILITIES).map((key: keyof IAspectRatioByProbability) => ({
  probability: Number(key),
  aspectRatio: PROBABILITIES[key]
}));

const ITEMS = Array.apply(null, { length: 1000 }).map((value: undefined, index: number) => {
  const seed = Math.random();

  return {
    key: `item-${index}`,
    aspectRatio: ENTRIES.filter((entry: { probability: number; aspectRatio: number; }) => seed > entry.probability)[0].aspectRatio
  };
});

declare class TilesListClass extends TilesList<typeof ITEMS[0]> { }

const TilesListType: typeof TilesListClass = TilesList;

export class TilesListBasicExample extends React.Component<any, any> {
  public render() {
    return (
      <div>
        <div>Start</div>
        <TilesListType
          items={ ITEMS }
          getItemAspectRatio={ this._onGetItemAspectRatio }
          onRenderCell={ this._onRenderCell }
        />
        <div>End</div>
      </div>
    );
  }

  @autobind
  private _onGetItemAspectRatio(item: typeof ITEMS[0]): number {
    return item && item.aspectRatio || 1;
  }

  @autobind
  private _onRenderCell(item: typeof ITEMS[0]) {
    return (
      <div>{ item.key }</div>
    );
  }
}
