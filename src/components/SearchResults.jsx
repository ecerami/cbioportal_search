import React from 'react';
import {observer} from 'mobx-react';
import SearchResultRow from './SearchResultRow';

@observer
class SearchResults extends React.Component {

    /**
     * Iterate through all search results, one per row.
     */
    render() {
        var rows = [];
        for (var i = 0; i < this.props.appState.searchResults.length; i++) {
            var currentRow = this.props.appState.searchResults[i]
            rows.push(<SearchResultRow key={i}
                title={currentRow.title}
                id={currentRow.id}
                description={currentRow.description}
                resultType={currentRow.resultType}
                roleInCancer={currentRow.roleInCancer}
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
