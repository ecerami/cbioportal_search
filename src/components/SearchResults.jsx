import React from 'react';
import {observer} from 'mobx-react';
import SearchResultStudyRow from './SearchResultStudyRow';
import SearchResultGeneRow from './SearchResultGeneRow';

@observer
class SearchResults extends React.Component {

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
        return (
            <div>
                <div className="searchResults">
                    {rows}
                    <div className="noResults">
                        {this.props.appState.searchResultsSummary}
                    </div>
                </div>
            </div>
        );
    }
};

export default SearchResults;
