import * as React from 'react';
import { Link } from 'office-ui-fabric-react/lib/Link';
import {
  ExampleCard,
  IComponentDemoPageProps,
  ComponentPage,
  PropertiesTableSet
} from '@uifabric/example-app-base';
import { TilesListBasicExample } from './examples/TilesList.Basic.Example';
const TilesListBasicExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/TilesList/examples/TilesList.Basic.Example.tsx') as string;

export class TilesListPage extends React.Component<IComponentDemoPageProps, {}> {
  public render() {
    return (
      <ComponentPage
        title='TilesList'
        componentName='TilesListExample'
        exampleCards={
          <div>
            <ExampleCard title='Simple DetailsList with 500 items, filtering, marquee selection' isOptIn={ true } code={ TilesListBasicExampleCode }>
              <TilesListBasicExample />
            </ExampleCard>
          </div>
        }
        propertiesTables={
          <PropertiesTableSet
            sources={ [
              require<string>('!raw-loader!office-ui-fabric-react/src/components/TilesList/TilesList.Props.ts')
            ] }
          />
        }
        overview={
          <div>
            <p>
              DetailsList is a derivative of the <Link href='#/examples/list'>List</Link> component. It is a robust way to display an information rich collection of items. It can support powerful ways to aid a user in finding content with sorting, grouping and filtering. Lists are a great way to handle large amounts of content, but poorly designed Lists can be difficult to parse.
            </p>
            <p>
              Use a DetailsList when density of information is critical. Lists can support single and multiple selection, as well as drag and drop and marquee selection. They are composed of a column header, which contains the metadata fields which are attached to the list items, and provide the ability to sort, filter and even group the list. List items are composed of selection, icon, and name columns at minimum. One can also include other columns such as Date Modified, or any other metadata field associated with the collection. Place the most important columns from left to right for ease of recall and comparison.
            </p>
            <p>
              DetailsList is classically used to display files, but is also used to render custom lists that can be purely metadata. Avoid using file type icon overlays to denote status of a file as it can make the entire icon unclear. Be sure to leave ample width for each column’s data. If there are multiple lines of text in a column, consider the variable row height variant.
            </p>
          </div>
        }
        bestPractices={
          <div></div>
        }
        dos={
          <div>
            <ul>
              <li>Use them to display content.</li>
              <li>Provide useful columns of metadata.</li>
              <li>Display columns in order of importance left to right or right to left depending on the standards of the culture.</li>
              <li>Give columns ample default width to display information.</li>
            </ul>
          </div>
        }
        donts={
          <div>
            <ul>
              <li>Use them to display commands or settings.</li>
              <li>Overload the view with too many columns that require excessive horizontal scrolling.</li>
              <li>Make columns so narrow that it truncates the information in typical cases.</li>
            </ul>
          </div>
        }
        isHeaderVisible={ this.props.isHeaderVisible }>
      </ComponentPage>
    );
  }
}
