import React, { Component } from "react";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import SearchPanel from './SearchPanel';
import cBioPortalState from '../models/cBioPortalState';
import ReactTooltip from 'react-tooltip'

@observer
class SearchApp extends React.Component {

  constructor(props) {
    super(props);
    var appState = new cBioPortalState();
    appState.geneSet = ["EGFR"];
    this.state = {
      appState: appState
    };
  }

  render() {
    return (
      <div className="search_panel">
        <SearchPanel appState={this.state.appState} />
        <br/><br/>
        {this.getRequirementsPanel()}
        {this.getImplementationDetailsPanel()}
        <ReactTooltip />
      </div>
    );
  }

  /**
   * Random Requirement Notes.
   */
  getRequirementsPanel() {
    var headerStyle = {
      fontWeight:"bold",
    }
    return (
      <Card>
        <CardHeader
          title="Product Requirement Notes"
          actAsExpander={true}
          showExpandableButton={true}
          style={headerStyle}
        />
        <CardText expandable={true}>
          There are a number of product details that we still need to spec out:
          <br/><br/>
          <ul>
            <li><b>Auto completion</b>:  Auto completion for the search box.  Ideally,
            I'd like to have auto-completion on multiple terms.</li>
            <li><b>Full gene validation</b>:  Gene checking is currently performed against 
              the <a href='http://cancer.sanger.ac.uk/census'>Cancer Gene Census</a>.
              For the final product, we will need to check against the cBioPortal
              API and also do alias checking.
            </li>
            <li><b>Configuration</b>:  
              For example, most local instances of cBioPortal will not have 
              TCGA data, and these links need to be configurable.  Examples
              should also be configurable.</li>
            <li><b>Tool tips</b>:  Tool tips are not currently enabled, and we 
            need to specify text for each tool tip.</li>
            <li><b>Home page integration</b>:  This component is intendeded to 
            supplement, not replace the current query interface.  How exactly
            will we integrate it into the home page?</li>
            <li><b>Search logic</b>:  If a users enters two search terms, 
            e.g. "breast france", the search box currently uses an 
            AND operator on both terms.  We may need to revisit based on
            specific edge cases.</li>
          </ul>
        </CardText>
      </Card>
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
