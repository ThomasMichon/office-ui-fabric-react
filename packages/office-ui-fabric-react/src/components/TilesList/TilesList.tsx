
import * as React from 'react';
import { ITilesListProps, ITilesHeaderItem, ITilesGridSegment, TilesGridMode } from './TilesList.Props';
import { List } from '../../List';
import { FocusZone, FocusZoneDirection } from '../../FocusZone';
import { SelectionZone, SelectionMode } from '../../utilities/selection/index';
import { autobind, css } from '../../Utilities';
import * as TilesListStylesModule from './TilesList.scss';

const TilesListStyles: any = TilesListStylesModule;

export interface ITilesListState {

}

interface ITileCell<TItem> {
  content: TItem;
  aspectRatio: number;
  rowHeight: number;
  mode: TilesGridMode;
  margin: number;
  onRender(content: TItem, finalSize: { width: number; height: number; }): React.ReactNode | React.ReactNode[];
}

export class TilesList<TItem> extends React.Component<ITilesListProps<TItem>, ITilesListState> {
  constructor(props: ITilesListProps<TItem>, context: any) {
    super(props, context);
  }

  public render() {
    const {
      items,
      selection
    } = this.props;

    const cells = this._getCells(items);

    const list = (
      <List
        items={ cells }
        onRenderCell={ this._onRenderCell }
        getCellClassName={ this._onGetCellClassName }
        getPageClassName={ this._onGetPageClassName }
        getPageStyle={ this._onGetPageStyle }
        getCellStyle={ this._onGetCellStyle }
        getItemCountForPage={ this._onGetItemCountPerPage }
        surfaceClassName={ TilesListStyles.listSurface }
      />
    );

    return (
      <FocusZone
        direction={ FocusZoneDirection.bidirectional }
      >
        {
          selection ?
            <SelectionZone
              selection={ selection }
              selectionMode={ SelectionMode.multiple }>
              { list }
            </SelectionZone> :
            { list }
        }
      </FocusZone>
    );
  }

  @autobind
  private _onRenderCell(item: ITileCell<TItem>) {
    const itemWidthOverHeight = item.aspectRatio;
    const itemHeightOverWidth = 1 / itemWidthOverHeight;

    return (
      <div
        role='presentation'
        className={ css(TilesListStyles.cell) }
        style={
          {
            paddingTop: `${(100 * itemHeightOverWidth).toFixed(2)}%`
          }
        }
      >
        <div
          role='presentation'
          className={ css(TilesListStyles.cellContent) }
        >
          { item.onRender(item.content, { width: 0, height: 0 }) }
        </div>
      </div>
    );
  }

  @autobind
  private _onGetItemCountPerPage(): number {
    return 100;
  }

  @autobind
  private _onGetPageClassName(): string {
    return TilesListStyles.listPage;
  }

  @autobind
  private _onGetCellClassName(): string {
    return TilesListStyles.listCell;
  }

  @autobind
  private _onGetPageStyle(): any {
    return {};
  }

  @autobind
  private _onGetCellStyle(item: ITileCell<TItem>): any {
    const itemWidthOverHeight = item.aspectRatio || 1;
    const itemHeightOverWidth = 1 / itemWidthOverHeight;
    const margin = item.margin;

    const isFill = item.mode === TilesGridMode.fill;

    const height = item.rowHeight;
    const width = itemWidthOverHeight * height;

    return {
      flex: `${itemWidthOverHeight} ${itemWidthOverHeight} ${width}px`,
      minHeight: `${height}px`,
      minWidth: `${width}px`,
      maxWidth: isFill ? `${width * 1.2}px` : `${width}px`,
      margin: `${margin}px`
    };
  }

  private _getCells(items: (ITilesGridSegment<TItem> | ITilesHeaderItem<TItem>)[]): ITileCell<TItem>[] {
    const cells: ITileCell<TItem>[] = [];

    for (const item of items) {
      if (isGridSegment(item)) {
        for (const gridItem of item.items) {
          cells.push({
            aspectRatio: gridItem.desiredSize.width / gridItem.desiredSize.height,
            content: gridItem.content,
            onRender: gridItem.onRender,
            rowHeight: item.rowHeight,
            margin: item.margin,
            mode: item.mode
          });
        }
      } else {
        cells.push({
          aspectRatio: 1,
          content: item.content,
          onRender: item.onRender,
          rowHeight: 0,
          margin: 0,
          mode: TilesGridMode.fill
        });
      }
    }

    return cells;
  }
}

function isGridSegment<TItem>(item: ITilesGridSegment<TItem> | ITilesHeaderItem<TItem>): item is ITilesGridSegment<TItem> {
  return !!(item as ITilesGridSegment<TItem>).items;
}
