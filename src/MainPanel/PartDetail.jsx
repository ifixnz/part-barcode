import React from 'react';
import $ from 'jquery';

class PartDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentPartDetail: null
        };
        this.loadPartDetail = this.loadPartDetail.bind(this);
    }

    loadPartDetail(partUrl) {
        if (partUrl) {
            $.ajax({
                type: 'GET',
                url: partUrl,
                success: data => {
                    this.setState({currentPartDetail: data});
                },
                error: () => {
                    console.log('error in loadPartDetail');
                    this.setState({currentPartDetail: null});
                }
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.part !== prevProps.part) {
            this.loadPartDetail(this.props.part);
        }
    }

    render() {
        if (this.props.part === null || this.state.currentPartDetail === null) {
            return (<p>No part selected.</p>);
        }
        return (<div>
            <p>{'Part: ' + this.props.part}</p>
            <p>{'Part Name: ' + this.state.currentPartDetail.name}</p>
            <p>{'Part Description: ' + this.state.currentPartDetail.description}</p>
            <p>{'Part Category: ' + this.state.currentPartDetail.category.categoryPath}</p>
            <p>{'Storage Location: ' + this.state.currentPartDetail.storageLocation.name}</p>
            <p>{'Current Stock: ' + this.state.currentPartDetail.stockLevel}</p>
        </div>);
    }
}

export default PartDetail;
