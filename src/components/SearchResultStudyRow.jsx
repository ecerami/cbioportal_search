import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import { observer } from 'mobx-react';
import ReactTooltip from 'react-tooltip'

@observer
class SearchResultStudyRow extends React.Component {

    constructor(props) {
        super(props);
        this.studyClicked = this.studyClicked.bind(this);
        this.geneTextChanged = this.geneTextChanged.bind(this);
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
            + this.props.appState.currentStudySelected
            + " " + this.props.id)
        if (this.props.appState.currentStudySelected === null
            || this.props.appState.currentStudySelected !== this.props.id) {
            this.props.appState.currentStudySelected = this.props.id;
        } else {
            this.props.appState.currentStudySelected = null;
        }
        console.log("After: study selected:  "
            + this.props.appState.currentStudySelected)
        event.preventDefault();
    }

    render() {
        var actions = this.getStudyLinks();
        return (
            <div className="row align-items-start searchResultsRow">
                <div className="col-4">
                    <ReactTooltip />
                    <div className="searchResultsRowHeader">
                        {this.getBadge()} 
                        <a href="" data-tip="Jump to study view:  provides an overview of all genomic and clinical data with the study." onClick={this.linkClicked}>
                        {this.props.title}
                        </a>
                    </div>
                    <div className="searchResultsRowText">
                        <div dangerouslySetInnerHTML={{ __html: this.props.description }} />
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
        return (
            <div className="studyBadge">Study</div>
        )
    }


    getStudyLinks() {
        var actions = this.getStudyGoLinks();
        var geneExpress = this.getGeneExpress();
        return (
            <div className="col-6">
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
                        style={{ width: 200, marginLeft: 10 }}
                        value={this.props.appState.currentGeneListStr}
                        onChange={this.geneTextChanged}
                        hintText="EGFR"
                    />
                    <RaisedButton className="submit" onClick={this.geneExpressLinkClicked} label="Submit" secondary={true}
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
        var divStyle = {
            marginTop: 15
        }
        if (this.props.appState.searchResultsGenes.length === 0) {
            return (
                <div style={divStyle}>
                    <RaisedButton data-tip="Click to Specify Genes of Interest"
                    className="submit" onClick={this.studyClicked} label="Analyze Specific Genes within Study" primary={true}
                    icon={<FontIcon className="material-icons">fingerprint</FontIcon>} />
                </div>
            );
        } else {
            var label;
            if (this.props.appState.searchResultsGenes.length === 1) {
                label = "Analyze " + this.props.appState.searchResultsGenes[0].title
                    + " within Study";
            } else {
                label = "Analyze " + this.props.appState.searchResultsGenes.length
                + " genes within Study";
            }
            return (
                <div style={divStyle}>
                    <RaisedButton data-tip="Analyze gene(s) within study" 
                        className="submit" onClick={this.linkClicked} 
                        label={label} primary={true}
                        icon={<FontIcon className="material-icons">fingerprint</FontIcon>} />
                </div>
            );
        }
    }
};

export default SearchResultStudyRow;
