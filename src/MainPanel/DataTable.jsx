import React from 'react';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import PropTypes from 'prop-types';

class SimpleDataTable extends React.Component {

    constructor(props) {
        super(props);
        this.getRowKey = this.getRowKey.bind(this);
    }

    getRowKey(row) {
        if (this.props.rowKeyMapping) {
            return this.props.rowKeyMapping(row);
        }
        return JSON.stringify(row);
    }

    render() {
        if (this.props.data.length === 0) {
            return (<p>Empty table</p>);
        }
        return (
            <Table striped bordered responsive>
                <thead>
                    <tr>{this.props.tableHeader()}</tr>
                </thead>
                <tbody>
                    {this.props.data.map(row =><tr key={this.getRowKey(row)}>{this.props.processRow(row)}</tr>)}
                </tbody>
            </Table>
        );
    }
}

class PaginationDataTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            totalAmount: 0,
            currentPage: this.props.initialPage ? this.props.initialPage : 1,
            data: []
        };
        this.setData = this.setData.bind(this);
        this.setTotalAmount = this.setTotalAmount.bind(this);
        this.setDataAndTotalAmount = this.setDataAndTotalAmount.bind(this);
        this.setCurrentPage = this.setCurrentPage.bind(this);
        this.getCurrentPage = this.getCurrentPage.bind(this);
    }

    setData(newData) {
        this.setState({data: newData});
    }

    setTotalAmount(amount) {
        this.setState({totalAmount: amount});
    }

    setDataAndTotalAmount(newData, amount) {
        this.setState({
            data: newData,
            totalAmount: amount
        });
    }

    getCurrentPage() {
        return this.state.currentPage;
    }

    setCurrentPage(page) {
        this.props.jumpToPage(page);
        this.setState({currentPage: page});
    }

    render() {
        if (this.state.data.length === 0) {
            if (this.props.emptyPage) {
                return this.props.emptyPage();
            }
            return (<p>Loading data...</p>);
        }
        let pages = [];
        let allPages = parseInt(this.state.totalAmount / this.props.amountPerPage) + 1;
        for (let number = 1; number <= allPages; number++) {
            pages.push(
                <Pagination.Item key={number} active={number === this.state.currentPage}
                                 onClick={() => this.setCurrentPage(number)}>{number}</Pagination.Item>
            );
        }
        return (<>
            <SimpleDataTable tableHeader={this.props.tableHeader}
                             processRow={this.props.processRow}
                             rowKeyMapping={this.props.rowKeyMapping}
                             data={this.state.data} />
            <Pagination>{pages}</Pagination>
        </>);
    }
}

export function simpleTableHeader(headers) {
    return headers.map(header => <th key={header} scope="col">{header}</th>);
}

PaginationDataTable.propTypes = {
    tableHeader: PropTypes.func.isRequired,
    processRow: PropTypes.func.isRequired,
    jumpToPage: PropTypes.func.isRequired,
    amountPerPage: PropTypes.any.isRequired
};

export default PaginationDataTable;
