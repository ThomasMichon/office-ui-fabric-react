
import * as React from 'react';
import { TilesList, ITilesGridSegment, ITilesGridItem, TilesGridMode } from '../../TilesList';
import { Tile, TileMode } from '../../Tile';
import { Selection } from '../../../utilities/selection/Selection';
import { MarqueeSelection } from '../../../MarqueeSelection';
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

const ITEMS = (Array.apply(null, { length: 1000 }) as undefined[]).map((value: undefined, index: number) => {
  const seed = Math.random();

  return {
    key: `item-${index}`,
    aspectRatio: ENTRIES.filter((entry: { probability: number; aspectRatio: number; }) => seed > entry.probability)[0].aspectRatio
  };
});

type ExampleItem = typeof ITEMS[0];

declare class TilesListClass extends TilesList<ExampleItem> { }

const TilesListType: typeof TilesListClass = TilesList;

export class TilesListBasicExample extends React.Component<any, any> {
  private _selection: Selection;

  constructor() {
    super();

    this._selection = new Selection({
      getKey: (item: ExampleItem) => item.key,
    });

    this._selection.setItems(ITEMS);
  }
  public render() {
    const items: ITilesGridSegment<ExampleItem>[] = [
      {
        items: ITEMS.map((item: ExampleItem): ITilesGridItem<ExampleItem> => {
          return {
            content: item,
            desiredSize: {
              width: 100 * item.aspectRatio,
              height: 100
            },
            onRender: this._onRenderCell
          };
        }),
        margin: 8,
        rowHeight: 100,
        mode: TilesGridMode.fill
      }
    ];

    return (
      <div style={ { padding: '4px' } }>
        <div>Start</div>
        <MarqueeSelection selection={ this._selection }>
          <TilesListType
            selection={ this._selection }
            items={ items }
          />
        </MarqueeSelection>
        <div>End</div>
      </div>
    );
  }

  @autobind
  private _onRenderCell(item: ExampleItem) {
    return (
      <Tile
        selection={ this._selection }
        selectionIndex={ ITEMS.indexOf(item) }
        mode={ item.aspectRatio === 1 ? TileMode.icon : TileMode.rich }
      />
    );
  }
}
