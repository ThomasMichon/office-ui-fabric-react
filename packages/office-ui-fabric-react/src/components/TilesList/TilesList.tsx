
import * as React from 'react';
import { ITilesListProps, ITilesHeaderItem, ITilesGridSegment, TilesGridMode } from './TilesList.Props';
import { List, IPageProps } from '../../List';
import { FocusZone, FocusZoneDirection } from '../../FocusZone';
import { SelectionZone, SelectionMode } from '../../utilities/selection/index';
import { autobind, css, IRenderFunction, IRectangle } from '../../Utilities';
import * as TilesListStylesModule from './TilesList.scss';

const TilesListStyles: any = TilesListStylesModule;

export interface ITilesListState<TItem> {
  cells: ITileCell<TItem>[];
}

export interface ITileGrid {
  rowHeight: number;
  mode: TilesGridMode;
  margin: number;
  key: string;
}

export interface ITileCell<TItem> {
  content: TItem;
  aspectRatio: number;
  grid: ITileGrid;
  onRender(content: TItem, finalSize: { width: number; height: number; }): React.ReactNode | React.ReactNode[];
}

export class TilesList<TItem> extends React.Component<ITilesListProps<TItem>, ITilesListState<TItem>> {
  constructor(props: ITilesListProps<TItem>, context: any) {
    super(props, context);

    this.state = {
      cells: this._getCells(props.items)
    };
  }

  public componentWillReceiveProps(nextProps: ITilesListProps<TItem>) {
    if (nextProps.items !== this.props.items) {
      this.setState({
        cells: this._getCells(nextProps.items)
      });
    }
  }

  public render() {
    const {
      selection
    } = this.props;

    const {
      cells
    } = this.state;

    const list = (
      <List
        items={ cells }
        onRenderCell={ this._onRenderCell }
        getCellClassName={ this._onGetCellClassName }
        getCellStyle={ this._onGetCellStyle }
        getPage={ this._getPage }
        onRenderPage={ this._onRenderPage }
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
  private _onRenderPage(pageProps: IPageProps, defaultRender?: IRenderFunction<IPageProps>) {
    const {
      page,
      ...divProps
    } = pageProps;

    const {
      items
    } = page;

    const data: {
      startCells: {
        [index: number]: boolean;
      };
      extraCells: ITileCell<TItem>[];
    } = page.data;

    const cells: ITileCell<TItem>[] = items || [];

    let grids: React.ReactNode[] = [];

    const previousCell = this.state.cells[page.startIndex - 1];
    const nextCell = this.state.cells[page.startIndex + page.itemCount];

    const endIndex = cells.length;

    for (let i = 0; i < endIndex;) {
      const grid = cells[i].grid;

      const renderedCells: React.ReactNode[] = [];

      for (; i < endIndex && cells[i].grid === grid; i++) {
        const cell = cells[i];

        renderedCells.push(
          <div
            key={ `${grid.key}-item-${i}` }
            data-item-index={ page.startIndex + i }
            className={ css('ms-List-cell', this._onGetCellClassName()) }
            style={
              {
                ...this._onGetCellStyle(cell),
                outline: data.startCells[page.startIndex + i] ? '1px solid blue' : ''
              }
            }
          >
            { this._onRenderCell(cell) }
          </div>
        );
      }

      /*
      if (data.extraCells) {
        let j = 0;

        for (const extraCell of data.extraCells) {
          renderedCells.push(
            <div
              key={ `${grid.key}-item-extra-${j}` }
              data-extra-index={ j }
              data-item-index={ this.state.cells.indexOf(extraCell) }
              className={ css('ms-List-cell', this._onGetCellClassName()) }
              style={
                {
                  ...this._onGetCellStyle(extraCell),
                  outline: '1px solid red'
                }
              }
            >
              { this._onRenderCell(extraCell) }
            </div>
          );

          j++;
        }
      }
      */

      const isOpenStart = previousCell && previousCell.grid === grid;
      const isOpenEnd = nextCell && nextCell.grid === grid;

      grids.push(
        <div
          key={ grid.key }
          className={ css('ms-TilesList-grid') }
          style={
            {
              display: 'flex',
              flexDirection: 'row',
              flexFlow: 'row wrap',
              flexItemAlign: 'flex-start',
              justifyContent: 'flex-start',
              alignContent: 'flex-start',
              margin: `-${grid.margin}px`,
              marginTop: isOpenStart ? '0' : `-${grid.margin}px`,
              marginBottom: isOpenEnd ? '0' : `-${grid.margin}px`
            }
          }>
          { ...renderedCells }
        </div>
      );
    }

    return (
      <div
        { ...divProps }
      >
        { ...grids }
      </div>
    );
  }

  @autobind
  private _getPage(startIndex: number, bounds: IRectangle): {
    itemCount: number;
    data: {
      startCells: {
        [index: number]: boolean;
      };
      extraCells: ITileCell<TItem>[];
    };
  } {
    const {
      cells
    } = this.state;

    const endIndex = Math.min(cells.length, startIndex + 100);

    let rowWidth = 0;
    let rowStart: number;
    let fillPercent: number;
    let i = startIndex;

    let isAtGridEnd = true;

    let startCells: {
      [index: number]: boolean;
    } = {};

    let extraCells: ITileCell<TItem>[];

    for (; i < endIndex;) {
      const grid = cells[i].grid;

      rowWidth = 0;
      rowStart = i;

      const boundsWidth = bounds.width + 2 * grid.margin;

      if (grid.mode === TilesGridMode.none) {
        isAtGridEnd = true;
        fillPercent = 1;
        i++;
        continue;
      }

      startCells[i] = true;

      for (; i < endIndex && cells[i].grid === grid; i++) {
        const cell = cells[i];

        const width = cell.aspectRatio * grid.rowHeight + 2 * grid.margin;
        rowWidth += width;
        fillPercent = rowWidth / boundsWidth;

        if (rowWidth > boundsWidth) {
          rowWidth = width;
          fillPercent = rowWidth / boundsWidth;
          rowStart = i;
          startCells[i] = true;
        }
      }

      if (cells[i] && cells[i].grid === grid) {
        isAtGridEnd = false;
      }

      if (fillPercent > 0 && fillPercent < 0.9 && !isAtGridEnd) {
        extraCells = cells.slice(rowStart, i);
      }
    }

    let itemCount = fillPercent > 0 && fillPercent < 0.9 && !isAtGridEnd ?
      rowStart - startIndex :
      i - startIndex;

    return {
      itemCount: itemCount,
      data: {
        startCells: startCells,
        extraCells: extraCells
      }
    };
  }

  @autobind
  private _onGetCellClassName(): string {
    return TilesListStyles.listCell;
  }

  @autobind
  private _onGetCellStyle(item: ITileCell<TItem>): any {
    const itemWidthOverHeight = item.aspectRatio || 1;
    const itemHeightOverWidth = 1 / itemWidthOverHeight;
    const margin = item.grid.margin;

    const isFill = item.grid.mode === TilesGridMode.fill;

    const height = item.grid.rowHeight;
    const width = itemWidthOverHeight * height;

    return {
      flex: isFill ? `${itemWidthOverHeight} ${itemWidthOverHeight} ${width}px` : `0 0 ${width}px`,
      maxWidth: isFill ? `${width * 1.5}px` : `${width}px`,
      margin: `${margin}px`
    };
  }

  private _getCells(items: (ITilesGridSegment<TItem> | ITilesHeaderItem<TItem>)[]): ITileCell<TItem>[] {
    const cells: ITileCell<TItem>[] = [];

    let index = 0;

    for (const item of items) {
      if (isGridSegment(item)) {
        const grid: ITileGrid = {
          rowHeight: item.rowHeight,
          margin: item.margin,
          mode: item.mode,
          key: `grid-${index++}`
        };

        for (const gridItem of item.items) {
          cells.push({
            aspectRatio: gridItem.desiredSize.width / gridItem.desiredSize.height,
            content: gridItem.content,
            onRender: gridItem.onRender,
            grid: grid
          });
        }
      } else {
        cells.push({
          aspectRatio: 1,
          content: item.content,
          onRender: item.onRender,
          grid: {
            rowHeight: 0,
            margin: 0,
            mode: TilesGridMode.none,
            key: `header- ${index++}`
          }
        });
      }
    }

    return cells;
  }
}

function isGridSegment<TItem>(item: ITilesGridSegment<TItem> | ITilesHeaderItem<TItem>): item is ITilesGridSegment<TItem> {
  return !!(item as ITilesGridSegment<TItem>).items;
}
