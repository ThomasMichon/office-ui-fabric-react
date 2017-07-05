
import * as React from 'react';
import { ITileProps, TileMode } from './Tile.Props';
import { Check } from '../../Check';
import { Selection } from '../../utilities/selection/Selection';
import { SELECTION_CHANGE } from '../../utilities/selection/interfaces';
import { css, BaseComponent, autobind } from '../../Utilities';
import * as TileStylesModule from './Tile.scss';

const TileStyles: any = TileStylesModule;

export interface ITileState {
  isSelected?: boolean;
}

/**
 * A tile provides a frame for a potentially-selectable item which displays its contents prominently.
 *
 * @export
 * @class Tile
 * @extends {React.Component<ITileProps, ITileState>}
 */
export class Tile extends BaseComponent<ITileProps, ITileState> {
  private _selection: Selection;

  constructor(props: ITileProps, context: any) {
    super(props, context);

    this._selection = props.selection;

    const {
      selectionIndex
    } = props;

    const isSelected = !!this._selection && selectionIndex > 1 && this._selection.isIndexSelected(selectionIndex);

    this.state = {
      isSelected: isSelected
    };
  }

  public componentDidMount() {
    if (this._selection) {
      this._events.on(this._selection, SELECTION_CHANGE, this._onSelectionChange);
    }
  }

  public render() {
    const {
      children,
      selectionIndex = -1,
      mode = TileMode.icon
    } = this.props;

    const {
      isSelected = false
    } = this.state;

    return (
      <div className={ css('ms-Tile', TileStyles.tile, {
        [TileStyles.richContent]: mode === TileMode.rich,
        [TileStyles.iconContent]: mode === TileMode.icon,
        [TileStyles.selected]: isSelected
      }) }
        data-is-focusable={ true }
        data-selection-index={ (selectionIndex > -1) ? selectionIndex : undefined }>
        <div className={ css('ms-Tile-content') }>
          { children }
        </div>
        <button className={ css('ms-Tile-check', TileStyles.check) }
          data-is-focusable={ false }
          data-selection-toggle={ true }
          role='checkbox'>
          <Check
            checked={ isSelected }
          />
        </button>
      </div>
    );
  }

  @autobind
  private _onSelectionChange() {
    const {
          selectionIndex
        } = this.props;

    this.setState({
      isSelected: selectionIndex > -1 && this._selection.isIndexSelected(selectionIndex)
    });
  }
}
