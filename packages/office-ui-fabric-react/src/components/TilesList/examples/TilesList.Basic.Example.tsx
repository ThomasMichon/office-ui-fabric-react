
import * as React from 'react';
import { TilesList } from '../../TilesList';
import { autobind } from '../../../Utilities';

const ITEMS = Array.apply(null, { length: 1000 }).map((value: undefined, index: number) => {
  return {
    key: `item-${index}`,
    aspectRatio: 0.5 + 1.5 * Math.random()
  };
});

declare class TilesListClass extends TilesList<typeof ITEMS[0]> { }

const TilesListType: typeof TilesListClass = TilesList;

export class TilesListBasicExample extends React.Component<any, any> {
  public render() {
    return (
      <TilesListType
        items={ ITEMS }
        getItemAspectRatio={ this._onGetItemAspectRatio }
        onRenderCell={ this._onRenderCell }
      />
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
