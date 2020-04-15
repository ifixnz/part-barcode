import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import $ from 'jquery';

class InternalIDGeneratorPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            message: null,
            isError: true
        }
        this.generateInternalPartNumber = this.generateInternalPartNumber.bind(this);
    }

    generateInternalPartNumber() {
        $.ajax({
            type: 'POST',
            url: '/ipn/new',
            data: JSON.stringify(this.props.part),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: data => {
                this.props.part['internalPartNumber'] = data['internalPartNumber'];
                console.log(JSON.stringify(this.props.part));
                $.ajax({
                    type: 'PUT',
                    url: this.props.part['@id'] + '?_dc=' + Date.now(),
                    data: JSON.stringify(this.props.part),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: data1 => {
                        this.setState({isError: false, message: 'Internal part number generated for part ' + data1.name + ', new part number is '+ data1.internalPartNumber});
                    },
                    error: () => {
                        this.setState({isError: true, message: 'Failed to update internal part number for part ' + this.props.part.name + ' to '+ this.props.part.internalPartNumber});
                    }
                });
            },
            error: () => {
                this.setState({isError: true, message: 'Failed to generate internal part number for part ' + this.props.part.name});
            }
        });
    }

    render() {
        let messageBanner = null;
        if (this.state.message !== null) {
            messageBanner = (<Alert variant={this.state.isError ? 'danger' : 'success'} onClose={() => this.setState({message: null})} dismissible>
                <p>{this.state.message}</p>
            </Alert>);
        }
        let idGen = null;
        if (this.props.part.internalPartNumber) {
            idGen = (<>{this.props.part.internalPartNumber}</>);
        } else {
            idGen = (<Button onClick={this.generateInternalPartNumber}>Generate</Button>);
        }
        return (<>
        {messageBanner}
        <Table striped bordered hover>
            <tbody>
                <tr><td>Name</td><td>{this.props.part.name}</td></tr>
                <tr><td>ID</td><td>{idGen}</td></tr>
                <tr><td>Description</td><td>{this.props.part.description}</td></tr>
                <tr><td>Category</td><td>{this.props.part.category.categoryPath}</td></tr>
                <tr><td>Storage Location</td><td>{this.props.part.storageLocation.name}</td></tr>
                <tr><td>Current Stock</td><td>{this.props.part.stockLevel}</td></tr>
            </tbody>
        </Table></>);
    }
}

export default InternalIDGeneratorPanel;
