import React from 'react';
import $ from 'jquery';
import PaginationDataTable from './DataTable.jsx';
import {simpleTableHeader} from './DataTable.jsx';

class PartList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            amountPerPage: 10
        };
        this.loadPartsInCategory = this.loadPartsInCategory.bind(this);
        this.jumpToPage = this.jumpToPage.bind(this);
        this.partTableRef = React.createRef();
        this.partTableHeaders = [
            'Name',
            'Description',
            'Internal ID',
            'Storage Location',
            'Status',
            'Stock'
        ];
    }

    loadPartsInCategory(categoryId, page = 0) {
        let filterStr = '&filter=';
        if (categoryId.length === 1) {
            filterStr += `{"property":"category","operator":"=","value":"${categoryId}"}`;
        } else {
            let filters = [{
                subfilters: [],
                property: 'category',
                operator: 'IN',
                value: Array.from(categoryId)
            }];
            filterStr += JSON.stringify(filters);
        }
        console.log('filterStr=' + filterStr);
        $.ajax({
            type: 'GET',
            url: `api/parts?page=${page}&itemsPerPage=${this.state.amountPerPage}` + filterStr,
            success: data => {
                // this.setState({partCategories: data});
                this.partTableRef.current.setDataAndTotalAmount(data['hydra:member'], data['hydra:totalItems']);
            },
            error: () => {
                console.log('error in loadPartsInCategory');
                this.setState({partCategories: null});
            }
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.categoryId !== prevProps.categoryId) {
            this.partTableRef.current.setCurrentPage(1);
            this.jumpToPage(1);
        }
    }

    processUserRow(part) {
        return (<>
            <th scope="row">{part.name}</th>
            <td>{part.description}</td>
            <td>{part.internalPartNumber}</td>
            <td>{part.storageLocation.name}</td>
            <td>{part.tatus}</td>
            <td>{part.stockLevel}</td>
        </>);
    }

    jumpToPage(page) {
        this.loadPartsInCategory(this.props.categoryId, page);
    }

    render() {
        return (<>
            <PaginationDataTable tableHeader={() => simpleTableHeader(this.partTableHeaders)}
                                 processRow={this.processUserRow}
                                 jumpToPage={this.jumpToPage}
                                 rowKeyMapping={row => row['@id']}
                                 amountPerPage={this.state.amountPerPage}
                                 ref={this.partTableRef} />
            <div><p>part details</p></div>
        </>);
    }
}

export default PartList;
