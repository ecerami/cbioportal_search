import React from 'react';
import {observer} from 'mobx-react';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import SearchResultStudyRow from './SearchResultStudyRow';
import SearchResultGeneRow from './SearchResultGeneRow';

@observer
class SearchResults extends React.Component {

    /**
     * Dummy links, which are not yet implement.
     */
    linkClicked(event) {
        event.preventDefault();
        alert("This link/feature is not implemented.");
    }

    /**
     * Iterate through all search results, one per row.
     */
    render() {
        var rows = [];

        //  Push all matching genes
        rows.push(<SearchResultGeneRow 
            key="gene_matches" 
            appState={this.props.appState}
            />
        )

        //  Push all matching studies
        for (var i = 0; i < this.props.appState.searchResultsStudies.length; i++) {
            var currentRow = this.props.appState.searchResultsStudies[i]
            rows.push(<SearchResultStudyRow key={i}
                title={currentRow.title}
                id={currentRow.id}
                description={currentRow.description}
                resultType={currentRow.resultType}
                appState={this.props.appState}
                />
            );
        }

        var buttonStyle = {
            marginLeft:20,
            marginTop:0
        }

        var mergeButton = null;
        if (this.props.appState.searchResultsStudies.length > 1) {
            mergeButton = 
                <FlatButton data-tip="Click to Merge all Matching Studies into a New Virtual Study"
                style={buttonStyle} onClick={this.linkClicked} label="Merge studies" primary={true}
                icon={<FontIcon className="material-icons">group_work</FontIcon>} />
        }

        return (
            <div>
                <div className="searchResults">
                    <div className="searchResultsSummary">
                        {this.props.appState.searchResultsSummary}
                        {mergeButton}
                    </div>
                    {rows}
                </div>
            </div>
        );
    }
};

export default SearchResults;
