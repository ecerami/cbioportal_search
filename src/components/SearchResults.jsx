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
import {observer} from 'mobx-react';
import SearchResultRow from './SearchResultRow';

@observer
class SearchResults extends React.Component {

    constructor(props) {
        super(props);
    }

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
