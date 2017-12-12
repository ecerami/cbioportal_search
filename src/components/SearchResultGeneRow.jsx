import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import { observer } from 'mobx-react';
import ReactTooltip from 'react-tooltip'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

@observer
class SearchResultGeneRow extends React.Component {

    constructor(props) {
        super(props);
        this.handleStudyGroupChange = this.handleStudyGroupChange.bind(this);
        this.getMenuItems = this.getMenuItems.bind(this);
    }

    /**
     * Dummy links, which are not yet implement.
     */
    linkClicked(event) {
        event.preventDefault();
        alert("This link/feature is not implemented.");
    }

    render() {
        if (this.props.appState.searchResultsGenes.length === 0) {
            return (<div/>)
        } else if (this.props.appState.searchResultsGenes.length === 1) {
            return this.renderSingleGene();
        } else {
            return this.renderMultipleGenes();
        }
    }

    renderSingleGene() {
        var currentGene = this.props.appState.searchResultsGenes[0];
        var actions = this.getGeneLinks();
        var roleInCancer = currentGene.roleInCancer;
        if (roleInCancer === "TSG") {
            roleInCancer = "Tumor Suppressor";
        }
        return (
            <div className="row align-items-start searchResultsRow">
                <div className="col-4">
                    <ReactTooltip />
                    <div className="searchResultsRowHeader">
                        {this.getBadge()} {currentGene.title}
                    </div>
                    <div className="searchResultsRowText">
                        <div dangerouslySetInnerHTML={{ __html: currentGene.description }} />
                    </div>
                    <div>
                        {roleInCancer}
                    </div>
                </div>
                {actions}
            </div>
        );        
    }

    renderMultipleGenes() {
        var actions = this.getGeneLinks();
        var geneListHtml = []
        for (var i=0; i<this.props.appState.searchResultsGenes.length; i++) {
            var currentGene = this.props.appState.searchResultsGenes[i];
            geneListHtml.push(<li key={currentGene.title}>{currentGene.title}:
                &nbsp;
                <span className="searchResultsRowText">
                {currentGene.description}
                </span>
                &nbsp;
                {currentGene.roleInCancer}</li>);
        }
        return (
            <div className="row align-items-start searchResultsRow">
                <div className="col-4">
                    <ReactTooltip />
                    <div className="searchResultsRowHeader">
                        {this.getBadge()}
                        <br/>
                        <ul>
                        {geneListHtml}
                        </ul>
                    </div>
                </div>
                {actions}
            </div>
        );        
    }

    /**
     * A small visual badge, indicating search result type.
     */
    getBadge() {
        var label = "Gene";
        if (this.props.appState.searchResultsGenes.length > 1) {
            label = "Multiple Genes";
        }
        return (
            <div className="geneBadge">{label}</div>
        )
    }

    handleStudyGroupChange(event, index, value) {
        console.log("Study Group Changed:  " + value);
        this.props.appState.studyGroupSelected = value;
    }

    getGeneLinks() {
        var selectStyle = {
            verticalAlign: "top",
            width:300
        }
        var buttonStyle = {
            marginLeft:20,
            marginTop:30
        }
        var labelText = "View gene across";
        if (this.props.appState.searchResultsGenes.length ===2) {
            labelText = "View both genes across";
        } else if (this.props.appState.searchResultsGenes.length >2) {
            labelText = "View all " 
                + this.props.appState.searchResultsGenes.length + " genes across";
        }
        return (
            <div className="col-6">
            <SelectField
            floatingLabelText={labelText}
            value={this.props.appState.studyGroupSelected}
            style={selectStyle}
            onChange={this.handleStudyGroupChange}
            >
            { this.getMenuItems() }
            </SelectField>
            <RaisedButton style={buttonStyle} onClick={this.linkClicked} label="Go" primary={true}
                icon={<FontIcon className="material-icons">play_circle_filled</FontIcon>} />
            </div>
        );
    }

    getMenuItems() {
        var menuItems = [];
        var options = [];
        if (this.props.appState.searchResultsStudies.length === 1) {
            options.push("1 Matching Study");
        } else if (this.props.appState.searchResultsStudies.length >1) {
            options.push(this.props.appState.searchResultsStudies.length + " Matching Studies");
        }
        options.push("All TCGA Studies (Published)");
        options.push("All TCGA Studies (Provisional)");
        options.push("All Studies");
        var key = "menu_item_" + i;
        for (var i=0; i<options.length; i++) {
            menuItems.push(<MenuItem key={key} value={i} primaryText={options[i]} />)
        }
        return menuItems;
    }
};

export default SearchResultGeneRow;
