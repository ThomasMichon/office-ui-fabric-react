import * as React from 'react';
import { IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { SpinButton } from 'office-ui-fabric-react/lib/SpinButton';
import { DetailsList } from 'office-ui-fabric-react/lib/DetailsList';
import { ConstrainMode } from 'office-ui-fabric-react/lib/DetailsList';
import { DetailsListLayoutMode } from 'office-ui-fabric-react/lib/DetailsList';
import { SelectionMode } from 'office-ui-fabric-react/lib/DetailsList';
import { Separator } from 'office-ui-fabric-react/lib/Separator';
import { Text } from 'office-ui-fabric-react/lib/Text';

function createTableData(rows: number, columns: number) {
  const data: Record<string, string>[] = [];
  const charCode = 'A'.charCodeAt(0);

  for (let r = 0; r < rows; r++) {
    const row: Record<string, string> = {};
    for (let c = 0; c < columns; c++) {
      row[`${c}`] = `${String.fromCharCode(charCode + r)}-${c}`;
    }
    data.push(row);
  }
  return data;
}

export function DetailsListColumnResizeExample(): JSX.Element {
  const [rows, setRowCount] = React.useState<number>(1);
  const [columns, setColumns] = React.useState<number>(4);

  const allTablesData = React.useMemo(() => {
    const temp: Record<string, string>[][] = [];
    for (let x = 0; x < 2; x++) {
      temp.push(createTableData(rows, columns));
    }
    return temp;
  }, [columns, rows]);

  const tableColumns = React.useMemo(() => {
    const temp: IColumn[][] = [];

    for (let t = 0; t < 2; t++) {
      const tableCols: IColumn[] = [];
      for (let c = 0; c < columns /* - t*/; c++) {
        const colVal = `${c}`;
        tableCols.push({
          key: colVal,
          fieldName: colVal,
          minWidth: 100,
          maxWidth: 300,
          name: colVal,
          isResizable: true,
        });
      }
      temp.push(tableCols);
    }

    return temp;
  }, [columns]);

  const adjustRows = (modifier = 1) => (val: string) => {
    const num = Number(val);
    console.log('num: ', num);
    setRowCount(num + modifier);
  };

  const adjustColumns = (modifier = 1) => (val: string) => {
    const num = Number(val);
    console.log('num: ', num);
    setColumns(num + modifier);
  };

  const validate = (val: string) => val;

  return (
    <>
      <SpinButton
        value={'' + rows}
        label={'Rows per table: '}
        min={0}
        step={1}
        onIncrement={adjustRows()}
        onDecrement={adjustRows(-1)}
        onValidate={validate}
      />
      <SpinButton
        value={'' + columns}
        label={'Columns per table: '}
        min={0}
        step={1}
        onIncrement={adjustColumns()}
        onDecrement={adjustColumns(-1)}
        onValidate={validate}
      />
      <div>
        {allTablesData.map((curTableData: Record<string, string>[], index: number) => {
          return (
            <>
              <Text block variant="xLarge">
                {'Table with' + (index !== 1 ? 'out' : '') + ' columns provided'}
              </Text>
              <Text block>
                {index !== 1
                  ? "All columns can be resized.  First Column resizing can cause the table to go over it's viewport. Overflow columns that overflow drop off."
                  : "All columns can be resized.  First Column resizing can cause the table to go over it's viewport. Overflow columns remain and cannot be resized beyond min width"}
              </Text>
              <DetailsList
                key={index}
                items={curTableData}
                columns={index === 1 ? tableColumns[index] : undefined}
                constrainMode={ConstrainMode.unconstrained}
                layoutMode={DetailsListLayoutMode.justified}
                selectionMode={SelectionMode.none}
              />
              <Separator />
            </>
          );
        })}
      </div>
    </>
  );
}
