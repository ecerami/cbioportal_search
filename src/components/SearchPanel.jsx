import React from 'react';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import { observer } from 'mobx-react';
import SearchResults from './SearchResults';
import ReactTooltip from 'react-tooltip'

@observer
class SearchPanel extends React.Component {

    constructor(props) {
        super(props);
        this.initSearch = this.initSearch.bind(this);
        this.searchTextChanged = this.searchTextChanged.bind(this);
        this.searchTextKeyPressed = this.searchTextKeyPressed.bind(this);
        this.sampleSearchClicked = this.sampleSearchClicked.bind(this);
    }

    /**
     * Perform a Search.
     */
    initSearch() {
        console.log("Starting search:  " + this.props.appState.searchText)
        this.props.appState.search();
    }

    /**
     * Triggered when user changes the search box text.
     */
    searchTextChanged(event, newValue) {
        this.props.appState.searchText = newValue;
    }

    /**
     * Triggered when user selects an example search link.
     */
    sampleSearchClicked(event) {
        event.preventDefault();
        console.log("Sample search link clicked.");
        var searchText = event.currentTarget.getAttribute('href');
        console.log("Search text:  " + searchText);
        this.props.appState.searchText = searchText;
        this.props.appState.search();
    }

    /**
     * Handle ENTER key within search box.
     */
    searchTextKeyPressed(event) {
        if (event.key === 'Enter') {
            console.log("Enter Pressed:  " + this.props.appState.searchText)
            event.preventDefault();
            this.props.appState.search();
        }
    }

    render() {
        return (
            <div>
                { this.getExamplesPanel() }
                <div>
                    <TextField
                        id="search_box"
                        hintText="EGFR"
                        floatingLabelText="Enter a gene, cancer type or keyword."
                        floatingLabelFixed={true}
                        onChange={this.searchTextChanged}
                        onKeyPress={this.searchTextKeyPressed}
                        style={{ width: 400 }}
                        value={this.props.appState.searchText}
                    />
                    <RaisedButton className="submit" onClick={this.initSearch} label="Search" secondary={true}
                        icon={<FontIcon className="material-icons">search</FontIcon>} />
                </div>
                <SearchResults appState={this.props.appState} />
            </div>
        );
    }

    /**
     * A few examples, used to illustrate functionality.
     */
    getExamplesPanel() {
        var headerStyle = {
            fontWeight: "bold",
        }
        return (
            <Card onExpandChange={this.cardExpanded} style={{width:525, marginBottom:30}} >
                <CardHeader
                    title="Example Searches"
                    actAsExpander={true}
                    showExpandableButton={true}
                    style={headerStyle}
                />
                <CardText expandable={true}>
                <div className="row align-items-start">
                    <div className="col-5">
                    <ul>
                        <li><a href="EGFR" onClick={this.sampleSearchClicked}>EGFR</a></li>
                        <li><a href="lung" onClick={this.sampleSearchClicked}>lung</a></li>
                        <li><a href="glio*" onClick={this.sampleSearchClicked}>glio*</a></li>
                        <li><a href="EGFR lung" onClick={this.sampleSearchClicked}>EGFR lung</a></li>
                    </ul>
                    </div>

                    <div className="col-7">
                    <ul>
                        <li><a href="EGFR msk lung" onClick={this.sampleSearchClicked}>EGFR msk lung</a></li>
                        <li><a href="PIK3CA breast metastatic" onClick={this.sampleSearchClicked}>PIK3CA breast metastatic</a></li>
                        <li><a href="van allen" onClick={this.sampleSearchClicked}>van allen</a></li>
                    </ul>
                    </div>
                </div>
                </CardText>
            </Card>
        );
    }
};

export default SearchPanel;