
import * as React from 'react';
import { TilesList } from './TilesList';

export interface ITilesListProps<TItem> extends React.Props<TilesList<TItem>> {
  items?: TItem[];
  getItemAspectRatio?(item: TItem): number;
  onRenderCell?(item: TItem): React.ReactNode | React.ReactNode[];
}
