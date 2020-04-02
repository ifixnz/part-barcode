import React from 'react';
import $ from 'jquery';
import PaginationDataTable from './DataTable.jsx';
import {simpleTableHeader} from './DataTable.jsx';
import Button from 'react-bootstrap/Button';
import Barcode from './Barcode.jsx';

class PartList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            amountPerPage: 10,
            isBarcodeShown: false,
            currentPartDetail: {name: ''},
            availableTemplates: []
        };
        this.loadPartsInCategory = this.loadPartsInCategory.bind(this);
        this.handleBarcode = this.handleBarcode.bind(this);
        this.jumpToPage = this.jumpToPage.bind(this);
        this.loadTemplates = this.loadTemplates.bind(this);
        this.loadAllParts = this.loadAllParts.bind(this);
        this.partTableRef = React.createRef();
        this.partTableHeaders = [
            'Name',
            'Category',
            'Internal ID',
            'Storage Location',
            'Stock',
            'Barcode'
        ];
    }

    loadPartsInCategory(categoryId, page = 1) {
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
                this.partTableRef.current.setDataAndTotalAmount(data['hydra:member'], data['hydra:totalItems']);
            },
            error: () => {
                console.log('error in loadPartsInCategory');
            }
        });
    }

    componentDidMount() {
        this.loadTemplates();
        this.loadAllParts(1);
    }

    loadAllParts(page = 1) {
        $.ajax({
            type: 'GET',
            url: `api/parts?page=${page}&itemsPerPage=${this.state.amountPerPage}`,
            success: data => {
                this.partTableRef.current.setDataAndTotalAmount(data['hydra:member'], data['hydra:totalItems']);
            },
            error: () => {
                console.log('error in loadAllParts');
            }
        });
    }

    loadTemplates() {
        $.ajax({
            type: 'GET',
            url: '/templates',
            success: data => {
                console.log(JSON.stringify(data));
                this.setState({availableTemplates: data});
            },
            error: () => {
                this.setState({availableTemplates: []});
            }
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.categoryId !== prevProps.categoryId) {
            this.partTableRef.current.setCurrentPage(1);
            this.jumpToPage(1);
        }
    }

    handleBarcode(part) {
        this.setState({currentPartDetail: part, isBarcodeShown: true});
    }

    processUserRow(part, cbList) {
        return (<>
            <th scope="row">{part.name}</th>
            <td>{part.category.name}</td>
            <td>{part.internalPartNumber}</td>
            <td>{part.storageLocation.name}</td>
            <td>{part.stockLevel}</td>
            <td><Button onClick={() => cbList[0](part)} size="sm">View Barcode</Button></td>
        </>);
    }

    jumpToPage(page) {
        if (this.props.categoryId === null) {
            this.loadAllParts(page);
        } else {
            this.loadPartsInCategory(this.props.categoryId, page);
        }
    }

    render() {
        return (<>
            <PaginationDataTable tableHeader={() => simpleTableHeader(this.partTableHeaders)}
                                 processRow={this.processUserRow}
                                 jumpToPage={this.jumpToPage}
                                 rowKeyMapping={row => row['@id']}
                                 amountPerPage={this.state.amountPerPage}
                                 callbackList={[this.handleBarcode]}
                                 ref={this.partTableRef} />
            <Barcode show={this.state.isBarcodeShown}
                     onHide={() => this.setState({isBarcodeShown: false})}
                     templateList={this.state.availableTemplates}
                     title={'Part: ' + this.state.currentPartDetail.name}
                     part={this.state.currentPartDetail} />
        </>);
    }
}

export default PartList;
