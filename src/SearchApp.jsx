import React from "react";
import { observer } from "mobx-react";
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import SearchPanel from './components/SearchPanel';
import cBioPortalState from './models/cBioPortalState';
import ReactTooltip from 'react-tooltip'
import 'react-tabs/style/react-tabs.css';

@observer
class SearchApp extends React.Component {
  appState;

  constructor(props) {
    super(props);
    this.appState = new cBioPortalState();
    this.appState.geneSet = ["EGFR"];
  }

  render() {
    var divStyle = {
      marginLeft: 25
    }
    return (
      <div style={divStyle}>
      <Tabs>
        <TabList>
          <Tab>Quick Search</Tab>
          <Tab>Build Query</Tab>
          <Tab>Download Data</Tab>
        </TabList>

        <TabPanel>
          <div className="search_panel">
            <SearchPanel appState={this.appState} />
          </div>
        </TabPanel>
        <TabPanel>
          <img alt="Build Query" src="build_query.png" width="80%"/> 
        </TabPanel>
        <TabPanel>
          <img alt="Download Data" src="build_query.png" width="80%"/>
        </TabPanel>
      </Tabs>        
      <br/><br/>
      {this.getImplementationDetailsPanel()}
      <ReactTooltip />
      </div>
    );
  }

  /**
   * Random Implementation Notes.
   */
  getImplementationDetailsPanel() {
    var headerStyle = {
      fontWeight:"bold",
    }
    return (
      <Card>
        <CardHeader
          title="Implementation Notes"
          actAsExpander={true}
          showExpandableButton={true}
          style={headerStyle}
        />
        <CardText expandable={true}>
          This prototype is built with:
          <br/><br/>
          <ul>
            <li>React, and <a href='http://www.material-ui.com/'>React Material UI</a>.</li>
            <li>State management via <a href='http://mobx.js.org'>MobX</a>.</li>
            <li>Javascript search engine via <a href='https://lunrjs.com/'>Lunr.js</a>.</li>
            <li>HTTP requests via <a href="https://www.npmjs.com/package/axios">axios</a>.</li>
            <li>Tooltips via <a href="https://www.npmjs.com/package/react-tooltip">react-tooltip</a>.</li>
            <li>Gene checking is currently performed against 
              the <a href='http://cancer.sanger.ac.uk/census'>Cancer Gene Census</a>.
              Therefore, if you enter a gene not on this list, it will fail.
              The current prototype also only checks for exact matches to HUGO 
              gene symbols and does not perform alias mapping.</li>
          </ul>
        </CardText>
      </Card>
    );
  }
}

export default SearchApp;
