
import * as React from 'react';
import { TilesList } from './TilesList';
import { Selection } from '../../utilities/selection/Selection';

export interface ITilesHeaderItem<TItem> {
  content: TItem;
  onRender(content: TItem): React.ReactNode | React.ReactNode[];
}

export interface ITilesGridItem<TItem> {
  content: TItem;
  desiredSize?: { width: number; height: number; };
  onRender(content: TItem, finalSize: { width: number; height: number; }): React.ReactNode | React.ReactNode[];
}

export const enum TilesGridMode {
  none,
  stack,
  fill
}

export interface ITilesGridSegment<TItem> {
  items: ITilesGridItem<TItem>[];
  margin: number;
  rowHeight: number;
  mode: TilesGridMode;
}

export interface ITilesListProps<TItem> extends React.Props<TilesList<TItem>> {
  items: (ITilesHeaderItem<TItem> | ITilesGridSegment<TItem>)[];
  selection?: Selection;
}
