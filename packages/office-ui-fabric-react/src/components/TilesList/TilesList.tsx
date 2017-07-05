
import * as React from 'react';
import { ITilesListProps } from './TilesList.Props';
import { List } from '../../List';
import { FocusZone, FocusZoneDirection } from '../../FocusZone';
import { SelectionZone, Selection, SelectionMode } from '../../utilities/selection/index';
import { autobind, css } from '../../Utilities';
import * as TilesListStylesModule from './TilesList.scss';

const TilesListStyles: any = TilesListStylesModule;

export interface ITilesListState {

}

export class TilesList<TItem> extends React.Component<ITilesListProps<TItem>, ITilesListState> {
  private _selection: Selection;

  constructor(props: ITilesListProps<TItem>, context: any) {
    super(props, context);

    const {
      selection = new Selection()
    } = props;

    this._selection = selection;
  }

  public render() {
    const {
      items
    } = this.props;

    return (
      <FocusZone
        direction={ FocusZoneDirection.bidirectional }>
        <SelectionZone
          selection={ this._selection }
          selectionMode={ SelectionMode.multiple }>
          <List
            items={ items }
            onRenderCell={ this._onRenderCell }
            getCellClassName={ this._onGetCellClassName }
            getPageClassName={ this._onGetPageClassName }
            getPageStyle={ this._onGetPageStyle }
            getCellStyle={ this._onGetCellStyle }
            getItemCountForPage={ this._onGetItemCountPerPage }
            surfaceClassName={ TilesListStyles.listSurface }
          />
        </SelectionZone>
      </FocusZone>
    );
  }

  @autobind
  private _onRenderCell(item: TItem) {
    const {
      getItemAspectRatio,
      onRenderCell
    } = this.props;

    const itemWidthOverHeight = getItemAspectRatio && getItemAspectRatio(item) || 1;
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
          { onRenderCell && onRenderCell(item) }
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
  private _onGetCellStyle(item: TItem): any {
    const {
      getItemAspectRatio
    } = this.props;

    const itemWidthOverHeight = getItemAspectRatio && getItemAspectRatio(item) || 1;
    const itemHeightOverWidth = 1 / itemWidthOverHeight;

    const height = 150;
    const width = itemWidthOverHeight * height;

    return {
      flex: `${itemWidthOverHeight} ${itemWidthOverHeight} ${width}px`,
      minHeight: `${height}px`,
      minWidth: `${width}px`,
      maxWidth: `${width * 1.2}px`
    };
  }
}
