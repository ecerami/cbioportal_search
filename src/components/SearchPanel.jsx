import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import { observer } from 'mobx-react';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import SearchResults from './SearchResults';

@observer
class SearchPanel extends React.Component {

    constructor(props) {
        super(props);
        this.initSearch = this.initSearch.bind(this);
        this.clearSearch = this.clearSearch.bind(this);
        this.searchTextChanged = this.searchTextChanged.bind(this);
        this.searchTextKeyPressed = this.searchTextKeyPressed.bind(this);
        this.sampleSearchClicked = this.sampleSearchClicked.bind(this);
        this.handleExampleToggle = this.handleExampleToggle.bind(this);
    }

    /**
     * Perform a Search.
     */
    initSearch() {
        console.log("Starting search:  " + this.props.appState.searchText)
        this.props.appState.search();
    }

    /**
     * Clear Search.
     */
    clearSearch() {
        this.props.appState.searchText = "";
        this.props.appState.search();
    }    

    /**
     * Triggered when user changes the search box text.
     */
    searchTextChanged(event, newValue) {
        this.props.appState.searchText = newValue;
        this.props.appState.search();
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
    
    handleExampleToggle(event) {
        this.props.appState.examplesDrawerOpen = ! this.props.appState.examplesDrawerOpen;
        console.log("Toggle:  " + this.props.appState.examplesDrawerOpen)
    }

    render() {
        var toggleLabel = "Show Examples";
        if (this.props.appState.examplesDrawerOpen === true) {
            toggleLabel = "Hide Examples";
        }
        return (
            <div>
                <div className="row align-items-start">
                    <div className="col-8">
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
                    <RaisedButton className="submit" onClick={this.clearSearch} label="Clear" primary={true}
                        icon={<FontIcon className="material-icons">clear</FontIcon>} />
                    &nbsp;&nbsp;
                    <RaisedButton label={toggleLabel} onClick={this.handleExampleToggle} />
                    </div>
                    <div className="col-6">
                    </div>
                </div>
                <Drawer width={425} openSecondary={true} open={this.props.appState.examplesDrawerOpen} >
                    <AppBar showMenuIconButton={false} title="Examples" />
                    { this.getExamplesPanel() }
                </Drawer>                
                <SearchResults appState={this.props.appState} />
            </div>
        );
    }

    /**
     * A few examples, used to illustrate functionality.
     */
    getExamplesPanel() {
        var exampleStyle = {
            marginTop:20
        }
        return (
            <div style={exampleStyle}>
                    <ul>
                        <li>Single gene:  <a href="EGFR" onClick={this.sampleSearchClicked}>EGFR</a></li>
                        <li>Multiple genes:  <a href="EGFR KRAS" onClick={this.sampleSearchClicked}>EGFR KRAS</a></li>
                        <li>Multiple genes:  <a href="EGFR KRAS NF1" onClick={this.sampleSearchClicked}>EGFR KRAS NF1</a></li>
                        <li>Cancer type keyword: <a href="lung" onClick={this.sampleSearchClicked}>lung</a></li>
                        <li>Cancer type wildcard: <a href="glio*" onClick={this.sampleSearchClicked}>glio*</a></li>
                        <li>Multiple keywords: <a href="breast metastatic" onClick={this.sampleSearchClicked}>breast metastatic</a></li>
                        <li>Multiple keywords: <a href="msk lung" onClick={this.sampleSearchClicked}>msk lung</a></li>
                        <li>Author: <a href="van allen" onClick={this.sampleSearchClicked}>van allen</a></li>
                        <li>Single gene + cancer type keyword:  <a href="EGFR lung" onClick={this.sampleSearchClicked}>EGFR lung</a></li>
                        <li>Single gene + multiple keywords:  <a href="EGFR msk lung" onClick={this.sampleSearchClicked}>EGFR msk lung</a></li>
                        <li>Multiple genes + keywords:  <a href="PIK3CA PIK3R1 breast" onClick={this.sampleSearchClicked}>PIK3CA PIK3R1 breast</a></li>
                    </ul>
            </div>
        );
    }
};

export default SearchPanel;
