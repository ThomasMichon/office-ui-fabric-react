
import * as React from 'react';
import { ITileProps } from './Tile.Props';
import { css } from '../../Utilities';
import * as TileStylesModule from './Tile.scss';

const TileStyles: any = TileStylesModule;

export interface ITileState {

}

/**
 * A tile provides a frame for a potentially-selectable item which displays its contents prominently.
 *
 * @export
 * @class Tile
 * @extends {React.Component<ITileProps, ITileState>}
 */
export class Tile extends React.Component<ITileProps, ITileState> {
  public render() {
    const {
      children
    } = this.props;

    return (
      <div className={ css('ms-Tile', TileStyles.tile) }>

      </div>
    );
  }
}
