
import * as React from 'react';
import { TilesList } from './TilesList';
import { Selection } from '../../utilities/selection/Selection';

export interface ITilesListProps<TItem> extends React.Props<TilesList<TItem>> {
  items?: TItem[];
  selection?: Selection;
  getItemAspectRatio?(item: TItem): number;
  onRenderCell?(item: TItem): React.ReactNode | React.ReactNode[];
}
