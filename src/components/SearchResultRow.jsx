import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import { observer } from 'mobx-react';
import ReactTooltip from 'react-tooltip'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

@observer
class SearchResultRow extends React.Component {

    constructor(props) {
        super(props);
        this.studyClicked = this.studyClicked.bind(this);
        this.geneTextChanged = this.geneTextChanged.bind(this);
        this.handleStudyGroupChange = this.handleStudyGroupChange.bind(this);
    }

    /**
     * Dummy links, which are not yet implement.
     */
    linkClicked(event) {
        event.preventDefault();
        alert("This link/feature is not implemented.");
    }

    /** 
     * More dummy links, which are not yet implemented.
     */
    geneExpressLinkClicked(event) {
        event.preventDefault();
        alert("User would be taken to main results page.");
    }

    /**
     * Triggered when user changes the gene box text.
     */
    geneTextChanged(event, newValue) {
        console.log("New gene text entered:  " + newValue);
        this.props.appState.currentGeneListStr = newValue;
    }

    studyClicked(event) {
        console.log("Study Clicked");
        console.log("Before: study selected:  "
            + this.props.appState.currentStudySelected)
        if (this.props.appState.currentStudySelected == null) {
            this.props.appState.currentStudySelected = this.props.id;
        } else if (this.props.appState.currentStudySelected
            === this.props.id) {
            this.props.appState.currentStudySelected = null;
        }
        console.log("After: study selected:  "
            + this.props.appState.currentStudySelected)
        event.preventDefault();
    }

    render() {
        var actions = ""
        var roleInCancer = "";
        if (this.props.resultType === "gene") {
            actions = this.getGeneLinks();
            roleInCancer = this.props.roleInCancer;
            if (roleInCancer === "TSG") {
                roleInCancer = "Tumor Suppressor";
            }
        } else {
            actions = this.getStudyLinks();
        }
        return (
            <div className="row align-items-start searchResultsRow">
                <div className="col-4">
                    <ReactTooltip />
                    <div className="searchResultsRowHeader">
                        {this.getBadge()} {this.props.title}
                    </div>
                    <div className="searchResultsRowText">
                        <div dangerouslySetInnerHTML={{ __html: this.props.description }} />
                    </div>
                    <div>
                        {roleInCancer}
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
        if (this.props.resultType === "gene") {
            return (
                <div className="geneBadge">Gene</div>
            )
        } else {
            return (
                <div className="studyBadge">Study</div>
            )
        }
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
        return (
            <div className="col-6">
            <SelectField
            floatingLabelText="View gene(s) across"
            value={this.props.appState.studyGroupSelected}
            style={selectStyle}
            onChange={this.handleStudyGroupChange}
            >
            <MenuItem value={1} primaryText="All TCGA Studies (Published)" />
            <MenuItem value={2} primaryText="All TCGA Studies (Provisional)" />
            <MenuItem value={3} primaryText="All Studies" />
            </SelectField>
            <RaisedButton style={buttonStyle} onClick={this.linkClicked} label="Go" primary={true}
                icon={<FontIcon className="material-icons">play_circle_filled</FontIcon>} />
            </div>
        );
    }

    getStudyLinks() {
        var actions = this.getStudyGoLinks();
        var geneExpress = this.getGeneExpress();
        return (
            <div className="col-6">
                <a href="" data-tip="The study summary provides an overview of all genomic and clinical data" onClick={this.linkClicked}>Go to Study Summary</a><br />
                {actions}
                {geneExpress}
            </div>
        );
    }

    getGeneExpress() {
        if (this.props.appState.currentStudySelected === this.props.id) {
            return (
                <div>
                    <TextField
                        id="gene_box"
                        style={{ width: 200 }}
                        value={this.props.appState.currentGeneListStr}
                        onChange={this.geneTextChanged}
                    />
                    <RaisedButton className="submit" onClick={this.geneExpressLinkClicked} label="Submit" primary={true}
                        icon={<FontIcon className="material-icons">play_circle_filled</FontIcon>} />
                </div>
            );
        } else {
            return (
                <div></div>
            )
        }
    }

    getStudyGoLinks() {
        return (
            <div>
                <a href="" data-tip="Click to Specify Genes of Interest" onClick={this.studyClicked}>Analyze Specific Genes within Study</a>
            </div>
        );
    }
};

export default SearchResultRow;
